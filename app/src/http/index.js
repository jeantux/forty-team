import Vue from 'vue'
import VueResource from 'vue-resource'
import servicesAuth from '../modules/auth/services'
import servicesPages from '../pages/services'
import interceptors from './interceptors'
Vue.use(VueResource)

const http = Vue.http

http.options.root = 'http://localhost:3000/fortyteam/'
http.interceptors.push(interceptors)

Object.keys(servicesAuth).map(service => {
  servicesAuth[service] = Vue.resource('', {}, servicesAuth[service])
})

Object.keys(servicesPages).map(service => {
  servicesPages[service] = Vue.resource('', {}, servicesPages[service])
})

const setBearerToken = token => {
  http.headers.common['Authorization'] = `Bearer ${token}`
}

export { http, setBearerToken, servicesAuth, servicesPages}
