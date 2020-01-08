import BaseGameEntity from './BaseGameEntity';
import Vector2D from './Common/Vector2D';

const {ccclass, property} = cc._decorator;
@ccclass
export default class MovingEnity extends BaseGameEntity {

    protected m_vVelocity : Vector2D = new Vector2D();
    // a normalized vector pointing in the direction the entity is heading
    protected m_vHeading : Vector2D = new Vector2D();
    // a vector perpendicular to the heading vector
    protected m_vSide : Vector2D = new Vector2D();

    protected m_dMass : number = 0;
    // the maximum speed this entity may travel at.
    protected m_dMaxSpeed : number = 0;
    // the maximum force this entity can produce to power itself
    protected m_dMaxForce : number = 0;
    // the maximum rate (radians per second) this vehicle can rotate
    protected m_dMaxTurnRate : number = 0;


    public initMovingEntity(position : Vector2D, radius : number, velocity : Vector2D, max_speed : number, heading : Vector2D, mass : number, scale : Vector2D, turn_rate : number, max_force : number) : void {
        this.initBaseGameEntity(0, position, radius);
        this.m_vVelocity.Assignment(velocity);
        this.m_dMaxSpeed = max_speed;
        this.m_vHeading.Assignment(heading);
        this.m_dMass = mass;
        this.m_vScale.Assignment(scale);
        this.m_dMaxTurnRate = turn_rate;
        this.m_dMaxForce = max_force;
    }

    public Velocity() : Vector2D { 
        return this.m_vVelocity;
    }

    public SetVelocity(newVel : Vector2D) : void { 
        this.m_vVelocity.Assignment(newVel);
    }

    public Mass() : number { 
        return this.m_dMass;
    }

    public Side() : Vector2D { 
        return this.m_vSide;
    }

    public MaxSpeed() : number { 
        return this.m_dMaxSpeed;
    }

    public SetMaxSpeed(new_speed : number) : void { 
        this.m_dMaxSpeed = new_speed;
    }

    public MaxForce() : number {
        return this.m_dMaxForce;
    }

    public SetMaxForce(mf : number) : void {
        this.m_dMaxForce = mf;
    }

    public IsSpeedMaxedOut() : boolean {
        return this.m_dMaxSpeed * this.m_dMaxSpeed >= this.m_vVelocity.LengthSq();
    }

    public Speed() : number {
        return this.m_vVelocity.Length();
    }

    public SpeedSq() : number {
        return this.m_vVelocity.LengthSq();
    }

    public Heading() : Vector2D {
        return this.m_vHeading;
    }

    public SetHeading(new_heading : Vector2D) : void {
        this.m_vHeading.Assignment(new_heading);
        this.m_vSide = this.m_vHeading.Perp();
    }

    /**
     * given a target position, this method rotates the entity's heading and
     * side vectors by an amount not greater than m_dMaxTurnRate until it directly
     * faces the target.
     * 
     * returns true when the heading is facing in the desired direction.
     */
    public RotateHeadingToFacePosition(target : Vector2D) : boolean {
        let toTarget : Vector2D = (target.Sub(this.m_vPos)).Normalize();
        // first determine the angle between the heading vector and the target
        let angle : number = Math.acos(this.m_vHeading.Dot(toTarget));
        // return true if the player is facing the target
        if(angle < 0.00001) {
            return true;
        }
        // clamp the amount to turn to the max turn rate
        if(angle > this.m_dMaxTurnRate) {
            angle = this.m_dMaxTurnRate;
        }

        let radians : number = angle * this.m_vHeading.Sign(toTarget);
        this.m_vHeading.RotateSelf(radians);
        this.m_vVelocity.RotateSelf(radians);
        this.m_vSide = this.m_vHeading.Perp();
        return false;
    }

    public MaxTurnRate() : number {
        return this.m_dMaxTurnRate;
    }

    public SetMaxTurnRate(val : number) : void {
        this.m_dMaxTurnRate = val;
    }

}