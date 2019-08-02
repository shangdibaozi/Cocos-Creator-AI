import Vector2D from './Common/Vector2D';


export enum Entity_Type {
    default_entity_type = -1
};

const {ccclass, property} = cc._decorator;
@ccclass
export default class BaseGameEntity extends cc.Component {

    // each entity has a unique ID
    private m_ID : number = 0;
    // every entity has a type associated with it(health, troll, ammo etc)
    private m_EntityType : number = 0;
    // this is a generic flag
    private m_bTag : boolean = false;

    // its location in the environment
    protected m_vPos : Vector2D = new Vector2D();
    protected m_vScale : Vector2D = new Vector2D();
    // the length of this object's bouding radius
    protected m_dBoudingRadius : number = 0.0;

    // used by the constructor to give each entity a unique ID
    static NextID : number = 0;

    NextValidID() : number {
        BaseGameEntity.NextID++;
        return BaseGameEntity.NextID;
    }

    /**
     * 
     */
    public initBaseGameEntity(entityType : number, pos : Vector2D, r : number) : void {
        this.m_ID = this.NextValidID();
        this.m_dBoudingRadius = r || 0.0;
        this.m_vScale = new Vector2D(1.0, 1.0);
        this.m_EntityType = entityType || Entity_Type.default_entity_type;
        this.m_bTag = false;
        this.m_vPos.Assignment(pos);
    }

    Pos() {
        return this.m_vPos;
    }

    SetPos(new_pos : Vector2D) {
        this.m_vPos.x = new_pos.x;
        this.m_vPos.y = new_pos.y;
    }

    BRadius() {
        return this.m_dBoudingRadius;
    }

    SetBRadius(r : number) {
        this.m_dBoudingRadius = r;
    }

    ID() {
        return this.m_ID;
    }

    IsTagged() {
        return this.m_bTag;
    }

    Tag() {
        this.m_bTag = true;
    }

    UnTag() {
        this.m_bTag = false;
    }

    Scale() {
        return this.m_vScale;
    }

    SetScale(val : Vector2D) {

    }

    EntityType() {
        return this.m_EntityType;
    }

    SetEntityType(new_type : number) {
        this.m_EntityType = new_type;
    }
}
