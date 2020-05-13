import _ from 'lodash'
import { makeGroup, isFpEditor } from '../helpers'
import { getCurrentLanguage, setLanguage } from '@sangre-fp/i18n'
import {
    HANDLE_ADD_FORM_VISIBILITY,
    CHANGE_ADD_FORM_PAGE,
    CHANGE_RADAR_NAME,
    CHANGE_MAP_INTRO,
    CHANGE_RADAR_LANGUAGE,
    CHANGE_PHENOMENA_SET,
    CHANGE_HIDE_USERS_FROM_TRIAL,
    CHANGE_RADAR_IMAGE,
    CHANGE_RADAR_TITLE_IMAGE,
    CHANGE_VOTING_ON,
    CHANGE_RATINGS_ON,
    CHANGE_RATINGS_SETTINGS,
    CHANGE_DISCUSSION_ON,
    CHANGE_COMMENTS_ON,
    CHANGE_LIKING_ON,
    CHANGE_VOTING_UP,
    CHANGE_EXISTING_RADAR_PAGE,
    HANDLE_EDIT_SECTOR_PAGE_VISIBILITY,
    HANDLE_EDIT_TIMERANGES_PAGE_VISIBILITY,
    HANDLE_ADD_PHENOMENA_VISIBILITY,
    GET_GROUPS_SUCCESS,
    CHANGE_RADAR_GROUP,
    HANDLE_EDIT_PHENOMENA_VISIBILITY,
    CHANGE_DISPLAY_HALO_WHEN_RATING,
    CHANGE_RADAR_SHARING,
    CHANGE_RADAR_SHARING_EXPIRY,
    CREATE_RADAR_SUCCESS,
    FETCH_RADAR_SUCCESS,
    UPDATE_RADAR_SUCCESS,
    UPDATE_RADAR_VERSION,
    TOGGLE_EDIT_MENU_VISIBILITY,
    TOGGLE_LABEL_MODE,
    SET_DRAGGED_PHENOMENON
} from '@sangre-fp/reducers/actionTypes'

// polyfill fix for edge
const paramsString = document.location.search
const searchParams = new URLSearchParams(paramsString)
const id = Number(searchParams.get('node'))

