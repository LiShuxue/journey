import axios from 'axios'
import API from './api'
import store from '../store'

axios.defaults.timeout = 60 * 1000
axios.defaults.baseURL = 'http://localhost:8080'

axios.interceptors.request.use(config => {
  for (let key in API.requireAuth) {
    // 需要携带token
    if (config.url.includes(API.requireAuth[key])) {
      if (store.state.access_token && store.state.refresh_token) {
        config.headers.Authorization = `Bearer ${store.state.access_token}`
        config.headers.refresh_token = store.state.refresh_token
      }
    }
  }
  return config
}, error => {
  return Promise.reject(error)
})

axios.interceptors.response.use(response => {
  console.log(response)
  if (response.status === 200 && response.data.errMsg) {
    return Promise.reject(response)
  }
  if (response.status === 200 && response.data.new_access_token && response.data.new_refresh_token) {
    store.dispatch('saveAccessTokenAction', response.data.new_access_token)
    store.dispatch('saveRefreshTokenAction', response.data.new_refresh_token)
  }
  return response
}, error => {
  console.log(error.response)
  return Promise.reject(error.response)
})

export default axios
