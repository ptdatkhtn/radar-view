import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import SignalList from '../components/SignalList'
import { changeSignalListVisibility, fetchRadarSignals, changeSignalCreateVisibility } from '../actions/signals'

export default connect(
    state => {
        const { loading, errors, signals: signalData } = state
        return {
            loading,
            errors,
            signalData
        }
    },
    dispatch => ({
        ...bindActionCreators({
            changeSignalListVisibility,
            changeSignalCreateVisibility,
            fetchRadarSignals
        }, dispatch)
    })
)(SignalList)
