import MovingEnity from "./MovingEntity";
import GameWorld from "./GameWorld";
import SteeringBehavior from "./SteeringBehavior";
import Vector2D from './Common/Vector2D';



const {ccclass, property} = cc._decorator;
@ccclass
export default class Vehicle extends MovingEnity {
    // a pointer to the world data. So a vehicle can access any obstacle, path, wall or agent data
    private m_pWorld : GameWorld = null;
    // the steering behavior class
    private m_pSteering : SteeringBehavior = null;

    // this vector represents the average of the vehicle's heading
    private m_vSmoothedHeading : Vector2D = null;
    // when true, smooting is active
    
    m_vecVehicleVB : Array<Vector2D>[] = [];

    // updates the vehicle's position and orientation
    Update(time_elapsed : number) : void {
        // Keep a record of its old position so we can update its call later in this method
        let OldPos : Vector2D = this.Pos();
        let SteeringForce : Vector2D = null;
        // calculate the combine force from each steering behavior in the vehicle's list
        SteeringForce = this.m_pSteering.Calculate();

        // Acceleration = Force / Mass
        let acceleration : Vector2D = SteeringForce.Div(this.m_dMass);

        // update velocity
        this.m_vVelocity.AddSelf(acceleration);

        // make sure vehicle does not exceed maximum velocity
        this.m_vVelocity.Truncate(this.m_dMaxSpeed);

        // update the position
        this.m_vPos.AddSelf(this.m_vVelocity.Mult(time_elapsed));

        // update the heading if the vehicle has a non zero velocity
        if(this.m_vVelocity.LengthSq() > 0.00000001) {
            this.m_vHeading.Assignment(Vector2D.Vec2DNormalize(this.m_vVelocity));
            this.m_vSide.Assignment(this.m_vHeading.Perp());
        }


    }
}