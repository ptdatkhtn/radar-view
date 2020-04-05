import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Filters } from '../components/Filters'
import { toggleFilter, setActiveFilter, resetFilters, setActiveTagFilter } from '../actions/radarSettings'

export default connect(
    state => {
        const {
            phenomenaTypes,
            filters: {
                filtersVisible,
                activeFilter,
                activeTagFilter
            },
            radarSettings: {
                group,
                radarLanguage
            }
        } = state

        return {
            phenomenaTypes,
            filtersVisible,
            activeFilter,
            activeTagFilter,
            group,
            language: radarLanguage
        }
    },
    dispatch => bindActionCreators({
        toggleFilter,
        setActiveFilter,
        resetFilters,
        setActiveTagFilter
    }, dispatch)
)(Filters)
