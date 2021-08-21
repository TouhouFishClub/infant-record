"use strict";

import Vue from 'vue';
import axios from "axios";
import router from '@/router'
import store from '@/store'
import {breaking} from "vuetify/lib/util/console";

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
  function(config) {
    // Do something before request is sent
    return config;
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

const wait = (timeout = 1000) =>
  new Promise((resolve,reject) => {
    setTimeout(() => {
      console.log('wait')
      resolve()
    }, timeout)
  })

const recordResponse = (method, url, reqData) => {
  switch (method) {
    case 'get':
      return Promise.resolve(
        _axios.get(url).then(resp => {
          // console.log('请求成功')
          return resp
        })
      )
    case 'post':
      return Promise.resolve(
        _axios.post(url, reqData).then(resp => {
          // console.log('请求成功')
          return resp
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
  function(response) {
    // Do something with response data
    return response;
  },
  async function(error) {
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
              }
            }).catch(err => {
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

Plugin.install = function(Vue, options) {
  Vue.axios = _axios;
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

Vue.use(Plugin)

export default Plugin;
