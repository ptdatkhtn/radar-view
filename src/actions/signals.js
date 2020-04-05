import { getNetworkMethods } from './network'
import { getSignals } from '@sangre-fp/connectors/search-api'
import { requestTranslation } from '@sangre-fp/i18n'
import { getImageUrl, uploadFile } from '@sangre-fp/connectors/media-api'
import { TYPE_SIGNAL, upsertDocument } from '@sangre-fp/connectors/content-service-api'
import * as actionTypes from '@sangre-fp/reducers/actionTypes'

export const changeSignalListVisibility = () => dispatch => dispatch({ type: actionTypes.HANDLE_SIGNAL_LIST_VISIBILITY })
export const changeSignalCreateVisibility = () => dispatch => dispatch({ type: actionTypes.HANDLE_SIGNAL_CREATE_VISIBILITY })

export const fetchRadarSignals = (searchInput = '', page = 0, size = 10) => (dispatch, getState) => {
  const { uuid, group } = getState().radarSettings
  const { loading, success, error } = getNetworkMethods(
    actionTypes.FETCH_SIGNALS,
    page === 0 ? actionTypes.FETCH_SIGNALS_SUCCESS : actionTypes.FETCH_MORE_SIGNALS_SUCCESS,
    requestTranslation('fetchingSignalsError')
  )

  dispatch(loading())

  return getSignals(searchInput, [group.id], page, size, uuid)
    .then((data) => dispatch(success({ ...data })))
    .catch(err => dispatch(error(err)))
}

export const createSignal = (signal, callback) => async (dispatch, getState) => {
  const { title, body, imageFile: file } = signal
  const { loading, success, error } = getNetworkMethods(
    actionTypes.CREATE_SIGNAL,
    actionTypes.CREATE_SIGNAL_SUCCESS,
    requestTranslation('creatingSignalsError')
  )
  const { uuid, radarLanguage, group: { id: groupId } } = getState().radarSettings
  const titleMissing = !title
  const bodyMissing = !body
  const languageMissing = !radarLanguage

  if (bodyMissing || languageMissing || titleMissing) {
    return dispatch(error(new Error('Invalid data'), requestTranslation('missingRequiredSignalData')))
  }

  dispatch(loading())

  const doc = {
    language: radarLanguage,
    type: TYPE_SIGNAL,
    group: Number(groupId),
    content: {
      title,
      body,
      radar: uuid,
      media: {
        image: ''
      }
    }
  }

  try {
    if (file) {
      doc.media.image = getImageUrl(await uploadFile(file, groupId))
    }
    dispatch(success(await upsertDocument(doc)))
    callback()
  } catch (err) {
    dispatch(error(err))
  }
}
