import React, { PureComponent } from 'react'
import styled from 'styled-components'
import * as d3 from 'd3'
import _ from 'lodash'
import classNames from 'classnames'
import Text from 'react-svg-text'
import { toast } from 'react-toastify'
import SockJsClient from 'react-stomp'
import {
    AllPhenomena,
    CreateRadarForm,
    AddPhenomenaSandbox,
    ConfirmDialog,
    SignalList,
    SideNav,
    ErrorModal,
    TimeRangeEditorForm,
    Filters
} from '../containers'
import {
    Modal,
    SVGIcon,
    Loading
} from '@sangre-fp/ui'
import SectorEditorForm from './SectorEditorForm'
import EditSectorMenu from './EditSectorMenu'
import Phenomenon from './Phenomenon'
import { getCoordsFromAngleAndRadius, detectLeftButton } from '../helpers'
import { modalStyles, paddingModalStyles } from '@sangre-fp/ui'
import {
    centerRadiusPercentage,
    getWebSocketHeaders,
    timerangeColors,
    radarBorderWidth
} from '../config'
import { PUBLIC_URL, RADAR_DATA_WEBSOCKET_URL } from '../env'
import { requestTranslation } from '@sangre-fp/i18n'
import { PhenomenonEditForm, PhenomenonLoader } from "@sangre-fp/content-editor";

class RadarPage extends PureComponent {
    constructor(props) {
        super(props)
        const { containerWidth, containerHeight, svgDimensions } = props
        const containerSize = Math.min(containerWidth, containerHeight)
        const zoomExtent = (containerSize / svgDimensions) * 0.80
        this.zoom = d3.zoom().scaleExtent([(containerSize / svgDimensions) * 0.50, zoomExtent + 4]).on('zoom', this.zoomed)
        this.state = {
            zoomExtent,
            sectorDescriptionModal: null,
            deleteRadarPhenomenonOpen: false,
            editSector: null,
            editMenuPosition: null,
            zoomTransform: {
                x: 0,
                y: 0,
                k: zoomExtent
            },
            mouseCoords: {
                x: 0,
                y: 0,
                angle: 0,
                radius: 0,
                timeRange: null,
                sector: null,
                time: null
            },
            phenomenaDragged: false
        }
    }

    componentDidMount() {
        const {
            getAuth,
            fetchRadar,
            getPhenomenaTypes,
            getUserGroups,
            radarSettings: {
                existingRadarPage
            }
        } = this.props

        getAuth()
            .then(() => {
                getUserGroups()
                getPhenomenaTypes()
                if (existingRadarPage) {
                    fetchRadar()
                }
            })

        this.attachEvents()
    }

    componentDidUpdate(prevProps) {
        if (this.shouldRadarRender() && !this.shouldRadarRender(prevProps)) {
            this.attachEvents()
        }
    }

    zoomed = () => {
        const { phenomenaDragged } = this.state

        if (!phenomenaDragged && this.isZoomable()) {
            this.setState({ zoomTransform: d3.event.transform })
        }
    }

    attachEvents() {
        const { zoomTransform: { k } } = this.state

        const svg = d3.select(this.svg)
        svg
            .on('touchstart', this.handleMouseAction)
            .on('touchmove', this.handleMouseAction)
            .on('mousemove', this.handleMouseAction)
            .on('touchend', this.onPhenomenaDragEnd)
            .on('click', () => this.props.toggleEditMenuVisiblity(false))
            .call(this.zoom)

        this.zoom.scaleBy(svg, k)
    }

    handleResultsRedirect = () => {
        const { radarSettings: { id } } = this.props
        window.location.href = `${PUBLIC_URL}/node/${id}/results`
    }

    isZoomable = () => !this.isEditorPageOpen()

    hideSectorMenuEdit = () => this.setState({ editMenuPosition: null })

    showSectorEditMenu = ({ pageX, pageY }, sector) => this.setState({
        editMenuPosition: {
            x: pageX,
            y: pageY,
            sector
        }
    })
    handleEditPhenomenonFormClose = () => this.props.changeEditPhenomenaVisibility()

