// 1.秒杀 2.降价拍 3.礼包 4.助力免费领 5.专题 99.普通产品 100:嵌入H5的页面地址 101注册
// 首页广告位跳转
const adsensePage = {
    1: {
        name: "链接产品",
        page: '/pages/product-detail/product-detail?prodCode=',
    },
    2: {
        name: '链接专题',
        page: '/pages/topic/topic?code=',
    },
    3: {
        name: "降价拍",
        page: '/pages/product-detail/discount-detail/discount-detail?code=',
    },
    4: {
        name: "秒杀",
        page: '/pages/product-detail/seckill-detail/seckill-detail?code=',
    },
    5: {
        name: "礼包",
        page: '/pages/product-detail/gift-bag-detail/gift-bag-detail?giftBagId=',
    },
    6: {
        name: "经验值专区",
        page: '/pages/experience/experience?activityCode=',
    },
    8: {
        name: "店铺",
        page: '/pages/download-app/download-app',
        tabbar: true,
    },
    10: {
        name: "h5页面",
        page: '',
    },
    11: {
        name: "秀场",
        page: '/pages/discover/discover-detail/discover-detail?articleCode=',
    },
}
//  分享跳转
const pages = {
    1: adsensePage[4].page,
    2: adsensePage[3].page,
    3: adsensePage[5].page,
    4: '/pages/index/index?page=""',
    5: adsensePage[2].page,
    99: adsensePage[1].page,
    100: '/pages/web-view/web-view?id=',
    101: '/pages/register/register?inviteId=',
    102: '/pages/discover/discover-detail/discover-detail?articleId='
}
export {pages, adsensePage}