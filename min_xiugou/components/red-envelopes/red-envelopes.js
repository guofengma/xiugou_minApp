let { Tool,API, Storage, Event} = global;
const app = getApp()
Component({
    properties: {
        // visiable: Boolean,
        door:Number, // 1注册页面领取 2 产品页面
        classNameIndex:Number,
    },
    data: {
        visiable:false,
        succ:false,
        className:[
            '', 'zoomIn-lt', 'zoomIn-rt', 'zoomIn-lb','zoomIn-rb'
        ]
    },
    methods: {
        close() {
            this.setData({
                visiable:false
            })
            if (this.data.door == 1) {
                this.goPage()
            }
        },
        givingPackageToUser(){
            API.givingPackageToUser({}).then((res) => {
                this.setData({
                    succ:true
                })
                app.getLevel()
            }).catch((res) => {
                console.log(res)
            })
        },
        goPage(){
            Tool.redirectTo('/pages/my/my-account/cash/cash')
        },
        btnClick(){
            API.userReceivePackage({
                'type':this.data.door,
            }).then((res) => {
                this.setReqData(res)
                let that = this
                if(this.data.door==1){
                    this.setReqData(res)
                    let that = this
                    if (this.data.door == 1) {
                        app.getLevel()
                    }
                }
            }).catch((res) => {
                console.log(res)
            })
        },
        setReqData(res){
            let datas = res.data || {}
            if (datas.phone) {
                datas.showPhone = datas.phone.slice(0, 3) + "*****" + datas.phone.slice(7)
            }
            this.setData({
                visiable: true,
                datas: datas
            })
        }
    },
    ready(){

    }
})
