import { connect } from 'react-redux'
import { compose, bindActionCreators } from 'redux'
import { createSelector } from 'reselect'
import { getCurrentLanguage } from '@sangre-fp/i18n'
import { isCollaborationToolsAllowed } from '../selectors'
import CreateRadarForm from '../components/CreateRadarForm'
import filter from 'lodash/filter'
import includes from 'lodash/includes'
import {
    changeAddRadarFormVisibility,
    changeRadarName,
    changeMapIntro,
    changeRadarLanguage,
    changeAddRadarFormPage,
    changePhenomenaSet,
    changeHideUsersFromTrial,
    changeRadarImage,
    changeVotingOn,
    changeRatingsOn,
    changeRatingsSettings,
    changeDiscussionOn,
    changeCommentsOn,
    changeLikingOn,
    changeVotingUp,
    createRadar,
    changeRadarGroup,
    updateRadar,
    getRadarSets,
    getUserGroups,
    changeDisplayHaloWhenRating,
    changeRadarTitleImage
} from '../actions/radarSettings'


const getStateRadarSets = state => state.radarSets

// sets for both languages have language set to 'und'
const LANGUAGE_UNDEFINED = 'und'

const getRadarSetsByLanguage = createSelector(
    [getCurrentLanguage, getStateRadarSets],
    (language, radarSets) => filter(
        radarSets,
        radarSet => includes([language, LANGUAGE_UNDEFINED], radarSet.language)
    )
)

const mapStateToProps = state => {
    const {
        radarSettings,
        loading
    } = state

    const radarSets = getRadarSetsByLanguage(state)
    return {
        ...radarSettings,
        radarSets,
        loading,
        isCollaborationToolsAllowed: isCollaborationToolsAllowed(state)
    }
}

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        changeDisplayHaloWhenRating,
        changeAddRadarFormVisibility,
        changeRadarName,
        changeMapIntro,
        changeRadarLanguage,
        changeAddRadarFormPage,
        changePhenomenaSet,
        changeHideUsersFromTrial,
        changeRadarImage,
        changeVotingOn,
        changeRatingsOn,
        changeRatingsSettings,
        changeDiscussionOn,
        changeCommentsOn,
        changeLikingOn,
        changeVotingUp,
        createRadar,
        changeRadarGroup,
        updateRadar,
        getUserGroups,
        getRadarSets,
        changeRadarTitleImage
    }, dispatch)
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps)
)(CreateRadarForm)
