import { combineReducers } from 'redux'
import radarData from './radarData'
import radarSettings from './radarSettings'
import phenomena from './phenomena'
import timelines from '@sangre-fp/reducers/timelines'
import filters from './filters'
import signals from './signals'

import {
    auth,
    loading,
    errors,
    radarSets,
    phenomenaTypes,
    phenomenaTypesById,
    confirmDialog,
    sectors
} from '@sangre-fp/reducers'

export default combineReducers({
    sectors,
    filters,
    phenomena,
    timelines,
    radarData,
    radarSettings,
    auth,
    radarSets,
    loading,
    errors,
    phenomenaTypes,
    phenomenaTypesById,
    signals,
    confirmDialog
})
