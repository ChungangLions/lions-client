import React, { useState, useEffect, useRef } from "react";
import { IoIosArrowDown } from "react-icons/io";
import styled from "styled-components";

const DropDown = ({ options, onClick}) => {
  const [selected, setSelected] = useState("기본 순");
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleSelect = (option) => {
    setSelected(option.label);
    setOpen(false); // 선택 후 드롭다운 닫기
    if (onClick) onClick(option);
  };

  // 바깥쪽 클릭 시 드롭다운 닫기
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <DropDownContainer ref={dropdownRef}>
      <DropDownBtn onClick = {() => setOpen(!open)}>
        {selected} 
        <IoIosArrowDown />
      </DropDownBtn>

      {/* 드롭다운 목록 */}
      {open && (
        <DropDownMenu>
          {options.map((option) => (
            <OptionList
              key = {option.value}
              onClick={() => handleSelect(option)}>
              {option.label}
            </OptionList>
          ))}
        </DropDownMenu>
      )}

    </DropDownContainer>
  )
};

export default DropDown;

const DropDownContainer = styled.div`
position: relative;
width: 100%;
display: flex;
flex-direction: row;
align-items: center;
text-align: left;
font-size: 16px;
color: #64a10f;
font-family: Pretendard;

`;

const DropDownMenu = styled.div`
position: absolute;
  top: 100%;
  margin-top: 5px;
  margin-left: -10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: white;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  z-index: 10;
  `;

  
const DropDownBtn = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid none;
  border-radius: 5px;
  background-color: white;
  cursor: pointer;
  width: 150px;
  font-size : 16px;
  gap: 10px;
  font-weight: 500;
`;

const OptionList = styled.div`
  padding: 10px 10px;
  cursor: pointer;
  font-weight: 500;
  &:hover {
    background-color: #e9f4d0;
    border-radius: 5px;
  }
`;

