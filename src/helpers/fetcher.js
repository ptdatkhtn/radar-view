import axios from 'axios'
import {getCsrfToken, getSessionToken} from '@sangre-fp/connectors/session'
const DRUPAL_API_URL = process.env.REACT_APP_DRUPAL_API_URL
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


export async function getMembershipForPublicLink(groupId) {
    // eslint-disable-next-line
    return httpRequest(GET, `membership?filter[gid]=${groupId}&sort=role_weight,email`)
}

export default {
    getMembershipForPublicLink,
}