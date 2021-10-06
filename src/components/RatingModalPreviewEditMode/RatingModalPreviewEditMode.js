import React, { useEffect } from 'react'
import styled from 'styled-components'
import Select from 'react-select'
import Toggle from 'react-toggle'
import {
    Modal, 
    paddingModalStyles
} from '@sangre-fp/ui'
import { requestTranslation } from '@sangre-fp/i18n'
import {InfoCircle} from '@styled-icons/boxicons-regular'
import Popover from '@material-ui/core/Popover';
import { withStyles } from '@material-ui/core/styles';
import styles from '../CreateRadarForm.module.css'
import ConfirmationModalForRatings from '../ConfirmationModalForRatings/ConfirmationModalForRatings'
import CollaborationChartSetting from '../CollaborationChartSetting'
import {mockDataEn, mockDataFin} from '../CreateRadarForm'
import InformationModal from '../InformationModal/InformationModal'
import { getLanguage } from '@sangre-fp/i18n'
import {ratingApi} from '../../helpers/fetcher'
import ConfirmationModalFoCollabTool from '../ConfirmationModalForCollabTool/ConfirmationModalForCollabTool'

export const PAGE_HEADER_AND_LANGUAGE = 1
export const PAGE_BASIC_SETTINGS = 2
export const PAGE_USER_OPTIONS = 3
export const PAGE_CONCLUSIONS = 4

