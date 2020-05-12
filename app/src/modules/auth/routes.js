export default [
  {
    name: 'login',
    path: '/login',
    component: () => import(/* webpackChunkName: "login" */ './pages/Login')
  },
  {
    name: 'recover',
    path: '/recover',
    component: () => import(/* webpackChunkName: "recover" */ './pages/Recover')
  },
  {
    name: 'register',
    path: '/register',
    component: () => import(/* webpackChunkName: "register" */ './pages/Register')
  }
]