    renderTimelines() {
        const { timeRanges, radius } = this.props

        return (
            <g className={'time-ranges'}>
                <circle r={timeRanges[timeRanges.length - 1].outerRadius + radarBorderWidth} fill={'#F5F5F5'} />
                {timeRanges.slice().reverse().map(({ outerRadius }, index) => {
                    const isLast = index === 0

                    return (
                        <g key={index}>
                            <circle
                                r={outerRadius}
                                fill={timerangeColors(index)}
                                strokeWidth={isLast ? 2 : 0}
                                stroke={'#979797'}
                                strokeDasharray={4}
                            />
                        </g>
                    )}
                )}
                {!timeRanges.length &&
                    <circle r={radius} fill={timerangeColors(4)}/>
                }
            </g>
        )
    }

    renderPhenomena() {
        const {
            radius,
            timeRanges,
            draggedPhenomenon
        } = this.props

        return (
            <AllPhenomena
                radius={radius}
                timeRanges={timeRanges}
                scaled={this.scaled}
                zoomTransform={this.state.zoomTransform}
                onPhenomenaDrag={this.onPhenomenaDrag}
                draggedPhenomenon={draggedPhenomenon}
                getPhenomenaDisplayProps={this.getPhenomenaDisplayProps}
            />
        )
    }

    renderSectors() {
        const { timeRanges, radius } = this.props
        const { mouseCoords: { sector } } = this.state
        const selectedKey = sector ? sector.key : 0
        const fontSize = this.scaled(8.5)
        const { sectors: lastSectors } = _.last(timeRanges)

        return (
            <g className={'sectors'}>
                {timeRanges.map(({ sectors }) => sectors.map(({ key, arc }) => (
                    <path
                        stroke={'transparent'}
                        fill={selectedKey === key ? '#dededf' : 'transparent'}
                        key={key}
                        className={'sector'}
                        d={arc}
                    />
                )))}

                {lastSectors.map(({ id, key, title, startAngle, endAngle, notes }) => {
                    const middleOfSectorAngle = ((startAngle + endAngle) / 2) || 0
                    const offset = fontSize * 5
                    const width = radius * 0.25

                    const [x, y] = getCoordsFromAngleAndRadius(middleOfSectorAngle, radius + offset + radarBorderWidth)

                    return (
                        <g key={`sector-meta-${id}`}>
                            <path
                                key={key}
                                stroke={'#909090'}
                                fill={'#909090'}
                                className={'sector'}
                                strokeWidth='1'
                                strokeDasharray={4}
                                d={d3.radialLine()([[startAngle, 0], [startAngle, radius]])}
                            />
                            <Text
                                x={x}
                                y={y}
                                verticalAnchor={'middle'}
                                className={'sector-label noselect'}
                                width={width}
                                textAnchor='middle'
                                style={{
                                    fontSize: `${fontSize}px`
                                }}
                                onClick={() =>
                                    this.setState({
                                        sectorDescriptionModal: { notes, title }
                                    })
                                }
                            >
                                {title}
                            </Text>
                        </g>
                    )
                })}
            </g>
        )
    }

    renderLogo() {
        const { timeRanges, radius, radarSettings: { radarImage } } = this.props
        const logoRadius = _.first(timeRanges)
            ? _.first(timeRanges).radius
            : radius * centerRadiusPercentage
        const transform = `translate(${-logoRadius}, ${-logoRadius})`

        return (
            <g>
                {!radarImage ? (
                    <circle
                        className='radar-logo'
                        onClick={this.handleResultsRedirect}
                        r={logoRadius}
                        fill={'#126995'}
                    />
                ) : (
                    <foreignObject
                        className='radar-logo'
                        onClick={this.handleResultsRedirect}
                        width={logoRadius * 2}
                        height={logoRadius * 2}
                        transform={transform}
                    >
                        <img
                            alt='logo'
                            src={radarImage}
                            style={{
                                width: logoRadius * 2,
                                height: logoRadius * 2,
                                borderRadius: '50%',
                                objectFit: 'cover'
                            }}
                        />
                    </foreignObject>
                )}
            </g>
        )
    }

    getTimerangeLabelPath(radius) {
        return `
            M 0, 0
            m -${radius}, 0
            a ${radius},${radius} 0 1,0 ${(radius) * 2},0
        `
    }

