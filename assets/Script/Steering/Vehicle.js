import MovingEntity from './MovingEntity';
import SteeringBehaviors from './SteeringBehaviors';

cc.Class({
    extends : MovingEntity,

    properties : {
        m_pWorld : null,
        m_pSteering : null,
        m_pHeadingSmoother : null,
        m_vSmoothedHeading : null,
        m_bSmoothingOn : false,
        m_dTimeElapsed : 0,
        m_vecVehicleVB : null,
    },

    init(world, position, rotation, velocity, mass, max_force, max_speed, max_turn_rate, scale) {
        this._super(position, scale, velocity, max_speed, cc.v2(Math.sin(rotation), -Math.cos(rotation)), mass, cc.v2(scale, scale), max_turn_rate, max_force);
        this.m_pWorld = world;
        this.m_vSmoothedHeading = cc.v2(0, 0);
        this.m_bSmoothingOn = false;
        this.m_dTimeElapsed = 0.0;

        this.InitializeBuffer();

        this.m_pSteering = new SteeringBehaviors(this);
    },

    InitializeBuffer() {
        const NumVehicleVerts = 3;
        let vehicle = [
            cc.v2(-1.0, 0.6),
            cc.v2(1.0, 0.0),
            cc.v2(-1.0, -0.6)
        ];
        for(let vtx = 0; vtx < NumVehicleVerts; vtx++) {
            this.m_vecVehicleVB.push(vehicle[vtx]);
        }
    },

    Update(time_elapsed) {
        this.m_dTimeElapsed = time_elapsed;
        let OldPos = this.Pos();
        let SteeringForce;
        SteeringForce = this.m_pSteering.Calculate();
        let acceleration = SteeringForce.divSelf(this.m_dMass);
        this.m_vVelocity.addSelf(acceleration.mulSelf(time_elapsed))
        if(this.m_vVelocity.mag() > this.m_dMaxSpeed) {
            this.m_vVelocity.normalizeSelf();
            this.m_vVelocity.mulSelf(this.m_dMaxSpeed);
        }
        this.m_vPos.addSelf(this.m_vVelocity);
        if(this.m_vVelocity.magSqr() > 0.0000001) {
            this.m_vHeading = this.m_vVelocity.normalize();
            this.m_vSide.x = -this.m_vHeading.y;
            this.m_vSide.y = this.m_vHeading.x;
        }

        if(this.m_vPos.x > cc.winSize.width) {
            this.m_vPos.x = 0;
        }
        else if(this.m_vPos.x < 0) {
            this.m_vPos.x = cc.winSize.width;
        }

        if(this.m_vPos.y > cc.winSize.height) {
            this.m_vPos.y = 0;
        }
        else if(this.m_vPos.y < 0) {
            this.m_vPos.y = cc.winSize.height;
        }


        if(this.Steering().isSpacePartitioningOn()) {
            this.World().CellSpace().UpdateEntity(this, OldPos);
        }

        if(this.isSmoothingOn()) {
            this.m_vSmoothedHeading = this.m_pHeadingSmoother.Update(this.Heading());
        }
    },

    Render() {

    },

    Steering() {
        return this.m_pSteering;
    },

    World() {
        return this.m_pWorld;
    },

    SmoothedHeading() {
        return this.m_vSmoothedHeading;
    },

    isSmoothingOn() {
        return this.m_bSmoothingOn;
    },

    SmoothingOn() {
        this.m_bSmoothingOn = true;
    },

    SmoothingOff() {
        this.m_bSmoothingOn = false;
    },

    ToggleSmooting() {
        this.m_bSmoothingOn = !this.m_bSmoothingOn;
    },

    TimeEpalsed() {
        return this.m_dTimeElapsed;
    }
})