import { routes as auth } from '../modules/auth'
import { routes as home } from '../pages/home'
import { routes as search } from '../pages/search'
import { routes as config } from '../pages/config'

export default [
  ...auth,
  ...home,
  ...search,
  ...config
]
