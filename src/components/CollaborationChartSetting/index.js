import React, { useEffect, useState, useCallback } from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import edit2 from './edit2.svg'
import { requestTranslation, getLanguage } from '@sangre-fp/i18n'
import {
    Modal, 
    confirmDialogModalStyles
} from '@sangre-fp/ui'
import ConfirmationModalFoCollabTool from '../ConfirmationModalForCollabTool/ConfirmationModalForCollabTool'
import { mockData } from '../CreateRadarForm'
import Tooltip from '@mui/material/Tooltip';

const GlobalStyle = createGlobalStyle`
  .ReactModal__Overlay--after-open {
    background-color: rgba(0,0,0,.77)!important;
    z-index: 100;
  }
`

const CanvasContainer = styled.canvas`
  border: 1px solid #979797;
`
const ButtonModalActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 30px;
  margin-bottom: 18px;
`
const ModalContent = styled.div`
  padding: 12px 30px;
`
const EditButton = styled.img`
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`
const ModalTitle = styled.h3`
  color: #121212;
  font-size: 20px;
  margin: 0;
  margin-bottom: 24px;
`
const ModalInputHint = styled.div`
  color: #121212;
  font-weight: 400;
  font-size: 14px;
  // margin: 24px 0;
  margin-top: 10px;
`
const ModalInputValue = styled.input`
  width: 100%;
  height: 44px;
  border: 1px solid #bababa;
  box-sizing: border-box;
  padding: 12px;
