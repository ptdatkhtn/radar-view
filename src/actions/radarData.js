import _ from 'lodash'

import { loadingError, getNetworkMethods } from './network'
import { requestTranslation } from '@sangre-fp/i18n'
import drupalApi from '@sangre-fp/connectors/drupal-api'
import radarDataApi from '../radarDataApiProxy'
import { PUBLIC_URL } from '../env'
import * as actionTypes from '@sangre-fp/reducers/actionTypes'
import {
    getRadarPhenomena, NEWSFEED_ERROR,
    NEWSFEED_ERROR_PARTIAL,
    storePhenomenonWithNewsFeeds
} from '@sangre-fp/connectors/phenomena-api'
import { handleImageUploadIfNeeded } from '@sangre-fp/connectors/media-api'
import { getPhenomenaTypes } from './phenomenaTypes'
import generatePPTX from '../pptx-generator'

export const updateRadarVersion = version => ({
    type: actionTypes.UPDATE_RADAR_VERSION,
    payload: version
})

export function preloadImages (imageSources) {
    imageSources
        .forEach(i => {
        const linkEl = document.createElement('link');
        linkEl.setAttribute('rel', 'preload');
        linkEl.setAttribute('href', i);
        linkEl.setAttribute('as', 'image');
        document.head.appendChild(linkEl);
        });
    }

export const fetchRadar = () => async (dispatch, getState) => {
    const id = getState().radarSettings.id

    const { loading, success, error } = getNetworkMethods(
        actionTypes.FETCH_RADAR,
        actionTypes.FETCH_RADAR_SUCCESS,
        requestTranslation('fetchingRadarError')
    )

    dispatch(loading())

    try {
        const radarData = await drupalApi.getRadar(id)

        const img = new Image();
        img.onload = async () => {
            
        }
        preloadImages([`${PUBLIC_URL}${radarData?.radarImage}`])
        img.src = radarData?.radarImage // by setting an src, you trigger browser download
        const phenomenaData = await getRadarPhenomena(id, radarData.group.id)

            Object.values(phenomenaData.phenomena).forEach(res => {
                res.halo = _.get(radarData.phenomena[res.id], 'halo', false)
                res.speech_bubble = _.get(radarData.phenomena[res.id], 'speech_bubble', false)
            })

            const result = { ...radarData, ...phenomenaData }

            dispatch(getPhenomenaTypes(radarData.group.id)).then(() => dispatch(success(result)))
    } catch (err) {
        dispatch(error(err))
    }
}

export const refetchRadarData = () => async (dispatch, getState) => {
    const radarId = getState().radarSettings.id
    const groupId = getState().radarSettings.group.id

    const { loading, success, error } = getNetworkMethods(
        actionTypes.REFETCH_DATA,
        actionTypes.REFETCH_DATA_SUCCESS,
        requestTranslation('refetchingPhenomenaError')
    )

    dispatch(loading())

    try {
        const result = await getRadarPhenomena(radarId, groupId)

        dispatch(success(result))
    } catch (err) {
        dispatch(error(err))
    }
}

export const deleteRadarPhenomenon = (phenomenon, callback) => (dispatch, getState) => {
    const { time, version, id } = phenomenon
    const radarId = getState().radarSettings.id

    if (!time) {
        if (callback) {
            callback()
        }

        return dispatch({ type: actionTypes.DELETE_PHENOMENA_SUCCESS, payload: phenomenon })
    }

    const { loading, success, error } = getNetworkMethods(
        actionTypes.DELETE_PHENOMENA,
        actionTypes.DELETE_PHENOMENA_SUCCESS,
        requestTranslation('deletingPhenomenaError')
    )

    dispatch(loading())

    const data = {
        version,
        phenomenon_uuid: id
    }

    return radarDataApi.deletePhenomenon(radarId, data)
        .then(() => {
            dispatch(success(phenomenon))
            if (callback) {
                callback()
            }
        })
        .catch(err => dispatch(error(err)))
}

export const updatePhenomenonPosition = phenomenon => ({
    type: actionTypes.UPDATE_PHENOMENON,
    payload: phenomenon
})

export const updatePhenomenonVersion = phenomenon => ({
    type: actionTypes.UPDATE_PHENOMENON_VERSION,
    payload: phenomenon
})

const phenomenaApiErrorHandler = (error, errorFunc, dispatch) => {
    switch (error.response.data.error_code) {
        case 'outdated-version':
            dispatch(errorFunc(new Error('Outdated version'), requestTranslation('outDatedVersionError')))
            break
        case 'resource-not-found':
            dispatch(errorFunc(new Error('Not found'), requestTranslation('phenomenaNotFound')))
            break
        case 'already-exists':
            dispatch(errorFunc(new Error('Already exists'), requestTranslation('phenomenaExists')))
            break
        case 'invalid-input':
            dispatch(errorFunc(new Error('Invalid input'), requestTranslation('phenomenaInvalid')))
            break
        default:
            dispatch(errorFunc(error))
            break
    }
}

