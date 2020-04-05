import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AllPhenomena from '../components/AllPhenomena'
import { } from '../actions/radarSettings'

export default connect(
    state => {
        const {
            radarSettings: {
                id,
                canEditRadar
            },
            filters: {
                activeFilter,
                activeTagFilter
            }
        } = state

        return {
            radarId: id,
            canEdit: canEditRadar,
            activeFilter,
            activeTagFilter
        }
    },
    dispatch => bindActionCreators({
    }, dispatch)
)(AllPhenomena)
