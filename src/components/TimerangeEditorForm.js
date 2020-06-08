import _ from 'lodash'
import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { Range, Handle } from 'rc-slider'
import Select from 'react-select'
import Draggable from 'react-draggable'
import { requestTranslation } from '@sangre-fp/i18n'
import {
    Z_INDEX_MODAL,
    Checkbox,
    MaterialIcon,
    Modal,
    paddingModalStyles,
    ModalContainer,
    BorderTitleContainer as Container
} from '@sangre-fp/ui'
import { createGlobalStyle } from 'styled-components'
import ReactQuill from 'react-quill'
import {
    customQuillModules,
    RANGE_MIN,
    RANGE_MAX,
    RANGE_BOUNDARY,
    TIMELINE_TEMPLATE,
    MAX_TIMELINES
} from '../config'
import { formats } from '../quill'
import { roundToX } from '../actions/timelines'

const MODAL_WIDTH = 300
const MODAL_TO_RADAR_MARGIN = 37

export default class SectorEditorForm extends PureComponent {
    state = {
        // timerangeEditModal is either timeline to edit, false or new timeline template
        timerangeEditModal: false,
        updateTimerangeBlock: false,
        oldPositions: this.props.timelines.map(({ year }) => year)
    }

    calculateModalDisplacement = () => {
        const { radarWidth } = this.props

        if (!radarWidth) {
            return MODAL_TO_RADAR_MARGIN + 'px'
        }

        const windowWidth = window.innerWidth
        const availableWidth = (windowWidth - radarWidth) / 2

        if (availableWidth > MODAL_WIDTH + MODAL_TO_RADAR_MARGIN * 2) {
            return availableWidth - (MODAL_WIDTH + MODAL_TO_RADAR_MARGIN) + 'px'
        }

        return MODAL_TO_RADAR_MARGIN + 'px'
    }

    cancelEvents = e => {
        e.preventDefault()
        e.stopPropagation()
        this.blurHandles()
    }

    handleDescriptionChange = value => {
        const { timerangeEditModal } = this.state

        this.setState({
            timerangeEditModal: {
                ...timerangeEditModal,
                description: value
            }
        })
    }

    handleYearChange = ({ target }) => {
        const { timerangeEditModal } = this.state

        this.setState({
            timerangeEditModal: {
                ...timerangeEditModal,
                year: Number(target.value) ? Number(target.value) : ''
            }
        })
    }

    handleLabelChange = ({ target }) => {
        const { timerangeEditModal } = this.state

        this.setState({
            timerangeEditModal: {
                ...timerangeEditModal,
                label: target.value
            }
        })
    }


    handleLabelPositionChange = ({ value, year }) => {
        const { timerangeEditModal } = this.state

        this.setState({
            timerangeEditModal: {
                ...timerangeEditModal,
                position: value,
                year
            }
        })
    }

    generateLabelPositionOptions = () => {
        const { timelines } = this.props

        return timelines.map(({ label }, index) => {
            if (index < timelines.length - 1) {
                const nextPosition = Number(timelines[index + 1].position)
                const position = roundToX((Number(timelines[index].position) + nextPosition) / 2, 2)
                const year = Math.round((Number(timelines[index].year) + Number(timelines[index + 1].year)) / 2)

                return { label: requestTranslation('afterLabel', label), value: position, year }
            }

            return null
        }).filter(option => option)
    }

