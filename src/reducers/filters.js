import _ from 'lodash'
import {
    TOGGLE_FILTERS,
    SET_ACTIVE_FILTER,
    RESET_FILTERS,
    SET_ACTIVE_TAG_FILTER
} from '@sangre-fp/reducers/actionTypes'

const initialState = {
    filtersVisible: false,
    activeFilter: [],
    activeTagFilter: []
}

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case TOGGLE_FILTERS:
            return {
                ...state,
                filtersVisible: !state.filtersVisible
            }
        case SET_ACTIVE_FILTER:
            return {
                ...state,
                activeFilter: _.find(state.activeFilter, payload) ? state.activeFilter.filter(filter => filter !== payload) : [...state.activeFilter, payload]
            }
        case SET_ACTIVE_TAG_FILTER:
            return {
                ...state,
                activeTagFilter: _.includes(state.activeTagFilter, payload) ? state.activeTagFilter.filter(filter => filter !== payload) : [...state.activeTagFilter, payload]
            }
        case RESET_FILTERS:
            return {
                ...state,
                activeFilter: [],
                activeTagFilter: []
            }
        default:
            return state
    }
}
