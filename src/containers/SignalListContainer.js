import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import SignalList from '../components/SignalList'
import {
  changeSignalListVisibility,
  fetchRadarSignals,
  changeSignalCreateVisibility,
  archiveSignal
} from '../actions/signals'

export default connect(
  (state) => {
        const { loading, errors, signals: signalData, radarSettings: { canEditRadar, group } } = state
        return {
            loading,
            errors,
            signalData,
            groupId: group !== null && typeof group === 'object' ? group.id : group,
            canArchiveSignals: canEditRadar
        }
    },
    dispatch => ({
        ...bindActionCreators({
            changeSignalListVisibility,
            changeSignalCreateVisibility,
            fetchRadarSignals,
            archiveSignal
        }, dispatch)
    })
)(SignalList)
