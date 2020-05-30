export default [
  {
    path: '/config',
    name: 'config',
    component: () => import(/* webpackChunkName: "config" */ './Config')
  }
]
