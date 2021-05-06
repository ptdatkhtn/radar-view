import { createGlobalStyle } from 'styled-components'

export const RadarStyles = createGlobalStyle` 
   html, body {
      overflow: hidden !important;
      font-family: 'L10' !important;
  }
  
  .radar-widget-title {
    font-size: 18px;
  }

  .showSharedLinkBtn {
    position: absolute;
    top: 320px;
    left: 50%;
    border-radius: 0;
    color: white;
    width: 240px;
    left: calc(50% - 120px);
  }
`