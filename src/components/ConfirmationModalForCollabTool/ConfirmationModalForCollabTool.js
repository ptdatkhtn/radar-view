import React from "react";
import { Modal, paddingModalStyles } from '@sangre-fp/ui'
import { requestTranslation } from '@sangre-fp/i18n'

const ConfirmationModalFoCollabTool = ({
  ConfirmationModalNote,
  confirmationModal,
  yesConfirmationHandleBtn,
  noConfirmationHandleBtn,
  saveConfirmationHandleBtn,
  isSaveConfirmationHandleBtnExist = false
}) => {
  return (
    <Modal
      onRequestClose={noConfirmationHandleBtn}
      isOpen={confirmationModal}
      contentLabel="radar-modal"
      ariaHideApp={false}
      style={paddingModalStyles}
    >
      <div className="confirmation-modal-content pt-4 pb-4">
        <h3 className="confirmation-modal-title">
          {ConfirmationModalNote}
        </h3>
        {/* <p style={{textAlign: 'center'}}>{requestTranslation("sharePublicLinkConfirmationNote")}</p> */}
        <div className="confirmation-modal-actions">
          <button
          style={{marginRight: '10px'}}
            onClick={yesConfirmationHandleBtn}
            className="btn btn-lg btn-primary"
          >
            {requestTranslation("yesBtn").toUpperCase()}
          </button>
          <button
          style={{marginRight: '10px'}}
            className="btn btn-lg btn-primary"
            onClick={noConfirmationHandleBtn}
          >
            {requestTranslation("noBtn").toUpperCase()}
          </button>
          {isSaveConfirmationHandleBtnExist && <button
          style={{marginRight: '10px'}}
            className="btn btn-lg btn-primary"
            onClick={saveConfirmationHandleBtn}
          >
            {requestTranslation("save").toUpperCase()}
          </button>}
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModalFoCollabTool;
