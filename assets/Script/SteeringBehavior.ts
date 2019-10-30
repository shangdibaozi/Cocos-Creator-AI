import Vector2D from './Common/Vector2D';
import Vehicle from './Vehicle';
import Prm from './Prm';
import Utils from './Utils';

export enum summing_method {
    weighted_average,
    prioritized,
    dithered
};

export enum behavior_type {
    none = 0x00000,
    seek = 0x00002,		// 寻找
    flee = 0x00004,		// 逃跑
    arrive = 0x00008,		// 到达
    wander = 0x00010,		// 徘徊、游荡
    cohesion = 0x00020,		// 聚集
    separation = 0x00040,		// 分离
    allignment = 0x00080,
    obstacle_avoidance = 0x00100,		// 避障
    wall_avoidance = 0x00200,
    follow_path = 0x00400,
    pursuit = 0x00800,		// 追随
    evade = 0x01000,		// 逃避
    interpose = 0x02000,
    hide = 0x04000,
    flock = 0x08000,
    offset_pursuit = 0x10000,
}

// Arrive makes use of these to determine how quickly a vehicle should decelerate to its target
enum Deceleration {
    slow = 3,
    normal = 2,
    fast = 1
}


// the radius of the constraining circle for the wander behavior
const WanderRad = 1.2;
// distance the wander circle is projected in front of the agent
const WanderDist = 2.0;
// the maximum amount of displacement along the circle each frame
const WanderJitterPerSec = 80.0;

export default class SteeringBehavior {

    // a pointer to the owner of this instance
    private m_pVehicle : Vehicle = null;

    // the steering force created by the combined effect of all the selected behaviors
    private m_vSteeringForce : Vector2D = new Vector2D();

    // these can be used to keep track of friends, pursuers, or prey
    private m_pTargetAgent1 : Vehicle = null;
    private m_pTargetAgent2 : Vehicle = null;

    // the current target
    private m_vTarget : Vector2D = new Vector2D();

    // what type of method is used to sum any active behavior
    private m_SummingMethod : summing_method = null;

    // binary flags to indicate whether or not a behavior should be active
    private m_iFlags : number = 0;

    private m_Deceleration : Deceleration = null;


    // 
    private m_dWeightArrive : number = 0;
    private m_dWeightSeek : number = 0;
    private m_dWeightFlee : number = 0;
    private m_dWeightWander : number = 0;
    private m_dWeightPursuit : number = 0;
    private m_dWeightEvade : number = 0;

    private m_dWanderJitter : number = 0;
    private m_dWanderRadius : number = 0;
    private m_dWanderDistance : number = 0;

    // the current position on the wander circle the agent is attempting to steer towards
    m_vWanderTarget : Vector2D = new Vector2D();

    // any offset used for formations or offset pursuit
    private m_vOffset : Vector2D = new Vector2D();

    /**
     *
     */
    constructor(agent : Vehicle) {
        this.m_pVehicle = agent;
        this.m_iFlags = 0;
        this.m_SummingMethod = summing_method.prioritized;
        this.m_dWeightSeek = Prm.SeekWeight;
        this.m_dWeightFlee = Prm.FleeWeight;
        this.m_dWeightArrive = Prm.ArriveWeight;
        this.m_dWeightWander = Prm.WanderWeight;
        this.m_dWeightPursuit = Prm.PursuitWeight;
        this.m_dWeightEvade = Prm.EvadeWeight;
        this.m_Deceleration = Deceleration.normal;

        this.m_dWanderJitter = WanderJitterPerSec;
        this.m_dWanderRadius = WanderRad;
        this.m_dWanderDistance = WanderDist;

        // stuff for the wander behavior
        let theta = Utils.RandFloat() * Math.PI * 2;
        this.m_vWanderTarget.x = this.m_dWanderRadius * Math.cos(theta);
        this.m_vWanderTarget.y = this.m_dWanderRadius * Math.sin(theta);
    }

    public SeekOn() : void {
        this.m_iFlags |= behavior_type.seek;
    }