    validateTimerangeInput = () => {
        const { timerangeEditModal: { year, id } } = this.state
        const { timelines, timelineLabelFormat } = this.props

        const firstYear = Number(timelines[0].year)
        const lastYear = Number(timelines[timelines.length - 1].year)

        if (!id) {

            if (timelines.length >= MAX_TIMELINES) {
                return requestTranslation('timerangeAmountError')
            }

            if (!timelineLabelFormat && (!year || isNaN(year) || (year <= firstYear || year >= lastYear))) {

                return requestTranslation('timerangeBoundaryError', ({ firstYear, lastYear }) )
            }

            if (_.find(timelines, [ 'year', Number(year) ])) {


                return timelineLabelFormat ? requestTranslation('consecutiveYearError') : requestTranslation('timerangeExistsError')
            }

            let newTimelines = [...timelines]
            const timeline = this.state.timerangeEditModal

            if (!timeline || (timelineLabelFormat && !timeline.position)) {
                return true
            }

            const newTimelineIndex = timelineLabelFormat ? _.sortedIndexBy(timelines, timeline, 'position') : _.sortedIndexBy(timelines, timeline, 'year')
            newTimelines.splice(newTimelineIndex, 0, timeline)

            const nextTimeline = newTimelines[newTimelineIndex + 1]
            const previousTimeline = newTimelines[newTimelineIndex - 1]

            if (Number(nextTimeline.position) - Number(previousTimeline.position) < RANGE_BOUNDARY * 2) {
                return requestTranslation('timerangeSpaceError', ({ previousYear: timelineLabelFormat ? `'${previousTimeline.label}'` : previousTimeline.year, nextYear: timelineLabelFormat ? `'${nextTimeline.label}'` : nextTimeline.year }))
            }
        }

        if (id) {
            if (!year || isNaN(year)) {
                return requestTranslation('timerangeError', ({ firstYear, lastYear }) )
            }

            const index = _.findIndex(timelines, { id })
            const previousTimeline = timelines[index - 1]
            const nextTimeline = timelines[index + 1]

            if (nextTimeline && year >= nextTimeline.year) {
                return requestTranslation('timerangeSmallerYearError', nextTimeline.year)
            }

            if (previousTimeline && year <= previousTimeline.year) {
                return requestTranslation('timerangeLargerYearError', previousTimeline.year)
            }

            // if (year < 2018) {
            //     return requestTranslation('timerangeCurrentYearError', 2018)
            // }

        }

        return false
    }

    resetTimerangeEditModal = () => this.setState({ timerangeEditModal: false })

    renderTimeRangeModal = () => {
        const { timerangeEditModal } = this.state
        const { addTimeline, updateTimerange, timelineLabelFormat } = this.props
        const edit = timerangeEditModal.id
        const disabledText = this.validateTimerangeInput()
        const options = this.generateLabelPositionOptions()

        return timerangeEditModal && (
            <Modal
                isOpen={true}
                onRequestClose={() => this.setState({ timerangeEditModal: false})}
                contentLabel='Timerange editor'
                ariaHideApp={false}
                style={paddingModalStyles}
            >
                <ModalContainer>
                    <h2>
                        {edit ?
                            requestTranslation('editTimerange')
                            :
                            requestTranslation('addTimerange')
                        }
                    </h2>
                    {timelineLabelFormat ?
                        (
                            <div className='mb-4 d-flex w-100 align-items-center justify-content-between'>
                                <div style={{ width: '35%' }}>
                                    <h3>{requestTranslation('label')}</h3>
                                    <LabelInput
                                        maxLength={35}
                                        value={timerangeEditModal.label}
                                        onChange={this.handleLabelChange}
                                        placeholder={requestTranslation('typeLabel')}
                                    />
                                </div>
                                {!edit && (
                                    <div style={{ width: '35%' }}>
                                        <h3>{requestTranslation('labelPosition')}</h3>
                                        <Select
                                            searchable={false}
                                            clearable={false}
                                            name='position'
                                            className='fp-radar-select w-100 h-100'
                                            value={timerangeEditModal.position}
                                            onChange={this.handleLabelPositionChange}
                                            options={options.length ? options : []}
                                        />
                                    </div>
                                )}
                            </div>
                        )
                    :
                        (
                            <div>
                                <h3>{requestTranslation('year')}</h3>
                                <InputContainer className='mb-4'>
                                    <YearInput
                                        onChange={this.handleYearChange}
                                        value={timerangeEditModal.year}
                                        maxLength={4}
                                    />
                                </InputContainer>
                            </div>
                        )
                    }
                    <p>{disabledText}</p>
                    <h3>{requestTranslation('description')}</h3>
                    <ReactQuill
                        className='fp-wysiwyg'
                        style={{ height: '250px', paddingBottom: '42px' }}
                        modules={customQuillModules}
                        onChange={this.handleDescriptionChange}
                        formats={formats}
                        value={timerangeEditModal.description || ''}
                    />
                    <div className={'confirmation-modal-actions d-flex justify-content-end mt-4'}>
                        <button className='btn btn-lg btn-plain-gray'
                                onClick={this.resetTimerangeEditModal}>
                            {requestTranslation('cancel')}
                        </button>
                        <button
                            className='btn btn-lg btn-primary'
                            disabled={!!disabledText}
                            onClick={() =>
                                edit ?
                                    updateTimerange(timerangeEditModal, this.resetTimerangeEditModal)
                                    :
                                    addTimeline(timerangeEditModal, this.resetTimerangeEditModal)
                                }
                        >
                            {edit ? requestTranslation('edit') : requestTranslation('add')}
                        </button>
                    </div>
                </ModalContainer>
            </Modal>
        )
    }


