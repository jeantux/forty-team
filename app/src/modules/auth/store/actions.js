import { servicesAuth } from '@/http'
import * as storage from '../storage'
import * as types from './mutation-types'

export const ActionDoLogin = ({ dispatch }, payload) => {
  return servicesAuth.auth.login(payload).then(res => {
    dispatch('ActionSetUser', res.data.user)
    dispatch('ActionSetToken', res.data.token)
  })
}

export const ActionCheckToken = async({ dispatch, state }) => {
  if (state.token) {
    return Promise.resolve(state.token)
  }
  
  const token = storage.getLocalToken()

  if (!token) {
    return Promise.reject(new Error('Token Inválido'))
  }
  
  dispatch('ActionSetToken', token)
  return dispatch('ActionLoadSession')
}

export const ActionLoadSession = ({ dispatch }) => {
  return new Promise((resolve, reject) => {
    try {
      servicesAuth.auth.loadSession()
        .then(data => {
          dispatch('ActionSetUser', data.body.user.user)
          resolve()
        }).catch((err) => {
          dispatch('ActionSignOut')
          reject(err)
        })

    } catch (err) {
      dispatch('ActionSignOut')
      reject(err)
    }
  })
}

export const ActionSetUser = ({ commit }, payload) => {
  commit(types.SET_USER, payload)
}

export const ActionSetToken = ({ commit }, payload) => {
  storage.setLocalToken(payload)
  storage.setHeaderToken(payload)
  commit(types.SET_TOKEN, payload)
}

export const ActionSignOut = ({ dispatch }) => {
  storage.setHeaderToken('')
  storage.deleteLocalToken()
  dispatch('ActionSetToken', '')
  dispatch('ActionSetUser', {})
}
