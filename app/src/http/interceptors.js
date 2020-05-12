import store from '../modules/auth/store'

export default () => {
  return ({ status }) => {
    if (status === 401) {
      store.dispatch('auth/ActionSignOut')
      window._Vue.$router.push({ name: 'login' })
    }
  }
}
