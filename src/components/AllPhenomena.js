import React, { PureComponent } from 'react'
import Phenomena from './Phenomena'

export default class AllPhenomena extends PureComponent {
    render() {
        const {
            radius,
            timeRanges,
            scaled,
            onPhenomenaDrag,
            draggedPhenomenon,
            getPhenomenaDisplayProps,
            canEdit,
            radarId,
            activeFilter,
            activeTagFilter
        } = this.props
        const phenomenaDisplayProps = getPhenomenaDisplayProps()

        return (
            <g className={'phenomena'}>
                {timeRanges.map((({ value, sectors }) =>
                    sectors.filter(({ phenomena }) => !!phenomena.length).map(sector => (
                        <Phenomena
                            radarId={radarId}
                            canEdit={canEdit}
                            key={`${sector.id}-${value}`}
                            phenomena={sector.phenomena}
                            draggedPhenomenon={draggedPhenomenon}
                            radius={radius}
                            sector={sector}
                            scaled={scaled}
                            phenomenaDisplayProps={phenomenaDisplayProps}
                            onPhenomenaDrag={onPhenomenaDrag}
                            filter={activeFilter}
                            tagFilter={activeTagFilter}
                        />
                    )))
                )}
            </g>
        )
    }
}