    public SeekOff() : void {
        if(this.On(behavior_type.seek)) {
            this.m_iFlags ^= behavior_type.seek;
        }
    }

    public FleeOn() : void {
        this.m_iFlags |= behavior_type.flee;
    }

    public FleeOff() : void {
        if(this.On(behavior_type.flee)) {
            this.m_iFlags ^= behavior_type.flee;
        }
    }

    public ArriveOn() : void {
        this.m_iFlags |= behavior_type.arrive;
    }

    public ArriveOff() : void {
        if(this.On(behavior_type.arrive)) {
            this.m_iFlags ^= behavior_type.arrive;
        }
    }

    public WanderOn() : void {
        this.m_iFlags |= behavior_type.wander;
    }

    public WanderOff() : void {
        if(this.On(behavior_type.wander)) {
            this.m_iFlags ^= behavior_type.wander;
        }
    }

    public PursuitOn(v : Vehicle) {
        this.m_iFlags |= behavior_type.pursuit;
        this.m_pTargetAgent1 = v;
    }

    public PursuitOff() : void {
        if(this.On(behavior_type.pursuit)) {
            this.m_iFlags ^= behavior_type.pursuit;
        }
    }

    public EvadeOn(v : Vehicle) : void {
        this.m_iFlags |= behavior_type.evade;
        this.m_pTargetAgent1 = v;
    }

    public EvadeOff() : void {
        this.m_iFlags &= ~behavior_type.evade;
    }

    public OffsetPursuitOn(v1 : Vehicle, offset : Vector2D) : void {
        this.m_iFlags |= behavior_type.offset_pursuit;
        this.m_vOffset.Assignment(offset);
        this.m_pTargetAgent1 = v1;
    }

    public OffsetPursuitOff() {
        this.m_iFlags &= ~behavior_type.offset_pursuit;
    }

    public Calculate() : Vector2D {
        // reset the steering force
        this.m_vSteeringForce.Zero();


        switch(this.m_SummingMethod) {
            case summing_method.weighted_average : {

            }
            break;
            case summing_method.prioritized : {
                this.m_vSteeringForce.Assignment(this.CalculatePrioritized());
            }
            break;
            case summing_method.dithered : {

            }
            break;
            default:
                this.m_vSteeringForce.Zero();
        }

        return this.m_vSteeringForce;
    }

    // this method calls each active steering behavior in order of priority
    // and acumulates their forces until the max steering force magnitude
    // is reached, at which time the function returns the steering force
    // accumulated to that point
    public CalculatePrioritized() : Vector2D {
        let force : Vector2D = null;
        let crosshair : Vector2D = this.m_pVehicle.World().Crosshair();

        if(this.On(behavior_type.evade)) {
            force = this.Evade(this.m_pTargetAgent1).MultSelf(this.m_dWeightEvade);
            if(!this.AccumulateForce(this.m_vSteeringForce, force)) {
                return this.m_vSteeringForce;
            }
        }

        if(this.On(behavior_type.flee)) {
            force = this.Flee(crosshair).MultSelf(this.m_dWeightFlee);
            if(!this.AccumulateForce(this.m_vSteeringForce, force)) {
                return this.m_vSteeringForce;
            }
        }

        if(this.On(behavior_type.seek)) {
            force = this.Seek(crosshair).MultSelf(this.m_dWeightSeek);
            if(!this.AccumulateForce(this.m_vSteeringForce, force)) {
                return this.m_vSteeringForce;
            }
        }

        if(this.On(behavior_type.arrive)) {
            force = this.Arrive(crosshair, this.m_Deceleration).MultSelf(this.m_dWeightArrive);
            if(!this.AccumulateForce(this.m_vSteeringForce, force)) {
                return this.m_vSteeringForce;
            }
        }

        if(this.On(behavior_type.wander)) {
            force = this.Wander().MultSelf(this.m_dWeightWander);
            if(!this.AccumulateForce(this.m_vSteeringForce, force)) {
                return this.m_vSteeringForce;
            }
        }

        if(this.On(behavior_type.pursuit)) {
            force = this.Pursuit(this.m_pTargetAgent1).MultSelf(this.m_dWeightPursuit);
            if(!this.AccumulateForce(this.m_vSteeringForce, force)) {
                return this.m_vSteeringForce;
            }
        }

        if(this.On(behavior_type.offset_pursuit)) {
            force = this.OffsetPursuit(this.m_pTargetAgent1, this.m_vOffset);
            if(!this.AccumulateForce(this.m_vSteeringForce, force)) {
                return this.m_vSteeringForce;
            }
        }

        return this.m_vSteeringForce;
    }

