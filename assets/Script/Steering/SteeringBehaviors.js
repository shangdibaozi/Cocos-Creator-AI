
let summing_method = cc.Enum({
    weighted_averate : -1,
    prioritized : -1,
    dithered : -1
});

let behavior_type = cc.Enum({
    none : 0x00000,
    seek : 0x00002,
    flee : 0x00004,
    arrive : 0x00008,
    wander : 0x00010,
    cohesion : 0x00020,
    separation : 0x00040,
    allignment : 0x00080,
    obstacle_avoidance : 0x00100,
    wall_avoidance : 0x00200,
    follow_path : 0x00400,
    pursuit : 0x00800,
    evade : 0x01000,
    interpose : 0x02000,
    hide : 0x04000,
    flock : 0x08000,
    offset_pursuit : 0x10000
})

cc.Class({
    name : 'SterringBehaviors',

    properties : {
        m_pVehicle : null,
        m_vSteeringForce : null,
        m_pTargetAgent1 : null,
        m_pTargetAgent2 : null,
        m_vTarget : null,
        m_dDBoxLength : null,
        m_Feelers : null,
        m_dWallDetectionFeelerLength : null,
        m_vWanderTarget : null,
        m_dWanderJitter : null,
        m_dWanderRadius : null,
        m_dWanderDistance : null
    },

    ctor() {

    }
});