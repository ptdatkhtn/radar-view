import {
    FETCH_RADAR_SUCCESS,
    UPDATE_PHENOMENON,
    CREATE_PHENOMENA_SUCCESS,
    DELETE_PHENOMENA_SUCCESS,
    CREATE_PHENOMENA_POSITION_SUCCESS,
    UPDATE_PHENOMENON_INGESTION_SUCCESS,
    UPDATE_PHENOMENON_VERSION,
    REFETCH_DATA_SUCCESS
} from '@sangre-fp/reducers/actionTypes'

const initialState = []

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case REFETCH_DATA_SUCCESS:
            return payload.phenomena

        case FETCH_RADAR_SUCCESS:
            return payload.phenomena

        case UPDATE_PHENOMENON:
            return state.map(phenomenon => {
                if (phenomenon.id === payload.id) {
                    return {
                        ...phenomenon,
                        ...payload
                    }
                }

                return phenomenon
            })

        case UPDATE_PHENOMENON_VERSION: {
            return state.map(phenomenon => {
                if (phenomenon.id === payload.id) {
                    return {
                        ...phenomenon,
                        version: payload.version
                    }
                }

                return phenomenon
            })
        }

        case CREATE_PHENOMENA_SUCCESS:
            return state.concat(payload)

        case DELETE_PHENOMENA_SUCCESS:
            return state.filter(item => item.id !== payload.id)

        case CREATE_PHENOMENA_POSITION_SUCCESS:
            return state.map(phenomenon => {
                if (phenomenon.id === payload.id) {
                    return {
                        ...phenomenon,
                        ...payload
                    }
                }

                return phenomenon
            })

        case UPDATE_PHENOMENON_INGESTION_SUCCESS:
            return state.map(phenomenon => {
                if (phenomenon.id === payload.id) {
                    return {
                        ...phenomenon,
                        ...payload
                    }
                }

                return phenomenon
            })

        default:
            return state
    }
}
