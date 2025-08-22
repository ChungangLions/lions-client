import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  const modalContent = (
    <Overlay onClick={onClose}>
      <ModalContainer>
        <ModalWrapper onClick={e => e.stopPropagation()}>
          {children}
        </ModalWrapper>
      </ModalContainer>
    </Overlay>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default Modal;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(103, 103, 103, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const ModalContainer = styled.div`
width: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Pretendard;
  text-align: center;
  font-size: 16px;
  color: #1a2d06;
`;

const ModalWrapper = styled.div`
 width: 546px; 
  height: 280px; 
  background-color: #fff;
  border-radius: 5px;
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
`;