import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { IoIosArrowDown } from "react-icons/io";

export const Dropdown = (props) => {
  // console.log(props.props.data);
  const list = props.props?.data ?? [];
  const selectRef = useRef(null);
  const [showOptions, setShowOptions] = useState(false);
  const {value, onChange, width, placeholder, disabled} = props;
  const [currentValue, setCurrentValue] = useState(value || '');

  
  const handleOnChangeSelectValue = (e) => {
    e.stopPropagation(); // 부모 onClick 막는 용도
    const newValue = e.target.getAttribute("value");
    setCurrentValue(newValue);
    if (onChange) onChange(newValue);
    setShowOptions(false);
  };

  useEffect(() => {
    setCurrentValue(value ?? '');
  }, [value]);

  useEffect(() => {
    // NOTE: Dropdwon 박스 바깥쪽을 클릭시 옵션이 사라지는 기능
    function handleClickOutside(event) {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectRef]);

  return (
    <SelectBox 
      onClick={() => !disabled && setShowOptions((prev) => !prev)} 
      ref={selectRef} 
      $width={width}
      $disabled={disabled}
    >
      <Label>
        {value ? value : (placeholder ?? list[0])} <DropdownArrow />
      </Label>
      <SelectOptions show={showOptions}>
        {list.map((data) => (
          <Option key={data.id} value={data} onClick={handleOnChangeSelectValue}>
            {data}
          </Option>
        ))}
      </SelectOptions>
    </SelectBox>
  );
};

Dropdown.defaultProps = {
  name: "초기값",
};

const SelectBox = styled.div`
  position: relative;
  width: ${(props) => props.$width || "775px"};
//   height: 39px;
  padding: 10px;
  gap: 10px;
  margin-top: 10px;
  background-color: ${(props) => props.$disabled ? "#F5F5F5" : "#FFF"};
  border-radius: 5px;
//   align-self: center;

  cursor: ${(props) => props.$disabled ? "not-allowed" : "pointer"};
  opacity: ${(props) => props.$disabled ? 0.6 : 1};
  // &::before {
  //   content: "⌵";
  //   position: absolute;
  //   top: 4px;
  //   right: 8px;
  //   color: #64A10F;
  //   font-size: 20px;
  //   font-weight: 800;
  // }
`;

const Label = styled.label`
  font-size: 16px;
  font-weight: 400;
  display: flex;
  color: #1A2D06;
  align-items: center;
  justify-content: space-between;
`;

const SelectOptions = styled.ul`
  position: absolute;
  left: 0;
  min-width: 100%;
  width: fit-content;
  max-height: 200px;
  overflow-y: auto;
  z-index: 999;
  border: ${(props) => (props.show ? "1px solid #D9D9D9;" : "none")};
  border-radius: 5px;
  background-color: white;
  /* 공백 없애기! */
  padding-left: 0;
  margin: 0;
  display: ${(props) => (props.show ? "block" : "none")};  /* 핵심! 옵션 닫기 */

  // 스크롤바 CSS
  ::-webkit-scrollbar {
    width: 4px;
  }
  ::-webkit-scrollbar-thumb {
    background-color: #777777;
    border-radius: 10px;
  }
  ::-webkit-scrollbar-track {
    background-color: #D9D9D9;
    border-radius: 0px 3px 3px 0px;
  }
`;

const Option = styled.li`
  font-size: 16px;
  font-weight: 400;
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.2s ease-in;
  &:hover {
    background-color: #D9D9D9;
  }
  list-style: none; /* 혹시 불릿이 남는 경우 추가! */
`;

const DropdownArrow = styled(IoIosArrowDown)`
  margin-left: 5px;
  cursor: pointer;
  color: #64A10F;
  
`;