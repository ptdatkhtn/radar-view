import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import RadarPage from '../components/RadarPage'
import { compose, bindActionCreators } from 'redux'
import Dimensions from 'react-dimensions'
import { createSelector } from 'reselect'
import { centerRadiusPercentage } from '../config'
import { getCoordsFromAngleAndRadius } from '../helpers'
import * as d3 from 'd3'
import _ from 'lodash'

import {
    changeAddRadarFormVisibility,
    changeEditPhenomenaVisibility,
    getUserGroups,
    toggleEditMenuVisiblity
} from '../actions/radarSettings'
import { addSector, deleteSector, updateSector } from '../actions/sectors'
import {
    fetchRadar,
    setDraggedPhenomenon,
    updatePhenomenon,
    createPhenomenonWithPosition,
    deleteRadarPhenomenon,
    refetchRadarData,
    storePhenomenon,
    addPublicPhenomenaToRadar
} from '../actions/radarData'

const getCreateTimeRanges = (thisRadius, centerRadius = thisRadius * centerRadiusPercentage) => timeRanges => {
    let previousRadius = centerRadius

    return timeRanges.map((timeRange, index) => {
        const { startYear, endYear, sectors, position } = timeRange
        const width = position - (index ? timeRanges[index - 1].position : 0)
        const timelineWidth = (thisRadius - centerRadius) * width

        // get inner radius
        const radius = previousRadius

        // get outer radius
        const outerRadius = previousRadius + timelineWidth

        previousRadius = outerRadius

        // get scale
        const scale = d3.scaleLinear()
            .range([radius, outerRadius])
            .domain([startYear, endYear])

        // get constraints
        const band = d3.scaleBand().range([0, 2 * Math.PI]).domain(_.keys(sectors))

        // set phenomena x and y
        return {
            ...timeRange,
            radius,
            outerRadius,
            scale,
            sectors: sectors.map((sector, sectorIndex) => {
                const startAngle = (Math.PI + band(sectorIndex))
                const endAngle = Math.PI + band(sectorIndex) + band.step()
                const key = `sector-${startYear}-${sector.id}`
                return {
                    ...sector,

                    key,

                    startAngle,

                    endAngle,

                    scale,

                    arc: d3.arc()
                        .innerRadius(radius)
                        .outerRadius(outerRadius)
                        .startAngle(startAngle)
                        .endAngle(endAngle)(),

                    constraints: {
                        angle: [startAngle, endAngle],
                        radius: [radius, outerRadius]
                    },

                    phenomena: sector.phenomena.map(phenomenon => {
                        const { xOffset, time } = phenomenon

                        const angle = startAngle + ((endAngle - startAngle) * xOffset)
                        const phenomenonRadius = scale(time)

                        const [x, y] = getCoordsFromAngleAndRadius(angle, phenomenonRadius)

                        return {
                            ...phenomenon,
                            angle,
                            radius: phenomenonRadius,
                            x,
                            y
                        }
                    })
                }
            })
        }
    })
}

const Timelines = WrappedComponent => {
    class WithTimelines extends PureComponent {
        render() {
            // const { containerHeight, containerWidth } = this.props
            const containerHeight = 2300
            const containerWidth = 2300
            const svgDimensions = Math.min(containerHeight, containerWidth)
            const radius = (svgDimensions / 2) - 30
            const createTimeRanges = getCreateTimeRanges(radius)

            return (
                <WrappedComponent
                    {...this.props}
                    svgDimensions={svgDimensions}
                    radius={radius}
                    createTimeRanges={createTimeRanges}
                />
            )
        }
    }

    return WithTimelines
}

const getTimelines = ({ timelines }) => timelines
const getSectors = ({ sectors }) => sectors
const getPhenomena = ({ phenomena }) => phenomena
const getDraggedPhenomenonId = ({ radarSettings: { draggedPhenomenonId } }) => draggedPhenomenonId

const getPropsCreateTimeRanges = (state, props) => props.createTimeRanges

const getSectorPhenomena = (sector, phenomenas, startYear, endYear) => {
    return phenomenas.filter(
        ({ sectorId, time }) =>
            sectorId === sector.id && time >= startYear && time < endYear
    )
}

const getTimelineSectors = (sectors, phenomena, startYear, endYear) => sectors.map(sector => ({
    ...sector,
    phenomena: getSectorPhenomena(sector, phenomena, startYear, endYear)
}))

const getTimeRanges = createSelector(
    [getTimelines, getSectors, getPhenomena],
    (timeLineBoundaries, sectors, phenomena) => {
        // TODO fix
        const isPlaceholder = timeLineBoundaries.length === 1 && timeLineBoundaries[0][1] === 1

        return timeLineBoundaries.map(({ year: startYear }, index) => {
            if (timeLineBoundaries[index + 1]) {
                const endYear = timeLineBoundaries[index + 1].year
                const title = timeLineBoundaries[index + 1].title || ''
                const id = timeLineBoundaries[index + 1].id
                const version = timeLineBoundaries[index + 1].version || 1
                const position = timeLineBoundaries[index + 1].position
                const description = timeLineBoundaries[index].description
                const label = timeLineBoundaries[index].label

                return {
                    id,
                    title,
                    startYear,
                    endYear,
                    isPlaceholder,
                    sectors: getTimelineSectors(sectors, phenomena, startYear, endYear),
                    version,
                    position,
                    description,
                    label
                }
            }

            return null
        }).filter(timeRange => !!timeRange)
    }
)

const getRadarData = createSelector(
    [getTimeRanges, getPropsCreateTimeRanges],
    (timeRanges, createTimeRanges) => createTimeRanges(timeRanges)
)
const getDraggedPhenomenon = createSelector(
    [getPhenomena, getDraggedPhenomenonId],
    (phenomena, draggedPhenomenonId) => _.find(
        phenomena, ({ id }) => id === draggedPhenomenonId
    )
)

const mapStateToProps = (state, props) => {
    const {
        radarSettings,
        loading,
        phenomenaTypesById,
        timelines
    } = state

    return {
        loading,
        radarSettings,
        phenomenaTypesById,
        timeRanges: getRadarData(state, props),
        canEditRadar: radarSettings.canEditRadar,
        isVisitor: radarSettings.isVisitor,
        draggedPhenomenon: getDraggedPhenomenon(state),
        timelines
    }
}

const mapDispatchToProps = dispatch => ({
    ...bindActionCreators({
        changeAddRadarFormVisibility,
        addSector,
        deleteSector,
        updateSector,
        fetchRadar,
        changeEditPhenomenaVisibility,
        deleteRadarPhenomenon,
        storePhenomenon,
        getUserGroups,
        refetchRadarData,
        toggleEditMenuVisiblity,
        addPublicPhenomenaToRadar
    }, dispatch),
    setDraggedPhenomenon: phenomenon => dispatch(setDraggedPhenomenon(phenomenon.id || phenomenon.phenomenon_uuid)),
    updatePhenomenon:
        // phenomena do not have ids until placed
        (phenomenon, positionData) => !phenomenon.time
            ? dispatch(createPhenomenonWithPosition(phenomenon, positionData))
            : dispatch(updatePhenomenon(phenomenon, positionData))
})

export default compose(
    Dimensions(),
    Timelines,
    connect(mapStateToProps, mapDispatchToProps)
)(RadarPage)
