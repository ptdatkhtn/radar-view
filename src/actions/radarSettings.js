import _ from 'lodash'
import * as actionTypes from '@sangre-fp/reducers/actionTypes'
import { requestTranslation } from '@sangre-fp/i18n'
import { getNetworkMethods } from './network'
import drupalApi from '@sangre-fp/connectors/drupal-api'
import { handleImageUploadIfNeeded } from '@sangre-fp/connectors/media-api'

export const toggleEditMenuVisiblity = (visibilityState = false) => dispatch => (
    dispatch({ type: actionTypes.TOGGLE_EDIT_MENU_VISIBILITY , payload: visibilityState })
)

export const getUserGroups = () => dispatch => {
    const { loading, success, error } = getNetworkMethods(
        actionTypes.GET_GROUPS,
        actionTypes.GET_GROUPS_SUCCESS,
        requestTranslation('fetchingGroupsError')
    )

    dispatch(loading())

    const groupRequest = drupalApi.getGroups()
    const membershipRequest = drupalApi.getMemberships()

    return Promise.all([groupRequest, membershipRequest]).then(([groups, memberships]) => {
        const membershipGroupIds = memberships ? Object.values(memberships).map(membership => parseInt(membership.gid, 10)) : []
        dispatch(success(groups ? Object.values(groups).filter(group => membershipGroupIds.indexOf(group.id) !== -1) : []))
    })
    .catch(err => {
        dispatch(error(err))
    })
}

export const changeAddRadarFormVisibility = (page = false) => dispatch => {
    if (page) {
        dispatch({ type: actionTypes.HANDLE_ADD_FORM_VISIBILITY, payload: page })
    } else {
        dispatch({ type: actionTypes.HANDLE_ADD_FORM_VISIBILITY })
    }
}

export const changeDisplayHaloWhenRating = rating => dispatch => dispatch({ type: actionTypes.CHANGE_DISPLAY_HALO_WHEN_RATING, payload: rating })
export const changeRadarName = name => dispatch => dispatch({ type: actionTypes.CHANGE_RADAR_NAME, payload: name })
export const changeMapIntro = mapIntro => dispatch => dispatch({ type: actionTypes.CHANGE_MAP_INTRO, payload: mapIntro })
export const changeRadarLanguage = language => dispatch => dispatch({ type: actionTypes.CHANGE_RADAR_LANGUAGE, payload: language })
export const changeRadarGroup = group => dispatch => dispatch({ type: actionTypes.CHANGE_RADAR_GROUP, payload: group })
export const changeAddRadarFormPage = page => dispatch => dispatch({ type: actionTypes.CHANGE_ADD_FORM_PAGE, payload: page })
export const changePhenomenaSet = set => dispatch => dispatch({ type: actionTypes.CHANGE_PHENOMENA_SET, payload: set })
export const changeHideUsersFromTrial = bool => dispatch => dispatch({ type: actionTypes.CHANGE_HIDE_USERS_FROM_TRIAL, payload: bool })
export const changeRadarImage = image => dispatch => dispatch({ type: actionTypes.CHANGE_RADAR_IMAGE, payload: image })
export const changeRadarTitleImage = image => dispatch => dispatch({ type: actionTypes.CHANGE_RADAR_TITLE_IMAGE, payload: image })
export const changeVotingOn = bool => dispatch => dispatch({ type: actionTypes.CHANGE_VOTING_ON, payload: bool })
export const changeRatingsOn = bool => dispatch => dispatch({ type: actionTypes.CHANGE_RATINGS_ON, payload: bool })
export const changeRadarSharing = bool => dispatch => dispatch({ type: actionTypes.CHANGE_RADAR_SHARING, payload: bool })

export const changeRadarSharingExpiry = date => dispatch => dispatch({ type: actionTypes.CHANGE_RADAR_SHARING_EXPIRY, payload: date })

export const changeRatingsSettings = ({
    axisXTitle,
    axisXMax,
    axisXMin,
    axisYTitle,
    axisYMax,
    axisYMin,
    fourFieldsTopLeft,
    fourFieldsTopRight,
    fourFieldsBottomLeft,
    fourFieldsBottomRight
}) => dispatch => dispatch({
    type: actionTypes.CHANGE_RATINGS_SETTINGS,
    payload: {
        axisXTitle,
        axisXMax,
        axisXMin,
        axisYTitle,
        axisYMax,
        axisYMin,
        fourFieldsTopLeft,
        fourFieldsTopRight,
        fourFieldsBottomLeft,
        fourFieldsBottomRight
    }
})

