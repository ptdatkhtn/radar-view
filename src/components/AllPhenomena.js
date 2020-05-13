import React, { PureComponent } from 'react'
import Phenomena from './Phenomena'

export default class AllPhenomena extends PureComponent {
    render() {
        const { timeRanges, getPhenomenaDisplayProps } = this.props
        const phenomenaDisplayProps = getPhenomenaDisplayProps()

        return (
            <g className={'phenomena'}>
                {timeRanges.map((({ value, sectors }) =>
                    sectors.filter(({ phenomena }) => !!phenomena.length).map(sector => (
                        <Phenomena
                            {...this.props}
                            key={`${sector.id}-${value}`}
                            sector={sector}
                            phenomena={sector.phenomena}
                            phenomenaDisplayProps={phenomenaDisplayProps}
                        />
                    )))
                )}
            </g>
        )
    }
}
