import './polyfills'
import 'react-app-polyfill/ie11'
import 'core-js'
import 'url-search-params-polyfill'

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import store from './configureStore'
import { RadarPage } from './containers'
import CreationWizard from './components/CreationWizard'
import * as serviceWorker from './serviceWorker'
import { GlobalStyles } from '@sangre-fp/ui'
import { RadarStyles } from './styles'
import { ToastContainer } from 'react-toastify'

import './session'
import './translations'

// package styles
import 'react-select/dist/react-select.css'
import 'react-quill/dist/quill.snow.css'
import 'react-toggle/style.css'
import 'react-toastify/dist/ReactToastify.css'
import 'rc-slider/dist/rc-slider.css'
import 'rc-tooltip/assets/bootstrap.css'

const paramsString = document.location.search
const searchParams = new URLSearchParams(paramsString)
const id = Number(searchParams.get('node'))

const renderApp = returnUri => (
  <Provider store={store}>
    <GlobalStyles />
    {id ? (
      <>
        <RadarStyles />
        <ToastContainer
          toastClassName='fp-toast'
          position='top-left'
          progressClassName='toast-progress'
        />
        <RadarPage returnUri={returnUri} />
      </>
    ) : (
      <CreationWizard />
    )}
  </Provider>
)

const appElement = document.getElementById('fp-radar-page')
ReactDOM.render(renderApp(appElement.getAttribute('data-return-uri')), appElement)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
