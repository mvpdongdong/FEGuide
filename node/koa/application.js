const http = require('http')
const EventEmitter = require('events')
const context = require('./context')
const request = require('./request')
const response = require('./response')

class Koa extends EventEmitter {
  constructor() {
    super()
    this.middlewares = []
    this.context = context
    this.request = request
    this.response = response
  }

  listen(...args) {
    http.createServer(this.callback()).listen(...args)
  }

  use(fn) {
    this.middlewares.push(fn)
  }

  // 引人中间件
  // compose(ctx) {
  //   const createAsync = function (fn, next) {
  //     return async function () {
  //       await fn(ctx, next)
  //     }
  //   }
  //   let next = async function() { // 返回 Promise 对象，从而进行后文 fn.then().catch() 调用
  //     return Promise.resolve()
  //   }

  //   for (let i = this.middlewares.length - 1; i >= 0; i--) {
  //     next = createAsync(this.middlewares[i], next)
  //   }

  //   return next()
  // }

  // 官方版compose
  compose (middleware) {
    if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')
    for (const fn of middleware) {
      if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
    }

    /**
     * @param {Object} context
     * @return {Promise}
     * @api public
     */

    return function (context, next) {
      // last called middleware #
      let index = -1
      return dispatch(0)
      function dispatch (i) {
        if (i <= index) return Promise.reject(new Error('next() called multiple times'))
        index = i
        let fn = middleware[i]
        if (i === middleware.length) fn = next
        if (!fn) return Promise.resolve()
        try {
          return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
        } catch (err) {
          return Promise.reject(err)
        }
      }
    }
  }

  callback() {
    return (req, res) => {
      const ctx = this.createCtx(req, res)
      const handle = () => this.handleRes(ctx)
      const errHandle = (err) => this.handleErr(err, ctx)
      const fn = this.compose(this.middlewares);
      return fn(ctx).then(handle).catch(errHandle)
    }
  }

  // 将 req， res 封装进 ctx 对象中
  createCtx(req, res) {
    const ctx = Object.create(this.context)
    ctx.request = Object.create(this.request)
    ctx.response = Object.create(this.response)
    ctx.req = ctx.request.req = req
    ctx.res = ctx.response.res = res
    return ctx
  }

  handleRes(ctx) {
    if (typeof(ctx.body) === 'string') {
      ctx.statusCode && ctx.res.writeHead(ctx.statusCode)
      ctx.res.end(ctx.body)
    } else if (typeof(ctx.body) === 'object') {
      ctx.statusCode && ctx.res.writeHead(ctx.statusCode)
      ctx.res.end(JSON.stringify(ctx.body))
    }
  }

  // 引人错误机制
  handleErr(err, ctx) {
    if (err.code === 'ENOENT') {
      ctx.statusCode = 404
    } else {
      ctx.statusCode = 500
    }
    const msg = err.message || 'Internal Error'
    ctx.res.end(msg)
    this.emit('error', err)
  }
}

module.exports = Koa
