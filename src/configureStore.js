import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './reducers'
import {changeEditPhenomenaVisibility} from "./actions/radarSettings";

const composeEnhancers = process.env.NODE_ENV !== 'production' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)))


window.radarCallbacks = {
    ...(window.radarCallbacks || {}),
    openPhenomenonEditor: uuid => store.dispatch(changeEditPhenomenaVisibility(uuid))
}

export default store
