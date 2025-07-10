import type { ReactNode } from "react";
import './Modal.css'
interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  children: ReactNode;
}

function ConfirmModal(props: Props) {
  const { isOpen, onClose, onConfirm } = props;
  if (!isOpen) return null;
  return (
    <>
      <div className="dark-bg modal">
        <div className="modal-container">
          <p className="modal-title">
            Are you sure you want 
            to delete <br /> the task?
          </p>
          <div className="modal_button-container">
            <button className="btn modal_cancel-btn" onClick={onClose}>Cancel</button>
            <button className="btn modal_confirm-btn" onClick={onConfirm}>
              Confirm
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ConfirmModal;
