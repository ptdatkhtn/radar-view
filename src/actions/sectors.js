import _ from 'lodash'
import { getNetworkMethods } from './network'
import * as actionTypes from '@sangre-fp/reducers/actionTypes'
import radarDataApi from '../radarDataApiProxy'
import { requestTranslation } from '@sangre-fp/i18n'

export const addSector = (placement, selectedSector) => (dispatch, getState) => {
    const { loading, success, error } = getNetworkMethods(
        actionTypes.ADD_SECTOR,
        actionTypes.ADD_SECTOR_SUCCESS,
        requestTranslation('addingSectorError')
    )

    const radarId = getState().radarSettings.id

    const data = {
        title: '',
        notes: ''
    }

    if (selectedSector && !_.isEmpty(selectedSector) && placement === 0) {
        data.next = {}
        data.next.id = selectedSector.id
        data.next.version = selectedSector.version
    } else if (selectedSector && !_.isEmpty(selectedSector) && placement === 1) {
        data.previous = {}
        data.previous.id = selectedSector.id
        data.previous.version = selectedSector.version
    }

    dispatch(loading())

    return radarDataApi.createSector(radarId, data)
        .then(({ sector, next, previous }) => dispatch(success({
            affectedSectors: [next, previous].filter(s => !_.isEmpty(s)),
            sectorId: selectedSector.id,
            placement,
            sector
        })))
        .catch(err => dispatch(error(err)))
}

export const updateSector = (sector, title, notes, callback) => (dispatch, getState) => {
    const { loading, success, error } = getNetworkMethods(
        actionTypes.EDIT_SECTOR,
        actionTypes.EDIT_SECTOR_SUCCESS,
        requestTranslation('editingSectorError')
    )

    dispatch(loading())

    const radarId = getState().radarSettings.id
    const data = {
        id: sector.id,
        version: sector.version,
        title,
        notes
    }

    return radarDataApi.updateSector(radarId, data)
        .then(resultData => {
            if (callback) {
                callback()
            }
            return dispatch(success(resultData.sector))
        })
        .catch(err => dispatch(error(err)))
}

export const deleteSector = ({ id: sectorId, version }) => (dispatch, getState) => {
    const { loading, success, error } = getNetworkMethods(
        actionTypes.DELETE_SECTOR,
        actionTypes.DELETE_SECTOR_SUCCESS,
        requestTranslation('deletingSectorError')
    )

    dispatch(loading())

    const radarId = getState().radarSettings.id
    const data = { id: sectorId, version }

    return radarDataApi.deleteSector(radarId, sectorId, data)
        .then(({ next, previous, radar_version }) => {
            const affectedSectors = [next, previous].filter(s => !_.isEmpty(s))
            dispatch(success({
                    deletedSectorId: sectorId,
                    affectedSectors,
                    radarVersion: radar_version
                }
            ))
        })
        .catch(err => dispatch(error(err)))
}
