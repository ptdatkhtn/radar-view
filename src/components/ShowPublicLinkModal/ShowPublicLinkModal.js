import React, {useState} from "react";
import { Modal, paddingModalStyles } from "@sangre-fp/ui";
import { requestTranslation } from "@sangre-fp/i18n";
import { CopyToClipboard } from 'react-copy-to-clipboard'

const ShowPublicLinkModal = ({ publicLinkShowed, publicLinkURL, showPublicLinkModalClose }) => {
    const [shareInput, setShareInput] = useState("");
    const [linkCopied, setLinkCopied] = useState(false);
    const onRequestCloseModal = () => {
        showPublicLinkModalClose();
        setLinkCopied(false)
    }
  return (
    <Modal
      isOpen={publicLinkShowed}
      contentLabel="radar-modal"
      ariaHideApp={false}
      style={paddingModalStyles}
    >
      <div className="confirmation-modal-content pt-4 pb-4">
        <h3 className="confirmation-modal-title">
            {requestTranslation("publicLinkURL")}
        </h3>
        <p style={{textAlign: 'center', padding: '0 32px'}}>{requestTranslation("publicLinkNote")}</p>
        <div className="modal-form-section">
            <div className="d-flex mt-2 align-items-center">
                <input
                    className="form-control w-75"
                    value={publicLinkURL}
                    readOnly
                    onFocus={(e) => e.target.select()}
                    type="text"
                    ref={(el) => {
                    setShareInput(el);
                    }}
                />
                <CopyToClipboard text={publicLinkURL} onCopy={
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
        </div>
        <div className="confirmation-modal-actions">
          <button
            onClick={onRequestCloseModal}
            className="btn btn-lg btn-plain-gray"
          >
            {requestTranslation("cancel").toUpperCase()}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ShowPublicLinkModal;