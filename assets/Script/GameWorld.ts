import Vector2D from './Common/Vector2D';
import Utils from './Utils';
import Vehicle from './Vehicle';
import Prm from './Prm';
import BaseGameEntity from './BaseGameEntity';

export default class GameWorld {
    vehiclePrefag : cc.Prefab = null;
    vehicleLayer : cc.Node = null;

    // a contianer of all the moving entities
    private m_Vehicles : Array<Vehicle> = [];

    // local copy of client window dimensions
    private m_cxClient : number = 0;
    private m_cyClient : number = 0;

    // the position of the crosshair
    private m_vCrosshair : Vector2D = new Vector2D();

    /**
     * set true to pause the motion
     */
    private m_bPaused : boolean = false;

    /**
     *
     */
    initWorld(cx : number, cy : number, vehiclePrefag : cc.Prefab, vehicleLayer : cc.Node) {
        this.m_cxClient = cx;
        this.m_cyClient = cy;
        this.vehiclePrefag = vehiclePrefag;
        this.vehicleLayer = vehicleLayer;
        this.m_vCrosshair = new Vector2D(cx / 2, cy / 2);
        
        for(let a = 0; a < Prm.NumAgents; a++) {
            let spawnPos : Vector2D = new Vector2D(cx / 2.0 + Utils.RandomClamped() * cx / 2.0, cy / 2.0 + Utils.RandomClamped() * cy / 2.0);
            let node : cc.Node = cc.instantiate(this.vehiclePrefag);
            node.parent = vehicleLayer;
            let pVehicle : Vehicle = node.getComponent(Vehicle);
            pVehicle.initVehicle(this, 
                                spawnPos,                           // initial position
                                Utils.RandFloat() * Math.PI * 2,    // start rotation
                                new Vector2D(0, 0),                 // velocity
                                Prm.VehicleMass,                    // mass
                                Prm.MaxSteeringForce,               // max force
                                Prm.MaxSpeed,                       // max velocity
                                Prm.MaxTurnRatePerSecond,           // max turn rage
                                Prm.VehicleScale);                  // scale

            pVehicle.Steering().FlockingOn();

            // pVehicle.Steering().SeekOn();
            // pVehicle.Steering().FleeOn();
            // pVehicle.Steering().ArriveOn();
            // pVehicle.Steering().WanderOn();

            this.m_Vehicles.push(pVehicle);
        }

        this.m_Vehicles[Prm.NumAgents - 1].Steering().FlockingOff();
        this.m_Vehicles[Prm.NumAgents - 1].SetScale(new Vector2D(10, 10));
        this.m_Vehicles[Prm.NumAgents - 1].Steering().WanderOn();
        this.m_Vehicles[Prm.NumAgents - 1].SetMaxSpeed(70);
        this.m_Vehicles[Prm.NumAgents - 1].node.color = cc.Color.GREEN;

        for(let i = 0; i < Prm.NumAgents - 1; i++) {
            this.m_Vehicles[i].Steering().EvadeOn(this.m_Vehicles[Prm.NumAgents - 1]);
            // this.m_Vehicles[Prm.NumAgents - 1].Steering().OffsetPursuitOn(this.m_Vehicles[i], new Vector2D(100, 100));
        }
    }

    public Crosshair() : Vector2D {
        return this.m_vCrosshair;
    }

    public SetCrosshair(p : cc.Vec2) {
        this.m_vCrosshair.x = p.x;
        this.m_vCrosshair.y = p.y;
    }


    public Update(time_elapsed : number) : void {
        if(this.m_bPaused) {
            return;
        }
        for(let i = 0, len = this.m_Vehicles.length; i < len; i++) {
            this.m_Vehicles[i].Update(time_elapsed);
        }
    }

    public Agents() {
        return this.m_Vehicles;
    }

    /**
     * creates some walls that form an enclosure for the steering agents.
     * used to demonstrate several of the steering behaviors
     */
    public CreateWalls() {

    }

    /**
     * Sets up the vector of obstacles with random positions and sizes. Makes
     * sure the obstacles do not overlap
     */
    public CreateObstacles() {

    }

    public cxClient() : number {
        return this.m_cxClient;
    }

    public cyClient() : number {
        return this.m_cyClient;
    }

    public CellSpace() {

    }

    public TagVehiclesWithinViewRange(pVehicle : BaseGameEntity, range : number) {
        this.TagNeighbors(pVehicle, this.m_Vehicles, range);
    }

    /**
     * tags any entities contained in a std container that are within the radius of the single entity parameter
     * @param entity 
     * @param containerOfEntities 
     * @param radius 
     */
    TagNeighbors(entity : BaseGameEntity, containerOfEntities : Vehicle[], radius : number) {
        let curEntity : Vehicle = null;
        for(let i = 0, len = containerOfEntities.length; i < len; i++) {
            curEntity = containerOfEntities[i];
            // first clear any current tag
            curEntity.UnTag();

            let to = curEntity.Pos().Sub(entity.Pos());

            // the bounding radius of the other is taken into account by adding it to the range
            let range = radius + curEntity.BRadius();

            // if entity within range, tag for further consideration. (working in distance-squared space to avoid sqrts)
            if((curEntity !== entity) && (to.LengthSq() < range * range)) {
                curEntity.Tag();
            }
        }
    }
}