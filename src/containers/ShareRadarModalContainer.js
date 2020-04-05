import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ShareRadarModal from '../components/ShareRadarModal'
import { changeRadarSharing, changeRadarSharingExpiry, updateRadar } from '../actions/radarSettings'


export default connect(
    state => {
        const {
            loading,
            errors,
            radarSettings: {
                enableUrlLogin,
                urlLoginExpire,
                urlLoginLink,
                group,
                id
            }
        } = state

        return {
            loading,
            errors,
            enableUrlLogin,
            urlLoginExpire,
            urlLoginLink,
            group,
            id
        }
    },
    dispatch => bindActionCreators({
        changeRadarSharing,
        changeRadarSharingExpiry,
        updateRadar
    }, dispatch)
)(ShareRadarModal)
