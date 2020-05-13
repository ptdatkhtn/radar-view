import React, { PureComponent } from 'react'
import * as d3 from 'd3'
import Phenomenon from './Phenomenon'
import { getCoordsFromAngleAndRadius } from '../helpers'
import isEqual from 'lodash/isEqual'

const getConstrainedValue = ([min, max], value) => {
    if (value < min) {
        return min
    }
    if (value > max) {
        return max
    }
    return value
}

export default class Phenomena extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            nodes: this.copyPhenomena()
        }
    }

    // TODO check if this should be variable based on the actual sector size
    range = [0, 100]
    copyPhenomena = (phenomena = this.props.phenomena) => {
        const { sector: { constraints } } = this.props
        this.xScale = d3.scaleLinear().domain(constraints.angle).range(this.range)
        this.yScale = d3.scaleLinear().domain(constraints.radius).range(this.range)
        return phenomena.map(({ angle, radius, size }, index) => ({
            index,
            x: this.xScale(angle),
            y: this.yScale(radius),
            fy: this.yScale(radius),
            size
        }))
    }

    startForce = () => {
        // const {centroid} = this.props
        // const [x, y] = centroid
        const { nodes } = this.state

        if (this.force) {
            this.force.stop()
        }

        if (nodes.length > 1) {
            this.force =
                d3.forceSimulation(nodes)
                // TODO check if forceCollide or distanceMin could be used to prevent overlays
                    .force('charge', d3
                            .forceManyBody()
                            .strength(-5)
                            // TODO check scaling distances based on the actual arc length
                            .distanceMax(this.range[1] / nodes.length)
                        // TODO check scaling distanceMin based on the actual arc length
                        // .distanceMin(d => d.size)
                    )
                    // TODO check scaling radius based on the actual arc length
                    // .force('collision', d3.forceCollide().radius(d => d.size))
                    .on('tick', () => {
                        // eslint-disable-next-line
                        nodes.map(node => {
                            node.x = getConstrainedValue(this.range, node.x)
                            node.y = getConstrainedValue(this.range, node.y)
                        })
                        this.setState({ nodes: nodes.slice() })
                    })
        }
    }

    componentDidMount() {
        this.startForce()
    }

    componentWillReceiveProps(nextProps) {
        const { phenomena: nextPhenomena } = nextProps
        const { phenomena } = this.props

        if (!isEqual(nextPhenomena, phenomena)) {
            this.setState({ nodes: this.copyPhenomena(nextPhenomena) }, this.startForce)
        }
    }

    componentWillUnmount() {
        if (this.force) {
            this.force.stop()
        }
    }

    getNodeCoordinates = (index) => {
        const { nodes } = this.state

        const node = nodes[index]

        const angle = this.xScale.invert(node.x)
        const radius = this.yScale.invert(node.y)

        const [cx, cy] = getCoordsFromAngleAndRadius(angle, radius)

        return { cx, cy }
    }

    render() {
        const { phenomena, draggedPhenomenon, phenomenaDisplayProps } = this.props

        return (
            <g>
                {phenomena.map((phenomenon, index) => {
                    const { id } = phenomenon
                    const dragged = draggedPhenomenon
                        && draggedPhenomenon.id === id

                    return (
                        <Phenomenon
                            {...this.props}
                            {...this.getNodeCoordinates(index)}
                            key={index}
                            hidden={dragged}
                            phenomenon={phenomenon}
                            {...phenomenaDisplayProps}
                        />
                    )
                })}
            </g>
        )
    }
}
