import React from "react";

const Modal = ({ children }) => {
  return (
    <div className="modal is-active">
      <div className="modal-background"></div>
      <div className="modal-content">{children}</div>
      <button className="modal-close is-large" aria-label="close"></button>
    </div>
  );
};

export default Modal;
