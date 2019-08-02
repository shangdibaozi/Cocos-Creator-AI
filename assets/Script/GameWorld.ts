import Vector2D from './Common/Vector2D';
import Utils from './Utils';
import Vehicle from './Vehicle';
import Prm from './Prm';

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
            pVehicle.initVehicle(this, spawnPos, Utils.RandFloat() * Math.PI * 2, new Vector2D(0, 0), Prm.VehicleMass, Prm.MaxSteeringForce, Prm.MaxSpeed, Prm.MaxTurnRatePerSecond, Prm.VehicleScale);
            pVehicle.Steering().SeekOn();
            this.m_Vehicles.push(pVehicle);
        }
    }

    public Crosshair() : Vector2D {
        return this.m_vCrosshair;
    }

    public SetCrosshair(p : cc.Vec2) {
        this.m_vCrosshair.x = p.x;
        this.m_vCrosshair.y = p.y;
    }


    public Update(time_elapsed) : void {
        for(let i = 0, len = this.m_Vehicles.length; i < len; i++) {
            this.m_Vehicles[i].Update(time_elapsed);
        }
    }
}