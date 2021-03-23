import React from "react";
import { Modal, paddingModalStyles } from '@sangre-fp/ui'
import { requestTranslation } from '@sangre-fp/i18n'

const DeleteConfirmationModal = ({
  deletePublicLink,
  deleteConfirmationModal,
  deleteConfirmationModalClose,
}) => {
  return (
    <Modal
      isOpen={deleteConfirmationModal}
      contentLabel="radar-modal"
      ariaHideApp={false}
      style={paddingModalStyles}
    >
      <div className="confirmation-modal-content pt-4 pb-4">
        <h3 className="confirmation-modal-title">
          {requestTranslation("deletePublicLinkConfirmation")}
        </h3>
        <div className="confirmation-modal-actions">
          <button
            onClick={deleteConfirmationModalClose}
            className="btn btn-lg btn-plain-gray"
          >
            {requestTranslation("cancel").toUpperCase()}
          </button>
          <button
            className="btn btn-lg btn-primary"
            onClick={deletePublicLink}
          >
            {requestTranslation("delete").toUpperCase()}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModal;
