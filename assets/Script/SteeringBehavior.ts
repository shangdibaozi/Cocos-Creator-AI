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

export default class SteeringBehavior {

    // a pointer to the owner of this instance
    private m_pVehicle : Vehicle = null;

    // the steering force created by the combined effect of all the selected behaviors
    private m_vSteeringForce : Vector2D = new Vector2D();

    // what type of method is used to sum any active behavior
    private m_SummingMethod : summing_method = null;

    // binary flags to indicate whether or not a behavior should be active
    private m_iFlags : number = 0;


    // 
    m_dWeightArrive : number = 0;
    m_dWeightSeek : number = 0;

    /**
     *
     */
    constructor(agent : Vehicle) {
        this.m_pVehicle = agent;
        this.m_iFlags = 0;
        this.m_SummingMethod = summing_method.prioritized;
        this.m_dWeightSeek = Prm.SeekWeight;

    }

    public SeekOn() : void {
        this.m_iFlags |= behavior_type.seek;
    }

    public SeekOff() : void {
        if(this.On(behavior_type.seek)) {
            this.m_iFlags ^= behavior_type.seek;
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
        if(this.On(behavior_type.seek)) {
            force = this.Seek(this.m_pVehicle.World().Crosshair()).Mult(this.m_dWeightSeek);
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
        let desiredVelocity = Vector2D.Vec2DNormalize(targetPos.Sub(this.m_pVehicle.Pos())).Mult(this.m_pVehicle.MaxSpeed());
        return desiredVelocity.Sub(this.m_pVehicle.Velocity());
    }
}