import React from "react";
import { Modal, paddingModalStyles } from '@sangre-fp/ui'
import { requestTranslation } from '@sangre-fp/i18n'

const SharedLinkModalAfterDelete = ({
  SharedLinkModalAfterDelete,
  SharedLinkModalAfterDeleteClose,
  RadarTitle
}) => {
  return (
    <Modal
      isOpen={SharedLinkModalAfterDelete}
      contentLabel="radar-modal"
      ariaHideApp={false}
      style={paddingModalStyles}
    >
      <div className="confirmation-modal-content pt-4 pb-4">
        <h3 className="confirmation-modal-title">
          {requestTranslation("sharedLinkDeletedNote")}
        </h3>
        <p style={{textAlign: 'center', marginLeft: '110px', marginRight: '117px'}}>{RadarTitle}</p>
        <div className="confirmation-modal-actions">
          <button
            onClick={SharedLinkModalAfterDeleteClose}
            className="btn btn-lg btn-primary"
          >
            {requestTranslation("ok").toUpperCase()}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default SharedLinkModalAfterDelete;
