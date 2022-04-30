import * as d3 from 'd3'
import {
    PUBLIC_URL
} from './env'
import _ from 'lodash'
import { getUserRoles } from '@sangre-fp/connectors/session'

export const getCoordsFromAngleAndRadius = (angle, radius) => d3.radialLine()([[angle, radius]])
    .match(/^M(.+),(.+)Z$/)
    .slice(1)
    .map(Number)

export const detectLeftButton = evt => {
    const event = evt || window.event
    if ('buttons' in evt) {
        return event.buttons === 1
    }
    const button = event.which || event.button
    return button === 1
}

export const getPhenomenonUrl = (radarId = false, phenomenon, hideEdit = false) => {
    const { group, id } = phenomenon
    const hasGroup = phenomenon.hasOwnProperty('group')
    const groupUrl = hasGroup ? `group=${group}` : ''

    if (!radarId) {
        return `${PUBLIC_URL}/fp-phenomena/${id}${groupUrl.length ? `/?${groupUrl}` : ''}`
    }

    const urlParams = new URLSearchParams(window.location.search)
    const vsid = urlParams.get('vsid')

    // eslint-disable-next-line
    return `${PUBLIC_URL}/node/${radarId}?issue=${id}&map_id=${radarId}&source_position=right&source_page=radar-view${groupUrl.length ? `&${groupUrl}` : ''}${hideEdit ? '&hideEdit=true' : ''}${vsid ? `&vsid=${vsid}` : ''}`
}

export const editorRole = role =>  role === 'manager' || role === 'owner' || role === 'editor'

export const publicEditorRole = permissions => !!_.find(permissions, permission => permission === 'fp editor')

export const makeGroup = group => {
    const {
        id,
        label,
        radarsUsed,
        radarsAllowed: radarsAllowedString,
        accountDrupalRoles,
        accountPermissions,
        availableResources
    } = group

    // backend is returning this as a string for whatever reason
    const radarsAllowed = Number(radarsAllowedString)

    // not sure why this info is in the group
    const canEditPublic = accountDrupalRoles && publicEditorRole(accountDrupalRoles[0])
    const canEdit = accountPermissions && editorRole(accountPermissions.role)

    return {
        ...group,
        id,
        value: id,
        label,
        radarsAllowed,
        radarsUsed,
        hasAvailableRadars: radarsUsed < radarsAllowed,
        availableResources,
        canEditPublic,
        canEdit
    }
}

export const isFpEditor = () => publicEditorRole(getUserRoles()?.[0])

export const arrayMoveMutate = (array, from, to) => {
    array.splice(to < 0 ? array.length + to : to, 0, array.splice(from, 1)[0])
}

export const arrayMove = (array, from, to) => {
    const arr = array.slice()
    arrayMoveMutate(arr, from, to)
    return arr
}

export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }