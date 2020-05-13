import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AddPhenomenaSandbox from '../components/AddPhenomenaSandbox'
import { changeAddPhenomenaVisibility } from '../actions/radarSettings'
import { storePhenomenon, addPublicPhenomenaToRadar } from '../actions/radarData'

export default connect(
    (state) => {
        const {
            radarSettings: {
                id,
                group,
                radarLanguage,
                addPhenomenaVisible
            },
        } = state

        return {
            radarId: id,
            radarLanguage,
            addPhenomenaVisible,

            radar: {
                id,
                groupId: group.id,
                language: radarLanguage
            }
        }
    },
    dispatch => bindActionCreators({
        changeAddPhenomenaVisibility,
        storePhenomenon,
        addPublicPhenomenaToRadar
    }, dispatch)
)(AddPhenomenaSandbox)