    renderTimelineTooltip() {
        const { timelines, timeRanges, radarSettings: { timelineLabelFormat } } = this.props
        const { scaled } = this
        const fontSize = scaled(9)
        const strokeWidth = scaled(4)
        const tooltipHeight = scaled(16.5)

        return (
            <g className={'timeline'}>
                {timeRanges.map((timeRange, index) => {
                    const isLast = index === timeRanges.length - 1
                    const tooltipY = timeRange.radius
                    const {
                        description,
                        startYear,
                        endYear,
                        outerRadius,
                        label,
                        radius
                    } = timeRange
                    const line = d3.radialLine()([[Math.PI, radius + tooltipHeight], [Math.PI, outerRadius]])

                    return (
                        <g key={`tooltips-${index}`}>
                            <path d={line} stroke={'#8d8e92'} strokeWidth={strokeWidth} />
                            {(!timeRange.isPlaceholder) && (
                                <g>
                                    <g>
                                        <path
                                            d={this.getTimerangeLabelPath(tooltipY + tooltipHeight)}
                                            id={`timerange-label-${index}`}
                                            fill="transparent"
                                            style={{ pointerEvents: 'none' }}
                                        />
                                        <text
                                            dy={-tooltipHeight / 4}
                                            className={'hoverable timeline-label-text noselect'}
                                            style={{ fontSize: `${fontSize}px` }}
                                            onClick={() =>
                                                this.setState({
                                                    sectorDescriptionModal: {
                                                    notes: description,
                                                    title: timelineLabelFormat ? label : startYear
                                                }}
                                            )}
                                        >
                                            <textPath xlinkHref={`#timerange-label-${index}`} textAnchor="middle" startOffset="50%">
                                                {timelineLabelFormat ? label : startYear}
                                            </textPath>
                                        </text>
                                    </g>
                                    {isLast && (
                                        <g>
                                            <path
                                                id='timerange-label-last'
                                                d={this.getTimerangeLabelPath(outerRadius + tooltipHeight)}
                                                fill={'transparent'}
                                                style={{ pointerEvents: 'none' }}
                                            />
                                            <text
                                                dy={-tooltipHeight / 4}
                                                className={'hoverable timeline-label-text noselect'}
                                                style={{ fontSize: `${fontSize}px` }}
                                                onClick={() => {
                                                    this.setState({
                                                        sectorDescriptionModal: {
                                                            notes: timelines[timelines.length - 1].description,
                                                            title: timelineLabelFormat ? timelines[timelines.length - 1].label : endYear
                                                        }
                                                    })
                                                }}
                                            >
                                                <textPath xlinkHref={`#timerange-label-last`} textAnchor="middle" startOffset="50%">
                                                    {timelineLabelFormat ? timelines[timelines.length - 1].label : endYear}
                                                </textPath>
                                            </text>
                                        </g>
                                    )}
                                </g>
                            )}
                        </g>
                    )
                })}
            </g>
        )
    }

    shouldRadarRender(props = this.props) {
        const { timeRanges } = props

        return timeRanges.length !== 0 && !this.isEditorPageOpen(props)
    }

    renderRadar = () => {
        const { containerWidth, containerHeight } = this.props
        const { zoomTransform: { x, y, k } } = this.state
        const classes = classNames({
            'zoomed-out': k < 0.25,
            'zoomed-out-far': k < 0.15
        })

        return this.shouldRadarRender() && (
            <svg ref={this.svgRef}
                 height={containerHeight}
                 width={containerWidth}
                 className={classes}>
                <g className='zoom-control' transform={`translate(${x}, ${y}) scale(${k})`}>
                    <g ref={this.radarRef}
                       transform={`translate(${containerWidth / 2}, ${containerHeight / 2})`}>
                        {this.renderTimelines()}
                        {this.renderSectors()}
                        {this.renderTimelineTooltip()}
                        {this.renderLogo()}
                        {this.renderPhenomena()}
                        {this.renderDragMarker()}
                    </g>
                </g>
            </svg>
        )
    }

