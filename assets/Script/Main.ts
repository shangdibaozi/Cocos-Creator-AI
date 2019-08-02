import GameWorld from "./GameWorld";

const {ccclass, property} = cc._decorator;
@ccclass
export default class Main extends cc.Component {

    @property(cc.Prefab)
    vehiclePrefab : cc.Prefab = null;
    @property(cc.Node)
    vehicleLayer : cc.Node = null;

    m_pWorld : GameWorld = null;
    onLoad() {
        this.m_pWorld = new GameWorld();
        this.m_pWorld.initWorld(cc.winSize.width, cc.winSize.height, this.vehiclePrefab, this.vehicleLayer);

        this.installEvents();
    }

    installEvents() {
        this.node.on('touchend', this.touchEnd, this);
    }

    update(dt) {
        this.m_pWorld.Update(dt);
    }

    touchEnd(event : cc.Event.EventTouch) : void {
        let touchPoint : cc.Vec2 = event.getLocation(); // 获得的是在世界坐标系下的坐标点
        this.m_pWorld.SetCrosshair(touchPoint);
    }
}