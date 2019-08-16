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
    private m_vSmoothedHeading : Vector2D = new Vector2D();
    // when true, smooting is active


    private m_dTimeElapsed : number = 0;
    
    private m_vecVehicleVB : Array<Vector2D>[] = [];

    public initVehicle(world : GameWorld, position : Vector2D, rotation : number, velocity : Vector2D, mass : number, max_force : number, max_speed : number, max_turn_rate : number, scale : number) {
        this.initMovingEntity(position, scale, velocity, max_speed, new Vector2D(Math.sin(rotation), -Math.cos(rotation)), mass, new Vector2D(scale, scale), max_turn_rate, max_force);
        this.m_pWorld = world;
        this.m_pSteering = new SteeringBehavior(this);
        this.m_dTimeElapsed = 0;
    }

    // updates the vehicle's position and orientation
    public Update(time_elapsed : number) : void {
        // update the time elapsed
        this.m_dTimeElapsed = time_elapsed;
        // Keep a record of its old position so we can update its call later in this method
        let OldPos : Vector2D = this.Pos();
        // calculate the combine force from each steering behavior in the vehicle's list
        let SteeringForce : Vector2D = this.m_pSteering.Calculate();

        // Acceleration = Force / Mass 加速度公式
        let acceleration : Vector2D = SteeringForce.Div(this.m_dMass);
        
        // update velocity
        this.m_vVelocity.AddSelf(acceleration.MultSelf(time_elapsed));

        // make sure vehicle does not exceed maximum velocity
        this.m_vVelocity.Truncate(this.m_dMaxSpeed);
        
        // update the position
        this.m_vPos.AddSelf(this.m_vVelocity.Mult(time_elapsed));
        
        // update the heading if the vehicle has a non zero velocity
        if(this.m_vVelocity.LengthSq() > 0.00000001) {
            this.m_vHeading.Assignment(Vector2D.Vec2DNormalize(this.m_vVelocity));
            this.m_vSide.Assignment(this.m_vHeading.Perp());
        }

        Vector2D.WrapAround(this.m_vPos, this.m_pWorld.cxClient(), this.m_pWorld.cyClient());

        this.UpdateNode();
    }

    public Steering() : SteeringBehavior {
        return this.m_pSteering;
    }

    public World() : GameWorld {
        return this.m_pWorld;
    }

    public SmoothedHeading() : Vector2D {
        return this.m_vSmoothedHeading;
    }

    private UpdateNode() {
        this.node.x = this.m_vPos.x;
        this.node.y = this.m_vPos.y;

        this.node.rotation = Math.atan2(this.m_vHeading.x, this.m_vHeading.y) * cc.macro.DEG;
    }

    public TimeElapsed() : number {
        return this.m_dTimeElapsed;
    }
}