    renderMenuLink = (x, y, onClick, radius = this.scaled(25), fontSize = this.scaled(14)) => (
        <g key={x + y} onClick={onClick} className={'tooltip-edit'}>
            <circle r={radius / 2} cx={x} cy={y} fill={'#126995'} stroke={'none'}/>
            <SVGIcon x={x} y={y} fontSize={fontSize} icon={'edit'}/>
        </g>
    )

    renderEditabilityTooltip = (sector, index, offset) => {
        const middleOfSectorAngle = ((sector.startAngle + sector.endAngle) / 2) || 0
        const toolTipOffset = Math.min(offset * 0.15, 100)
        const [x, y] = getCoordsFromAngleAndRadius(middleOfSectorAngle, offset - toolTipOffset)

        return this.renderMenuLink(x, y, e => this.showSectorEditMenu(e, sector))
    }

    renderSectorEditor = () => {
        const { containerWidth, containerHeight, timeRanges, radius, updateSector, radarSettings: { editSectorsPageOpen }, canEditRadar } = this.props

        if (!canEditRadar) {
            return null
        }

        const { sectors: lastSectors, outerRadius: lastRadius } = _.last(timeRanges)
        const { editSector, zoomExtent } = this.state
        const transform = `translate(${containerWidth / 2}, ${containerHeight / 2}) scale(${zoomExtent})`

        return editSectorsPageOpen && (
            <div>
                <Modal
                    isOpen={!!editSector}
                    onRequestClose={() => {
                        this.setState({ editSector: null })
                    }}
                    contentLabel='Sector settings'
                    style={modalStyles}
                    ariaHideApp={false}
                >
                    <SectorEditorForm
                        sector={editSector}
                        onClose={() => {
                            this.setState({ editSector: null })
                        }}
                        updateSector={updateSector}
                    />
                </Modal>
                <svg height={containerHeight} width={containerWidth} fill='black'>
                    <g transform={transform}>
                        <circle stroke={'#D9D9D9'}
                                fill={'rgb(15, 19, 24)'}
                                r={lastRadius}/>
                        {this.renderSectors()}
                        {lastSectors.map((sector, index) =>
                            this.renderEditabilityTooltip(
                                sector,
                                index,
                                lastRadius
                            )
                        )}
                        {!lastSectors.length &&
                        this.renderEditabilityTooltip({}, 1, radius)
                        }
                    </g>
                </svg>
            </div>
        )
    }

    isEditorPageOpen(props = this.props) {
        const {
            radarSettings: {
                editSectorsPageOpen
            }
        } = props

        return editSectorsPageOpen
    }

    scaled = value => {
        const { zoomExtent, zoomTransform: { k } } = this.state

        if (!this.isZoomable()) {
            return value / (zoomExtent / 1.4)
        }

        const divisor = Math.max(k, 0.25)

        return value / (divisor / 1.4)
    }

    onPhenomenaDrag = (e, phenomenon, newlyCreated = false) => {
        const { setDraggedPhenomenon, canEditRadar } = this.props

        if (e) {
            e.stopPropagation()
        }

        if (
            newlyCreated
            || (detectLeftButton(e) && e)
            || ('ontouchstart' in document.documentElement)
            || ('ontouchstart' in window)
        ) {
            this.setState({
                updatingPhenomena: phenomenon
            })

            this.longpressTimeout = setTimeout(() => {
                if (canEditRadar) {
                    this.setState({ phenomenaDragged: true })
                    setDraggedPhenomenon(phenomenon)
                }
            }, 650)

            document.addEventListener('mouseup', this.onPhenomenaDragEnd)
            document.addEventListener('touchend', this.onPhenomenaDragEnd)
            document.addEventListener('touchcancel', this.onPhenomenaDragEnd)
            document.addEventListener('pointerup', this.onPhenomenaDragEnd)
            // safari fix for when adding phenom
            document.addEventListener('click', this.onPhenomenaDragEnd)
        }
    }

