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
        const groupsProp = [
            {
              value: 0,
              label: 'FP phenomena'
            },
            {
              value: group?.id,
              label: group?.title
            }
          ]
        return {
            phenomena,
            group,
            isRadar,
            groupsProp
        }
    }
)(PhenomenaSelector)
