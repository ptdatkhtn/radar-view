import React from "react";
import { Modal, paddingModalStyles } from "@sangre-fp/ui";
import { requestTranslation } from "@sangre-fp/i18n";
import { InfoCircle } from "@styled-icons/boxicons-regular";
import styled from "styled-components";

const InformationModal = ({
  InfoModalHeader,
  InfoModalDescription,
  InfoModalNote,
  InfoModalOpen,
  InfoModalClose,
  LearnMoreBtn,
  GuideBtn,
  LearnMoreLink,
  GuideLink,
}) => {
  const handleClick = (link) => {
    window.open(link);
  };
  return (
    <Modal
      onRequestClose={InfoModalClose}
      isOpen={InfoModalOpen}
      contentLabel="radar-modal"
      ariaHideApp={false}
      style={paddingModalStyles}
    >
      <div className="confirmation-modal-content pt-4 pb-4">
        <div
          className="modal-form-section modal-form-header"
          style={{ marginLeft: "10px" }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <InformationIcon background={false} />
            <h3 style={{ marginLeft: "20px", marginBottom: "0" }}>
              {InfoModalHeader}
            </h3>
          </div>
          <p className="mt-4" style={{ fontWeight: "700" }}>
            {InfoModalNote}
          </p>
          <p className="mt-4">{InfoModalDescription}</p>
          <div style={{ marginTop: "48px", display: 'flex', justifyContent:'space-between', justifyItems:'center' }}>
            <p>Learn more from the HUB: </p>
            <div style={{display: 'flex', flexDirection: 'column'}}>
              <button
                onClick={() => handleClick(LearnMoreLink)}
                className="btn btn-sm btn-outline-secondary"
              >
                {LearnMoreBtn}
              </button>
              <button
                className="btn btn-sm btn-outline-secondary"
                style={{marginTop: '17px'}}
                onClick={() => handleClick(GuideLink)}
              >
                {GuideBtn}
              </button>
            </div>
          </div>
        </div>

        {/* <p style={{textAlign: 'center'}}>{requestTranslation("sharePublicLinkConfirmationNote")}</p> */}
        {/* <div className="confirmation-modal-actions">
          <button
            onClick={() => handleClick(LearnMoreLink)}
            className="btn btn-lg btn-plain-gray"
          >
            {LearnMoreBtn}
          </button>
          <button
            className="btn btn-lg btn-primary"
            onClick={() => handleClick(GuideLink)}
          >
            {GuideBtn}
          </button>
        </div> */}
      </div>
    </Modal>
  );
};

export default InformationModal;

const InformationIcon = styled(InfoCircle)`
  background-color: ${(props) => (props.background ? "#f1f3f3" : "white")};
  color: black;
  width: 45px;
  height: 45px;
`;
