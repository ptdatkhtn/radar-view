import { createGlobalStyle } from 'styled-components'

export const RadarStyles = createGlobalStyle` 
   html, body {
      overflow: hidden !important;
      font-family: 'L10' !important;
  }
  
  .radar-widget-title {
    font-size: 18px;
  }
  
  .fp-wysiwyg .ql-editor p, 
  .fp-wysiwyg .ql-editor h1,
  .fp-wysiwyg .ql-editor h2,
  .fp-wysiwyg .ql-editor h3,
  .fp-wysiwyg .ql-editor h4,
  .fp-wysiwyg .ql-editor h5,
  .fp-wysiwyg .ql-editor h6,
  .fp-wysiwyg .ql-editor iframe,
  .fp-wysiwyg .ql-editor img {
    margin-bottom: 20px;
  }
`