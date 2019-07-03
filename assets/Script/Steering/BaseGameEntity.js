
cc.Class({
    extends: cc.Component,

    properties: {
        m_vPos : null,
        m_vScale : cc.v2(1, 1),
        m_dBoundingRadius : null
    },

    Pos() {
        return this.m_vPos;
    },

    SetPos(new_pos) {
        m_vPos = new_pos;
    },

    BRadius() {
        return this.m_dBoundingRadius;
    },

    SetBRadius(r) {
        this.m_dBoundingRadius = r;
    },

    Scale() {
        return this.m_vScale;
    },

    SetScale(val) {
        if(val instanceof cc.Vec2) {
            this.m_dBoundingRadius *= Math.max(val.x, val.y) / Math.max(this.m_vScale.x, this.m_vScale.y);
            this.m_vScale = val;
        }
        else {
            this.m_dBoundingRadius *= (val / Math.max(this.m_vScale.x, this.m_vScale.y));
            this.m_vScale = cc.v2(val, val);
        }
    }
});
