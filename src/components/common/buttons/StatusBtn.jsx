import React from 'react';
import styled from 'styled-components';

const StatusBtn = ({ status, children, onClick, disabled = false }) => {
  return (
    <StyledStatusBtn 
      status= {status}
      disabled={disabled}
    >
      {children}
    </StyledStatusBtn>
  );
};

const StyledStatusBtn = styled.button`
  width: 100%;
  position: relative;
  border-radius: 5px;
  box-sizing: border-box;
  min-height: 45px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 13px 20px;
  text-align: center;
  font-size: 16px;
  font-family: Pretendard;
  transition: all 0.2s ease;
  word-wrap: break-word;
  white-space: normal;
  line-height: 1.2;

  ${props => {
    switch (props.status) {
      case 'DRAFT':
        return `
          border: 1px solid #bcbcbc;
          background-color: transparent;
          color: #bcbcbc;
        `;
      case 'PARTNERSHIP':
        return `
          border: 1px solid #70af19;
          background-color: transparent;
          color: #70af19;
        `;
      case 'READ':
        return `
          border: 1px solid #70af19;
          background-color: transparent;
          color: #70af19;
        `;
      case 'REJECTED':
        return `
          background-color: #bcbcbc;
          border: 1px solid #898989;
          color: #898989;
        `;
      default:
        return `
          border: 1px solid #bcbcbc;
          background-color: transparent;
          color: #bcbcbc;
        `;
    }
  }}

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;

export default StatusBtn;