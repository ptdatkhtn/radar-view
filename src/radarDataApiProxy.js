import 'proxy-polyfill'
import radarDataApi from '@sangre-fp/connectors/radar-data-api'
import store from './configureStore'
import { updateRadarVersion } from './actions/radarData'

const handler = {
  get(radarApi, name) {
    return (...args) => {
      if (!radarApi.hasOwnProperty(name)) {
        throw new Error('Invalid call')
      }

      return radarApi[name](...args)
        .then(res => {
          store.dispatch(updateRadarVersion(res.data.radar_version))

          return res.data
        })
    }
  }
}

const radarDataApiProxy = new Proxy(radarDataApi, handler)

export default radarDataApiProxy

