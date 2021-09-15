import axios from 'axios'
import {getCsrfToken, getSessionToken} from '@sangre-fp/connectors/session'
const DRUPAL_API_URL = process.env.REACT_APP_DRUPAL_API_URL
const baseUrl = process.env.REACT_APP_VOTING_API_URL

const GET = 'GET'
const POST = 'POST'
const DELETE = 'DELETE'
const PUT = 'PUT'
const PATCH = 'PATCH'

async function httpRequest(method, path, payload = null) {
    return axios({
        method,
        url: `${DRUPAL_API_URL}/v1.0/${path}`,
        headers: {
            'X-CSRF-Token': getCsrfToken(),
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getSessionToken()}`
        },
        withCredentials: true,
        data: payload || null
    }).then(res => res.data)
}

async function httpRequestCustom(baseUrl, method, path, payload = null) {
    return axios({
        method,
        url: `${baseUrl}/${path}`,
        headers: {
            'X-CSRF-Token': getCsrfToken(),
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getSessionToken()}`
        },
        withCredentials: true,
        data: payload || null
    })
  }

export async function getMembershipForPublicLink(groupId) {
    // eslint-disable-next-line
    return httpRequest(GET, `membership?filter[gid]=${groupId}&sort=role_weight,email`)
}

export default {
    getMembershipForPublicLink,
}

export const ratingApi = {
    //delete all votes from all phenomenon by radarId
    getFlipAxis : async (gid, radarId) => {
        return await httpRequestCustom(baseUrl, 'GET', `meta/rating/${gid}/radar/${radarId}/flipaxis/`)
    },
    getFlipAxisAfterSaved : async (gid, radarId) => {
        return await httpRequestCustom(baseUrl, 'GET', `meta/rating/${gid}/radar/${radarId}/flipAxisAfterSaved/`)
    },
    //add hidden phenomennon of radar
    changeFlipAxis: async (gid, radarId, payload) => {
        return await httpRequestCustom(baseUrl, 'POST', `meta/rating/${gid}/radar/${radarId}/flipaxis/`, payload)
    },
    changeFlipAxisAfterSaved: async (gid, radarId, payload) => {
        return await httpRequestCustom(baseUrl, 'POST', `meta/rating/${gid}/radar/${radarId}/flipAxisAfterSaved/`, payload)
    }
}