import _ from 'lodash'

import { getNetworkMethods } from './network'
import * as actionTypes from '@sangre-fp/reducers/actionTypes'
import radarDataApi from '../radarDataApiProxy'
import { requestTranslation } from '@sangre-fp/i18n'

export function roundToX(num, X) {
    return +(Math.round(num + "e+"+X)  + "e-"+X)
}

export const updateTimerange = (timerange, callback) => (dispatch, getState) => {
    const radarId = getState().radarSettings.id

    const { loading, success, error } = getNetworkMethods(
        actionTypes.UPDATE_TIMERANGE,
        actionTypes.UPDATE_TIMERANGE_SUCCESS,
        requestTranslation('updatingTimelinesError')
    )

    // can be data = {...payload} when title is removed from dto by konrad
    const { id, version, position, label, description, year } = timerange
    const data = { id, version, position, label, description, year }

    dispatch(loading())

    return radarDataApi.updateRadarTimeRange(radarId, data)
        .then(timeRangeData => {
            callback()
            return dispatch(success({
                ...timeRangeData.time_range
            }))
        })
        .catch(err => dispatch(error(err)))
}

export const updateTimerangePosition = (newTimelinePositions, oldTimelinePositions) => (dispatch, getState) => {
    const radarId = getState().radarSettings.id
    const timelines = getState().timelines
    const newPosition = _.difference(newTimelinePositions, oldTimelinePositions)[0]

    // because this is fired upon a onAfterChange event, the position has already been set by the uploadPositions function
    const timelineToUpdate = _.find(timelines, { position: roundToX(Number(newPosition), 2) })
    const data = { ...timelineToUpdate }

    // first and last timerange position are unchangable
    // so the only time timelineToUpload is false, is when one
    // of those has been touched (they fire an event despite being disabled
    // ( bug in rc-slider )
    if (!timelineToUpdate) {
        return
    }

    const { loading, success, error } = getNetworkMethods(
        actionTypes.UPDATE_TIMERANGE,
        actionTypes.UPDATE_TIMERANGE_SUCCESS,
        requestTranslation('updatingTimelinesPositionError')
    )

    dispatch(loading())

    return radarDataApi.updateRadarTimeRange(radarId, data)
        .then(timeRangeData => dispatch(success({
            ...timeRangeData.time_range
        })))
        .catch(err => {
            // set the timeranges position to it's old position
            dispatch({
                type: actionTypes.UPDATE_TIMELINES,
                payload: updatePositions(timelines, oldTimelinePositions)
            })

            dispatch(error(err))
        })
}

export const removeTimeline = timerange => (dispatch, getState) => {
    const radarId = getState().radarSettings.id

    const { loading, success, error } = getNetworkMethods(
        actionTypes.REMOVE_TIMELINE,
        actionTypes.REMOVE_TIMELINE_SUCCESS,
        requestTranslation('removingTimelineError')
    )

    dispatch(loading())

    const data = { ...timerange }

    return radarDataApi.deleteRadarTimeRange(radarId, data)
        .then(timeRangeData => dispatch(success(timeRangeData.time_range.id)))
        .catch(err => dispatch(error(err)))
}


const updatePositions = (timelines, positions) => {
    return timelines
        .map((timeline, index) => ({
            ...timeline,
            position: roundToX(Number(positions[index]), 2)
        }))
}

export const updateTimelinePositions = timelineYearRangeValues => (dispatch, getState) => {
    const timelines = getState().timelines

    // first and last positions are unchangable
    const positions = timelineYearRangeValues.map((value, index) => {
        if (index === 0) {
            return 0
        }

        if (index === timelineYearRangeValues.length - 1) {
            return 1
        }

        return value
    })

    dispatch({
        type: actionTypes.UPDATE_TIMELINES,
        payload: updatePositions(timelines, positions)
    })
}

export const addTimeline = (timeline, callback) => (dispatch, getState) => {
    const timelines = getState().timelines
    const { id: radarId, timelineLabelFormat } = getState().radarSettings

    // insert new timeline into proper place
    let newTimelines = [...timelines]
    const newTimelineIndex = timelineLabelFormat ? _.sortedIndexBy(timelines, timeline, 'position') : _.sortedIndexBy(timelines, timeline, 'year')
    newTimelines.splice(newTimelineIndex, 0, timeline)

    // set the new timeline's position to be between it's neightbours
    const nextTimelinePosition = Number(newTimelines[newTimelineIndex + 1].position)
    const previousTimelinePosition = Number(newTimelines[newTimelineIndex - 1].position)
    const timelinePosition = (nextTimelinePosition + previousTimelinePosition) / 2

    const { loading, success, error } = getNetworkMethods(
        actionTypes.ADD_TIMERANGE,
        actionTypes.ADD_TIMERANGE_SUCCESS,
        requestTranslation('addingTimelineError')
    )

    const data = {
        ...newTimelines[newTimelineIndex],
        position: roundToX(Number(timelinePosition), 2)
    }

    dispatch(loading())

    return radarDataApi.addRadarTimeRange(radarId, data)
        .then(timeRangeData => {
            const newTimelineState = [...timelines]
            // posiiton will come from backend once it's implemented
            // then delete this position below
            newTimelineState.splice(newTimelineIndex, 0, {...timeRangeData.time_range })

            dispatch(success(newTimelineState))
            callback()
        })
        .catch(err => dispatch(error(err)))
}

export const toggleLabelMode = () => dispatch => dispatch({ type: actionTypes.TOGGLE_LABEL_MODE })