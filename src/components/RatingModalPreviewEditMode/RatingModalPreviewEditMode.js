import React, { useState } from 'react'
import styled from 'styled-components'
import _ from 'lodash'
import Select from 'react-select'
import Toggle from 'react-toggle'
import {
    Loading,
    Radiobox,
    Checkbox,
    Modal, 
    paddingModalStyles
} from '@sangre-fp/ui'
import { requestTranslation } from '@sangre-fp/i18n'
import { radarLanguages, initialCommentTopics, customQuillModules } from '../../config'
import { PUBLIC_URL } from '../../env'
import ReactQuill from 'react-quill'
import filter from 'lodash/filter'
import find from 'lodash/find'
import first from 'lodash/first'
import times from 'lodash/times'
import { formats } from '../../quill'
import classNames from 'classnames'
import {InfoCircle} from '@styled-icons/boxicons-regular'
import Popover from '@material-ui/core/Popover';
import { withStyles } from '@material-ui/core/styles';
import styles from '../CreateRadarForm.module.css'
import RatingSummaryPreview from '../RatingSummaryPreview';
import debounce from 'lodash/debounce'
import ConfirmationModalForRatings from '../ConfirmationModalForRatings/ConfirmationModalForRatings'
import { SettingsInputAntennaTwoTone } from '@material-ui/icons'

const URL = window.URL || window.webkitURL

export const PAGE_HEADER_AND_LANGUAGE = 1
export const PAGE_BASIC_SETTINGS = 2
export const PAGE_USER_OPTIONS = 3
export const PAGE_CONCLUSIONS = 4

// TODO enable when implemented
const COMMENT_TOPICS_ENABLED = false
const RATING_ARROWS_ENABLED = false

export const CustomModalStyles = { content: { ...paddingModalStyles.content}, overlay: { ...paddingModalStyles.overlay} }
export const mockData= [
    {
        title: 'Time',
        label: 'Time',
        leftAttr: 'near term',
        rightAttr: 'long term'
    },
    {
        title: 'Probability',
        label: 'Probability',
        leftAttr: 'low',
        rightAttr: 'high'
    },
    {
        title: 'Fit with current strategy',
        label: 'Fit with current strategy',
        leftAttr: 'near term',
        rightAttr: 'long term'
    },
    {
        title: 'Fit with new strategy',
        label: 'Fit with new strategy',
        leftAttr: 'weak',
        rightAttr: 'strong'
    },
    {
        title: 'Direction of the trend',
        label: 'Direction of the trend',
        leftAttr: 'weakening',
        rightAttr: 'increasing'
    },
    {
        title: 'Importance',
        label: 'Importance',
        leftAttr: 'low',
        rightAttr: 'high'
    },
    {
        title: 'Impact1',
        label: 'Impact',
        leftAttr: 'moderate',
        rightAttr: 'huge'
    },
    {
        title: 'Impact2',
        label: 'Impact',
        leftAttr: 'local',
        rightAttr: 'global'
    },
    {
        title: 'Nature1',
        label: 'Nature',
        leftAttr: 'threat',
        rightAttr: 'opportunity'
    },
    {
        title: 'Nature2',
        label: 'Nature',
        leftAttr: 'long term trend',
        rightAttr: 'emergent'
    },
    {
        title: 'Speed of change',
        label: 'Speed of change',
        leftAttr: 'gradual',
        rightAttr: 'tsunami'
    },
    {
        title: 'Size of threat/risk',
        label: 'Size of threat/risk',
        leftAttr: 'moderate',
        rightAttr: 'huge'
    },
    {
        title: 'Size of opportunity',
        label: 'Size of opportunity',
        leftAttr: 'moderate',
        rightAttr: 'huge'
    },
    {
        title: 'Nature3',
        label: 'Nature',
        leftAttr: 'non-disrupting',
        rightAttr: 'disrupting'
    },
    {
        title: 'Fit with existing capabilities',
        label: 'Fit with existing capabilities',
        leftAttr: 'weak',
        rightAttr: 'strong'
    },
    {
        title: 'Magnitude of actions required',
        label: 'Magnitude of actions required',
        leftAttr: 'minor',
        rightAttr: 'huge'
    },
    {
        title: 'Custom',
        label: 'Custom',
        leftAttr: 'x',
        rightAttr: 'y'
    },
]


