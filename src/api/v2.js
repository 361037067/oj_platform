// 配置API接口地址
let root = '/api/v2'
// 引用axios
let axios = require('axios')
// 自定义判断元素类型JS
function toType (obj) {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}
// 参数过滤函数
function filterNull (o) {
  for (var key in o) {
    // 如果是空值，删除此项
    if (o[key] === null) {
      delete o[key]
    }
    // 如果是字符串，去除首位空格，
    // 如果是对象，数组，递归调用本过滤函数
    if (toType(o[key]) === 'string') {
      o[key] = o[key].trim()
    } else if (toType(o[key]) === 'object') {
      o[key] = filterNull(o[key])
    } else if (toType(o[key]) === 'array') {
      o[key] = filterNull(o[key])
    }
  }
  return o
}
/*
  接口处理函数
  这个函数每个项目都是不一样的，我现在调整的是适用于
  http://127.0.0.1:7001/apiv2 的接口.
*/

function apiAxios (method, url, params, success, failure) {
  if (params) {
    params = filterNull(params)
  }
  axios({
    method: method,
    url: url,
    // (此处有个天坑请注意，get请求是不带body的，什么params，什么body，统统处理成query，别去找了)
    // 上一条是以前的注释，有严重的错误，作为学习进度的记录保留，重新解释如下
    // params会被处理成 url?aaa=xxx&bbb=ooo  这样的形式，目标后台(eggjs为例)可以通过 ctx.query 获取
    // data会被处理成无法直接观测到的 POST 形式提交，目标后台（eggjs为例）可以通过  ctx.request.body 获取
    // 此处有个特列需注意就是关于PUT的处理，根据eggjs RESTful的规定data,params都有，尚未处理待改进
    data: method === 'POST' || method === 'PUT' || method === 'PATCH' || method === 'DELETE' ? params : null,
    params: method === 'GET' ? params : null,
    baseURL: root,
    withCredentials: false,
    // header中加入自定义的验证参数
    headers: {
      'authkey': 'v2secret'
    }
  })
    .then(function (res) {
      // 按照接口设计，所有的错误都作为html错误抛出
      // 因此，这里只会收到正确的数据，直接输出
      success(res.data)
    })
    .catch((error) => {
      // 关于错误的处理机制有两种思路
      // 服务器端有关错误的文字提示根据api的设计规则是存放在 res data.error 中的
      // 有关错误的 html 状态码是存放在 res.status 中的
      // 第一种思路，直接返回 res.data ，那么客户界面就感知不到 res.status
      // 第二种思路，返回 res那么客户界面就可以通过  res.data.error获取错误提示，res.status 获取错误代码
      // 哪种好呢？暂时还是选择第二种，便于客户端界面判断是请求错误，还是服务器错误
      let res = error.response
      // console.log(res)
      if (res && res.status !== 504) {
        if (res) {
          failure(res)
        } else {
          failure({status: 500, data: {error: '出错了，请检查服务器日志'}})
        }
      } else {
        failure({status: 504, data: {error: '连接超时或数据服务停机，请稍待或联系管理员(信息工程系卜强)'}})
      }
    })
}

// 返回在vue模板中的调用接口
export default {
  get: function (url, params, success, failure) {
    return apiAxios('GET', url, params, success, failure)
  },
  post: function (url, params, success, failure) {
    return apiAxios('POST', url, params, success, failure)
  },
  put: function (url, params, success, failure) {
    return apiAxios('PUT', url, params, success, failure)
  },
  delete: function (url, params, success, failure) {
    return apiAxios('DELETE', url, params, success, failure)
  }
  // patch: function (url, params, success, failure) {
  //   return apiAxios('PATCH', url, params, success, failure)
  // }
}
