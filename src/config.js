import * as d3 from 'd3'
import { requestTranslation } from '@sangre-fp/i18n'
import { getSessionToken } from '@sangre-fp/connectors/session'

export const customQuillModules = {
    toolbar: [
        [{ header: ['1', '2', '3', '4', '5'] }, { font: [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ list: 'ordered' }, { list: 'bullet' },
            { indent: '-1' }, { indent: '+1' }],
        ['link'],
        ['clean']
    ],
    clipboard: {
        // toggle to add extra line breaks when pasting HTML:
        matchVisual: false
    }
}

export const centerRadiusPercentage = 0.15
export const radarBorderWidth = 80

export const ALL_GROUP_VALUE = -1

export const radarLanguages = () => [
    { value: 'en', label: requestTranslation('english') },
    { value: 'fi', label: requestTranslation('finnish') }
]

export const radarLanguagesWithAll = () => [
    { value: 'all', label: requestTranslation('all') },
    ...radarLanguages()
]

export const initialCommentTopics = [
    { label: 'Opportunities', checked: false },
    { label: 'Threats', checked: false },
    { label: 'Actions', checked: false }
]

export const getWebSocketHeaders = () => ({ Authorization: `Bearer ${getSessionToken()}` })

export const RANGE_MIN = 0
export const RANGE_MAX = 1
export const MAX_TIMELINES = 10
export const RANGE_BOUNDARY = RANGE_MAX / MAX_TIMELINES
export const TIMELINE_TEMPLATE = {
    position: null,
    year: '',
    description: '',
    label: ''
}

export const timerangeColors = d3.scaleLinear()
    .domain([30, 2, 1, 0])
    .range(['#333334', '#E7E7E8', '#F3F3F4', '#FBFBFC'])
    .interpolate(d3.interpolateRgb)
