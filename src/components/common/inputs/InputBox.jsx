import React from "react";
import styled from "styled-components";

const InputBox = ({ defaultText, unit = "", width = "795px", value, onChange, type="text"}) => {
  return (
    <InputWrapper $width={width}>
      <TextInput
        type={type}
        placeholder={defaultText}
        $withUnit={!!unit}
        $width={width}
        value={value}
        onChange={onChange}
      />
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
  padding: 10px;
  margin-top: 10px;
  background-color: #D9D9D9;
  border: 0px;
  font-size: 16px;
  font-weight: 400;
  /* 단위 공간 확보 (글자가 input 겹치지 않도록 오른쪽 여백 추가) */
  padding-right: ${(props) => (props.$withUnit ? "36px" : "10px")};
  box-sizing: border-box;

  /* ===== 숫자 입력 시 스피너(화살표) 제거 ===== */
  /* Chrome, Safari, Edge */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const InputUnit = styled.span`
  position: absolute;
  right: 15px;
  top: 55%;
  transform: translateY(-50%);
  font-size: 16px;
  color: #222;
  pointer-events: none;
  z-index: 2;
  background: transparent;
`;