    handleMouseAction = () => {
        const { timeRanges, radius: radarRadius } = this.props
        d3.event.preventDefault()

        if (!this.isEditorPageOpen()) {
            const [x, y] = d3.mouse(this.radar)
            const radians = Math.atan2(y, x)
            const angle = radians < (Math.PI / 2) ? radians + (Math.PI * 2.5) : radians + (Math.PI * 0.5)
            const radius = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
            const isOutside = radius > radarRadius
            const timeRange = _.find(timeRanges, ({ radius: innerRadius, outerRadius }) => radius >= innerRadius && radius < outerRadius)
            const sector = timeRange && _.find(timeRange.sectors, ({ startAngle, endAngle }) => angle >= startAngle && angle < endAngle)
            const outerTimeRange = isOutside ? _.last(timeRanges) : _.first(timeRanges)
            const boundaryRadius = isOutside ? outerTimeRange.outerRadius : outerTimeRange.radius
            const boundaryTime = isOutside ? outerTimeRange.endYear + 0.00001 : outerTimeRange.startYear + 0.00001
            const outerSector = _.find(outerTimeRange.sectors, ({ startAngle, endAngle }) => angle >= startAngle && angle < endAngle)
            const time = timeRange && timeRange.scale.invert(radius)
            const xOffset = sector ? d3.scaleLinear()
                .range([0, 1])
                .domain([sector.startAngle, sector.endAngle])
                .interpolate(d3.interpolate)(angle) : 0.5

            this.setState({
                mouseCoords: {
                    x,
                    y,
                    isOutside,
                    xOffset,
                    angle,
                    radius,
                    timeRange,
                    sector,
                    time,
                    outerSector,
                    boundaryTime,
                    boundaryRadius
                }
            })
        }
    }

    onPhenomenaDragEnd = e => {
        const { updatePhenomenon, setDraggedPhenomenon, draggedPhenomenon: phenomenon } = this.props
        if (this.longpressTimeout) {
            clearTimeout(this.longpressTimeout)
        }

        if (phenomenon) {
            const { mouseCoords: { time, angle, sector, xOffset } } = this.state
            const deleting = !sector

            if (deleting) {
                this.setState({ deleteRadarPhenomenonOpen: phenomenon })
            } else {
                updatePhenomenon(phenomenon, {
                    sectorId: sector.id,
                    xOffset,
                    time,
                    angle
                })
            }

            this.setState({ phenomenaDragged: false })
            setDraggedPhenomenon(false)

            if (e) {
                e.preventDefault()
                e.stopPropagation()
            }
        }

        if (e && ('ontouchstart' in document.documentElement || 'ontouchstart' in window)) {
            e.preventDefault()
            e.stopPropagation()
        }

        document.removeEventListener('mouseup', this.onPhenomenaDragEnd)
        document.removeEventListener('pointerup', this.onPhenomenaDragEnd)
        document.removeEventListener('touchcancel', this.onPhenomenaDragEnd)
        document.removeEventListener('touchend', this.onPhenomenaDragEnd)
        document.removeEventListener('click', this.onPhenomenaDragEnd)
    }

    svgRef = ref => this.svg = ref
    radarRef = ref => this.radar = ref

    getPhenomenaDisplayProps = () => {
        const { radius, phenomenaTypesById } = this.props
        // this can't be scaled due to react-svg-text calculation mechanisms
        const labelWidth = radius * 0.25
        const labelHeight = this.scaled(30)
        const phenomenaSize = this.scaled(21)
        const iconSize = this.scaled(21)
        const fontSize = this.scaled(8)

        return { labelWidth, labelHeight, phenomenaSize, iconSize, fontSize, phenomenaTypesById }
    }

    getDragCoords() {
        const {
            mouseCoords: { sector, x, y, outerSector = {}, boundaryRadius }
        } = this.state
        const { endAngle, startAngle } = outerSector

        return !sector ? getCoordsFromAngleAndRadius(
            startAngle + ((endAngle - startAngle) / 2),
            boundaryRadius
        ) : [x, y]
    }

    renderDragMarker() {
        const { draggedPhenomenon } = this.props

        if (draggedPhenomenon) {
            if (!this.phenomenaDisplayProps) {
                this.phenomenaDisplayProps = this.getPhenomenaDisplayProps()
            }

            const { mouseCoords: { sector } } = this.state
            const [cx, cy] = this.getDragCoords()

            return (
                <Phenomenon
                    cx={cx}
                    cy={cy}
                    phenomenon={draggedPhenomenon}
                    deleting={!sector}
                    dragged={true}
                    {...this.phenomenaDisplayProps}
                    scaled={this.scaled}
                />
            )
        } else if (this.phenomenaDisplayProps) {
            this.phenomenaDisplayProps = null
        }
        return null
    }

