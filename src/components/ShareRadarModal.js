/* eslint-disable */
import React, { Component } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { requestTranslation } from '@sangre-fp/i18n'
import moment from 'moment'
import { PUBLIC_URL } from '../env'

class ShareRadarModal extends Component {
  // handleClipboardClick = () => this.shareInput.focus()

  render() {
    const {
      requestClose,
      changeRadarSharing,
      changeRadarSharingExpiry,
      enableUrlLogin,
      urlLoginLink,
      urlLoginExpire,
      updateRadar,
      group,
      id
    } = this.props

    return (
      <div>
        <button onClick={requestClose} className='btn-close-modal'>
            <i className='material-icons'>close</i>
        </button>
        <div className={'modal-form-sections'}>
            <div className='modal-form-section modal-form-header'>
                <h2 className={'confirmation-modal-title'}>{requestTranslation('shareRadar')}</h2>
                <p className='mt-4'>{requestTranslation('shareRadarFromUsrMngmt')}</p>
            </div>
            <div className='modal-form-section justify-content-end d-flex'>
                <button
                  onClick={requestClose}
                  className='btn btn-lg btn-plain-gray'
                >
                    {requestTranslation('cancel')}
                </button>
                <a
                    href={`${PUBLIC_URL}/radarusers?gid=${group.id}&invite=${id}`}
                    className='btn btn-lg btn-primary'
                >
                    {requestTranslation('goToManagement')}
                </a>
            </div>
        </div>
      </div>
    )
  }
}

export default ShareRadarModal
