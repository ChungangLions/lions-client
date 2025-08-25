import React from "react";
import styled from "styled-components";

const InputBox = ({ defaultText, unit = "", width = "795px", value, onChange, type="text", border="0px", readOnly=false, disabled=false, onClick, onEnter, multiline=false }) => {
  
  const handleEnter = (e) => {
    if (e.key === "Enter") {
      onEnter();
    }
  }

  return (
    <InputWrapper $width={width}>
      {multiline ? (
        <TextArea
          placeholder={defaultText}
          $withUnit={!!unit}
          $width={width}
          $border={border}
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          disabled={disabled}
          onClick={onClick}
          onKeyDown={handleEnter}
          rows={3}
        />
      ) : (
        <TextInput
          type={type}
          placeholder={defaultText}
          $withUnit={!!unit}
          $width={width}
          $border={border}
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          disabled={disabled}
          onClick={onClick}
          onKeyDown={handleEnter}
        />
      )}
      {unit && <InputUnit>{unit}</InputUnit>}
    </InputWrapper>
  );
};

export default InputBox;

const InputWrapper = styled.div`
  position: relative;
  display: inline-block;
  width: ${(props) => props.$width || "795px"};
`;

const TextInput = styled.input`
  width: 100%;
  padding: 15px 20px;
  background-color:#fff;
  border: ${(props) => props.$border || "0px"};
  border-radius: 5px;
  font-size: 16px;
  font-weight: 400;
  /* 단위 공간 확보 (글자가 input 겹치지 않도록 오른쪽 여백 추가) */
  padding-right: ${(props) => (props.$withUnit ? "36px" : "20px")};
  box-sizing: border-box;

  & ::placeholder {
    color: #898989;
  }

  /* ===== 숫자 입력 시 스피너(화살표) 제거 ===== */
  /* Chrome, Safari, Edge */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 15px 20px;
  background-color:#fff;
  border: ${(props) => props.$border || "0px"};
  border-radius: 5px;
  font-size: 16px;
  font-weight: 400;
  /* 단위 공간 확보 (글자가 input 겹치지 않도록 오른쪽 여백 추가) */
  padding-right: ${(props) => (props.$withUnit ? "36px" : "20px")};
  box-sizing: border-box;
  resize: vertical;
  min-height: 80px;
  font-family: inherit;

  & ::placeholder {
    color: #898989;
  }
`;

const InputUnit = styled.span`
  width: 14px;
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--main-main600, #70AF19);
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  pointer-events: none;
  z-index: 2;
  background: transparent;
`;
