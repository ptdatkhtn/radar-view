import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import AxisPreview from './AxisPreview'
import { requestTranslation } from "@sangre-fp/i18n";
const LABEL_WIDTH = 16

const CanvasContainer = styled.canvas`
  border: 1px solid #979797;
`

export const HeaderContainer = styled.h2`
  &&{
    font-weight: normal;
    font-size: 16px;
  }
`
export const Spacing = styled.div`
  background-color: #f1f3f3;
  width: 100%;
  height: ${({ customHeight }) => `${customHeight}px`};
`

const AxisX = ({
  axisWidth,
  horizontalAxisName,
  leftEnd,
  rightEnd,
  containerWidth
}) => {
  const cellStyle = { fontSize: 12, height: 16, whiteSpace: 'nowrap', color: '#979797' }
  return (
    <>
      <table cellPadding='0' cellSpacing='0' align='center' style={{ width: axisWidth, margin: 0, border: 'none' }}>
        <tbody style={{ border: 'none' }}>
          <tr style={{ border: 'none' }}>
            <td style={{ ...cellStyle, textAlign: 'left' }}>
              <div style={{ width: containerWidth / 2, overflow: 'hidden', textOverflow: 'ellipsis' }}>{leftEnd}</div>
            </td>
            <td style={{ ...cellStyle, textAlign: 'right' }}>
              <div style={{ width: containerWidth / 2, overflow: 'hidden', textOverflow: 'ellipsis' }}>{rightEnd}</div>
            </td>
          </tr>
        </tbody>
      </table>

      <table cellPadding='0' cellSpacing='0' align='center' style={{ width: axisWidth, margin: 0 }}>
        <tbody style={{ border: 'none' }}>
          <tr style={{ border: 'none' }}>
            <td style={{ ...cellStyle, textAlign: 'center' }}>
              <div style={{ width: containerWidth, overflow: 'hidden', textOverflow: 'ellipsis' }}>{horizontalAxisName}</div>
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
  containerHeight
}) => {
  const cellStyle = {
    fontSize: 12,
    whiteSpace: 'nowrap',
    color: '#979797'
  }
  return (
    <>
      <table cellPadding='0' cellSpacing='0' style={{ height: axisHeight }}>
        <tbody style={{ border: 'none' }}>
          <tr style={{ ...cellStyle, border: 'none' }}>
            <td style={{ border: 'none' }}>
              <div style={{ width: 16, writingMode: 'vertical-lr', transform: 'rotate(180deg)', overflow: 'hidden', textOverflow: 'ellipsis', height: containerHeight, textAlign: 'center' }}>{verticalAxisName}</div>
            </td>
          </tr>
          
        </tbody>
      </table>

      <table cellPadding='0' cellSpacing='0' style={{ height: axisHeight, border: 'none' }}>
        <tbody style={{ border: 'none' }}>
          <tr style={{ ...cellStyle, border: 'none' }}>
            <td style={{ border: 'none' }}>
              <div style={{ width: 16, writingMode: 'vertical-rl', transform: 'rotate(180deg)', overflow: 'hidden', textOverflow: 'ellipsis', height: containerHeight / 2 - 10, textAlign: 'right' }}>{topEnd}</div>
            </td>
          </tr>

          <tr style={{ ...cellStyle, border: 'none' }}>
            <td style={{ border: 'none' }}>
              <div style={{ width: 16, writingMode: 'vertical-rl', transform: 'rotate(180deg)', overflow: 'hidden', textOverflow: 'ellipsis', height: containerHeight / 2 - 10, textAlign: 'left' }}>{lowEnd}</div>
            </td>
          </tr>
          
        </tbody>
      </table>
    </>
  )
}

const RatingSummaryPreview = ({
  topHeader = 'Preview for content cards:',
  bottomHeader = '',
  containerWidth = 400,
  containerHeight = 400,
  topLeft = requestTranslation('topLeft'),
  topRight = requestTranslation('topRight'),
  bottomLeft = requestTranslation('bottomLeft'),
  bottomRight = requestTranslation('bottomRight'),
  horizontalAxisName = requestTranslation('HorizontalAxisName'),
  leftEnd = requestTranslation('leftEnd'),
  rightEnd = requestTranslation('rightEnd'),
  verticalAxisName = requestTranslation('verticalAxisName'),
  topEnd = requestTranslation('highEnd'),
  lowEnd = requestTranslation('lowEnd')
}) => {
  const [appContext, setAppContext] = useState({})
  // areaDraw 1, 2 from the first row left to right
  // areaDraw 3, 4 from the second row left to right
  const { axis, axisContext } = appContext

  const drawLine = ({ begin, end }) => {
    axisContext.lineWidth = 1
    axisContext.strokeStyle = 'rgb(37 37 37)'
    axisContext.beginPath()
    axisContext.moveTo(...begin)
    axisContext.lineTo(...end)
    axisContext.stroke()
  }

  const drawText = ({ x, y, text }) => {
    axisContext.font = 'italic 14px Arial'
    axisContext.strokeStyle = 'rgb(224, 222, 222)'
    axisContext.fillStyle = 'rgb(224, 222, 222)'
    axisContext.textAlign = 'center'
    axisContext.fillText(text, x, y)
  }

  const drawTexts = () => {
    drawText({ x: containerWidth / 4, y: containerHeight / 4, text: topLeft })
    drawText({ x: containerWidth * 0.75, y: containerHeight / 4, text: topRight })
    drawText({ x: containerWidth * 0.25, y: containerHeight * 0.75, text: bottomLeft })
    drawText({ x: containerWidth * 0.75, y: containerHeight * 0.75, text: bottomRight })
  }

  const drawNormalAxis = () => {
    axis.width = containerWidth
    axis.height = containerHeight
    
    drawLine({ begin: [0, axis.clientHeight / 2], end: [axis.clientWidth, axis.clientHeight / 2] })
    drawLine({ begin: [axis.clientWidth / 2, 0], end: [axis.clientWidth / 2, axis.clientHeight] })
    drawTexts()
  }

  useEffect(() => {
    if (appContext.axis) {
      drawNormalAxis()
    }
  }, [appContext, topLeft, topRight, bottomLeft, bottomRight, containerWidth])

  useEffect(() => {
    const canvasAxis = document.getElementById('axis')

    setAppContext({
      axis: canvasAxis,
      axisContext: canvasAxis.getContext('2d'),
      svgApp: document.getElementById('svg-app')
    })
  }, [])

  return (
    <>
      <HeaderContainer>{bottomHeader}</HeaderContainer>
      {/* <Spacing customHeight={10}/> */}
      <div style={{ display: 'flex', width: `${containerWidth}px` }}>
        <AxisY containerHeight={containerHeight} axisHeight={containerHeight} verticalAxisName={verticalAxisName} topEnd={topEnd} lowEnd={lowEnd}/>
        <div style={{ width: containerWidth, height: containerHeight }}>
          <div style={{ position: 'relative', width: containerWidth, height: containerHeight, background: 'white' }}>
            <CanvasContainer id='axis'/>
          </div>
          <AxisX containerWidth={containerWidth} axisWidth={containerWidth} horizontalAxisName={horizontalAxisName} leftEnd={leftEnd} rightEnd={rightEnd}/>
        </div>
      </div>
    </>
  )
}

export default RatingSummaryPreview