    renderHandles = handleProps => {
        const {
            timelines,
            toggleConfirmationDialog,
            removeTimeline,
            timelineLabelFormat
        } = this.props
        const { index, dragging } = handleProps
        const isDisabled = index === 0 || index === timelines.length - 1
        const { year, label } = timelines[index]

        return (
            <Handle
                key={year}
                {...handleProps}
                dragging={dragging.toString()}
                disabled={isDisabled}
                style={{ zIndex: timelines.length - index }}
            >
                {isDisabled ?
                    <DragIconContainer />
                :
                    <DragIconContainer border>
                        <MaterialIcon color={'#0A6996'}>
                                unfold_more
                        </MaterialIcon>
                    </DragIconContainer>
                }
                <div className='pl-2 trunctuate'>{timelineLabelFormat ? label : year}</div>
                <div
                    className='ml-auto dropdown show dropdown-toggle h-100'
                    href='#'
                    role="button"
                    data-toggle="dropdown"
                    id="dropdownMenuLink"
                    onMouseDown={this.cancelEvents}
                    onClick={this.cancelEvents}
                    onMouseUp={this.cancelEvents}
                >
                    <button
                        className='btn btn-link h-100 w-100 d-flex align-items-center justify-content-center pl-2 pr-2'
                        onMouseDown={this.cancelEvents}
                        onClick={this.cancelEvents}
                        onMouseUp={this.cancelEvents}
                    >
                        <MaterialIcon
                            color={'#0A6996'}
                            onMouseDown={this.cancelEvents}
                            onClick={this.cancelEvents}
                            onMouseUp={this.cancelEvents}
                        >
                            more_horiz
                        </MaterialIcon>
                    </button>
                    <div
                        className='dropdown-menu'
                        aria-labelledby="dropdownMenuLink"
                    >
                        <div
                            className='dropdown-item'
                            onMouseDown={e => {
                                this.cancelEvents(e)

                                this.setState({ timerangeEditModal: timelines[index] })
                            }}
                        >
                            {requestTranslation('edit')}
                        </div>
                        {!isDisabled &&
                            <div
                                className='dropdown-item'
                                onMouseDown={e => {
                                    this.cancelEvents(e)
                                    toggleConfirmationDialog({
                                        title: requestTranslation('timelineDeleteTitle', timelineLabelFormat ? label : year),
                                        text: requestTranslation('timelineDeleteSubtitle'),
                                        callback: () => removeTimeline(timelines[index])
                                    })
                                }}
                            >
                                {_.upperFirst(_.toLower(requestTranslation('delete')))}
                            </div>
                        }
                    </div>
                </div>
            </Handle>
        )
    }

    savePreviousPosition = positions => this.setState({ oldPositions: positions })

    // this is needed because we're preventing bubbling when clicking on the dropdown
    // in the custom handle. Without this the handle would still be focused after selecting an action
    // and clicking anywhere else after would move said handle.
    blurHandles = () => {
        const handles = document.getElementsByClassName('rc-slider-handle')

        for (let i = 0; i < handles.length - 1; i++) {
            handles[i].blur()
        }
    }

    isMobileDevice() {
        return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
    }