const useStyles = theme => ({
    popover: {
      pointerEvents: 'none',
      width: '40%'
    },
    paper: {
      padding: theme.spacing(1),
      backgroundColor: '#424242',
      color: '#fff',
      width: 'fit-content'
    },
  });
const  RatingModalPreviewEditMode = ({
    isRatingPreviewEditOpen,
    ratingsOn,
    axisXTitle,
    axisXMin,
    axisXMax,
    axisYTitle,
    axisYMin,
    axisYMax,
    fourFieldsTopLeft,
    fourFieldsTopRight,
    fourFieldsBottomLeft,
    fourFieldsBottomRight,
    axisYSelect,
    axisXSelect,
    RatingAnchorEl,
    RatingDescriptionDisplayed,
    openClearAllFields,
    widthContentWidth,
    onHoverRatingIcon,
    onLeaveRatingIcon,
    handleDisplayVericalAxisRatingChange,
    handleDisplayHorizontalAxisRatingChange,
    handleFlipHorizontalAndVerticalChange,
    openClearAllFieldsModal,
    closeClearAllFieldsModal,
    clearAllFieldsBtn,
    classes,
    // handleRatingsOnChange,
    handleRatingPreviewEditModeClose,
    handleRatingOff

}) => {
        // const { classes } = props;

        const handleRatingsOnChange = (e) => {
            handleRatingOff(e)
        }
        return (
        ratingsOn && (
            <Modal
                isOpen={isRatingPreviewEditOpen}
                contentLabel="radar-modal"
                ariaHideApp={false}
                style={CustomModalStyles}
    >
            {/* <div className='modal-form-sections'> */}
                <div className='modal-form-section' style={{background: '#f1f3f3'}}>
                    <HalfWidth>
                        <div style={{display: 'flex'}}>
                            <h3>
                                {requestTranslation('rating')}
                            </h3>
                            <InformationIcon 
                                onMouseEnter={onHoverRatingIcon}
                                onMouseLeave={onLeaveRatingIcon}
                            />
                            <Popover 
                                className={classes.popover}
                                classes={{
                                    paper: classes.paper,
                                }}
                                open={RatingDescriptionDisplayed || false}
                                anchorEl={RatingAnchorEl} 
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                                }}
                                onClose={onLeaveRatingIcon}
                                disableRestoreFocus
                            >
                                <HoverBox>The Rating tool allows users to evaluate phenomena based on any pre-defined axis. You can easily select some of the commonly used axis from the pulldown menu and/or fill in any custom fields manually. </HoverBox>
                            </Popover> 
                        </div>
                        <SpaceBetween>
                            <p>
                                {requestTranslation('createFormRatingDescription')}
                            </p>
                            <Toggle icons={false}
                                    defaultChecked={ratingsOn}
                                    onChange={() => handleRatingsOnChange(!ratingsOn)}
                            />
                        </SpaceBetween>
                        {/* <SpaceBetween> */}
                            {/* <p style={{marginTop: '12px'}}>{requestTranslation('IntructionsForNamingAxis')}</p> */}
                        {/* </SpaceBetween> */}
                    </HalfWidth>
                    

                    {ratingsOn && (
                    <FullWidthBgContainer style={{ paddingTop: 0, paddingRight: 0, paddingLeft: 0 }}>
                        <p style={{marginTop: '12px'}}>{requestTranslation('IntructionsForNamingAxis')}</p>
                        <SpaceBetween>
                            <HalfWidth>
                                <h4>
                                    {requestTranslation('verticalAxis')}
                                </h4>
                                <Columns>
                                    <Column>
                                        <Select
                                            defaultValue='Select'
                                            searchable={false}
                                            name='group'
                                            className= {`${styles['custom-react-select-margin-bottom-att']}` }
                                            onChange={handleDisplayVericalAxisRatingChange}
                                            value={axisYSelect}
                                            options={mockData.map(i => ({
                                                label: i.label, value: i.title
                                            }))}
                                            clearable={false}
                                        />
                                    </Column>
                                </Columns>   
                            </HalfWidth>
                            <HalfWidth>
                                <h4>
                                    {requestTranslation('horizontalAxis')}
                                </h4>
                                <Columns>
                                    <Column>
                                        <Select
                                            searchable={false}
                                            name='group'
                                            className= {`${styles['custom-react-select-margin-bottom-att']}` }
                                            value={axisXSelect}
                                            onChange={handleDisplayHorizontalAxisRatingChange}
                                            options={mockData.map(i => ({
                                                label: i.label, value: i.title
                                            }))}
                                            clearable={false}
                                        />
                                    </Column>
                                </Columns>
                            </HalfWidth>
                        </SpaceBetween>
                    </FullWidthBgContainer>
                )}

                {ratingsOn && (
                    <FullWidthBgContainer style={{ paddingTop: 0, paddingRight: 0, paddingLeft: 0 }}> 
                        <SpaceBetween>
                                <RatingSummaryPreview
                                    // bottomHeader = 'Preview for rating result and summary view'
                                    // containerWidth = {+this.state.widthContentWidth - 50}
                                    // containerHeight = {+this.state.widthContentWidth * 0.60}
                                    containerWidth = {320}
                                    containerHeight = {200}
                                    topLeft = {fourFieldsTopLeft}
                                    topRight = {fourFieldsTopRight}
                                    bottomLeft = {fourFieldsBottomLeft}
                                    bottomRight = {fourFieldsBottomRight}
                                    horizontalAxisName = {axisXTitle}
                                    leftEnd = {axisXMin}
                                    rightEnd = {axisXMax}
                                    verticalAxisName = {axisYTitle}
                                    topEnd = {axisYMax}
                                    lowEnd = {axisYMin}
                                />
                        </SpaceBetween>
                        <RatingGroupBtn style={{marginTop: '62px'}}>
                            <HandleRatingsBtn className="btn btn-outline-secondary" onClick={openClearAllFieldsModal} >CLEAR ALL FIELDS</HandleRatingsBtn>
                            <HandleRatingsBtn className="btn btn-outline-secondary" onClick={handleFlipHorizontalAndVerticalChange}>{requestTranslation('FlipHorizontalVertical')}</HandleRatingsBtn>
                            <HandleRatingsBtnActive className="btn btn-outline-secondary">EDIT MANUALLY</HandleRatingsBtnActive>
                            <button className="btn btn-primary" onClick={handleRatingPreviewEditModeClose}>DONE</button>
                        </RatingGroupBtn>
                        <ConfirmationModalForRatings 
                            ConfirmationModalNote= 'Are you sure to clear all fields?'
                            confirmationModal= {openClearAllFields}
                            confirmationModalClose = {closeClearAllFieldsModal}
                            confirmationModalHandleBtn = {clearAllFieldsBtn}
                        />
                    </FullWidthBgContainer>
                )}
                </div>
            {/* </div> */}
            </Modal>
        )
    )
    }