    renderEditPhenomenonForm() {
        const {
            radarSettings: { editPhenomenaVisible, id, group, radarLanguage },
            storePhenomenon,
        } = this.props

        return (
            <Modal isOpen={!!editPhenomenaVisible}
                   contentLabel={'Edit phenomena'}
                   style={modalStyles}
                   onRequestClose={this.handleEditPhenomenonFormClose}
                   ariaHideApp={false}>
                {editPhenomenaVisible && (
                    <PhenomenonLoader uuid={editPhenomenaVisible.uuid} group={editPhenomenaVisible.group}>
                        {({ loading, error, phenomenon }) => {
                            if (loading) {
                                return <div className="py-5 text-center">Loading...</div>
                            }

                            if (error) {
                                return <div className="py-5 text-center text-danger">{error.message}</div>
                            }

                            return (
                                <PhenomenonEditForm
                                    phenomenon={phenomenon}
                                    onSubmit={(values, newsFeedChanges) => {
                                        storePhenomenon(values, newsFeedChanges, this.handleEditPhenomenonFormClose)
                                    }}
                                    onCancel={this.handleEditPhenomenonFormClose}
                                    onDelete={() => {}}
                                    radar={{
                                        id,
                                        groupId: group.id,
                                        language: radarLanguage
                                    }}
                                />
                            )
                        }}
                    </PhenomenonLoader>
                )}
            </Modal>
        )
    }

    handleWebsocketUpdate = update => {
        const { radarSettings: { radar_version }, refetchRadarData } = this.props

        if (update.radar_version !== radar_version) {
            refetchRadarData()
                .then(() => toast(requestTranslation('radarUpdated')))
        }
    }

    renderSockJsClient() {
        const { account, id } = this.props.radarSettings

        return account && id && (
            <SockJsClient
                url={RADAR_DATA_WEBSOCKET_URL}
                topics={[`/topic/radar/${id}`]}
                onMessage={update => setTimeout(function() {
                    this.handleWebsocketUpdate(update)
                }.bind(this), 500)}
                headers={getWebSocketHeaders()}
            />
        )
    }

    renderBottomLeftNav() {
        const { isVisitor, radarSettings: { editSectorsPageOpen } } = this.props

        return !editSectorsPageOpen && !isVisitor && <Filters />
    }

    renderTitle() {
        const { radarName, groups, group, titleLogo } = this.props.radarSettings
        const renderTitleLogoInput = _.find(groups, ({ value }) => Number(value) === Number(group.id))

        return renderTitleLogoInput && renderTitleLogoInput.radarLogoEnabled && titleLogo
            ?
            (<RadarTitleLogo src={titleLogo} />)
            :
            (<RadarTitle id='radar-title-left'>{radarName}</RadarTitle>)
    }


    // this really needs to be rewritten
    renderEditSectorMenu() {
        const { editMenuPosition } = this.state
        const { timeRanges, addSector, deleteSector } = this.props

        return editMenuPosition && (
            <EditSectorMenu
                timeranges={timeRanges}
                handleEditSectorForm={() => {
                    this.setState({ editSector: editMenuPosition.sector })
                    this.hideSectorMenuEdit()
                }}
                y={editMenuPosition.y}
                x={editMenuPosition.x}
                sector={editMenuPosition.sector}
                onClose={this.hideSectorMenuEdit}
                deleteSector={sectorId => {
                    deleteSector(sectorId)
                    this.hideSectorMenuEdit()
                }}
                addSector={(direction, sectorId) => {
                    addSector(direction, sectorId)
                    this.hideSectorMenuEdit()
                }}
            />
        )
    }

    renderCreateRadarModal() {
        const {
            changeAddRadarFormVisibility,
            radarSettings: {
                addRadarFormOpen,
                id,
            }
        } = this.props

        return (
            <Modal
                isOpen={addRadarFormOpen}
                contentLabel='Radar settings'
                style={modalStyles}
                ariaHideApp={false}
                onRequestClose={id ? () => changeAddRadarFormVisibility() : null}
            >
                <CreateRadarForm />
            </Modal>
        )
    }

