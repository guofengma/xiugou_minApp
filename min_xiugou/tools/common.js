// 1.秒杀 2.降价拍 3.礼包 4.助力免费领 5.专题 99.普通产品 100:嵌入H5的页面地址 101注册
const pages = {
  1: '/pages/product-detail/seckill-detail/seckill-detail?code=',
  2: '/pages/product-detail/discount-detail/discount-detail?code=',
  3: '/pages/product-detail/gift-bag-detail/gift-bag-detail?giftBagId=',
  4: '/pages/index/index?page=""',
  5: '/pages/topic/topic?code=',
  99: '/pages/product-detail/product-detail?productId=',
  100: '/pages/web-view/web-view?id=',
  101: '/pages/register/register?inviteId=',
  102: '/pages/discover/discover-detail/discover-detail?articleId='
}
const levelName = {
  0:'黄金',
  1: '铂金',
  2: '黑金',
  3: '钻石',
  4: '达人',
  5: '名人',
}
export { levelName, pages}