    // This function calculates how much of its max steering force the vehicle has left
    // to apply and then applies that amount of the force to add.
    public AccumulateForce(runningTot : Vector2D, forceToAdd : Vector2D) : boolean {
        // calculate how much steering force the vehicle has used so far
        let magnitudeSoFar : number = runningTot.Length();

        // calculate how much steering force remains to be used by this vehicle
        let magnitudeRemaining : number = this.m_pVehicle.MaxForce() - magnitudeSoFar;

        // return false if there is no more force left to use
        if(magnitudeRemaining <= 0.0) {
            return false;
        }

        // calculate the magnitude of the force we want to add
        let magnitudeToAdd : number = forceToAdd.Length();

        // if the magnitude of the sum of ForceToAdd and the running total does not exceed
        // the maximum force available to this vehicle, just add together. Otherwise add as
        // much of the ForceToAdd vector is possible without going over the max
        if(magnitudeToAdd < magnitudeRemaining) {
            runningTot.AddSelf(forceToAdd);
        }
        else {
            // add it to the steering force
            runningTot.AddSelf(Vector2D.Vec2DNormalize(forceToAdd).Mult(magnitudeRemaining));
        }
        return true;
    }

    // this function tests if a specific bit of m_iFlags is set
    private On(bt : behavior_type) : boolean {
        return (this.m_iFlags & bt) === bt;
    }

    // this behavior moves the agent towards a target position
    private Seek(targetPos : Vector2D) : Vector2D {
        let desiredVelocity = Vector2D.Vec2DNormalize(targetPos.Sub(this.m_pVehicle.Pos())).MultSelf(this.m_pVehicle.MaxSpeed());
        return desiredVelocity.SubSelf(this.m_pVehicle.Velocity());
    }

    // this behavior returns a vector that moves the agent away from a target position
    private Flee(targetPos : Vector2D) : Vector2D {
        let desiredVelocity = Vector2D.Vec2DNormalize(this.m_pVehicle.Pos().Sub(targetPos)).MultSelf(this.m_pVehicle.MaxSpeed());
        return desiredVelocity.SubSelf(this.m_pVehicle.Velocity());
    }

    // this behavior is similar to seek but it attempts to arrive at the target position with a zero velocity
    private Arrive(targetPos : Vector2D, deceleration : Deceleration) : Vector2D {
        let toTarget : Vector2D = targetPos.Sub(this.m_pVehicle.Pos());
        // calculate the distance to the target
        let dist : number = toTarget.Length();

        if(dist > 0) {
            // because Deceleration is enumerated as an int, this value is required to provide fine tweaking of the deceleration.
            let DecelerationTweaker = 0.3;
            // calculate the speed required to reach the target given the desired deceleration
            let speed = dist / (deceleration * DecelerationTweaker);
            // make sure the velocity does not exceed the max
            speed = Math.min(speed, this.m_pVehicle.MaxSpeed());

            // from here proceed just like Seek except we don't need to normalize
            // the toTarget vector because we have already gone to the trouble of
            // calculating its length: dist.
            let desiredVelocity : Vector2D = toTarget.MultSelf(speed / dist);
            return desiredVelocity.SubSelf(this.m_pVehicle.Velocity());
        }

        return new Vector2D(0, 0);
    }

