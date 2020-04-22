import { getNetworkMethods } from './network'
import drupalApi from '@sangre-fp/connectors/drupal-api'
import * as actionTypes from '@sangre-fp/reducers/actionTypes'
import { requestTranslation } from '@sangre-fp/i18n'
import {normalizeGroupPhenomenonTypes} from "@sangre-fp/connectors/drupal-api/normalize";

export const getPhenomenaTypes = () => (dispatch) => {
    const { loading, success, error } = getNetworkMethods(
        actionTypes.GET_PHENOMENA_TYPES,
        actionTypes.GET_PHENOMENA_TYPES_SUCCESS,
        requestTranslation('fetchingPhenomenaTypesError')
    )

    dispatch(loading())

    return drupalApi.getPhenomenaTypes(normalizeGroupPhenomenonTypes)
        .then(data => dispatch(success(data)))
        .catch(err => dispatch(error(err)))
}
