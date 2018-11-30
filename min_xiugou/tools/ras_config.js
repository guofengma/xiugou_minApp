import Operation from '../network/operation';
const O = Operation.sharedInstance();
export default {
  version: '1.0.4', //数据加签版本号
  client: 'miniapp', // 数据加签端口
  rsa_key: 'MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCGooQyXLJscasGD4s/r69iSq5ZkD/n9TCwPyMVrHqKGdDi9eD7F4+vk9ycWLNCW3QXK6cf6632dOvZr5nB7FODXgau08iT0XrkST+jnnKHy2KZP88prqjTgADlPAziyOC1z1241IACekzoGEJr2ik3isBpT1ULR4qZTmJkK02FjcSUw9qafPvGKuHnMiZgi5EktTr25Vm4gkkzwHhZbFndM9itEhYuorDxE8Oi7epO7Nb1Akh69AK+bs2+f7nCu7hUBKj+d7roTDMn4U+TB9vdCrJVP3o2l9KcK5iru+T9bss5LJuGsb4yQY8t1qQo2F2aR0AioWkEYXUhn0UYq0/tAgMBAAECggEAZ82rgSzpQCVPiCe55AtvfKg5zsIiE5R+ypSTV2WZQRrwa9zJbq7W0Ld/E2hsJZBfbHHys/DBOtEg+sCiGts79IAtROPytM2BI7u5/kvu3/YW+jMxZWDNt+vsRNHM2Zmpb2QHTbdBTye+XgA+TetxdepbuZY56q1pFhRSVgrxBTOG79gOLt4OaAAJhKcvuUuI2HMql9bNQ02esprfis5RRF7L4JeNQJiKeDgcT1hEtaKVkxQqpIjPDmRA1Ym/msZIEpyuvZjbPxYsJlkRIOVZ6I9fPSnYxHRjAeSbDV8PoHYRlOad0JYcE+etaLZfCjZdNLi9bi8lNjtqkww186pbHQKBgQDs/axDKkjkeviPc1SBwzAJMv3Rlo/BufEmJ/XLnEotfW4vZ2qolBgW1Sx8uG7jZELU35ZDTua3EKa8nUC5Qstk2wqUKQRKZhMdU1MjGNUzw9WNVQTzW+Bp6Rn6F+UgR3TEPIejEe+sfnJwGA87OpmEOb7fzlbg3p6hvVE0QmlagwKBgQCRbxU10HQk4avgpc6IeoEl+GTW2drer3DHHsXI8e+qgjvB+AOtinYzA5trlEdEFr2B9MkYreGTHnytgqZTSYA7mF1Mx9Wh00XphaKO+noEkNQx6ZTV7d3cUDHptlh5JyvyQBJ08lL1rhhs8DzxAY0vA5MhqIb3hSxes0Ap4C5gzwKBgHE3uy0XLV2h9c8qTMv1QKSUbLfNEv5841zUKFPOZY2X56TT5huFLIDz9F3dCnStuFPUQQgE0KnSVaW0BnC7HUogbsxbUAZu/2C6JvSUb35cZ1Autr/AO9S9HMDi235xRLJfLHlWH0cr3WX5yIUGOML3h12KSO0CzYv9UqcBty0bAoGABNwfa1Lx7qGT6sffpPPjCO/J/tv80mAudpjypwpepeYANTUielQcKww9z1R/JSlVX9hcN/TnitED/ZBWGoZkQJmQ1JYA741t0qXijsCT/z8PuDNEA/oU5d3QLS0ou7OxZkD53OqUFx2gN1O31Z3lp+KIsiE9kVvj5a47wKp7IkUCgYBviRnInzuvOcQ3dgzt6YyZ5VPPvV5Dp0KWXSyl+4sSSIzyOs6UqkcEXjT5dSJ7lIEpdCV5k2A6fltTl3+RIumL2+bot/YZpGVXOki2ODcirNGCJ5bKJb2eHvFgMj2+2vkgB0FM+2dSGtTNZ1fYYJhw8RCPDROhadOHZTCL4pZsNw==', //数据加签秘钥
  whiteList: [
    '/user/userSign/findMemberByPhone',
    '/user/userSign/signUser',
    '/sms/sendRegMessage',
    '/common/upload/oss',
    '/operator/seckill/makeSureOrder',
    '/operator/seckill/submitOrder',
    '/order/makeSureOrder',
    '/order/submitOrder',
    '/operator/activitypackage/makeSureOrder',
    '/operator/activitypackage/submitOrder',
    '/operator/activityDepreciate/submitOrder',
    '/operator/activityDepreciate/makeSureOrder',
  ],
}