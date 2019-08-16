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

    public Pos() : Vector2D {
        return this.m_vPos;
    }

    public SetPos(new_pos : Vector2D) : void {
        this.m_vPos.x = new_pos.x;
        this.m_vPos.y = new_pos.y;
    }

    public BRadius() : number {
        return this.m_dBoudingRadius;
    }

    public SetBRadius(r : number) : void {
        this.m_dBoudingRadius = r;
    }

    public ID() : number {
        return this.m_ID;
    }

    public IsTagged() : boolean {
        return this.m_bTag;
    }

    public Tag() : void {
        this.m_bTag = true;
    }

    public UnTag() : void {
        this.m_bTag = false;
    }

    public Scale() : Vector2D {
        return this.m_vScale;
    }

    public SetScale(val : Vector2D) : void {

    }

    public EntityType() : number {
        return this.m_EntityType;
    }

    public SetEntityType(new_type : number) : void {
        this.m_EntityType = new_type;
    }
}
