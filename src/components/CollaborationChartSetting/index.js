import React, { useEffect, useState, useCallback } from 'react'
import styled, { createGlobalStyle } from 'styled-components'
// import Modal from 'react-modal'
import edit1 from './edit1.svg'
import edit2 from './edit2.svg'
import {
    Loading,
    Radiobox,
    Checkbox,
    Modal, 
    confirmDialogModalStyles
} from '@sangre-fp/ui'

import { mockData } from '../RatingModalPreviewEditMode/RatingModalPreviewEditMode'
const GlobalStyle = createGlobalStyle`
  .ReactModal__Overlay--after-open {
    background-color: rgba(0,0,0,.77)!important;
  }
`

const CanvasContainer = styled.canvas`
  border: 1px solid #979797;
`
const ButtonModalStyled = styled.button`
  cursor: pointer;
  height: 46px;
  background-color: ${({ primary }) => !!primary ? '#6FBF40' : 'rgba(0,0,0,0)'};
  border: none;
  border-radius: 26px;
  width: 86px;
  color: ${({ primary }) => !!primary ? 'white' : '#666'};
  font-weight: 700;
  font-size: 16px;
  margin-right: ${({ marginRight }) => !!marginRight ? marginRight : 0}px;
  :hover {
    opacity: 0.8;
  }
  :disabled {
    opacity: 0.5;
    cursor: unset;
  }
`
const ButtonModalActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`
const ModalContent = styled.div`
  padding: 12px 16px;
`

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: 450,
    height: 276,
    boxSizing: 'border-box'
  },
}
const EditButton = styled.img`
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`
const ModalTitle = styled.h2`
  color: #121212;
  font-weight: 700;
  font-size: 20px;
  margin: 0;
  margin-bottom: 24px;
`
const ModalInputHint = styled.div`
  color: #121212;
  font-weight: 400;
  font-size: 14px;
  margin: 24px 0;
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
const SETTING_VALUE_TITLE = {
  [SETTING_VALUE.TOP_LEFT]: 'Inner axis - top left',
  [SETTING_VALUE.TOP_RIGHT]: 'Inner axis - top right',
  [SETTING_VALUE.BOTTOM_LEFT]: 'Inner axis - bottom left',
  [SETTING_VALUE.BOTTOM_RIGHT]: 'Inner axis - bottom right',
  [SETTING_VALUE.LEFT_END]: 'Horizontal axis - left end',
  [SETTING_VALUE.RIGHT_END]: 'Horizontal axis - right end',
  [SETTING_VALUE.TOP_END]: 'Vertical axis - top end',
  [SETTING_VALUE.LOW_END]: 'Vertical axis - low end',
  [SETTING_VALUE.HORIZONTAL]: 'Horizontal axis - horizontal',
  [SETTING_VALUE.VERTICAL]: 'Vertical axis - vertical',
}