export const changeDiscussionOn = bool => dispatch =>
    dispatch({ type: actionTypes.CHANGE_DISCUSSION_ON, payload: bool })

export const changeCommentsOn = bool => dispatch =>
    dispatch({ type: actionTypes.CHANGE_COMMENTS_ON, payload: bool })

export const changeLikingOn = bool => dispatch =>
    dispatch({ type: actionTypes.CHANGE_LIKING_ON, payload: bool })

export const changeVotingUp = bool => dispatch =>
    dispatch({ type: actionTypes.CHANGE_VOTING_UP, payload: bool })

export const toggleFilter = () => dispatch => dispatch({ type: actionTypes.TOGGLE_FILTERS })

export const setActiveFilter = filter => dispatch => dispatch({ type: actionTypes.SET_ACTIVE_FILTER, payload: filter })

export const setActiveTagFilter = filter => dispatch => dispatch({ type: actionTypes.SET_ACTIVE_TAG_FILTER, payload: filter })

export const resetFilters = () => dispatch => dispatch({ type: actionTypes.RESET_FILTERS })

export const createRadar = () => async (dispatch, getState) => {
    const radarSettings = getState().radarSettings
    const {
        group,
        radarImage,
        radarTitleImage
    } = radarSettings

    const { loading, success, error } = getNetworkMethods(
        actionTypes.CREATE_RADAR,
        actionTypes.CREATE_RADAR_SUCCESS,
        requestTranslation('creatingRadarError')
    )

    dispatch(loading())

    try {
        const groupId = _.isObject(group) ? _.get(group, 'id', 0) : group

        const radarInput = {
            ...radarSettings,
            radarImage: await handleImageUploadIfNeeded(radarImage, groupId),
            radarTitleImage: await handleImageUploadIfNeeded(radarTitleImage, groupId)
        }

        const data = await drupalApi.createRadar(radarInput)

        dispatch(success(data))
    } catch (err) {
        dispatch(error(err))
    }
}

export const updateRadar = (hideForm = true) => async (dispatch, getState) => {
    const radarSettings = getState().radarSettings

    const {
        group,
        radarImage,
        radarTitleImage,
        id
    } = radarSettings

    const { loading, success, error } = getNetworkMethods(
        actionTypes.UPDATE_RADAR,
        actionTypes.UPDATE_RADAR_SUCCESS,
        requestTranslation('updatingRadarError')
    )

    dispatch(loading())

    try {
        const groupId = _.isObject(group) ? _.get(group, 'id', 0) : group

        const radarInput = {
            ...radarSettings,
            radarImage: await handleImageUploadIfNeeded(radarImage, groupId),
            radarTitleImage: await handleImageUploadIfNeeded(radarTitleImage, groupId)
        }

        const data = await drupalApi.updateRadar(id, radarInput)

        if (hideForm) {
            dispatch({ type: actionTypes.HANDLE_ADD_FORM_VISIBILITY })
        }

        dispatch(success(data))
    } catch (e) {
        dispatch(error(e))
    }
}

export const getRadarSets = () => (dispatch) => {
    const { loading, success, error } = getNetworkMethods(
        actionTypes.GET_RADAR_SETS,
        actionTypes.GET_RADAR_SETS_SUCCESS,
        requestTranslation('fetchingSetsError')
    )

    dispatch(loading())

    return drupalApi.getRadarTemplates()
        .then(data => dispatch(success(data)))
        .catch(err => dispatch(error(err)))
}

export const sectorPageHandler = () => dispatch =>
    dispatch({ type: actionTypes.HANDLE_EDIT_SECTOR_PAGE_VISIBILITY })

export const timerangePageHandler = () => dispatch =>
    dispatch({ type: actionTypes.HANDLE_EDIT_TIMERANGES_PAGE_VISIBILITY })

export const clearAllErrors = () => dispatch =>
    dispatch({ type: actionTypes.CLEAR_ALL_ERRORS })

export const changeAddPhenomenaVisibility = () => ({ type: actionTypes.HANDLE_ADD_PHENOMENA_VISIBILITY })

export const changeEditPhenomenaVisibility = phenomenonUuid => (dispatch, getState) => {
    const { phenomena } = getState()

    const phenomenon = phenomenonUuid
        ? _.find(phenomena, { id: phenomenonUuid })
        : null

    if (phenomenonUuid && !phenomenon) {
        console.error('Invalid phenomenonUuid', phenomenonUuid)
    }

    return dispatch({
        type: actionTypes.HANDLE_EDIT_PHENOMENA_VISIBILITY,
        payload: phenomenon
    })
}
