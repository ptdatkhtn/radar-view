import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import TimerangeEditorForm from '../components/TimerangeEditorForm'
import { timerangePageHandler, updateRadar } from '../actions/radarSettings'
import { toggleConfirmationDialog } from '../actions/confirmDialog'
import {
    updateTimelinePositions,
    removeTimeline,
    addTimeline,
    updateTimerange,
    updateTimerangePosition,
    toggleLabelMode
} from '../actions/timelines'

export default connect(
    state => {
        const {
            radarSettings: {
                editTimeRangesPageOpen,
                timelineLabelFormat
            },
            timelines
        } = state

        return {
            editTimeRangesPageOpen,
            timelines,
            timelineLabelFormat
        }
    },
    dispatch => bindActionCreators({
        timerangePageHandler,
        toggleConfirmationDialog,
        updateTimelinePositions,
        removeTimeline,
        addTimeline,
        updateTimerange,
        updateTimerangePosition,
        updateRadar,
        toggleLabelMode
    }, dispatch)
)(TimerangeEditorForm)
