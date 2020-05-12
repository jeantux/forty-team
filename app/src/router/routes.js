import { routes as auth } from '../modules/auth'
import { routes as home } from '../pages/home'
import { routes as search } from '../pages/search'

export default [
  ...auth,
  ...home,
  ...search
]
