import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import SideNav from '../components/SideNav'
import {
    changeAddRadarFormVisibility,
    sectorPageHandler,
    timerangePageHandler,
    changeAddPhenomenaVisibility,
    toggleEditMenuVisiblity
} from '../actions/radarSettings'
import { changeSignalListVisibility } from '../actions/signals'
import {
    deleteRadar,
    cloneRadar,
    generatePowerpoint
} from '../actions/radarData'
import { isCollaborationToolsAllowed } from '../selectors'
import { PUBLIC_URL } from '../env'

export default connect(
    (state, props) => {
        const {
            radarSettings: {
                signalToolEnabled,
                addRadarFormOpen,
                editMenuOpen,
                editPhenomenaVisible,
                addPhenomenaVisible,
                editSectorsPageOpen,
                id,
                group,
                groups,
                canDeleteRadar,
                canEditRadar,
                isVisitor,
                canShareRadar,
                editTimeRangesPageOpen,
                radarName
            },
            signals: {
                signalListVisible
            }
        } = state

        const collaborationToolsAllowed = group && groups ?
            isCollaborationToolsAllowed(state)(group.id) : false

        return {
            signalToolEnabled,
            addRadarFormOpen,
            editPhenomenaVisible,
            signalListVisible,
            addPhenomenaVisible,
            editSectorsPageOpen,
            id,
            groupId: group.id,
            collaborationToolsAllowed,
            canDeleteRadar,
            isVisitor,
            canShareRadar,
            canEditRadar,
            getReturnUrl: () => props.returnUri || PUBLIC_URL || '/',
            editMenuOpen,
            editTimeRangesPageOpen,
            radarName
        }
    },
    dispatch => bindActionCreators({
        changeSignalListVisibility,
        deleteRadar,
        sectorPageHandler,
        changeAddRadarFormVisibility,
        timerangePageHandler,
        changeAddPhenomenaVisibility,
        cloneRadar,
        toggleEditMenuVisiblity,
        generatePowerpoint
    }, dispatch)
)(SideNav)
