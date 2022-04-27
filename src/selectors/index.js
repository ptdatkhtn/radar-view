import { createSelector } from 'reselect'
import { find } from 'lodash'

const getRadarSettingsGroups = (state) => state.radarSettings && state.radarSettings.groups
const getStoredPhen = (state) => state?.radarSettings?.storedPhenomenon

export const isCollaborationToolsAllowed = createSelector([ getRadarSettingsGroups ], (groups) => {
    return (groupId) => {
        const group = find(groups, g => groupId === g.id)
        if (group) {
            if (group.availableResources.hasOwnProperty('collaboration_tools')) {
                return !!group.availableResources.collaboration_tools
            }
            // Allowed for legacy accounts
            return true
        }
        return false
    }
})

export const storedPhenSelector = createSelector(getStoredPhen, storedPhenomenon => {
    console.log('phenomenonphenomenon222', storedPhenomenon)
    return storedPhenomenon ?? []
})