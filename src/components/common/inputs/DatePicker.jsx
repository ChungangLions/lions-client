import React from "react";
import styled from "styled-components";
import { Dropdown } from "./Dropdown";
import { FiPlus } from "react-icons/fi";
import { FiMinus } from "react-icons/fi";

/**
 * @param {object} props
 * @param {number} idx - 현재 아이템 index
 * @param {object} schedule - { day, start, end }
 * @param {number} total - 전체 목록 길이 (버튼 표시 조건 위해)
 * @param {function} onChange - 드롭다운 값 변경 핸들러 (idx, field, value)
 * @param {function} onAdd - 추가 버튼 클릭 핸들러
 * @param {function} onRemove - 삭제 버튼 클릭 핸들러
 * @param {object} dateData - 요일 dropdown data
 * @param {object} timeData - 시간 dropdown data
 */
const DatePicker = ({
  idx,
  schedule,
  total,
  onChange,
  onAdd,
  onRemove,
  dateData,
  timeData
}) => {
  return (
    <DatePickerGroup>
    <DropdownGroup>
        {/* 요일 */}
        <Dropdown
          props={dateData}
          width="106px"
          onChange={(val) => onChange(idx, "day", val)}
          value={schedule.day}
          placeholder="요일"
        />

        {/* 시작시간 */}
        <Dropdown
          props={timeData}
          width="88px"
          onChange={(val) => onChange(idx, "start", val)}
          value={schedule.start}
          placeholder="00:00"
        />

        <Text>~</Text>

        {/* 종료시간 */}
        <Dropdown
          props={timeData}
          width="88px"
          onChange={(val) => onChange(idx, "end", val)}
          value={schedule.end}
          placeholder="00:00"
        />

              {/* 제거 버튼 또는 플레이스홀더 */}
      {total > 1 && idx !== total - 1 ? (
        <DeleteBtn onClick={() => onRemove(idx)} />
      ) : (
        <DeleteBtnPlaceholder />
      )}

      {/* 추가 버튼 (마지막 아이템에서만 보임)
      {idx === total - 1 && <AddBtn onClick={onAdd} />} */}
    </DropdownGroup>
    {idx === total - 1 && <AddTextBtn onClick={onAdd}> <FiPlus /> 시간 추가</AddTextBtn>}
    </DatePickerGroup>
  );
};

export default DatePicker;


const DatePickerGroup = styled.div`
display: flex;
flex-direction: column;
gap: 10px;
`;

const DropdownGroup = styled.div`
display: flex;
align-items: center;
// align-self: stretch;
justify-content: center;
gap: 10px;
  font-size: 16px;
  font-weight: 400;
  width: 351px;
  color: #1A2D06
`;

const Text = styled.div`
display: flex;
align-self: stretch;
align-items: center;
color: var(--main-main950, #1A2D06);
font-family: Pretendard;
font-size: 16px;
font-style: normal;
font-weight: 400;
line-height: normal;
`;

const DeleteBtn = styled(FiMinus)`
margin-top: 10px;
width: 24px;
height: 24px;
stroke-width: 2;
stroke-linecap: round;
stroke-linejoin: round;
margin-left: 10px;
color: #1A2D06;
`;

const DeleteBtnPlaceholder = styled.div`
margin-top: 10px;
width: 24px;
height: 24px;
margin-left: 10px;
`;

const AddBtn = styled(FiPlus)`
margin-top: 10px;
width: 24px;
height: 24px;
stroke-width: 2;
stroke-linecap: round;
stroke-linejoin: round;
margin-left: 10px;
  color: ${({ $active }) => ($active ? "#365215" : "#1A2D06")};
  &:hover {
    color: ${({ $active }) => ($active ? "#365215" : "#70AF19")};
  }
`;

const AddTextBtn = styled.button`
display: flex;
padding: 4px 7px;
align-items: center;
gap: 2px;
border-radius: 5px;
background: var(--, #E7E7E7);
color: var(--, #898989);
font-family: Pretendard;
font-size: 16px;
font-style: normal;
font-weight: 400;
line-height: normal;
border: none;


// display: flex;
// align-items: center;
// gap: 10px;
// color: #1A2D06;
// background-color: #E9F4D0;
// border-radius: 5px;
// border: none;
// font-family: Pretendard;
// font-size: 16px;
// font-style: normal;
// font-weight: 400;
// line-height: normal;
// width: 150px;
// padding: 5px;
// justify-content: center;
`;