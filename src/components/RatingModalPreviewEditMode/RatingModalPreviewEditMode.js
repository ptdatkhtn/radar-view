import React, { useState, useRef, useLayoutEffect, useEffect } from 'react'
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
import ConfirmationModalForRatings from '../ConfirmationModalForRatings/ConfirmationModalForRatings'
import CollaborationChartSetting from '../CollaborationChartSetting'
import {mockDataEn, mockDataFin, mockData} from '../CreateRadarForm'
import InformationModal from '../InformationModal/InformationModal'
import { getLanguage } from '@sangre-fp/i18n'

const URL = window.URL || window.webkitURL

export const PAGE_HEADER_AND_LANGUAGE = 1
export const PAGE_BASIC_SETTINGS = 2
export const PAGE_USER_OPTIONS = 3
export const PAGE_CONCLUSIONS = 4

// TODO enable when implemented
const COMMENT_TOPICS_ENABLED = false
const RATING_ARROWS_ENABLED = false

export const CustomModalStyles = { content: { ...paddingModalStyles.content}, overlay: { ...paddingModalStyles.overlay} }
// export const mockData= [
//     {
//         title: 'Time',
//         label: 'Time',
//         leftAttr: 'near term',
//         rightAttr: 'long term'
//     },
//     {
//         title: 'Probability',
//         label: 'Probability',
//         leftAttr: 'low',
//         rightAttr: 'high'
//     },
//     {
//         title: 'Fit with current strategy',
//         label: 'Fit with current strategy',
//         leftAttr: 'near term',
//         rightAttr: 'long term'
//     },
//     {
//         title: 'Fit with new strategy',
//         label: 'Fit with new strategy',
//         leftAttr: 'weak',
//         rightAttr: 'strong'
//     },
//     {
//         title: 'Direction of the trend',
//         label: 'Direction of the trend',
//         leftAttr: 'weakening',
//         rightAttr: 'increasing'
//     },
//     {
//         title: 'Importance',
//         label: 'Importance',
//         leftAttr: 'low',
//         rightAttr: 'high'
//     },
//     {
//         title: 'Impact1',
//         label: 'Impact',
//         leftAttr: 'moderate',
//         rightAttr: 'huge'
//     },
//     {
//         title: 'Impact2',
//         label: 'Impact',
//         leftAttr: 'local',
//         rightAttr: 'global'
//     },
//     {
//         title: 'Nature1',
//         label: 'Nature',
//         leftAttr: 'threat',
//         rightAttr: 'opportunity'
//     },
//     {
//         title: 'Nature2',
//         label: 'Nature',
//         leftAttr: 'long term trend',
//         rightAttr: 'emergent'
//     },
//     {
//         title: 'Speed of change',
//         label: 'Speed of change',
//         leftAttr: 'gradual',
//         rightAttr: 'tsunami'
//     },
//     {
//         title: 'Size of threat/risk',
//         label: 'Size of threat/risk',
//         leftAttr: 'moderate',
//         rightAttr: 'huge'
//     },
//     {
//         title: 'Size of opportunity',
//         label: 'Size of opportunity',
//         leftAttr: 'moderate',
//         rightAttr: 'huge'
//     },
//     {
//         title: 'Nature3',
//         label: 'Nature',
//         leftAttr: 'non-disrupting',
//         rightAttr: 'disrupting'
//     },
//     {
//         title: 'Fit with existing capabilities',
//         label: 'Fit with existing capabilities',
//         leftAttr: 'weak',
//         rightAttr: 'strong'
//     },
//     {
//         title: 'Magnitude of actions required',
//         label: 'Magnitude of actions required',
//         leftAttr: 'minor',
//         rightAttr: 'huge'
//     },
//     {
//         title: 'Custom',
//         label: 'Custom',
//         leftAttr: 'x',
//         rightAttr: 'y'
//     },
// ]


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
    handleRatingOff,
    passCheckedCustomData,
    emitFlagToRefetchDataOfChart,
    handleUpdateStateWhenClickedDoneBtnInCreateRadarForm,
    isCustomVerticalProp,
    isCustomHorozontalProp
}) => {
        // const { classes } = props;
        
        const handleRatingsOnChange = (e) => {
            handleRatingOff(e)
        }
        
        const [isCustomVertical, setIsCustomVertical] = React.useState(isCustomVerticalProp)
        const [isCustomHorozol, setIsCustomHorozol] = React.useState(isCustomHorozontalProp)

        const [topEnd, setTopEnd] = React.useState(axisYMax)
        const [lowEnd, setLowEnd] = React.useState(axisYMin)
        const [leftEnd, setLeftEnd] = React.useState(axisXMin)
        const [rightEnd, setRightEnd] = React.useState(axisXMax)
        const [xName, setXName] = React.useState(axisXTitle)
        const [yName, setYname] = React.useState(axisYTitle)
        const [fourFieldsTopLeftValue, setfourFieldsTopLeftValue] = React.useState(fourFieldsTopLeft)
        const [fourFieldsTopRightValue, setfourFieldsTopRight] = React.useState(fourFieldsTopRight)
        const [fourFieldsBottomLeftValue, setfourFieldsBottomLeftValue] = React.useState(fourFieldsBottomLeft)
        const [fourFieldsBottomRightValue, setfourFieldsBottomRightValue] = React.useState(fourFieldsBottomRight)
        const [axisXSelectValue, setaxisXSelect] = React.useState(axisXSelect)
        const [axisYSelectValue, setaxisYSelect] = React.useState(axisYSelect)
        const [openRatingInformationModal, setOpenRatingInformationModal] = React.useState(false)


        const openRatingInformationModalHandle = () => {
            setOpenRatingInformationModal(true)
        }
    
        const closeRatingInformationModalHandle = () => {
            setOpenRatingInformationModal(false)
        } 
        const getDataFromLocalStorageThenSaveToLocalState = () => {
            const retrievedObject = JSON.parse(localStorage.getItem('chartData'))

            Promise.resolve()
            .then(() => {
                const {
                    leftEndValue, 
                    rightEndValue, 
                    topEndValue, 
                    lowEndValue, 
                    horizontalAxisNameValue, 
                    verticalAxisNameValue,
                    topLeftValue, 
                    topRightValue, 
                    bottomLeftValue, 
                    bottomRightValue,
                    inputSelectedXValue,
                    inputSelectedYValue,
                    isEditHorizontal,
                    isVerticalEdit
            } = retrievedObject

                if (retrievedObject) {
                    setLowEnd(retrievedObject.lowEndValue)
                    setTopEnd(retrievedObject.topEndValue)
                    setLeftEnd(retrievedObject.leftEndValue)
                    setRightEnd(retrievedObject.rightEndValue)
                    setXName(retrievedObject.horizontalAxisNameValue)
                    setYname(retrievedObject.verticalAxisName)
                    setfourFieldsTopLeftValue(() => retrievedObject.topLeftValue)
                    setfourFieldsTopRight((() => retrievedObject.topRightValue))
                    setfourFieldsBottomLeftValue(() => retrievedObject.bottomLeftValue)
                    setfourFieldsBottomRightValue(() => retrievedObject.bottomRightValue)
                    setaxisXSelect(prestate => retrievedObject.inputSelectedXValue)
                    setaxisYSelect(prestate => retrievedObject.inputSelectedYValue)
                    setIsCustomVertical(pre => isVerticalEdit)
                    setIsCustomHorozol( pre => isEditHorizontal)
                }
            }
            )
        }

        const receivedCheckDataFromCollaborationChartSettingVertical = (isVertical) => {
            setIsCustomVertical(isVertical)
            // getDataFromLocalStorageThenSaveToLocalState()
            
        }

        const receivedCheckDataFromCollaborationChartSettingHoronzal = (isHorizontal) => {
            setIsCustomHorozol(isHorizontal)
            // getDataFromLocalStorageThenSaveToLocalState()
            
        }

        const handleBothClickedDoneAndPassCheckedCustomData = async(isVertical, isHorizontal) => {
            passCheckedCustomData(isVertical, isHorizontal)
            // Retrieve the object from storage
            const retrievedObject = await localStorage.getItem('chartData');
            retrievedObject && emitFlagToRefetchDataOfChart(JSON.parse(retrievedObject));
            handleRatingPreviewEditModeClose()
        }

        const handleOpenClearAllFieldsModal = () => {
            Promise.resolve()
            .then(() => { 
                
                // localStorage.removeItem("chartData")
                setLowEnd(() => requestTranslation('lowEnd'))
                setTopEnd(() => requestTranslation('highEnd'))
                setLeftEnd(() => requestTranslation('leftEnd'))
                setRightEnd(() =>requestTranslation('rightEnd'))
                setXName(() => requestTranslation('HorizontalAxisName'))
                setYname(() => requestTranslation('verticalAxisName'))
                setfourFieldsTopLeftValue(() => requestTranslation('topLeft'))
                setfourFieldsTopRight((() => requestTranslation('topRight')))
                setfourFieldsBottomLeftValue(() => requestTranslation('bottomLeft'))
                setfourFieldsBottomRightValue(() => requestTranslation('bottomRight'))
                setaxisXSelect(()=> '')
                setaxisYSelect(() => '')
                
                setIsCustomHorozol(false)
                setIsCustomVertical(false)

                }
            )
            .then(() => {
                localStorage.removeItem("chartData")
                clearAllFieldsBtn()
            })
            
           
        }

        const handleDisplayVericalAxisRatingChangeOnRatingModalPreviewEditMode = ({value}) => {
            // handleDisplayVericalAxisRatingChange({value})
            mockData.some(i => {
                if ((String(value) === 'Custom') || (String(value) === 'Muokattu')  ) {
                    setIsCustomVertical(true)
                    handleDisplayVericalAxisRatingChange({value}, true)
                    return true
                }
                else if(String(value) === String(i.title)) {
                    setTopEnd(i.rightAttr)
                    setLowEnd(i.leftAttr)
                    setYname(i.nameAxis)
                    setaxisYSelect(i.title)
                    setIsCustomVertical(false)
                    handleDisplayVericalAxisRatingChange({value}, false)
                    return true
                }
            })
            
        }

        const handleDisplayHorizontalAxisRatingChangeOnRatingModalPreviewEditMode = ({value}) => {
            // handleDisplayHorizontalAxisRatingChange({value})
            mockData.some(i => {
                if ((String(value) === 'Custom') || (String(value) === 'Muokattu')  ) {
                    setIsCustomHorozol(true)
                    handleDisplayHorizontalAxisRatingChange({value}, true)
                    return true
                }
                else if(String(value) === String(i.title)) {
                    setRightEnd(i.rightAttr)
                    setLeftEnd(i.leftAttr)
                    setXName(i.nameAxis)
                    setaxisXSelect(i.title)
                    setIsCustomHorozol(false)
                    handleDisplayHorizontalAxisRatingChange({value}, false)
                    return true
                }
            })
            
        }

        const handleFlipHorizontalAndVerticalChangeInRatingEditChartMode = () => {
            const retrievedObject = JSON.parse(localStorage.getItem('chartData'))
            const {
                    leftEndValue, 
                    rightEndValue, 
                    topEndValue, 
                    lowEndValue, 
                    horizontalAxisNameValue, 
                    verticalAxisNameValue,
                    topLeftValue, 
                    topRightValue, 
                    bottomLeftValue, 
                    bottomRightValue,
                    inputSelectedXValue,
                    inputSelectedYValue,
                    isEditHorizontal,
                    isVerticalEdit
            } = retrievedObject

            localStorage.setItem('chartData', JSON.stringify({
                leftEndValue: lowEndValue, 
                rightEndValue: topEndValue, 
                topEndValue: rightEndValue, 
                lowEndValue: leftEndValue, 
                horizontalAxisNameValue: verticalAxisNameValue, 
                verticalAxisNameValue: horizontalAxisNameValue,
                topLeftValue, 
                topRightValue, 
                bottomLeftValue, 
                bottomRightValue,
                inputSelectedXValue: inputSelectedYValue,
                inputSelectedYValue: inputSelectedXValue,
                isVerticalEdit: isEditHorizontal,
                isEditHorizontal: isVerticalEdit
              }));

            

            Promise.resolve()
            .then(() => { 
                if (retrievedObject) {
                    setLowEnd(retrievedObject.leftEndValue)
                    setTopEnd(retrievedObject.rightEndValue)
                    setLeftEnd(retrievedObject.lowEndValue)
                    setRightEnd(retrievedObject.topEndValue)
                    setXName(retrievedObject.verticalAxisNameValue)
                    setYname(retrievedObject.horizontalAxisNameValue)
                    setfourFieldsTopLeftValue(() => retrievedObject.topLeftValue)
                    setfourFieldsTopRight((() => retrievedObject.topRightValue))
                    setfourFieldsBottomLeftValue(() => retrievedObject.bottomLeftValue)
                    setfourFieldsBottomRightValue(() => retrievedObject.bottomRightValue)
                    setaxisXSelect(prestate => retrievedObject.inputSelectedYValue)
                    setaxisYSelect(prestate => retrievedObject.inputSelectedXValue)
                    setIsCustomVertical(pre => isEditHorizontal)
                    setIsCustomHorozol( pre => isVerticalEdit)
                }
            }
            )
        }

        const handleDoneBtn = (isCustomVertical, isCustomHorozol) => {
            handleBothClickedDoneAndPassCheckedCustomData(isCustomVertical, isCustomHorozol)
            handleUpdateStateWhenClickedDoneBtnInCreateRadarForm()
        }

        useEffect(() => {
            setRightEnd(axisXMax)
        }, [axisXMax])
        useEffect(() => {
            setLeftEnd(axisXMin)
        }, [axisXMin])
        useEffect(() => {
            setLowEnd(axisYMin)
        }, [axisYMin])
        useEffect(() => {
            setTopEnd(axisYMax)
        }, [axisYMax])
        useEffect(() => {
            setXName(axisXTitle)
        }, [axisXTitle])
        useEffect(() => {
            setYname(axisYTitle)
        }, [axisYTitle])

        useEffect(() => {
            setfourFieldsTopLeftValue(fourFieldsTopLeft)
        }, [fourFieldsTopLeft])
        useEffect(() => {
            setfourFieldsTopRight(fourFieldsTopRight)
        }, [fourFieldsTopRight])
        useEffect(() => {
            setfourFieldsBottomLeftValue(fourFieldsBottomLeft)
        }, [fourFieldsBottomLeft])
        useEffect(() => {
            setfourFieldsBottomRightValue(fourFieldsBottomRight)
        }, [fourFieldsBottomRight])

        useEffect(() => {
            setaxisXSelect(axisXSelect)
        }, [axisXSelect])
        useEffect(() => {
            setaxisYSelect(axisYSelect)
        }, [axisYSelect])
        useEffect(() => {
            setIsCustomVertical(isCustomVerticalProp)
        }, [isCustomVerticalProp])
        useEffect(() => {
            setIsCustomHorozol(isCustomHorozontalProp)
        }, [isCustomHorozontalProp])

        return (
        ratingsOn && (
            <Modal
                isOpen={isRatingPreviewEditOpen}
                contentLabel="radar-modal"
                ariaHideApp={false}
                style={CustomModalStyles}
                    >
                            {/* <div className='modal-form-sections'> */}
                                <div 
                                    className='modal-form-section' 
                                    style={{background: '#f1f3f3'}}
                                    id="modal-form-section-chartEditMode"
                                    >
                                    <CustomHalfWidth>
                                        <div style={{display: 'flex'}}>
                                            <h3>
                                                {requestTranslation('rating')}
                                            </h3>
                                            <InformationIcon 
                                                onMouseEnter={onHoverRatingIcon}
                                                onMouseLeave={onLeaveRatingIcon}
                                                onClick={openRatingInformationModalHandle}
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
                                                <HoverBox>{requestTranslation('InfoIconHoverRating')}</HoverBox>
                                            </Popover> 
                                            <InformationModal 
                                    InfoModalHeader={requestTranslation('RatingTool')}
                                    InfoModalNote={requestTranslation('InfoModalRatingNote')}
                                    InfoModalOpen={openRatingInformationModal}
                                    InfoModalClose={closeRatingInformationModalHandle}
                                    LearnMoreBtn={requestTranslation('LearnMoreRatingBtn')}
                                    GuideBtn={requestTranslation('GuideRatingBtn')}
                                    LearnMoreLink='https://info.futuresplatform.com/hub/how-to-rate'
                                    GuideLink='https://info.futuresplatform.com/hub/most-commonly-used-axis-for-rating'
                                    InfoModalDescription={requestTranslation('InfoModalRatingContent')}
                                    InfoModalDescription2={requestTranslation('InfoModalRatingContent2')}
                                    InfoModalDescription3={requestTranslation('InfoModalRatingContent3')}
                                    InfoModalDescription4={requestTranslation('InfoModalRatingContent4')}
                                    InfoModalDescription5={requestTranslation('InfoModalRatingContent5')}
                                    InfoModalDescription6={requestTranslation('InfoModalRatingContent6')}
                                />
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
                                    </CustomHalfWidth>
                                    

                                    {ratingsOn && (
                                    <FullWidthBgContainer style={{ paddingTop: 0, paddingRight: 0, paddingLeft: 0, marginTop: '20px' }}>
                                        <SpaceBetween>
                                            <HalfWidth>
                                                <h4>
                                                    {requestTranslation('verticalAxis')}
                                                </h4>
                                                <Columns>
                                                    <Column>
                                                        <Select
                                                            defaultValue='Select'
                                                            // placeholder={getLanguage() === 'en' ? 'Select...' : 'Valitse...'}
                                                            searchable={false}
                                                            name='group'
                                                            className= {`${styles['custom-react-select-margin-bottom-att']}` }
                                                            onChange={handleDisplayVericalAxisRatingChangeOnRatingModalPreviewEditMode}
                                                            value={isCustomVertical ? getLanguage() === 'en' ?'Custom':'Muokattu' : axisYSelectValue}
                                                            options={
                                                                getLanguage() === 'en' ?
                                                                    (mockData?.map(i => ({
                                                                        label: i.label, value: i.title
                                                                    }))) : 
                                                                    (mockData?.map(i => ({
                                                                        label: i.label, value: i.title
                                                                    })))
                                                            }
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
                                                            // placeholder={getLanguage() === 'en' ? 'Select...' : 'Valitse...'}
                                                            className= {`${styles['custom-react-select-margin-bottom-att']}` }
                                                            value={isCustomHorozol ? getLanguage() === 'en' ?'Custom':'Muokattu' : axisXSelectValue}
                                                            onChange={handleDisplayHorizontalAxisRatingChangeOnRatingModalPreviewEditMode}
                                                            options={
                                                                getLanguage() === 'en' ?
                                                                    (mockData?.map(i => ({
                                                                        label: i.label, value: i.title
                                                                    }))) : 
                                                                    (mockData?.map(i => ({
                                                                        label: i.label, value: i.title
                                                                    })))
                                                            }
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
                                            <CollaborationChartSetting 
                                                containerWidth = {widthContentWidth}
                                                containerHeight = {widthContentWidth * 0.65}
                                                topLeft = {fourFieldsTopLeftValue}
                                                topRight = {fourFieldsTopRightValue}
                                                bottomLeft = {fourFieldsBottomLeftValue}
                                                bottomRight = {fourFieldsBottomRightValue}
                                                horizontalAxisName = {xName}
                                                leftEnd = {leftEnd}
                                                rightEnd = {rightEnd}
                                                verticalAxisName = {yName}
                                                topEnd = {topEnd}
                                                lowEnd = {lowEnd}
                                                passisCustomToRatingModalPreviewModeVertical={receivedCheckDataFromCollaborationChartSettingVertical}
                                                passisCustomToRatingModalPreviewModeHoronzal={receivedCheckDataFromCollaborationChartSettingHoronzal}
                                                inputSelectedX={isCustomHorozol? getLanguage() === 'en' ?'Custom':'Muokattu' : axisXSelectValue}
                                                inputSelectedY={isCustomVertical? getLanguage() === 'en' ?'Custom':'Muokattu' : axisYSelectValue}
                                                isCustomHorozol={isCustomHorozol}
                                                isCustomVertical={isCustomVertical}
                                                // passDataFromPreviewEditModeToPreivewMore={passDataFromPreviewEditModeToPreivewMore}
                                                />
                                        </SpaceBetween>
                                        <RatingGroupBtn style={{marginTop: '150px'}}>
                                            <RatingHandleBtnGroup>
                                                <HandleRatingsBtn className="btn btn-outline-secondary" onClick={openClearAllFieldsModal} >{requestTranslation('clearAllFieldsBtn')}</HandleRatingsBtn>
                                                <HandleRatingsBtn className="btn btn-outline-secondary" onClick={handleFlipHorizontalAndVerticalChangeInRatingEditChartMode}>{requestTranslation('FlipHorizontalVertical')}</HandleRatingsBtn>
                                                <HandleRatingsBtnActive className="btn btn-outline-secondary">{requestTranslation('editManuallyBtn')}</HandleRatingsBtnActive>   
                                            </RatingHandleBtnGroup>
                                        <HandleDoneBtn className="btn btn-primary " onClick={() => handleDoneBtn(isCustomVertical, isCustomHorozol)}>{requestTranslation('DoneBtn')}</HandleDoneBtn>
                                            
                                        </RatingGroupBtn>
                                        <ConfirmationModalForRatings 
                                            ConfirmationModalNote= 'Are you sure to clear all fields?'
                                            confirmationModal= {openClearAllFields}
                                            confirmationModalClose = {closeClearAllFieldsModal}
                                            confirmationModalHandleBtn = {handleOpenClearAllFieldsModal}
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

const HandleDoneBtn = styled.button`
    margin-bottom: 10px;
`

const HandleRatingsBtnActive = styled.button`
    background: #006998 !important;
    color: white !important;
    margin-bottom:import InformationModal from '../InformationModal/InformationModal';
 10px;
`
const RatingGroupBtn = styled.div`
display: flex;
flex-direction: column;

    @media (min-width: ${breakpoint}) {
        display: flex;
        justify-content: space-between;
        // align-items: flex-start;
        flex-direction: row;
    }
`
const CustomHalfWidth = styled.div`
@media (min-width: ${breakpoint}) {
    width: 80%;
    display: flex;
    flex-direction: column;
}
`

const RatingHandleBtnGroup = styled.div`
display: flex;
flex-direction: column;

    @media (min-width: ${breakpoint}) {
        width: 83%;
        display: flex;
        justify-content: space-between;
        flex-direction: row;
    }   

`