export const CustomModalStyles = { content: { ...paddingModalStyles.content}, overlay: { ...paddingModalStyles.overlay} }

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
    isCustomHorozontalProp,
    closedModal,
    radarid,
    groupid,
    dataOriginal,
    syncChartData
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
        const [openCofirmationModalForRatingEditMode, setOpenCofirmationModalForRatingEditMode] = React.useState(false)
        const [isFieldChange, setIsFieldChange] = React.useState(false)

        const isFieldChangeChecked = () => {
            const retrievedObject = JSON.parse(localStorage.getItem('chartData'))
            const oldData = JSON.parse(localStorage.getItem('old-data-edit-manually'))

            let bottomLeft = oldData ? String(oldData?.bottomLeftValue): String(dataOriginal.fourFieldsBottomLeft)
            let bottomRight = oldData ? String(oldData?.bottomRightValue): String(dataOriginal.fourFieldsBottomRight)
            let TopLeft = oldData ? String(oldData?.topLeftValue): String(dataOriginal.fourFieldsTopLeft)
            let topRight = oldData ? String(oldData?.topRightValue): String(dataOriginal.fourFieldsTopRight)
            let axisXTitle  = oldData ? String(oldData?.horizontalAxisNameValue): String(dataOriginal.axisXTitle)
            let axisYTitle = oldData ? String(oldData?.verticalAxisNameValue): String(dataOriginal.axisYTitle)
            let axisXMin = oldData ? String(oldData?.leftEndValue): String(dataOriginal.axisXMin)
            let axisXMax = oldData ? String(oldData?.rightEndValue): String(dataOriginal.axisXMax)
            let axisYMin = oldData ? String(oldData?.lowEndValue): String(dataOriginal.axisYMin)
            let axisYMax = oldData ? String(oldData?.topEndValue): String(dataOriginal.axisYMax)

            if(retrievedObject && (
                String(retrievedObject.bottomLeftValue) !== bottomLeft
                ||String(retrievedObject.bottomRightValue) !== bottomRight
                ||String(retrievedObject.topLeftValue) !== TopLeft
                ||String(retrievedObject.topRightValue) !== topRight
                ||String(retrievedObject.horizontalAxisNameValue) !== axisXTitle
                ||String(retrievedObject.verticalAxisNameValue) !== axisYTitle
                ||String(retrievedObject.leftEndValue) !== axisXMin
                ||String(retrievedObject.rightEndValue) !== axisXMax
                ||String(retrievedObject.lowEndValue) !== axisYMin
                ||String(retrievedObject.topEndValue) !== axisYMax
                )
            ){
                 setIsFieldChange(true)
            
            } else {
                // setIsFieldChange(false)
                setOpenCofirmationModalForRatingEditMode(false); 
                handleRatingPreviewEditModeClose()

            }
            
        }
    
        

        const openRatingInformationModalHandle = () => {
            setOpenRatingInformationModal(true)
        }
    
        const closeRatingInformationModalHandle = () => {
            setOpenRatingInformationModal(false)
        } 

        const receivedCheckDataFromCollaborationChartSettingVertical = (isVertical) => {
            setIsCustomVertical(isVertical)
            // getDataFromLocalStorageThenSaveToLocalState()
            
        }

        const passisCustomToRatingModalPreviewModeOther = (a, b) => {
            if (String(a) === 'topLeftValue') {
                setfourFieldsTopLeftValue(b)
            }
            else if (String(a) === 'topRightValue') {
                setfourFieldsTopRight(b)
            } 
            else if (String(a) === 'bottomLeftValue') {
                setfourFieldsBottomLeftValue(b)
            }
            else if (String(a) === 'bottomRightValue') {
                setfourFieldsBottomRightValue(b)
            }
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
            closedModal()
            setLowEnd(requestTranslation('lowEnd') )
            setTopEnd(requestTranslation('highEnd'))
            setLeftEnd(() => requestTranslation('leftEnd'))
            setRightEnd(() =>requestTranslation('rightEnd'))
            setXName(() => requestTranslation('HorizontalAxisName'))
            setYname(() => requestTranslation('verticalAxisName'))
            setfourFieldsTopLeftValue(requestTranslation('topLeft').toString().slice() )
            setfourFieldsTopRight((() => requestTranslation('topRight')))
            setfourFieldsBottomLeftValue(() => requestTranslation('bottomLeft'))
            setfourFieldsBottomRightValue(() => requestTranslation('bottomRight'))
            setaxisXSelect(()=> '')
            setaxisYSelect(() => '')
            
            setIsCustomHorozol(false)
            setIsCustomVertical(false)
        }

        const handleDisplayVericalAxisRatingChangeOnRatingModalPreviewEditMode = ({value}) => {
            const retrievedObject = JSON.parse(localStorage.getItem('chartData'))
                    const {
                        leftEndValue, 
                        rightEndValue, 
                        horizontalAxisNameValue, 
                        topLeftValue, 
                        topRightValue, 
                        bottomLeftValue, 
                        bottomRightValue,
                        inputSelectedXValue,
                        isEditHorizontal,
                        isVerticalEdit
                    } = retrievedObject

            // handleDisplayVericalAxisRatingChange({value})
            getLanguage() ==='en' ?  mockDataEn.some(i => {
                if ((String(value) === 'Custom') ) {
                    setIsCustomVertical(true)
                    handleDisplayVericalAxisRatingChange({value}, true)
                    setTopEnd('Y')
                    setLowEnd('X')
                    setYname('Custom')
                    setaxisYSelect('Custom')

                    localStorage.setItem('chartData', JSON.stringify({
                        leftEndValue, 
                        rightEndValue, 
                        horizontalAxisNameValue,
                        topLeftValue, 
                        topRightValue, 
                        bottomLeftValue, 
                        bottomRightValue,
                        inputSelectedXValue,
                        inputSelectedYValue: 'Custom',
                        isVerticalEdit,
                        isEditHorizontal,
                        topEndValue: 'Y', 
                        lowEndValue: 'X', 
                        verticalAxisNameValue: 'Custom'
                      }));

                    return true
                }
                else if(String(value) === String(i.title)) {
                    setTopEnd(i.rightAttr)
                    setLowEnd(i.leftAttr)
                    setYname(i.nameAxis)
                    setaxisYSelect(i.title)
                    setIsCustomVertical(false)
                    handleDisplayVericalAxisRatingChange({value}, false)

                    localStorage.setItem('chartData', JSON.stringify({
                        leftEndValue, 
                        rightEndValue, 
                        horizontalAxisNameValue,
                        topLeftValue, 
                        topRightValue, 
                        bottomLeftValue, 
                        bottomRightValue,
                        inputSelectedXValue,
                        inputSelectedYValue: i.title,
                        isVerticalEdit,
                        isEditHorizontal,
                        topEndValue: i.rightAttr, 
                        lowEndValue: i.leftAttr, 
                        verticalAxisNameValue: i.nameAxis
                      }));
                    return true
                }
            }) : 
            (mockDataFin.some(i => {
                if ((String(value) === 'Muokattu')  ) {
                    setIsCustomVertical(true)
                    handleDisplayVericalAxisRatingChange({value}, true)
                    setTopEnd('Y')
                    setLowEnd('X')
                    setYname('Muokattu')
                    setaxisYSelect('Muokattu')

                    

                    localStorage.setItem('chartData', JSON.stringify({
                        leftEndValue, 
                        rightEndValue, 
                        horizontalAxisNameValue,
                        topLeftValue, 
                        topRightValue, 
                        bottomLeftValue, 
                        bottomRightValue,
                        inputSelectedXValue,
                        inputSelectedYValue: 'Muokattu',
                        isVerticalEdit,
                        isEditHorizontal,
                        topEndValue: 'Y', 
                        lowEndValue: 'X', 
                        verticalAxisNameValue: 'Muokattu'
                      }));
                    return true
                }
                else if(String(value) === String(i.title)) {
                    setTopEnd(i.rightAttr)
                    setLowEnd(i.leftAttr)
                    setYname(i.nameAxis)
                    setaxisYSelect(i.title)
                    setIsCustomVertical(false)
                    handleDisplayVericalAxisRatingChange({value}, false)

                    localStorage.setItem('chartData', JSON.stringify({
                        leftEndValue, 
                        rightEndValue, 
                        horizontalAxisNameValue,
                        topLeftValue, 
                        topRightValue, 
                        bottomLeftValue, 
                        bottomRightValue,
                        inputSelectedXValue,
                        inputSelectedYValue: i.title,
                        isVerticalEdit,
                        isEditHorizontal,
                        topEndValue: i.rightAttr, 
                        lowEndValue: i.leftAttr, 
                        verticalAxisNameValue: i.nameAxis
                      }));
                    return true
                }
            }))

            // localStorage.setItem('chartData', JSON.stringify({
            //     leftEndValue: leftEnd, 
            //     rightEndValue: rightEnd, 
            //     topEndValue: topEnd, 
            //     lowEndValue: lowEnd, 
            //     horizontalAxisNameValue: xName, 
            //     verticalAxisNameValue: yName,
            //     topLeftValue: fourFieldsTopLeftValue, 
            //     topRightValue: fourFieldsTopRightValue, 
            //     bottomLeftValue: fourFieldsBottomLeftValue, 
            //     bottomRightValue: fourFieldsBottomRightValue,
            //     inputSelectedXValue: axisXSelectValue,
            //     inputSelectedYValue: axisYSelectValue,
            //     isVerticalEdit: isCustomVertical,
            //     isEditHorizontal: isCustomHorozol
            //   }));
            
        }

        const handleDisplayHorizontalAxisRatingChangeOnRatingModalPreviewEditMode = ({value}) => {
            const retrievedObject = JSON.parse(localStorage.getItem('chartData'))
                    const {
                        topEndValue, 
                        lowEndValue, 
                        verticalAxisNameValue,
                        topLeftValue, 
                        topRightValue, 
                        bottomLeftValue, 
                        bottomRightValue,
                        inputSelectedYValue,
                        isVerticalEdit
                    } = retrievedObject


            // handleDisplayHorizontalAxisRatingChange({value})
            getLanguage() ==='en' ? mockDataEn.some(i => {
                if ((String(value) === 'Custom')) {
                    setIsCustomHorozol(true)
                    setRightEnd('Y')
                    setLeftEnd('X')
                    setXName('Custom')
                    setaxisXSelect('Custom')
                    handleDisplayHorizontalAxisRatingChange({value}, true)

                    localStorage.setItem('chartData', JSON.stringify({
                        topEndValue, 
                        lowEndValue, 
                        verticalAxisNameValue,
                        topLeftValue, 
                        topRightValue, 
                        bottomLeftValue, 
                        bottomRightValue,
                        inputSelectedXValue: 'Custom',
                        inputSelectedYValue,
                        isVerticalEdit,
                        isEditHorizontal: true,
                        leftEndValue: 'X', 
                        rightEndValue: 'Y', 
                        horizontalAxisNameValue: 'Custom', 
                      }));

                    return true
                }
                else if(String(value) === String(i.title)) {
                    setRightEnd(i.rightAttr)
                    setLeftEnd(i.leftAttr)
                    setXName(i.nameAxis)
                    setaxisXSelect(i.title)
                    setIsCustomHorozol(false)
                    handleDisplayHorizontalAxisRatingChange({value}, false)

                    localStorage.setItem('chartData', JSON.stringify({
                        topEndValue, 
                        lowEndValue, 
                        verticalAxisNameValue,
                        topLeftValue, 
                        topRightValue, 
                        bottomLeftValue, 
                        bottomRightValue,
                        inputSelectedXValue: i.title,
                        inputSelectedYValue,
                        isVerticalEdit,
                        isEditHorizontal: false,
                        leftEndValue: i.leftAttr, 
                        rightEndValue: i.rightAttr, 
                        horizontalAxisNameValue: i.nameAxis, 
                      }));

                    return true
                }
            }): 
            (mockDataFin.some(i => {
                if ((String(value) === 'Muokattu')  ) {
                    setIsCustomHorozol(true)
                    setRightEnd('Y')
                    setLeftEnd('X')
                    setXName('Muokattu')
                    setaxisXSelect('Muokattu')
                    handleDisplayHorizontalAxisRatingChange({value}, true)

                    localStorage.setItem('chartData', JSON.stringify({
                        topEndValue, 
                        lowEndValue, 
                        verticalAxisNameValue,
                        topLeftValue, 
                        topRightValue, 
                        bottomLeftValue, 
                        bottomRightValue,
                        inputSelectedXValue: 'Muokattu',
                        inputSelectedYValue,
                        isVerticalEdit,
                        isEditHorizontal: true,
                        leftEndValue: 'X', 
                        rightEndValue: 'Y', 
                        horizontalAxisNameValue: 'Muokattu', 
                      }));
                    return true
                }
                else if(String(value) === String(i.title)) {
                    setRightEnd(i.rightAttr)
                    setLeftEnd(i.leftAttr)
                    setXName(i.nameAxis)
                    setaxisXSelect(i.title)
                    setIsCustomHorozol(false)
                    handleDisplayHorizontalAxisRatingChange({value}, false)

                    localStorage.setItem('chartData', JSON.stringify({
                        topEndValue, 
                        lowEndValue, 
                        verticalAxisNameValue,
                        topLeftValue, 
                        topRightValue, 
                        bottomLeftValue, 
                        bottomRightValue,
                        inputSelectedXValue: i.title,
                        inputSelectedYValue,
                        isVerticalEdit,
                        isEditHorizontal: false,
                        leftEndValue: i.leftAttr, 
                        rightEndValue: i.rightAttr, 
                        horizontalAxisNameValue: i.nameAxis, 
                      }));

                    return true
                }
            }))
        
        }

        const handleFlipHorizontalAndVerticalChangeInRatingEditChartMode = async () => {
            const {data } = await ratingApi.getFlipAxisAfterSaved( groupid, radarid)
            if(!!data.isFlip) {
                await ratingApi.changeFlipAxis(groupid, radarid, {isFlip: false})
            } else if(!data.isFlip){
                await ratingApi.changeFlipAxis(groupid, radarid, {isFlip: true})
            }

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

        React.useEffect(() => {
            if(isFieldChange) {
                setOpenCofirmationModalForRatingEditMode(true);
            }
            return () => {
                setIsFieldChange(false)
            }
        }, [isFieldChange])


        const handleDoneBtn = (isCustomVertical, isCustomHorozol) => {
            handleBothClickedDoneAndPassCheckedCustomData(isCustomVertical, isCustomHorozol)
            handleUpdateStateWhenClickedDoneBtnInCreateRadarForm()
        }
        const openCofirmationModalForRatingEditModeHandle =() => {
            // setIsFieldChange(true)
            isFieldChangeChecked()           
        }

        const closeCofirmationModalForRatingEditModeHandle = () => {
            setOpenCofirmationModalForRatingEditMode(false)

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
                onRequestClose={openCofirmationModalForRatingEditModeHandle}
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
                                                            placeholder={requestTranslation('selectValue')}
                                                            defaultValue='Select'
                                                            // placeholder={getLanguage() === 'en' ? 'Select...' : 'Valitse...'}
                                                            searchable={false}
                                                            name='group'
                                                            className= {`${styles['custom-react-select-margin-bottom-att']}` }
                                                            onChange={handleDisplayVericalAxisRatingChangeOnRatingModalPreviewEditMode}
                                                            value={isCustomVertical ? getLanguage() === 'en' ?'Custom':'Muokattu' : axisYSelectValue}
                                                            options={
                                                                getLanguage() === 'en' ?
                                                                    (mockDataEn?.map(i => ({
                                                                        label: i.label, value: i.title
                                                                    }))) : 
                                                                    (mockDataFin?.map(i => ({
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
                                                            placeholder={requestTranslation('selectValue')}
                                                            searchable={false}
                                                            name='group'
                                                            // placeholder={getLanguage() === 'en' ? 'Select...' : 'Valitse...'}
                                                            className= {`${styles['custom-react-select-margin-bottom-att']}` }
                                                            value={isCustomHorozol ? getLanguage() === 'en' ?'Custom':'Muokattu' : axisXSelectValue}
                                                            onChange={handleDisplayHorizontalAxisRatingChangeOnRatingModalPreviewEditMode}
                                                            options={
                                                                getLanguage() === 'en' ?
                                                                    (mockDataEn?.map(i => ({
                                                                        label: i.label, value: i.title
                                                                    }))) : 
                                                                    (mockDataFin?.map(i => ({
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
                                    <FullWidthBgContainer style={{ padding: 0 }}> 
                                        <SpaceBetween>
                                            <CollaborationChartSetting
                                                passisCustomToRatingModalPreviewModeOther={passisCustomToRatingModalPreviewModeOther}
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
                                                dataOriginal={dataOriginal}
                                                // passDataFromPreviewEditModeToPreivewMore={passDataFromPreviewEditModeToPreivewMore}
                                                />
                                        </SpaceBetween>
                                        <RatingGroupBtn style={{marginTop: '97px'}}>
                                            <RatingHandleBtnGroup>
                                                <HandleRatingsBtn className="btn btn-outline-secondary" onClick={openClearAllFieldsModal} >{requestTranslation('clearAllFieldsBtn')}</HandleRatingsBtn>
                                                <HandleRatingsBtn className="btn btn-outline-secondary" onClick={handleFlipHorizontalAndVerticalChangeInRatingEditChartMode}>{requestTranslation('FlipHorizontalVertical')}</HandleRatingsBtn>
                                                <HandleRatingsBtnActive className="btn btn-outline-secondary">{requestTranslation('editManuallyBtn')}</HandleRatingsBtnActive>   
                                            </RatingHandleBtnGroup>
                                        <HandleDoneBtn className="btn btn-primary " onClick={() => handleDoneBtn(isCustomVertical, isCustomHorozol)}>{requestTranslation('DoneBtn')}</HandleDoneBtn>
                                            
                                        </RatingGroupBtn>
                                        <ConfirmationModalForRatings 
                                            ConfirmationModalNote= {requestTranslation('ConfirmationClearAllModal')}
                                            confirmationModal= {openClearAllFields}
                                            confirmationModalClose = {closeClearAllFieldsModal}
                                            confirmationModalHandleBtn = {handleOpenClearAllFieldsModal}
                                        />
                                    </FullWidthBgContainer>
                                )}
                                </div>
                            {/* </div> */}
                            <ConfirmationModalFoCollabTool 
                                ConfirmationModalNote= {requestTranslation('closeCollabToolNote')}
                                confirmationModal={openCofirmationModalForRatingEditMode}
                                yesConfirmationHandleBtn={() => {
                                    const oldDataStorage = JSON.parse(localStorage.getItem('old-data-edit-manually'))
                                    localStorage.setItem('chartData', JSON.stringify({...oldDataStorage}))
                                    
                                    handleRatingPreviewEditModeClose()
                                    closeCofirmationModalForRatingEditModeHandle() // close confirmation small Modal
                                    syncChartData()
                                }}
                                noConfirmationHandleBtn={closeCofirmationModalForRatingEditModeHandle} 
                                
                            />
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
    margin-bottom: 10px;
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