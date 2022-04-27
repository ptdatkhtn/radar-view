import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AddPhenomenaSandbox from '../components/AddPhenomenaSandbox'
import { changeAddPhenomenaVisibility } from '../actions/radarSettings'
import { storePhenomenon, addPublicPhenomenaToRadar, updateStoredPhenonSelector } from '../actions/radarData'
import { storedPhenSelector } from '../selectors'
import { fetchPhenomenaList, setPhenomenonToTag } from '../actions/phenomenaList'


export default connect(
    (state) => {
        const {
            radarSettings: {
                id,
                group,
                radarLanguage,
                addPhenomenaVisible,
                storedPhenomenon,
            },
            phenomenaList: phenomenaListData,
        } = state

        return {
            radarId: id,
            radarLanguage,
            addPhenomenaVisible,
            storedPhenomenon,
            radar: {
                id,
                groupId: group.id,
                language: radarLanguage
            },
            storedPhenSelector: storedPhenSelector(state),
            phenomenaList: phenomenaListData
        }
    },
    dispatch => bindActionCreators({
        changeAddPhenomenaVisibility,
        storePhenomenon,
        addPublicPhenomenaToRadar,
        updateStoredPhenonSelector,
        fetchPhenomenaList, setPhenomenonToTag
    }, dispatch)
)(AddPhenomenaSandbox)
