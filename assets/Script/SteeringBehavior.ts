import Vector2D from './Common/Vector2D';
import Vehicle from './Vehicle';
import Prm from './Prm';

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

export default class SteeringBehavior {

    // a pointer to the owner of this instance
    private m_pVehicle : Vehicle = null;

    // the steering force created by the combined effect of all the selected behaviors
    private m_vSteeringForce : Vector2D = new Vector2D();

    // what type of method is used to sum any active behavior
    private m_SummingMethod : summing_method = null;

    // binary flags to indicate whether or not a behavior should be active
    private m_iFlags : number = 0;

    private m_Deceleration : Deceleration = null;


    // 
    private m_dWeightArrive : number = 0;
    private m_dWeightSeek : number = 0;
    private m_dWeightFlee : number = 0;

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
        this.m_Deceleration = Deceleration.normal;
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
}