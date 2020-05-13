import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AllPhenomena from '../components/AllPhenomena'
import { } from '../actions/radarSettings'

export default connect(
    state => {
        const {
            radarSettings: {
                id,
                canEditRadar,
                votingOn
            },
            filters: {
                activeFilter,
                activeTagFilter
            }
        } = state

        return {
            radarId: id,
            canEdit: canEditRadar,
            filter: activeFilter,
            tagFilter: activeTagFilter,
            votingOn
        }
    },
    dispatch => bindActionCreators({
    }, dispatch)
)(AllPhenomena)
