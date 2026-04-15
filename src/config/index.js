import { getUrlParam } from '../lib/util'

const isDebug = import.meta.env.DEV || getUrlParam('__debug')
const version = import.meta.env.VITE_VERSION || '0.7.0'

export default { isDebug, version }
