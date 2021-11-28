import { connect } from 'react-redux'
import { PhenomenaSelector } from '@sangre-fp/content-editor'

export default connect(
    state => {
        const {
            phenomena,
            radarSettings: {
                group
            }
        } = state
        const isRadar = true
        return {
            phenomena,
            group,
            isRadar
        }
    }
)(PhenomenaSelector)