export const storePhenomenon = (phenomenon, newsFeedChanges, callback, archived = false) => async (dispatch) => {
    let {
        group,
        _upload: {
          imageFile,
          imageUrl,
          // image // Contains image data url
        } = {},
        ...rest
    } = phenomenon

    const { loading, success, error } = phenomenon.id
        ? getNetworkMethods(
            actionTypes.UPDATE_PHENOMENON_INGESTION,
            actionTypes.UPDATE_PHENOMENON_INGESTION_SUCCESS,
            requestTranslation('updatingPhenomenaError')
        ) : getNetworkMethods(
            actionTypes.CREATE_PHENOMENA,
            actionTypes.CREATE_PHENOMENA_SUCCESS,
            requestTranslation('creatingPhenomenaError')
        )

    dispatch(loading())

    const phenomenonInput = {
        ...rest,
        archived,
        group,
    }

    phenomenonInput.content.media.image = await handleImageUploadIfNeeded(imageFile || imageUrl, group) || ''


    try {
        const { storedPhenomenon, status, failedNewsFeedTitles } = await storePhenomenonWithNewsFeeds(phenomenonInput, newsFeedChanges)

        if (status === NEWSFEED_ERROR_PARTIAL) {
            dispatch(error(new Error('News feed error'), requestTranslation('someNewsFeedCreationError', failedNewsFeedTitles)))
        } else if (status === NEWSFEED_ERROR) {
            dispatch(error(new Error('News feed error'), requestTranslation(phenomenon.id ? 'newsFeedUpdateError' : 'newsFeedCreationError')))
        } else {
            dispatch(success(storedPhenomenon))
            callback(storedPhenomenon)
        }
    } catch (e) {
        dispatch(error(e))
    }
}

export const updatePhenomenon = (phenomenon, positionData) => (dispatch, getState) => {
    dispatch(updatePhenomenonPosition({ ...phenomenon, ...positionData }))

    const radarId = getState().radarSettings.id
    const { id } = phenomenon
    const updatedPhenomenon = _.find(getState().phenomena, { id })

    const { loading, success, error } = getNetworkMethods(
        actionTypes.UPDATE_PHENOMENON_ASYNC,
        actionTypes.UPDATE_PHENOMENON_ASYNC_SUCCESS,
        requestTranslation('updatingPhenomenaError')
    )

    const { sectorId, time, xOffset, version } = updatedPhenomenon

    const data = {
        sectorId,
        time,
        xOffset,
        id,
        version
    }

    dispatch(loading())

    return radarDataApi.updatePhenomenon(radarId, data)
        .then(response => {
            dispatch(updatePhenomenonVersion(response.phenomenon))

            dispatch(success())
        })
        .catch(err => {
            phenomenaApiErrorHandler(err, error, dispatch)

            return dispatch(refetchRadarData())
        })
}

export const createPhenomenonWithPosition = (phenomenon, positionData) => (dispatch, getState) => {
    dispatch(updatePhenomenonPosition({ ...phenomenon, ...positionData }))

    const { id } = phenomenon

    const updatedPhenomenon = _.find(getState().phenomena, { id })

    const { loading, success, error } = getNetworkMethods(
        actionTypes.CREATE_PHENOMENA_POSITION,
        actionTypes.CREATE_PHENOMENA_POSITION_SUCCESS,
        requestTranslation('settingPhenomenaError')
    )

    const radarId = getState().radarSettings.id

    const { sectorId, time, xOffset } = updatedPhenomenon

    dispatch(loading())

    const data = {
        radarId,
        id,
        sectorId,
        time,
        xOffset
    }

    radarDataApi.createPhenomenon(Number(radarId), data)
        .then(resultData => dispatch(success(resultData.phenomenon)))
        .catch(err => {
            phenomenaApiErrorHandler(err, error, dispatch)

            return dispatch(refetchRadarData())
        })
}

export const setDraggedPhenomenon = id => dispatch =>
    dispatch({ type: actionTypes.SET_DRAGGED_PHENOMENON, payload: id })


export const cloneRadar = callback => (dispatch, getState) => {
    const { loading, success, error } = getNetworkMethods(
        actionTypes.CLONE_RADAR,
        actionTypes.CLONE_RADAR_SUCCESS,
        requestTranslation('cloningRadarError')
    )

    const parentRadarId = getState().radarSettings.id

    dispatch(loading())

    drupalApi.cloneRadar(parentRadarId)
        .then(radarData => {
            dispatch(success(radarData))
            callback(`${PUBLIC_URL}/radar?node=${radarData.id}`)
        })
        .catch(err => {
            if (err && err.response && err.response.status === 400) {
                dispatch(loadingError(
                    actionTypes.CLONE_RADAR,
                    err,
                    '',
                    requestTranslation('licenseError'))
                )
            } else {
                dispatch(error(err))
            }
        })
}

export const deleteRadar = () => (dispatch, getState) => {
    const { loading, success, error } = getNetworkMethods(
        actionTypes.DELETING_RADAR,
        actionTypes.DELETING_RADAR_SUCCESS,
        requestTranslation('deletingRadarError')
    )

    dispatch(loading())

    return drupalApi.deleteRadar(getState().radarSettings.id)
        .then(() => {
            dispatch(success())
            document.location.href = '/'
        })
        .catch(err => dispatch(error(err)))
}

export const addPublicPhenomenaToRadar = (phenomenon, callback) => (dispatch, getState) => {
    const { id } = phenomenon

    dispatch({
        type: actionTypes.CREATE_PHENOMENA_SUCCESS,
        payload: phenomenon
    })

    callback(_.find(getState().phenomena, { id }))
}

export const generatePowerpoint = (id, groupId) => (dispatch, getState) => {
    const { loading, success, error } = getNetworkMethods(
        actionTypes.GENERATE_POWERPOINT,
        actionTypes.GENERATE_POWERPOINT_SUCCESS,
        requestTranslation('generatingPPTXError')
    )

    dispatch(loading())

    return generatePPTX(id, groupId)
        .then(() => dispatch(success()))
        .catch(err => dispatch(error(err)))
}