export default withStyles(useStyles)(RatingModalPreviewEditMode)


const FullWidthBgContainer = styled.div`
    width: 100%;
    background-color: #f1f3f3;
    box-sizing: border-box;
    padding: 30px 50px;
    &:after {
      content: "";
      display: table;
      clear: both;
    }
`

const breakpoint = '767px'
const HalfWidth = styled.div`
    @media (min-width: ${breakpoint}) {
        width: 45%;
        display: flex;
        flex-direction: column;
    }
`

const SpaceBetween = styled.div`
    @media (min-width: ${breakpoint}) {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        flex-direction: row;
    }
`

const columnPadding = 10
const Columns = styled.div`
    width: ${({ width }) => width ? width : 'auto'};
    display: flex;
    margin: 0 -${columnPadding}px 10px -${columnPadding}px;
`

const Column = styled.div`
    flex: 1 1 ${({ width }) => width ? width : '0%'};
    padding: 0 ${columnPadding}px;
`
const InformationIcon = styled(InfoCircle)`
    background-color: '#f1f3f3'
    color: black;
    width: 18px;
    height: 18px;
    margin-top: 4px;
    margin-left: 18px;
    &:hover {
        cursor: pointer;
    }
`

const HoverBox = styled.p`
    display: flex;
    flex-wrap: wrap;
    width: fit-content;
    justify-content: center;
    align-items: center;
    align-content: center;
    margin: auto; 
`
const HandleRatingsBtn = styled.button`
    &:hover {
        background: #006998 !important;
        color: white !important;
    }
    margin-bottom: 10px;
`

const HandleRatingsBtnActive = styled.button`
    background: #006998 !important;
    color: white !important;
    margin-bottom: 10px;
`
const RatingGroupBtn = styled.div`
display: flex;
flex-direction: column;

    @media (min-width: ${breakpoint}) {
        display: flex;
        justify-content: space-evenly;
        // align-items: flex-start;
        flex-direction: row;
    }
`