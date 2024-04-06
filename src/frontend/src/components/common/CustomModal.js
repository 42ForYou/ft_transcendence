import React from "react";

const CustomModal = ({ hasCloseButton, handleClose, title, children, footerButtons }) => {
  return (
    <>
      <div className="CustomModal modal d-block" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              {hasCloseButton && (
                <button className="close" onClick={handleClose}>
                  <span aria-hidden="true">&times;</span>
                </button>
              )}
            </div>
            <div className="modal-body">{children}</div>
            <div className="modal-footer">{footerButtons}</div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop show"></div>
    </>
  );
};

export default CustomModal;