    // this behavior predicts where an agent will be in time T and seeks towards that point to intercept it
    private Pursuit(evader : Vehicle) : Vector2D {
        // if the evader is ahead and facing the agent then we can just seek for the evader's current position.
        let toEvader : Vector2D = evader.Pos().Sub(this.m_pVehicle.Pos());
        let relativeHeading = this.m_pVehicle.Heading().Dot(evader.Heading());

        if(toEvader.Dot(this.m_pVehicle.Heading()) > 0 && relativeHeading < -0.95) { // Math.acos(0.95) = 18 degs
            return this.Seek(evader.Pos());
        }

        // Not considered ahead so we predict where the evader will be.
        // the lookahead time is propotional to the distance between the evader
        // and the pursuer; and is inversely proportional to the sum of the agent's
        // velocities
        let lookAheadTime = toEvader.Length() / (this.m_pVehicle.MaxSpeed() + evader.Speed());
        // now seek to the predicted future position of the evader
        return this.Seek(evader.Pos().Add(evader.Velocity().Mult(lookAheadTime)));
    }

    // this behaivor maintains a position, in the direction of offset from the target vehicle
    private OffsetPursuit(leader : Vehicle, offset : Vector2D) : Vector2D {
        let headig : Vector2D = leader.Heading();
        let worldOffsetPos : Vector2D = offset.Rotate(Math.atan2(headig.y, headig.x));
        worldOffsetPos.AddSelf(leader.Pos());
        let toOffset : Vector2D = worldOffsetPos.SubSelf(this.m_pVehicle.Pos());
        // the lookahead time is propotional to the distance between the leader and the pursuer;
        // and is inversely proportional to the sum of both agent's velocities
        let lookAheadTime : number = toOffset.Length() / (this.m_pVehicle.MaxSpeed() + leader.Speed());
        // now Arrive at the predicted future position of the offset
        return this.Arrive(worldOffsetPos.AddSelf(leader.Velocity().Mult(lookAheadTime)), Deceleration.fast);
    }

    // this behavior attempts to evade a pursuer
    private Evade(pursuer : Vehicle) : Vector2D {
        // not necessary to include the check for facing direction this time
        let toPursuer = pursuer.Pos().Sub(this.m_pVehicle.Pos());
        // uncomment the following two lines to have Evade only consider pursuers within a 'threat range'
        let threatRange = 200.0;
        if(toPursuer.LengthSq() > threatRange * threatRange) {
            return new Vector2D();
        }

        // the lookahead time is propotional to the distance between the pursuer
        // and the pursuer; and is inversely proportional to the sum of the agent's velocities
        let lookAheadTime = toPursuer.Length() / (this.m_pVehicle.MaxSpeed() + pursuer.Speed());
        // now flee away from predicted future position of the pursuer
        return this.Flee(pursuer.Pos().Add(pursuer.Velocity().Mult(lookAheadTime)));
    }

    // this behavior makes the agent wander about randomly
    private Wander() : Vector2D {
        // this behavior is dependent on the update rate, so this line must be included when using time independent framerate.
        let jitterThisTimeSlice = this.m_dWanderJitter * this.m_pVehicle.TimeElapsed();

        // first, add a small random vector to the target's position
        this.m_vWanderTarget.x += Utils.RandomClamped() * jitterThisTimeSlice;
        this.m_vWanderTarget.y += Utils.RandomClamped() * jitterThisTimeSlice;

        // reproject this new vector back on to a unit circle
        this.m_vWanderTarget.Normalize();

        // increase the length of the vector to the same as the radius of the wander circle
        this.m_vWanderTarget.MultSelf(this.m_dWanderRadius);

        // move the target into a position WanderDist in front of the agent
        let target = this.m_vWanderTarget.Add(new Vector2D(this.m_dWanderDistance, 0));
        target.RotateSelf(Math.atan2(this.m_pVehicle.Heading().y, this.m_pVehicle.Heading().y));
        target.AddSelf(this.m_pVehicle.Pos());
        
        return target.SubSelf(this.m_pVehicle.Pos());
    }

    private ObstacleAvoidance(obstacles) {
        
    }
}