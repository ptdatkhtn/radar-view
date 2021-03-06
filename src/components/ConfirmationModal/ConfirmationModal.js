import React from "react";
import { Modal, paddingModalStyles } from '@sangre-fp/ui'
import { requestTranslation } from '@sangre-fp/i18n'

const ConfirmationModal = ({
  regeneratePublicLink,
  confirmationModal,
  confirmationModalClose,
}) => {
  return (
    <Modal
      isOpen={confirmationModal}
      contentLabel="radar-modal"
      ariaHideApp={false}
      style={paddingModalStyles}
    >
      <div className="confirmation-modal-content pt-4 pb-4">
        <h3 className="confirmation-modal-title">
          {requestTranslation("sharePublicLinkConfirmation")}
        </h3>
        <p style={{textAlign: 'center'}}>{requestTranslation("sharePublicLinkConfirmationNote")}</p>
        <div className="confirmation-modal-actions">
          <button
            onClick={confirmationModalClose}
            className="btn btn-lg btn-plain-gray"
          >
            {requestTranslation("cancel").toUpperCase()}
          </button>
          <button
            className="btn btn-lg btn-primary"
            onClick={regeneratePublicLink}
          >
            {requestTranslation("regeneratePublicLink").toUpperCase()}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
