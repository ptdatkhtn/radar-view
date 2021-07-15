import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  width: ${({ containerWidth }) => `${containerWidth}px`};
`

const TitleWrapper = styled.h3`
  &&{
    font-size: 14px;
    font-weight: bold;
    color: #121212;
    margin-bottom: 20px;
  }
`
const AxisLabelContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 14px;
`

const BarContainer = styled.div`
  position: relative;
  width: 100%;
  height: 20px;
`
const Line = styled.div`
  position: absolute;
  background-color: #979797;
  border-radius: 6px;
  height: 6px;
  width: 100%;
`
const Circle = styled.div`
  position: absolute;
  background-color: #979797;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  left: 50%;
  top: -35%;
`

const AxisPreview = ({
  containerWidth,
  title,
  leftLabel,
  rightLabel
}) => {
  return (
    <Container containerWidth={containerWidth}>
      <TitleWrapper>{title}</TitleWrapper>
      <AxisLabelContainer>
        <div>{leftLabel}</div>
        <div>{rightLabel}</div>
      </AxisLabelContainer>
      <BarContainer>
        <Line/>
        <Circle/>
      </BarContainer>
    </Container>
  )
}

export default AxisPreview