import {
    HANDLE_SIGNAL_LIST_VISIBILITY,
    FETCH_SIGNALS_SUCCESS,
    HANDLE_SIGNAL_CREATE_VISIBILITY,
    CREATE_SIGNAL_SUCCESS,
    FETCH_MORE_SIGNALS_SUCCESS
} from '@sangre-fp/reducers/actionTypes'

const initialState = {
    signalListVisible: false,
    signalCreateVisibility: false,
    signals: [],
    totalRadarSignals: false
}

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case HANDLE_SIGNAL_LIST_VISIBILITY:
            return {
                ...state,
                signalListVisible: !state.signalListVisible
            }
        case HANDLE_SIGNAL_CREATE_VISIBILITY:
            return {
                ...state,
                signalCreateVisibility: !state.signalCreateVisibility
            }
        case FETCH_SIGNALS_SUCCESS:
            return {
                ...state,
                signals: payload.result,
                totalRadarSignals: payload.total
            }
        case FETCH_MORE_SIGNALS_SUCCESS:
            return {
                ...state,
                signals: [...state.signals, ...payload.result],
                totalRadarSignals: payload.total
            }
        case CREATE_SIGNAL_SUCCESS:
            return {
                ...state,
                signals: [{ ...payload }, ...state.signals],
                totalRadarSignals: state.totalRadarSignals + 1
            }
        default:
            return state
    }
}
