import React, { useState } from 'react'
import { Modal, modalStyles } from '@sangre-fp/ui'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { requestTranslation } from '@sangre-fp/i18n'
import styles from './PublicLink.module.css'
const PublicLink = ({ isModalOpen, onRequestClose, publicURL, openConfirmationModal, openDeleteConfirmationModal}) => {
  const [shareInput, setShareInput] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);
  return (
    <>
      <Modal
        onRequestClose={onRequestClose}
        isOpen={isModalOpen}
        style={modalStyles}
        ariaHideApp={false}
        className={styles.ReactModal__Content}
      >
        <div className="modal-form-sections">
          <div className="modal-form-section modal-form-header">
            <div className={styles.Modal__Title}>
              {requestTranslation("createPublicLink")}
            </div>
            <div className="mt-4">{requestTranslation("publicLinkNote")}</div>
          </div>
          <div className="modal-form-section">
            <div className="font-weight-bold">
              {requestTranslation("publicLinkURL")}
            </div>
            <div className="d-flex mt-2 align-items-center">
              <input
                className="form-control w-75"
                value={publicURL}
                readOnly
                onFocus={(e) => e.target.select()}
                type="text"
                ref={(el) => {
                  setShareInput(el);
                }}
              />
                <CopyToClipboard text={publicURL} onCopy={
                  () => {
                    shareInput.focus();
                    setLinkCopied(true)
                  }} >
                  <button
                    className="btn btn-outline-secondary ml-3 mr-3"
                    style={{ height: "35px", flexShrink: 0 }}
                  >
                    {requestTranslation("copyToClipboard")}
                  </button>
                </CopyToClipboard>
                
            </div>
            {linkCopied && <h5 style={{display: 'flex', justifyContent: 'flex-end', marginRight: '64px', color: '#006998' }}>{requestTranslation("publicLinkCopied")}</h5>}
            <div className="d-flex mt-2 align-items-center">
              <button
                // disabled={!checked}
                className="btn btn-outline-secondary mr-3"
                onClick={openConfirmationModal}
              >
                {requestTranslation("regeneratePublicLink")}
              </button>
            </div>
            <div className="d-flex mt-2 align-items-center">
              {requestTranslation("regeneratePublicLinkNote")}
            </div>
          </div>
          <div className="modal-form-section modal-form-actions d-flex justify-content-between">
            <button
              className="btn btn-lg btn-plain-gray pl-0"
              onClick={openDeleteConfirmationModal}
            >
              {requestTranslation("deletePublicLink")}
            </button>
            <div className={styles.SavePublicLink__Container}>
              <button
                className={"btn btn-lg btn-plain-gray"}
                onClick={onRequestClose}
              >
                {requestTranslation("cancel")}
              </button>
              <button
                className={"btn btn-lg btn-primary"}
                onClick={() => alert("Saved")}
              >
                {requestTranslation("save")}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default PublicLink;