
cc.Class({
    extends: cc.Component,

    properties: {
        scrollView: cc.ScrollView,
        msgItemPrefab: cc.Prefab
    },

    onLoad() {
        this.msgNodes = [];
    },

    addMsg(msg, color) {
        let msgNode = cc.instantiate(this.msgItemPrefab);
        msgNode.color = color;
        msgNode.getComponent(cc.Label).string = msg;
        this.msgNodes.push(msgNode);
        msgNode.parent = this.scrollView.content;

        msgNode.on('size-changed', this.updateContent, this);
    },

    updateContent() {
        if(this.msgNodes.length <= 0) {
            return;
        }
        let h = 0;
        let y = 0;
        for(let i = 0, len = this.msgNodes.length; i < len; i++) {
            h += this.msgNodes[i].height;
            this.msgNodes[i].y = y - this.msgNodes[i].height / 2;
            y += -this.msgNodes[i].height;
        }
        this.scrollView.content.height = h;

    },

    update() {
        // this.updateContent();
    }
});
