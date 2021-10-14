import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import AxisPreview from './AxisPreview'
import { requestTranslation, getLanguage } from "@sangre-fp/i18n";
import Tooltip from '@mui/material/Tooltip';

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
  const cellStyle = { fontSize: 12, height: 16, fontFamily: 'L10',whiteSpace: 'nowrap', color: '#637282' }
  return (
    <>
      <table cellPadding='0' cellSpacing='0' align='center' style={{ width: axisWidth, margin: 0, border: 'none' }}>
        <tbody style={{ border: 'none' }}>
          <tr style={{ border: 'none' }}>
            <td style={{ ...cellStyle, textAlign: 'left', width: containerWidth / 2 }}>
              <Tooltip 
                  placement="bottom-start"
                  title={leftEnd}>
                  <div style={{ maxWidth: containerWidth / 2, width: 'fit-content',  overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: 'L10' }}>{leftEnd}</div>
                </Tooltip>
            </td>
            <td style={{ ...cellStyle, textAlign: 'right', width: containerWidth / 2 }}>
              <Tooltip 
                      placement="bottom-end"
                      title={rightEnd}>
                      <div style={{ marginLeft: 'auto', maxWidth: containerWidth / 2, width: 'fit-content', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: 'L10' }}>{rightEnd}</div>
                    </Tooltip>
            </td>
          </tr>
        </tbody>
      </table>

      <table cellPadding='0' cellSpacing='0' align='center' style={{ width: axisWidth, margin: 0 }}>
        <tbody style={{ border: 'none' }}>
          <tr style={{ ...cellStyle, border: 'none', fontSize: 16, fontWeight: 500 }}>
            <td style={{ ...cellStyle, textAlign: 'center', fontSize: 16, fontWeight: 500, width: containerWidth }}>
              <Tooltip 
                    // placement="bottom-start"
                    title={horizontalAxisName}>
                    <div style={{ margin: 'auto', width: 'fit-content', maxWidth: containerWidth, overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: 'L10' }}>{horizontalAxisName}</div>
                  </Tooltip>
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
    color: '#637282',
    fontFamily: 'L10'
  }
  return (
    <>
      <table cellPadding='0' cellSpacing='0' style={{ height: axisHeight }}>
        <tbody style={{ border: 'none' }}>
          <tr style={{ ...cellStyle, border: 'none', fontSize: 16, fontWeight: 500 }}>
            <td style={{ border: 'none', height: containerHeight }}>
            <Tooltip 
                    placement="right"
                    title={verticalAxisName}>
                      <div style={{ width: 18, writingMode: 'vertical-lr', transform: 'rotate(180deg)', 
                        // overflow: 'hidden', 
                        textOverflow: 'ellipsis', maxWidth: containerHeight, height: 'fit-content', textAlign: 'center', fontFamily: 'L10' }}>{verticalAxisName}</div>
                  </Tooltip>
              
            </td>
          </tr>
          
        </tbody>
      </table>

      <table cellPadding='0' cellSpacing='0' style={{ height: axisHeight, border: 'none' }}>
        <tbody style={{ border: 'none' }}>
          <tr style={{ ...cellStyle, border: 'none' }}>
            <td style={{ border: 'none', height: containerHeight / 2 - 10, verticalAlign: 'top' }}>
            <Tooltip 
                    placement="top"
                    title={topEnd}>
                      <div style={{ width: 16, writingMode: 'vertical-rl', transform: 'rotate(180deg)', overflow: 'hidden', textOverflow: 'ellipsis', maxHeight: containerHeight / 2 - 10, height: 'fit-content', textAlign: 'right', fontFamily: 'L10' }}>{topEnd}</div>
                  </Tooltip>
            </td>
          </tr>

          <tr style={{ ...cellStyle, border: 'none' }}>
            <td style={{ border: 'none', height: containerHeight / 2 - 10, verticalAlign: 'bottom' }}>
            <Tooltip 
                    // placement="bottom-start"
                    title={lowEnd}>
                    <div style={{ width: 16, writingMode: 'vertical-rl', transform: 'rotate(180deg)', overflow: 'hidden', textOverflow: 'ellipsis', maxHeight: containerHeight / 2 - 10, height: 'fit-content', textAlign: 'left', fontFamily: 'L10' }}>{lowEnd}</div>
                  </Tooltip>
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
    const lineHeight = 18
    const maxWidth = containerWidth / 2
    const words = text.split(' ')
    let line = ''

    axisContext.font = 'italic 15px L10'
    axisContext.fillStyle = 'rgb(224, 222, 222)'
    axisContext.textAlign = 'center'
    // axisContext.fillText(text, x, y)

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
    drawText({ x: containerWidth / 4, y: containerHeight / 4, text: topLeft })
    drawText({ x: containerWidth * 0.75, y: containerHeight / 4, text: topRight})
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
      <div style={{ display: 'flex', width: `${containerWidth}px`, fontFamily: 'L10' }}>
        <AxisY containerHeight={containerHeight} axisHeight={containerHeight} verticalAxisName={verticalAxisName} topEnd={topEnd} lowEnd={lowEnd}/>
        <div style={{ width: containerWidth, height: containerHeight, fontFamily: 'L10' }}>
          <div style={{ position: 'relative', width: containerWidth, height: containerHeight, background: 'white', fontFamily: 'L10' }}>
            <CanvasContainer id='axis'/>
          </div>
          <AxisX containerWidth={containerWidth} axisWidth={containerWidth} horizontalAxisName={horizontalAxisName} leftEnd={leftEnd} rightEnd={rightEnd}/>
        </div>
      </div>
    </>
  )
}

export default RatingSummaryPreview