`

const SETTING_VALUE = {
  TOP_LEFT: 'topLeftValue',
  TOP_RIGHT: 'topRightValue',
  BOTTOM_LEFT: 'bottomLeftValue',
  BOTTOM_RIGHT: 'bottomRightValue',
  LEFT_END: 'leftEndValue',
  RIGHT_END: 'rightEndValue',
  TOP_END: 'topEndValue',
  LOW_END: 'lowEndValue',
  HORIZONTAL: 'horizontalAxisNameValue',
  VERTICAL: 'verticalAxisNameValue'
}
// const SETTING_VALUE_TITLE = {
//   [SETTING_VALUE.TOP_LEFT]: getLanguage() === 'en' ? 'Fourfold table – top left' : 'Nelikenttä – vasen yläosa',
//   // [SETTING_VALUE.TOP_LEFT]: requestTranslation('abc'),
//   [SETTING_VALUE.TOP_RIGHT]: getLanguage() === 'en' ? 'Fourfold table – top right' : 'Nelikenttä – oikea yläosa',
//   [SETTING_VALUE.BOTTOM_LEFT]: getLanguage() === 'en' ? 'Fourfold table – bottom left' : 'Nelikenttä – vasen alaosa',
//   [SETTING_VALUE.BOTTOM_RIGHT]:  getLanguage() === 'en' ? 'Fourfold table – bottom right' : 'Nelikenttä – oikea alaosa',
//   [SETTING_VALUE.LEFT_END]:  getLanguage() === 'en' ? 'Horizontal axis – Left end' : 'Vaaka-akseli – vasen',
//   [SETTING_VALUE.RIGHT_END]: getLanguage() === 'en' ? 'Horizontal axis – Right end' : 'Vaaka-akseli – oikea',
//   [SETTING_VALUE.TOP_END]: getLanguage() === 'en' ? 'Vertical axis – High end' : 'Pystyakseli –  ylä',
//   [SETTING_VALUE.LOW_END]: getLanguage() === 'en' ? 'Vertical axis – Low end' : 'Pystyakseli – ala',
//   [SETTING_VALUE.HORIZONTAL]:  getLanguage() === 'en'? 'Horizontal axis - horizontal': 'Vaaka-akseli',
//   [SETTING_VALUE.VERTICAL]:  getLanguage() === 'en'? 'Vertical axis - vertical':'Pystyakseli',
// }

const SETTING_VALUE_TITLEEng = {
  [SETTING_VALUE.TOP_LEFT]:'Fourfold table – top left',
  [SETTING_VALUE.TOP_RIGHT]:  'Fourfold table – top right',
  [SETTING_VALUE.BOTTOM_LEFT]:  'Fourfold table – bottom left',
  [SETTING_VALUE.BOTTOM_RIGHT]:   'Fourfold table – bottom right' ,
  [SETTING_VALUE.LEFT_END]:   'Horizontal axis – Left end',
  [SETTING_VALUE.RIGHT_END]:  'Horizontal axis – Right end',
  [SETTING_VALUE.TOP_END]:  'Vertical axis – High end',
  [SETTING_VALUE.LOW_END]:  'Vertical axis – Low end' ,
  [SETTING_VALUE.HORIZONTAL]:  'Horizontal axis - horizontal',
  [SETTING_VALUE.VERTICAL]:  'Vertical axis - vertical',
}
const SETTING_VALUE_TITLEFin = {
  [SETTING_VALUE.TOP_LEFT]: 'Nelikenttä – vasen yläosa',
  [SETTING_VALUE.TOP_RIGHT]:  'Nelikenttä – oikea yläosa',
  [SETTING_VALUE.BOTTOM_LEFT]:  'Nelikenttä – vasen alaosa',
  [SETTING_VALUE.BOTTOM_RIGHT]:    'Nelikenttä – oikea alaosa',
  [SETTING_VALUE.LEFT_END]:   'Vaaka-akseli – vasen',
  [SETTING_VALUE.RIGHT_END]:  'Vaaka-akseli – oikea',
  [SETTING_VALUE.TOP_END]:   'Pystyakseli –  ylä',
  [SETTING_VALUE.LOW_END]:  'Pystyakseli – ala',
  [SETTING_VALUE.HORIZONTAL]:   'Vaaka-akseli',
  [SETTING_VALUE.VERTICAL]:  'Pystyakseli',
}
const ICON_SPACING = 30

const AxisX = ({
  axisWidth,
  horizontalAxisName,
  leftEnd,
  rightEnd,
  containerWidth,
  onEdit
}) => {
  const cellStyle = { fontSize: 12, height: 16, whiteSpace: 'nowrap', color: 'rgb(99, 114, 130)' }

  return (
    <>
      <table cellPadding='0' cellSpacing='0' align='center' style={{ width: axisWidth + 2, margin: 0, marginTop: -17, zIndex: 10, position: 'relative' }}>
      <tbody style={{border: 'none'}}>
        <tr style={{border: 'none'}}>
            <td style={{ ...cellStyle, fontSize: 16, fontWeight: 500, paddingLeft: ICON_SPACING }}>
              <EditButton src={edit2} onClick={() => onEdit(SETTING_VALUE.LEFT_END)} />
            </td>
            <td style={{ ...cellStyle, textAlign: 'center', fontSize: 16, fontWeight: 500 }}>
              <EditButton src={edit2} onClick={() => onEdit(SETTING_VALUE.HORIZONTAL)} />
            </td>
            <td style={{ ...cellStyle, textAlign: 'right', fontSize: 16, fontWeight: 500, paddingRight: ICON_SPACING }}>
              <EditButton src={edit2} onClick={() => onEdit(SETTING_VALUE.RIGHT_END)} />
            </td>
          </tr>
        </tbody>
      </table>

      <table cellPadding='0' cellSpacing='0' align='center' style={{ width: axisWidth, margin: 0, marginTop: 2 }}>
        <tbody style={{border: 'none'}}>
          <tr style={{border: 'none'}}>
            <td style={{ ...cellStyle, textAlign: 'left', width: containerWidth / 2 }}>
              <Tooltip 
                placement="bottom-start"
                title={leftEnd}>
                <div style={{ maxWidth: containerWidth / 2, width: 'fit-content', overflow: 'hidden', textOverflow: 'ellipsis' }}>{leftEnd}</div>
              </Tooltip>
            </td>
            <td style={{ ...cellStyle, textAlign: 'right', width: containerWidth / 2 }}>
              <Tooltip 
                placement="bottom-end"
                title={rightEnd}>
                <div style={{ width: 'fit-content', maxWidth: containerWidth / 2, overflow: 'hidden', textOverflow: 'ellipsis', marginLeft: 'auto' }}>{rightEnd}</div>
              </Tooltip>
            </td>
          </tr>
        </tbody>
      </table>

      <table cellPadding='0' cellSpacing='0' align='center' style={{ width: axisWidth, margin: 0, marginTop: 12 }}>
      <tbody style={{border: 'none'}}>
          <tr style={{border: 'none'}}>
            <td style={{ ...cellStyle, textAlign: 'center', fontSize: 16, fontWeight: 500, width: containerWidth }}>
            <Tooltip title={horizontalAxisName}>
              <div style={{ width: 'fit-content', maxWidth: containerWidth, overflow: 'hidden', textOverflow: 'ellipsis', margin: 'auto' }}>{horizontalAxisName}</div>
            </Tooltip>
              {/* <div style={{ width: containerWidth, overflow: 'hidden', textOverflow: 'ellipsis' }}>{horizontalAxisName}</div> */}
            </td>
          </tr>
        </tbody>
      </table>
    </>
  )
}

const AxisY = ({
  axisHeight,
  verticalAxisName,
  topEnd,
  lowEnd,
  containerHeight,
  onEdit
}) => {
  const cellStyle = {
    fontSize: 12,
    whiteSpace: 'nowrap',
    color: '#637282'
  }
  return (
    <>
      <table cellPadding='0' cellSpacing='0' style={{ height: axisHeight, marginRight: 10 }}>
        <tbody style={{border: 'none'}}>
          <tr style={{ ...cellStyle, fontSize: 16, fontWeight: 500, border: 'none' }}>
            <td style={{border: 'none', height: containerHeight}}>
              <Tooltip
                placement="right"
                title={verticalAxisName}>
                <div style={{ width: 18, writingMode: 'vertical-lr', transform: 'rotate(180deg)', 
                  // overflow: 'hidden', 
                  textOverflow: 'ellipsis', maxWidth: containerHeight, height: 'fit-content',textAlign: 'center' }}>{verticalAxisName}</div>
              </Tooltip>
            </td>
          </tr>

        </tbody>
      </table>

      <table cellPadding='0' cellSpacing='0' style={{ height: axisHeight, marginRight: 8 }}>
        <tbody style={{border: 'none'}}>
          <tr style={{ ...cellStyle, border: 'none' }}>
          <td style={{border: 'none', height: containerHeight / 2 - 10, verticalAlign: 'top'}}>
            <Tooltip
              placement="top"
              title={topEnd}>
                <div style={{ width: 16, writingMode: 'vertical-rl', transform: 'rotate(180deg)', overflow: 'hidden', textOverflow: 'ellipsis', maxHeight: containerHeight / 2 - 10, height: 'fit-content', textAlign: 'right' }}>{topEnd}</div>
            </Tooltip>
            </td>
          </tr>

          <tr style={{ ...cellStyle, border: 'none' }}>
          <td style={{border: 'none', height: containerHeight / 2 - 10, verticalAlign: 'bottom'}}>
            <Tooltip 
              title={lowEnd}>
                <div style={{ width: 16, writingMode: 'vertical-rl', transform: 'rotate(180deg)', overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'left', maxHeight: containerHeight / 2 - 10, height: 'fit-content' }}>{lowEnd}</div>
            </Tooltip>
            </td>
          </tr>
        </tbody>
      </table>

      <table cellPadding='0' cellSpacing='0' style={{ height: axisHeight + 2, marginRight: -17, zIndex: 1 }}>
        <tbody style={{border: 'none'}}>
          <tr style={{ ...cellStyle, border: 'none' }}>
            <td style={{ textAlign: 'right', border: 'none' }}>
              <div style={{ width: 34, writingMode: 'vertical-rl', transform: 'rotate(180deg)', overflow: 'hidden', textOverflow: 'ellipsis', height: containerHeight / 2 - 24 - ICON_SPACING, textAlign: 'right', marginTop: ICON_SPACING }}>
                <EditButton src={edit2} onClick={() => onEdit(SETTING_VALUE.TOP_END)} />
              </div>
            </td>
          </tr>

          <tr style={{ ...cellStyle, border: 'none' }}>
          <td style={{border: 'none'}}>
              <EditButton src={edit2} onClick={() => onEdit(SETTING_VALUE.VERTICAL)} />
            </td>
          </tr>

          <tr style={{ ...cellStyle, border: 'none' }}>
            <td style={{ textAlign: 'left', border: 'none' }}>
              <div style={{ width: 34, writingMode: 'vertical-rl', transform: 'rotate(180deg)', overflow: 'hidden', textOverflow: 'ellipsis', height: containerHeight / 2 - 24 - ICON_SPACING, textAlign: 'left', marginBottom: ICON_SPACING }}>
                <EditButton src={edit2} onClick={() => onEdit(SETTING_VALUE.LOW_END)} />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  )
}

const CollaborationChartSetting = ({
  containerWidth = 664,
  containerHeight = 424,
  topLeft = 'Top left',
  topRight = 'Top right',
  bottomLeft = 'Bottom left',
  bottomRight = 'Bottom right',
  horizontalAxisName = 'Horizontal axis name',
  leftEnd = 'Left end',
  rightEnd = 'Right end',
  verticalAxisName = 'Vertical axis name',
  topEnd = 'Top end',
  lowEnd = 'Low end',
  passisCustomToRatingModalPreviewModeVertical,
  passisCustomToRatingModalPreviewModeHoronzal,
  inputSelectedX,
  inputSelectedY,
  isCustomHorozol,
  isCustomVertical,
  passisCustomToRatingModalPreviewModeOther,
  dataOriginal
}) => {
  const [isFieldChange, setIsFieldChange] = React.useState(false)
  const [openCofirmationModalForEachField, setOpenCofirmationModalForEachField] = React.useState(false)
  const [appContext, setAppContext] = useState({})
  const [state, setState] = useState({
    showModal: false,
    currentSettingIndex: null,
    inputValueModal: '',
    [SETTING_VALUE.TOP_LEFT]: topLeft,
    [SETTING_VALUE.TOP_RIGHT]: topRight,
    [SETTING_VALUE.BOTTOM_LEFT]: bottomLeft,
    [SETTING_VALUE.BOTTOM_RIGHT]: bottomRight,
    [SETTING_VALUE.LEFT_END]: leftEnd,
    [SETTING_VALUE.RIGHT_END]: rightEnd,
    [SETTING_VALUE.TOP_END]: topEnd,
    [SETTING_VALUE.LOW_END]: lowEnd,
    [SETTING_VALUE.HORIZONTAL]: horizontalAxisName,
    [SETTING_VALUE.VERTICAL]: verticalAxisName
  })

  const [isEditHorizontal, setIsEditHorizontal] = useState(isCustomHorozol)
  const [isVerticalEdit, setIsVerticalEdit] = useState(isCustomVertical)
  const [inputSelectedXValue, setinputSelectedXValue] = useState(inputSelectedX)
  const [inputSelectedYValue, setinputSelectedYValue] = useState(inputSelectedY)

  const { showModal, inputValueModal, currentSettingIndex, topLeftValue, topRightValue, bottomLeftValue, bottomRightValue, leftEndValue, rightEndValue, topEndValue, lowEndValue, horizontalAxisNameValue, verticalAxisNameValue } = state
  // areaDraw 1, 2 from the first row left to right
  // areaDraw 3, 4 from the second row left to right
  const { axis, axisContext } = appContext
 
React.useEffect(() => {
  isFieldChange && setOpenCofirmationModalForEachField(true)
  return () => {
    setIsFieldChange(false)
  }
}, [isFieldChange, setIsFieldChange])

  const onCloseModal = () => {
    const oldData = JSON.parse(sessionStorage.getItem('old-inputFieldChanged'))

    // Identifying which key is changed
    let keyFieldChanged = null
    Object.keys(oldData).some(key => {
      if(key === currentSettingIndex ) {
        keyFieldChanged = key
        return true
      }
    })

    if (String(oldData[keyFieldChanged]) !== String(inputValueModal.trim())) {
      setIsFieldChange(true)
    } else {
      setOpenCofirmationModalForEachField(false)
      
      setState(prevState => {
        return {
          ...prevState,
          showModal: false,
          currentSettingIndex: null
        }
      })

    }
    
    // setState(prevState => {
    //   return {
    //     ...prevState,
    //     showModal: false,
    //     currentSettingIndex: null
    //   }
    // })
  }

  const onEditSetting = (value) => {
    const currentData = JSON.parse(sessionStorage.getItem('chartData'))
    sessionStorage.setItem('old-inputFieldChanged', JSON.stringify({
      ...currentData
    }));

    setState(prevState => {
      return {
        ...prevState,
        showModal: true,
        currentSettingIndex: value,
        inputValueModal: state[value]
      }
    })
  }

  const onSaveModal = async() => {
    Promise.resolve()
      .then(() => { 
        setState(prevState => {
          return {
            ...prevState,
            showModal: false,
            [currentSettingIndex]: inputValueModal.trim()
          }
    })})
      .then(() => {
        if (currentSettingIndex === 'topEndValue' 
          || currentSettingIndex === 'lowEndValue'
          || currentSettingIndex === 'verticalAxisNameValue') {
            // setIsVerticalEdit(true)
          passisCustomToRatingModalPreviewModeVertical(true)
        }
        if (currentSettingIndex === 'leftEndValue'
        || currentSettingIndex === 'rightEndValue'
        || currentSettingIndex === 'horizontalAxisNameValue') {
          // setIsEditHorizontal(true)
          passisCustomToRatingModalPreviewModeHoronzal(true)
        } else {
          passisCustomToRatingModalPreviewModeOther(currentSettingIndex, inputValueModal.trim())
        }
      })
  }


useEffect(() => {
  sessionStorage.setItem('chartData', JSON.stringify({
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
    inputSelectedXValue: inputSelectedXValue,
    inputSelectedYValue: inputSelectedYValue,
    isEditHorizontal,
    isVerticalEdit
  }));

  const retrievedObject = JSON.parse(sessionStorage.getItem('chartData'))
  sessionStorage.setItem('old-data-edit-manually', JSON.stringify({...retrievedObject}))

    return () => {
      sessionStorage.removeItem('old-data-edit-manually')
    }
}, [])


  useEffect (() => {
    sessionStorage.setItem('chartData', JSON.stringify({
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
      inputSelectedXValue: inputSelectedXValue,
      inputSelectedYValue: inputSelectedYValue,
      isEditHorizontal,
      isVerticalEdit
    }));
  }, [
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
    isVerticalEdit,
    isEditHorizontal
  ])

  useEffect (() => {
    const retrievedObject = JSON.parse(sessionStorage.getItem('chartData'))

    setState(prevState => {
      return {
        ...prevState,
        [SETTING_VALUE.LEFT_END]: retrievedObject ? retrievedObject.leftEndValue : leftEnd,
        [SETTING_VALUE.RIGHT_END]: retrievedObject ? retrievedObject.rightEndValue : rightEnd,
        [SETTING_VALUE.TOP_END]: retrievedObject ? retrievedObject.topEndValue : topEnd,
        [SETTING_VALUE.LOW_END]: retrievedObject ? retrievedObject.lowEndValue : lowEnd,
        [SETTING_VALUE.HORIZONTAL]: retrievedObject ? retrievedObject.horizontalAxisNameValue : horizontalAxisName,
        [SETTING_VALUE.VERTICAL]: retrievedObject ? retrievedObject.verticalAxisNameValue : verticalAxisName,
        [SETTING_VALUE.TOP_LEFT]: retrievedObject ? retrievedObject.topLeftValue : topLeft,
        [SETTING_VALUE.TOP_RIGHT]: retrievedObject ? retrievedObject.topRightValue : topRight,
        [SETTING_VALUE.BOTTOM_LEFT]: retrievedObject ? retrievedObject.bottomLeftValue : bottomLeft,
        [SETTING_VALUE.BOTTOM_RIGHT]: retrievedObject ? retrievedObject.bottomRightValue : bottomRight,
      }
    })
    setIsEditHorizontal(isCustomHorozol)
    setIsVerticalEdit(isCustomVertical)
    setinputSelectedXValue(inputSelectedX)
    setinputSelectedYValue(inputSelectedY)
  }, [
    horizontalAxisName,
    leftEnd,
    rightEnd,
    verticalAxisName,
    topEnd,
    lowEnd,
    topLeft,
    topRight,
    bottomLeft,
    bottomRight,
    inputSelectedX,
    inputSelectedY,
    isCustomHorozol,
    isCustomVertical,
    setState,
    setIsEditHorizontal,
    setIsVerticalEdit,
    setinputSelectedXValue,
    setinputSelectedYValue
  ])


  const onChangeInputModal = (e) => {
    e.persist()
    setState(prevState => {
      return {
        ...prevState,
        inputValueModal: e.target.value
      }
    })
  }

  const drawLine = ({ begin, end }) => {
    axisContext.strokeStyle = '#979797'
    axisContext.beginPath()
    axisContext.moveTo(...begin)
    axisContext.lineTo(...end)
    axisContext.stroke()
  }

  const drawText = ({ x, y, text }) => {
    const lineHeight = 18
    const maxWidth = containerWidth / 2
    const words = text.split(' ')
    let line = ''

    axisContext.font = 'italic 15px L10'
    axisContext.fillStyle = 'rgb(224, 222, 222)'
    axisContext.textAlign = 'center'

    for(let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' '
      const metrics = axisContext.measureText(testLine)
      const testWidth = metrics.width
      if (testWidth > maxWidth && n > 0) {
        axisContext.fillText(line, x, y)
        line = words[n] + ' '
        y += lineHeight
      }
      else {
        line = testLine
      }
    }
    axisContext.fillText(line, x, y)
  }

  const drawTexts = () => {
    drawText({ x: containerWidth / 4, y: containerHeight / 4, text: topLeftValue })
    drawText({ x: containerWidth * 0.75, y: containerHeight / 4, text: topRightValue })
    drawText({ x: containerWidth * 0.25, y: containerHeight * 0.75, text: bottomLeftValue })
    drawText({ x: containerWidth * 0.75, y: containerHeight * 0.75, text: bottomRightValue })
  }

  const drawNormalAxis = () => {
    // clear before redrawing
    axisContext.clearRect(0, 0, containerWidth, containerHeight)

    drawLine({ begin: [0, axis.clientHeight / 2 + 0.5], end: [axis.clientWidth + 0.5, axis.clientHeight / 2 + 0.5] })
    drawLine({ begin: [axis.clientWidth / 2 + 0.5, 0], end: [axis.clientWidth / 2 + 0.5, axis.clientHeight + 0.5] })
    drawTexts()
  }

  useEffect(() => {
    if (appContext.axis) {
      drawNormalAxis()
    }
  }, [appContext, topLeftValue, topRightValue, bottomLeftValue, bottomRightValue])

  useEffect(() => {
    const canvasAxis = document.getElementById('setting-app-axis')
    if (canvasAxis) {
      canvasAxis.width = containerWidth
      canvasAxis.height = containerHeight

      setAppContext({
        axis: canvasAxis,
        axisContext: canvasAxis.getContext('2d')
      })
    }
  }, [])
  useEffect(() => {
    mockData.some(i => {
      if(String(inputSelectedX) === String(i.title) 
        && String(leftEnd) === String(i.leftAttr)
        && String(rightEnd) === String(i.rightAttr)
        && !isCustomHorozol) {
          setState(prevState => {
            return {
              ...prevState,
              [SETTING_VALUE.LEFT_END]: i.leftAttr,
              [SETTING_VALUE.RIGHT_END]: i.rightAttr,
              [SETTING_VALUE.HORIZONTAL]: i.nameAxis,
            }
          })

          return true
      } else if (String(inputSelectedX) === String(i.title) && isCustomHorozol) {
        setState(prevState => {
          return {
            ...prevState,
            [currentSettingIndex]: inputValueModal.trim()
          }
        })

        return true
      }
  })
  }, [inputSelectedX] )

  useEffect(() => {
    mockData.some(i => {
      if(String(inputSelectedY) === String(i.title) 
        && String(lowEnd) === String(i.leftAttr)
        && String(topEnd) === String(i.rightAttr)
        && !isCustomVertical) {
          setState(prevState => {
            return {
              ...prevState,
              [SETTING_VALUE.LOW_END]: i.leftAttr,
              [SETTING_VALUE.TOP_END]: i.rightAttr,
              [SETTING_VALUE.VERTICAL]: i.nameAxis,
            }
          })
          return true
      } else if (String(inputSelectedY) === String(i.title) && isCustomVertical) {
        setState(prevState => {
          return {
            ...prevState,
            [currentSettingIndex]: inputValueModal.trim()
          }
        })

        return true
      }
  })
  }, [inputSelectedY] )
  const setCanvas = useCallback((node) => {
    // set one time only
    if (node && !axisContext) {
      node.width = containerWidth
      node.height = containerHeight
      setAppContext({
        axis: node,
        axisContext: node.getContext('2d')
      })
    }
  }, [])

        
        const closeCofirmationModalForEachFieldHandle = () => {
          setOpenCofirmationModalForEachField(false)

      }
      
  return (
    <>
      <GlobalStyle />
      {showModal && (
        <Modal
          isOpen={showModal}
          onRequestClose={onCloseModal}
          style={confirmDialogModalStyles}
          ariaHideApp={false}
        >
          <ModalContent style={{ zIndex: 2 }}>
            <ModalTitle>{getLanguage() === 'en' ? SETTING_VALUE_TITLEEng[currentSettingIndex] : SETTING_VALUE_TITLEFin[currentSettingIndex]}</ModalTitle>
            <ModalInputValue value={inputValueModal} maxLength={40} onChange={onChangeInputModal} />
            <ModalInputHint>{requestTranslation('max40Chars')}</ModalInputHint>

            <ButtonModalActions>
              <button onClick={onCloseModal} className="btn btn-lg btn-plain-gray">{requestTranslation('cancel')}</button>
              <button onClick={onSaveModal} className="btn btn-lg btn-primary">{requestTranslation('done')}</button>
            </ButtonModalActions>
          </ModalContent>

          <ConfirmationModalFoCollabTool 
            ConfirmationModalNote= {requestTranslation('closeCollabToolNote')}
            confirmationModal={openCofirmationModalForEachField}
            yesConfirmationHandleBtn={() => {
              const oldDataStorage = JSON.parse(sessionStorage.getItem('old-data-edit-manually'))
              sessionStorage.setItem('chartData', JSON.stringify({...oldDataStorage}))
              closeCofirmationModalForEachFieldHandle()
              setState(prevState => {
                return {
                  ...prevState,
                  showModal: false,
                  currentSettingIndex: null
                }
              })
              // handleRatingPreviewEditModeClose()
              // closeCofirmationModalForRatingEditModeHandle() // close confirmation small Modal
              // syncChartData()
          }}
          noConfirmationHandleBtn={closeCofirmationModalForEachFieldHandle} 
          />
        </Modal>
      )}

      <div style={{ display: 'flex', width: `${containerWidth}px` }}>
        <AxisY onEdit={onEditSetting} containerHeight={containerHeight} axisHeight={containerHeight} verticalAxisName={verticalAxisNameValue} topEnd={topEndValue} lowEnd={lowEndValue} />
        <div style={{ width: containerWidth, height: containerHeight }}>
          <div style={{ position: 'relative', width: containerWidth, height: containerHeight, background: 'white' }}>
            <svg id='svg-app' style={{ position: 'absolute', width: containerWidth + 2, height: containerHeight + 2 }}>
              <foreignObject x={containerWidth / 2 - 80} y={containerHeight / 2 - 80} width='34' height='34'>
                <EditButton src={edit2} onClick={() => onEditSetting(SETTING_VALUE.TOP_LEFT)} />
              </foreignObject>
              <foreignObject x={containerWidth / 2 - 80} y={containerHeight / 2 + 40} width='34' height='34'>
                <EditButton src={edit2} onClick={() => onEditSetting(SETTING_VALUE.BOTTOM_LEFT)} />
              </foreignObject>

              <foreignObject x={containerWidth / 2 + 40} y={containerHeight / 2 - 80} width='34' height='34'>
                <EditButton src={edit2} onClick={() => onEditSetting(SETTING_VALUE.TOP_RIGHT)} />
              </foreignObject>
              <foreignObject x={containerWidth / 2 + 40} y={containerHeight / 2 + 40} width='34' height='34'>
                <EditButton src={edit2} onClick={() => onEditSetting(SETTING_VALUE.BOTTOM_RIGHT)} />
              </foreignObject>
            </svg>
            <CanvasContainer ref={setCanvas} id='setting-app-axis' style={{ width: containerWidth, height: containerHeight }} />
          </div>
          <AxisX onEdit={onEditSetting} containerWidth={containerWidth} axisWidth={containerWidth} horizontalAxisName={horizontalAxisNameValue} leftEnd={leftEndValue} rightEnd={rightEndValue} />
        </div>
      </div>
    </>
  )
}

export default CollaborationChartSetting