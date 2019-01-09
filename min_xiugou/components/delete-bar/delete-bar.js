Component({
    properties: {
        item: Array,
        index: Number,
        prodskey: Number,
        itemkey: Number,
    },
    data: {
        startX: 0, //开始坐标
        startY: 0,
        scroll: true,
        items: ""
    },
    methods: {
        //手指触摸动作开始 记录起点X坐标
        touchstart (e) {
            this.data.items = this.data.item
            //开始触摸时 重置所有删除
            this.data.items.forEach(function (v, i) {
                if (v.isTouchMove)//只操作为true的
                    v.isTouchMove = false;
            })
            this.data.startX = e.changedTouches[0].clientX
            this.data.startY = e.changedTouches[0].clientY
        },
        touchend() {

        },
        //滑动事件处理
        touchmove (e) {
            let that = this,
                index = e.currentTarget.dataset.index,//当前索引
                prodskey = e.currentTarget.dataset.prodskey,
                itemkey = e.currentTarget.dataset.itemkey,
                startX = this.data.startX,//开始X坐标
                startY = this.data.startY,//开始Y坐标
                touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
                touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
                //获取滑动角度
                angle = this.angle({X: startX, Y: startY}, {X: touchMoveX, Y: touchMoveY});
            this.data.items.forEach((v, i)=> {
                v.isTouchMove = false
                //滑动超过30度角 return
                if (Math.abs(angle) > 20) return;
                if (i == index) {
                    if (touchMoveX > startX) {
                        //右滑
                        this.data.scroll = false
                        v.isTouchMove = false
                    } else {
                        //左滑
                        this.data.scroll = false
                        v.isTouchMove = true
                    }

                }
            })
            //更新数据
            this.triggerEvent('deleteClicked', {items: this.data.items, prodskey, itemkey})
        },
        /**
         * 计算滑动角度
         * @param {Object} start 起点坐标
         * @param {Object} end 终点坐标
         */
        angle (start, end) {
            let _X = end.X - start.X,
                _Y = end.Y - start.Y
            //返回角度 /Math.atan()返回数字的反正切值
            return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
        },
        //删除事件
        itemDelete(e) {
            this.data.scroll = true
            let index = e.currentTarget.dataset.index
            let prodskey = e.currentTarget.dataset.prodskey
            let itemkey = e.currentTarget.dataset.itemkey
            this.triggerEvent('deleteClicked', {items: this.data.items, index, prodskey, itemkey})
        }
    },
    ready: function () {

    }
})
