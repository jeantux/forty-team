export default [
  {
    path: '/search',
    name: 'search',
    component: () => import(/* webpackChunkName: "search" */ './Search')
  }
]