const AxisX = ({
  axisWidth,
  horizontalAxisName,
  leftEnd,
  rightEnd,
  containerWidth,
  onEdit
}) => {
  const cellStyle = { fontSize: 10, height: 16, whiteSpace: 'nowrap', color: '#637282' }
  return (
    <>
      <table cellPadding='0' cellSpacing='0' align='center' style={{ width: axisWidth, margin: 0, marginTop: 8 }}>
        <tbody style={{border: 'none'}}>
          <tr>
            <td style={{ ...cellStyle, textAlign: 'left' }}>
              <div style={{ width: containerWidth / 2, overflow: 'hidden', textOverflow: 'ellipsis' }}>{leftEnd}</div>
            </td>
            <td style={{ ...cellStyle, textAlign: 'right' }}>
              <div style={{ width: containerWidth / 2, overflow: 'hidden', textOverflow: 'ellipsis' }}>{rightEnd}</div>
            </td>
          </tr>
        </tbody>
      </table>

      <table cellPadding='0' cellSpacing='0' align='center' style={{ width: axisWidth, margin: 0, marginTop: 12 }}>
        <tbody style={{border: 'none'}}>
          <tr>
            <td style={{ ...cellStyle, textAlign: 'center', fontSize: 16, fontWeight: 500 }}>
              <div style={{ width: containerWidth, overflow: 'hidden', textOverflow: 'ellipsis' }}>{horizontalAxisName}</div>
            </td>
          </tr>
        </tbody>
      </table>

      <table cellPadding='0' cellSpacing='0' align='center' style={{ width: axisWidth, margin: 0, marginTop: 4 }}>
        <tbody style={{border: 'none'}}>
          <tr>
            <td style={{ ...cellStyle, fontSize: 16, fontWeight: 500 }}>
              <EditButton src={edit2} onClick={() => onEdit(SETTING_VALUE.LEFT_END)} />
            </td>
            <td style={{ ...cellStyle, textAlign: 'center', fontSize: 16, fontWeight: 500 }}>
              <EditButton src={edit1} onClick={() => onEdit(SETTING_VALUE.HORIZONTAL)} />
            </td>
            <td style={{ ...cellStyle, textAlign: 'right', fontSize: 16, fontWeight: 500 }}>
              <EditButton src={edit1} onClick={() => onEdit(SETTING_VALUE.RIGHT_END)} />
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
    fontSize: 10,
    whiteSpace: 'nowrap',
    color: '#637282'
  }
  return (
    <>
      <table cellPadding='0' cellSpacing='0' style={{ height: axisHeight, marginRight: 24, border: 'none' }}>
        <tbody style={{border: 'none'}}>
          <tr style={{ ...cellStyle, border: 'none' }}>
            <td style={{ textAlign: 'right', border: 'none' }}>
              <div style={{ width: 34, writingMode: 'vertical-rl', transform: 'rotate(180deg)', overflow: 'hidden', textOverflow: 'ellipsis', height: containerHeight / 2 - 24, textAlign: 'right' }}>
                <EditButton src={edit2} onClick={() => onEdit(SETTING_VALUE.TOP_END)} />
              </div>
            </td>
          </tr>

          <tr style={{ ...cellStyle, border: 'none' }}>
            <td>
              <EditButton src={edit2} onClick={() => onEdit(SETTING_VALUE.VERTICAL)} />
            </td>
          </tr>

          <tr style={{ ...cellStyle, border: 'none' }}>
            <td style={{ textAlign: 'left', border: 'none' }}>
              <div style={{ width: 34, writingMode: 'vertical-rl', transform: 'rotate(180deg)', overflow: 'hidden', textOverflow: 'ellipsis', height: containerHeight / 2 - 24, textAlign: 'left' }}>
                <EditButton src={edit2} onClick={() => onEdit(SETTING_VALUE.LOW_END)} />
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <table cellPadding='0' cellSpacing='0' style={{ height: axisHeight, marginRight: 12, border: 'none' }}>
        <tbody style={{border: 'none'}}>
          <tr style={{ ...cellStyle, fontSize: 16, fontWeight: 500, border: 'none' }}>
            <td>
              <div style={{ width: 16, writingMode: 'vertical-lr', transform: 'rotate(180deg)', overflow: 'hidden', textOverflow: 'ellipsis', height: containerHeight, textAlign: 'center' }}>{verticalAxisName}</div>
            </td>
          </tr>

        </tbody>
      </table>

      <table cellPadding='0' cellSpacing='0' style={{ height: axisHeight, marginRight: 8, border: 'none' }}>
        <tbody style={{border: 'none'}}>
          <tr style={{ ...cellStyle, border: 'none' }}>
            <td>
              <div style={{ width: 16, writingMode: 'vertical-rl', transform: 'rotate(180deg)', overflow: 'hidden', textOverflow: 'ellipsis', height: containerHeight / 2 - 10, textAlign: 'right' }}>{topEnd}</div>
            </td>
          </tr>

          <tr style={{ ...cellStyle }}>
            <td>
              <div style={{ width: 16, writingMode: 'vertical-rl', transform: 'rotate(180deg)', overflow: 'hidden', textOverflow: 'ellipsis', height: containerHeight / 2 - 10, textAlign: 'left' }}>{lowEnd}</div>
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
  isCustomVertical
}) => {
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
    [SETTING_VALUE.VERTICAL]: verticalAxisName,
  })
  const [isEditHorizontal, setIsEditHorizontal] = useState(isCustomHorozol)
  const [isVerticalEdit, setIsVerticalEdit] = useState(isCustomVertical)
  const [inputSelectedXValue, setinputSelectedXValue] = useState(inputSelectedX)
  const [inputSelectedYValue, setinputSelectedYValue] = useState(inputSelectedY)

  const { showModal, inputValueModal, currentSettingIndex, topLeftValue, topRightValue, bottomLeftValue, bottomRightValue, leftEndValue, rightEndValue, topEndValue, lowEndValue, horizontalAxisNameValue, verticalAxisNameValue } = state
  // areaDraw 1, 2 from the first row left to right
  // areaDraw 3, 4 from the second row left to right
  const { axis, axisContext } = appContext

  const onCloseModal = () => {
    setState(prevState => {
      return {
        ...prevState,
        showModal: false,
        currentSettingIndex: null
      }
    })
  }

  const onEditSetting = (value) => {
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
      .then(() => { setState(prevState => {
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
            setIsVerticalEdit(true)
          passisCustomToRatingModalPreviewModeVertical(true)
        }
        if (currentSettingIndex === 'leftEndValue'
        || currentSettingIndex === 'rightEndValue'
        || currentSettingIndex === 'horizontalAxisNameValue') {
          setIsEditHorizontal(true)
          passisCustomToRatingModalPreviewModeHoronzal(true)
        }
      })

    

    

    // localStorage.setItem('chartData', JSON.stringify({
    //   leftEndValue, 
    //   rightEndValue, 
    //   topEndValue, 
    //   lowEndValue, 
    //   horizontalAxisNameValue, 
    //   verticalAxisNameValue,
    //   topLeftValue, 
    //   topRightValue, 
    //   bottomLeftValue, 
    //   bottomRightValue,
    //   inputSelectedXValue: inputSelectedXValue,
    //   inputSelectedYValue: inputSelectedYValue
    // }));
  }

  useEffect (() => {
    localStorage.setItem('chartData', JSON.stringify({
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
    setState(prevState => {
      return {
        ...prevState,
        [SETTING_VALUE.LEFT_END]: leftEnd,
        [SETTING_VALUE.RIGHT_END]: rightEnd,
        [SETTING_VALUE.TOP_END]: topEnd,
        [SETTING_VALUE.LOW_END]: lowEnd,
        [SETTING_VALUE.HORIZONTAL]: horizontalAxisName,
        [SETTING_VALUE.VERTICAL]: verticalAxisName,
        [SETTING_VALUE.TOP_LEFT]: topLeft,
        [SETTING_VALUE.TOP_RIGHT]: topRight,
        [SETTING_VALUE.BOTTOM_LEFT]: bottomLeft,
        [SETTING_VALUE.BOTTOM_RIGHT]: bottomRight,
      }
    })
    setIsEditHorizontal(isCustomHorozol)
    setIsVerticalEdit(isCustomVertical)
    setinputSelectedXValue(inputSelectedX)
    setinputSelectedYValue(inputSelectedY)

    // localStorage.setItem('chartData', JSON.stringify({
    //   leftEndValue: leftEnd, 
    //   rightEndValue: rightEnd, 
    //   topEndValue: topEnd, 
    //   lowEndValue: lowEnd, 
    //   horizontalAxisNameValue: horizontalAxisName, 
    //   verticalAxisNameValue: verticalAxisName,
    //   topLeftValue: topLeft, 
    //   topRightValue: topRight, 
    //   bottomLeftValue: bottomLeft, 
    //   bottomRightValue: bottomRight,
    //   inputSelectedXValue: inputSelectedX,
    //   inputSelectedYValue: inputSelectedY
    // }));
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
    axisContext.lineWidth = 1
    axisContext.strokeStyle = 'rgb(37 37 37)'
    axisContext.beginPath()
    axisContext.moveTo(...begin)
    axisContext.lineTo(...end)
    axisContext.stroke()
  }

  const drawText = ({ x, y, text }) => {
    axisContext.font = 'italic 16px Arial'
    axisContext.fillStyle = 'rgb(224, 222, 222)'
    axisContext.textAlign = 'center'
    axisContext.fillText(text, x, y)
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

    drawLine({ begin: [0, axis.clientHeight / 2], end: [axis.clientWidth, axis.clientHeight / 2] })
    drawLine({ begin: [axis.clientWidth / 2, 0], end: [axis.clientWidth / 2, axis.clientHeight] })
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
              [SETTING_VALUE.HORIZONTAL]: inputSelectedX,
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
              [SETTING_VALUE.VERTICAL]: inputSelectedY,
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

  console.log('verticalAxisName', bottomRight)
  return (
    <>
      <GlobalStyle />
      <div style={{ display: 'flex', width: `${containerWidth}px` }}>
        <AxisY onEdit={onEditSetting} containerHeight={containerHeight} axisHeight={containerHeight} verticalAxisName={verticalAxisNameValue} topEnd={topEndValue} lowEnd={lowEndValue} />
        <div style={{ width: containerWidth, height: containerHeight }}>
          <div style={{ position: 'relative', width: containerWidth, height: containerHeight, background: 'white' }}>
            <svg id='svg-app' style={{ position: 'absolute', width: containerWidth, height: containerHeight }}>
              <foreignObject x={containerWidth / 2 - 80} y={containerHeight / 2 - 80} width='34' height='34'>
                <EditButton src={edit2} onClick={() => onEditSetting(SETTING_VALUE.TOP_LEFT)} />
              </foreignObject>
              <foreignObject x={containerWidth / 2 - 80} y={containerHeight / 2 + 40} width='34' height='34'>
                <EditButton src={edit2} onClick={() => onEditSetting(SETTING_VALUE.BOTTOM_LEFT)} />
              </foreignObject>

              <foreignObject x={containerWidth / 2 + 40} y={containerHeight / 2 - 80} width='32' height='32'>
                <EditButton src={edit1} onClick={() => onEditSetting(SETTING_VALUE.TOP_RIGHT)} />
              </foreignObject>
              <foreignObject x={containerWidth / 2 + 40} y={containerHeight / 2 + 40} width='32' height='32'>
                <EditButton src={edit1} onClick={() => onEditSetting(SETTING_VALUE.BOTTOM_RIGHT)} />
              </foreignObject>

            </svg>
            <CanvasContainer ref={setCanvas } id='setting-app-axis' style={{ width: containerWidth, height: containerHeight }}/>
          </div>
          <AxisX onEdit={onEditSetting} containerWidth={containerWidth} axisWidth={containerWidth} horizontalAxisName={horizontalAxisNameValue} leftEnd={leftEndValue} rightEnd={rightEndValue} />
        </div>
      </div>

      {showModal && (
        <Modal
          isOpen={showModal}
          onRequestClose={onCloseModal}
          style={confirmDialogModalStyles}
          ariaHideApp={false}
        >
          <ModalContent>
            <ModalTitle>{SETTING_VALUE_TITLE[currentSettingIndex]}</ModalTitle>
            <ModalInputValue value={inputValueModal} maxLength={20} onChange={onChangeInputModal} />
            <ModalInputHint>(max. 20 characters)</ModalInputHint>

            <ButtonModalActions>
              <ButtonModalStyled marginRight={12} onClick={onCloseModal}>Cancel</ButtonModalStyled>
              <ButtonModalStyled primary disabled={!inputValueModal} onClick={onSaveModal}>SAVE</ButtonModalStyled>
            </ButtonModalActions>
          </ModalContent>
        </Modal>
      )}
    </>
  )
}

export default CollaborationChartSetting