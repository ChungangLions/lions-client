import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

const Modal = ({ isOpen, onClose, children, message }) => {
  if (!isOpen) return null;

  const modalContent = (
    <Overlay onClick={onClose}>
      <ModalContainer>
        <ModalWrapper onClick={e => e.stopPropagation()}>
          {message && (
            <ModalContent>
              <ModalMessage>{message}</ModalMessage>
              <ModalButton onClick={onClose}>확인</ModalButton>
            </ModalContent>
          )}
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
  background: rgba(0, 0, 0, 0.4);
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
 width: 500px; 
  height: 250px; 
  background-color: #fff;
  border-radius: 5px;
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 30px;
  padding: 40px;
`;

const ModalMessage = styled.div`
  font-size: 18px;
  font-weight: 500;
  color: #1a2d06;
  text-align: center;
  line-height: 1.5;
   white-space: pre-line;
`;

const ModalButton = styled.button`
  width: 120px;
  height: 40px;
  background-color:#64a10f;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

`;