    render() {
        const {
            editTimeRangesPageOpen,
            toggleConfirmationDialog,
            timerangePageHandler,
            timelines,
            updateTimelinePositions,
            updateTimerangePosition,
            timelineLabelFormat,
            updateRadar,
            toggleLabelMode
        } = this.props
        const { oldPositions, updateTimerangeBlock } = this.state

        if (!editTimeRangesPageOpen || !timelines.length) {
            return null
        }

        return (
            <Draggable handle=".handle">
                <TimeRangeEditorContainer
                    left={this.calculateModalDisplacement}
                    className='d-flex flex-column'
                    style={{ height: this.isMobileDevice() ? '40vh' : '75vh'}}
                >
                    <RangeStyles />
                    <button className={'btn-close-modal'} onClick={timerangePageHandler}>
                        <i className='material-icons'>close</i>
                    </button>
                    <Container className='flex-shrink-0 handle' style={{ cursor: 'move' }}>
                        <h3 className='radar-widget-title mb-0'>{requestTranslation('timelineEditor')}</h3>
                    </Container>
                    <Container className='pt-5 h-100 d-flex flex-column' style={{ paddingBottom: '50px' }}>
                        <Range
                            key={timelines.length}
                            min={RANGE_MIN}
                            max={RANGE_MAX}
                            value={timelines.map(({ position }) => position )}
                            handle={this.renderHandles}
                            onBeforeChange={this.savePreviousPosition}
                            onChange={updateTimelinePositions}
                            // https://github.com/ant-design/ant-design/issues/13628
                            onAfterChange={newPositions => {
                                this.setState({ updateTimerangeBlock: !updateTimerangeBlock }, () => {
                                    updateTimerangePosition(newPositions, oldPositions)
                                    this.blurHandles()
                                })
                            }}
                            vertical={true}
                            allowCross={false}
                            pushable={RANGE_BOUNDARY}
                            step={RANGE_MAX / 100}
                            reverse
                        />
                        <button
                            className='btn btn-outline-secondary w-100 flex-shrink-0 position-relative'
                            style={{ top: '25px' }}
                            onClick={() => this.setState({ timerangeEditModal: TIMELINE_TEMPLATE })}
                        >
                            {requestTranslation('addTimelineButton')}
                        </button>
                    </Container>
                    <Container className='flex-shrink-0'>
                        <Checkbox
                            label={requestTranslation('toggleTimelineMode')}
                            className='mb-0'
                            checked={!!timelineLabelFormat}
                            onChange={() =>
                                toggleConfirmationDialog({
                                    text: requestTranslation('timelineModeSubtitle'),
                                    title: requestTranslation('timelineModeTitle'),
                                    callback: () => {
                                        toggleLabelMode()
                                        updateRadar(false)
                                    }
                                })
                            }
                        />
                    </Container>
                    <Container className='d-flex flex-shrink-0'>
                        <button
                            className='btn btn-primary ml-auto'
                            onClick={timerangePageHandler}
                        >
                            {requestTranslation('done')}
                        </button>
                    </Container>
                    {this.renderTimeRangeModal()}
                </TimeRangeEditorContainer>
            </Draggable>
        )
    }
}

const TimeRangeEditorContainer = styled.div`
    z-index: ${Z_INDEX_MODAL};
    background-color: #F2F4F4;
    position: absolute;
    top: 100px;
    left: ${({ left }) => left};
    width: 300px;
    max-height: 900px;
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
`

const DragIconContainer = styled.div`
    width: 35px;
    height: 100%;
    border-right: ${ ({ border }) => border ? '1px solid #E9ECEC' : null };
    display: flex;
    align-items: center;
    justify-content: center;
`

const InputContainer = styled.div`
    width: 125px;
    height: 38px;
    position: relative;
    border: 1px solid #ccc;
`

const YearInput = styled.input`
    width: 100%;
    height: 100%;
    border: none;
    display: flex;
    align-items: center;
    font-size: 18px;
    letter-spacing: 15px;
    font-weight: bold;
    padding-left: 15px;
    margin-right: -21px;
`

const LabelInput = styled.input`
    border: 1px solid #ccc;
    height: 38px;
    padding: 0 15px;
    font-weight: medium;
    font-size: 14px;
    width: 100%;
`

const RangeStyles = createGlobalStyle`
    .trunctuate {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .rc-slider.rc-slider-vertical {
        pointer-events: none;
        width: 100%;
        .rc-slider-handle {
            pointer-events: auto;
            width: 100%;
            height: 35px;
            border-radius: 5px;
            border: 1px solid #E9ECEC;
            display: flex;
            align-items: center;
            /*
                https://github.com/react-component/slider/blob/master/src/Handle.jsx
                line 90 needs to be fixed, they forgot to check if slider is vertical
                when doing translateY. Submit a merge request
            */
            transform: translateY(-50%) !important;
        }
        .rc-slider-handle:focus {
            outline: none;
            box-shadow: none;
        }
        .rc-slider-track {
            background-color: #C8C8C9;
            left: 15px;
        }
        .rc-slider-rail, .rc-slider-step {
            left: 15px;
        }
    }
    .dropdown-toggle::after {
        display: none;
    }
`
