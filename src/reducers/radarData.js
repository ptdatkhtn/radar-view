import { SET_DRAGGED_PHENOMENON } from '@sangre-fp/reducers/actionTypes'

const initialState = {
    draggedPhenomenonId: false
}

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case SET_DRAGGED_PHENOMENON:
            return {
                ...state,
                draggedPhenomenonId: payload
            }
        default:
            return state
    }
}
