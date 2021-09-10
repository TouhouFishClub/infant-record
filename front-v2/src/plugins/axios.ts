"use strict";

import Vue from 'vue';
import axios from 'axios';
import router from '@/router'

export interface ResponseData {
  response: {
    status: any;
  };
  config: {
    url: any;
    method: string;
    data: any;
  };
}

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

let config = {
  // baseURL: process.env.baseURL || process.env.apiUrl || ""
  // timeout: 60 * 1000, // Timeout
  // withCredentials: true, // Check cross-site Access-Control
};

const _axios = axios.create(config);

_axios.interceptors.request.use(
  (config: any) => {
    // Do something before request is sent
    return config;
  },
  (error: any) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

const wait = (timeout = 1000) =>
  new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      console.log('wait')
      resolve()
    }, timeout)
  })

const recordResponse = (method: string, url: any, reqData: any) => {
  switch (method) {
    case 'get':
      return Promise.resolve(
        _axios.get(url).then((res: any ) => {
          // console.log('请求成功')
          return res
        })
      )
    case 'post':
      return Promise.resolve(
        _axios.post(url, reqData).then((res: any) => {
          // console.log('请求成功')
          return res
        })
      )
    default:
      router.push('/')
      return
  }
}

let authPending = false

// Add a response interceptor
_axios.interceptors.response.use(
    (response: any) => {
    // Do something with response data
    return response;
  },
  async function(error: ResponseData) {
    // Do something with response error
    let s = (error && error.response) ? error.response.status : 500,
      url = error.config.url,
      method = error.config.method.toLowerCase(),
      reqData = error.config.data
    switch (s) {
      case 401:
        let un = localStorage.getItem('un')
        let pwd = localStorage.getItem('pwd')
        if(un && pwd) {
          /* 如果多请求并发，则只有一个进入登录逻辑，其他请求全部阻塞 */
          if(authPending) {
            while(authPending) {
              await wait(100)
            }
            return recordResponse(method, url, reqData)
          } else {
            authPending = true
          }
          return Promise.resolve(
            _axios.post('/p/a/login', {
              username: un,
              password: pwd,
              captcha: ''
            }).then(res => {
              authPending = false
              if(res.data.status == 'ok') {
                return recordResponse(method, url, reqData)
              } else {
                authPending = false
                localStorage.removeItem("un")
                localStorage.removeItem("pwd")
              }
            }).catch((err: any) => {
              console.log(err)
              authPending = false
            })
          )
        }
        router.replace('/login')
        break
    }

    return Promise.reject(error);
  }
);

//@ts-ignore
Plugin.install = function(Vue: { axios: any; prototype: any; }, options: any) {
  Vue.axios = _axios;
  //@ts-ignore
  window.axios = _axios;
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return _axios;
      }
    },
    $axios: {
      get() {
        return _axios;
      }
    },
  });
};

// Vue.use(Plugin)

export default Plugin;
