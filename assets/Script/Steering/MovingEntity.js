let BaseGameEntity = require('./BaseGameEntity');

cc.Class({
    extends: BaseGameEntity,

    properties: {
        m_vVelocity : null,
        m_vHeading : null, // 朝向
        m_vSide : cc.v2(0, 0),     // 和朝向垂直的向量
        m_dMass : null,     // 质量
        m_dMaxSpeed : null, // 最大速度
        m_dMaxForce : null, // 最大力
        m_dMaxTurnRate : null // 
    },

    Velocity() {
        return this.m_vVelocity;
    },

    SetVelocity(newVel) {
        this.m_vVelocity = newVel;
    },

    Mass() {
        return this.m_dMass;
    },

    Side() {
        return this.m_vSide;
    },

    MaxSpeed() {
        return this.m_dMaxSpeed;
    },

    SetMaxSpeed(new_speed) {
        this.m_dMaxSpeed = new_speed;
    },

    MaxForce() {
        return this.m_dMaxForce;
    },

    SetMaxForce(mf) {
        this.m_dMaxForce = mf;
    },

    IsSpeedMaxedOut() {
        return this.m_dMaxSpeed * this.m_dMaxSpeed >= this.m_vVelocity.magSqr();
    },

    Speed() {
        return this.m_vVelocity.mag();
    },

    SpeedSq() {
        return this.m_vVelocity.magSqr();
    },

    Heading() {
        return this.m_vHeading;
    },

    SetHeading(new_heading) {
        
        this.m_vHeading = new_heading;
        this.m_vSide.x = -this.m_vHeading.y;
        this.m_vSide.y = this.m_vHeading.x;
    },

    /**
     * 按照一定值选择朝向到target
     */
    RotateHeadingToFacePosition(target) {
        let toTarget = target.sub(this.m_vPos).normalize();
        let radian = Math.acos(this.m_vHeading.dot(toTarget));
        let angle =  radian* cc.macro.DEG;
        if(angle < 0.00001) {
            return true;
        }

        if(angle > this.m_dMaxTurnRate) {
            angle = this.m_dMaxTurnRate;
        }

        let sign = 0;
        if(this.m_vHeading.cross(toTarget) > 0) { // 逆时针
            sign = -1;
        }
        else { // 顺时针
            sign = 1;
        }
        radian *= sign;
        this.m_vHeading.rotateSelf(radian);
        this.m_vVelocity.rotateSelf(radian);
        this.m_vSide.x = -this.m_vHeading.y;
        this.m_vSide.y = this.m_vHeading.x;
    },

    MaxTurnRate() {
        return this.m_dMaxTurnRate;
    },

    SetMaxTurnRate(val) {
        this.m_dMaxTurnRate = val;
    }
});