const initialState = {
    id: id || false,
    existingRadarPage: !!id,
    addRadarFormOpen: !id,
    addRadarFormPage: 1,
    groups: [],
    group: false,
    radarName: '',
    mapIntro: null,
    radarLanguage: getCurrentLanguage(),
    phenomenaSet: false,
    hideUsersFromTrial: false,
    radarImage: false,
    votingOn: false,
    ratingsOn: false,
    discussionOn: false,
    commentsOn: false,
    likingOn: false,
    votingUp: true,
    editMenuOpen: false,
    editSectorsPageOpen: false,
    editTimeRangesPageOpen: false,
    addPhenomenaVisible: false,
    editPhenomenaVisible: null,
    account: false,
    displayHaloWhenRating: null,
    enableUrlLogin: false,
    urlLoginExpire: null,
    urlLoginLink: '',
    isRadarTemplate: false,
    radarTitleImage: false,
    timelineLabelFormat: false,
    draggedPhenomenonId: false
}

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case SET_DRAGGED_PHENOMENON:
            return {
                ...state,
                draggedPhenomenonId: payload
            }
        case TOGGLE_LABEL_MODE:
            return {
                ...state,
                timelineLabelFormat: !state.timelineLabelFormat
            }
        case TOGGLE_EDIT_MENU_VISIBILITY:
            return {
                ...state,
                editMenuOpen: payload
            }
        case UPDATE_RADAR_SUCCESS:
            return {
                ...state,
                ...payload
            }
        case CREATE_RADAR_SUCCESS:
            const { origin, pathname } = window.location
            window.location.href = origin + pathname + `?node=${payload.id}`

            return {
                ...state,
                ...payload,
                editSectorsPageOpen: !payload.time_ranges.length
            }
        case HANDLE_ADD_FORM_VISIBILITY:
            return {
                ...state,
                addRadarFormOpen: !state.addRadarFormOpen,
                addRadarFormPage: payload || 1
            }
        case FETCH_RADAR_SUCCESS:
            setLanguage(payload.radarLanguage)
            const account = payload.account
            const role = account ? account.role : false
            const canDeleteRadar = role === 'owner' || role === 'manager' || String(account.userId) === String(payload.ownerId)
            const canEditRadar = role === 'owner' || role === 'editor' || role === 'manager' || isFpEditor
            const isVisitor = role === 'visitor'
            const canShareRadar = role === 'owner' || role === 'manager'

            return {
                ...state,
                ...payload,
                canDeleteRadar,
                canEditRadar,
                isVisitor,
                canShareRadar
            }
        case CHANGE_RADAR_SHARING:
            return {
                ...state,
                enableUrlLogin: payload
            }
        case CHANGE_RADAR_SHARING_EXPIRY:
            return {
                ...state,
                urlLoginExpire: payload
            }
        case CHANGE_EXISTING_RADAR_PAGE:
            return {
                ...state,
                existingRadarPage: payload
            }
        case HANDLE_EDIT_SECTOR_PAGE_VISIBILITY:
            return {
                ...state,
                editSectorsPageOpen: !state.editSectorsPageOpen
            }
        case HANDLE_EDIT_TIMERANGES_PAGE_VISIBILITY:
            return {
                ...state,
                editTimeRangesPageOpen: !state.editTimeRangesPageOpen
            }
        case CHANGE_RADAR_NAME:
            return {
                ...state,
                radarName: payload
            }
        case CHANGE_MAP_INTRO:
            return {
                ...state,
                mapIntro: payload
            }
        case CHANGE_RADAR_LANGUAGE:
            setLanguage(payload)

            return {
                ...state,
                radarLanguage: payload
            }
        case CHANGE_ADD_FORM_PAGE:
            return {
                ...state,
                addRadarFormPage: payload
            }
        case CHANGE_PHENOMENA_SET:
            return {
                ...state,
                phenomenaSet: payload
            }
        case CHANGE_RADAR_GROUP:
            return {
                ...state,
                group: payload
            }
        case CHANGE_HIDE_USERS_FROM_TRIAL:
            return {
                ...state,
                hideUsersFromTrial: payload
            }
        case CHANGE_RADAR_IMAGE:
            return {
                ...state,
                radarImage: payload
            }
        case CHANGE_RADAR_TITLE_IMAGE:
            return {
                ...state,
                radarTitleImage: payload
            }
        case CHANGE_VOTING_ON:
            return {
                ...state,
                votingOn: payload
            }
        case CHANGE_DISPLAY_HALO_WHEN_RATING:
            return {
                ...state,
                displayHaloWhenRating: payload
            }
        case CHANGE_RATINGS_ON:
            return {
                ...state,
                ratingsOn: payload
            }
        case CHANGE_RATINGS_SETTINGS:
            return {
                ...state,
                ...payload
            }
        case CHANGE_DISCUSSION_ON:
            return {
                ...state,
                discussionOn: payload
            }
        case CHANGE_COMMENTS_ON:
            return {
                ...state,
                commentsOn: payload
            }
        case CHANGE_LIKING_ON:
            return {
                ...state,
                likingOn: payload
            }
        case CHANGE_VOTING_UP:
            return {
                ...state,
                votingUp: payload
            }
        case GET_GROUPS_SUCCESS:
            // filter out groups without ids
            const groups = _.filter(
                _.map(payload, makeGroup),
                group => group.id
            )

            return {
                ...state,
                groups
            }
        case HANDLE_ADD_PHENOMENA_VISIBILITY:
            return {
                ...state,
                addPhenomenaVisible: !state.addPhenomenaVisible
            }
        case HANDLE_EDIT_PHENOMENA_VISIBILITY:
            return {
                ...state,
                editPhenomenaVisible: payload
            }
        case UPDATE_RADAR_VERSION:
            return {
                ...state,
                radar_version: payload
            }
        default:
            return state
    }
}
