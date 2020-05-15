export default [
  {
    name: 'login',
    path: '/login',
    component: () => import(/* webpackChunkName: "login" */ './pages/Login')
  },
  {
    name: 'register',
    path: '/register',
    component: () => import(/* webpackChunkName: "register" */ './pages/Register')
  }
]
