/* eslint-disable */
import React, { Component } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import { requestTranslation } from '@sangre-fp/i18n'
import { PUBLIC_URL } from '../env'
import LinkIcon from '@material-ui/icons/Link';
class ShareRadarModal extends Component {
  // handleClipboardClick = () => this.shareInput.focus()

  render() {
    const {
      requestClose,
      requestOpenPublicLink,
      checkPublicLinkExsited,
      publicLink,
      changeRadarSharing,
      changeRadarSharingExpiry,
      enableUrlLogin,
      urlLoginLink,
      urlLoginExpire,
      updateRadar,
      group,
      id
    } = this.props

    const onClickOpenPublicLink = (gid) => {
      requestOpenPublicLink(gid)
    }

    return (
      <div>
        <button onClick={requestClose} className='btn-close-modal'>
            <i className='material-icons'>close</i>
        </button>
        <div className={'modal-form-sections'}>
            <div className='modal-form-section modal-form-header'>
                <h2 className={'confirmation-modal-title'}>{requestTranslation('shareRadar')}</h2>
                <p className='mt-4'>{requestTranslation('shareRadarFromUsrMngmt')}</p>
                {checkPublicLinkExsited && publicLink && <div className='mt-4' style={{display: 'flex'}}><LinkIcon style={{transform: 'rotate(310deg)', borderRadius: '20px'}}></LinkIcon><p style={{ paddingLeft:'8px'}}>{requestTranslation('checkPublicLinkAlreadyExisted')}</p></div>}
            </div>
            <div className='modal-form-section justify-content-end d-flex'>
                <button
                  onClick={requestClose}
                  className='btn btn-lg btn-plain-gray'
                >
                    {requestTranslation('cancel')}
                </button>
                <div style={{ marginRight: "20px" }}>
                  <a
                    onClick={() => onClickOpenPublicLink(group.id)}
                    className="btn btn-lg btn-primary"
                  >
                    {requestTranslation("publicLink")}
                  </a>
                </div>
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