    renderSectorDescriptionModal() {
        const { sectorDescriptionModal } = this.state

        return (
            <Modal
                isOpen={!!sectorDescriptionModal}
                contentLabel='Sector description'
                onRequestClose={() => this.setState({ sectorDescriptionModal: null })}
                style={modalStyles}
                ariaHideApp={false}
            >
                {!!sectorDescriptionModal &&
                    <div>
                        <div className='modal-form-sections'>
                            <div className='modal-form-section modal-form-header'>
                                <h2>{sectorDescriptionModal.title}</h2>
                            </div>
                            <div className='modal-form-section'>
                                <div
                                    dangerouslySetInnerHTML={{ __html: sectorDescriptionModal.notes }}
                                />
                            </div>
                        </div>

                        <div className='modal-form-section modal-form-actions pt-0'>
                            <div
                                onClick={() => this.setState({ sectorDescriptionModal: null })}
                                className='btn btn-lg btn-primary'
                            >
                                {requestTranslation('close')}
                            </div>
                        </div>
                    </div>
                }
            </Modal>
        )
    }

    renderDeleteRadarPhenomenonModal() {
        const { deleteRadarPhenomenonOpen } = this.state
        const { deleteRadarPhenomenon } = this.props

        return (
            <Modal
                isOpen={!!deleteRadarPhenomenonOpen}
                contentLabel='Delete phenomena from radar'
                style={paddingModalStyles}
                className={'paddedModal'}
                ariaHideApp={false}
            >
                <div className={'confirmation-modal-content'}>
                    <h3 className={'confirmation-modal-title'}>
                        {requestTranslation('deletePhenomenaDoubleCheck')}
                    </h3>
                    <div className={'confirmation-modal-actions'}>
                        <button className='btn btn-lg btn-plain-gray'
                                onClick={() => {
                                    if (deleteRadarPhenomenonOpen.time) {
                                        this.setState({ deleteRadarPhenomenonOpen: false })
                                    } else {
                                        deleteRadarPhenomenon(
                                            deleteRadarPhenomenonOpen, () => this.setState({ deleteRadarPhenomenonOpen: false })
                                        )
                                    }
                                }}>
                            {requestTranslation('cancel')}
                        </button>
                        <button
                            className='btn btn-lg btn-primary'
                            onClick={() =>
                                deleteRadarPhenomenon(deleteRadarPhenomenonOpen, () => this.setState({ deleteRadarPhenomenonOpen: false }))
                            }
                        >
                            {requestTranslation('delete')}
                        </button>
                    </div>
                </div>
            </Modal>
        )
    }

    render() {
        const { loading } = this.props

        return (
            <Container style={{ pointerEvents: loading.length ? 'none' : 'all' }}>
                <Loading shown={loading.length} color={'white'}/>
                {this.renderTitle()}
                {this.renderBottomLeftNav()}
                <SideNav />
                {this.renderEditSectorMenu()}
                {this.renderRadar()}
                {this.renderSectorEditor()}
                <SignalList />
                <AddPhenomenaSandbox onPhenomenaDrag={this.onPhenomenaDrag} />
                <TimeRangeEditorForm radarWidth={this.svg && this.svg.width.baseVal.value} />
                {this.renderEditPhenomenonForm()}
                {this.renderSockJsClient()}
                {this.renderCreateRadarModal()}
                {this.renderSectorDescriptionModal()}
                {this.renderDeleteRadarPhenomenonModal()}
                <ConfirmDialog />
                <ErrorModal />
            </Container>
        )
    }
}

const RadarTitle = styled.h1`
    color: white;
    position: absolute;
    top: 25px;
    left: 25px;
    margin: 0;
    text-shadow: 1.5px 1.5px 0 rgba(0, 0, 0, .2);
    max-width: 250px;
`

const Container = styled.div`
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: black;
    display: flex;
    align-items: center;
    justify-content: center;
`

const RadarTitleLogo = styled.img`
    height: 85px;
    width: auto;
    object-fit: contain;
    position: absolute;
    top: 25px;
    left: 25px;
`

export default RadarPage
