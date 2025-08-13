import React from "react";
import styled from "styled-components";
import { Dropdown } from "./Dropdown";

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

      <div>-</div>

      {/* 종료시간 */}
      <Dropdown
        props={timeData}
        width="88px"
        onChange={(val) => onChange(idx, "end", val)}
        value={schedule.end}
        placeholder="00:00"
      />

      {/* 제거 버튼 */}
      {total > 1 && idx !== total - 1 && (
        <TimeBtn onClick={() => onRemove(idx)}> - </TimeBtn>
      )}

      {/* 추가 버튼 (마지막 아이템에서만 보임) */}
      {idx === total - 1 && <TimeBtn onClick={onAdd}> + </TimeBtn>}
    </DropdownGroup>
  );
};

export default DatePicker;


const DropdownGroup = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  font-size: 16px;
  font-weight: 400;
  max-width: 351px;
`;

const TimeBtn = styled.button`
  width: 24px;
  height: 24px;
  border: 1px solid #D9D9D9;
  font-size: 14px;
  font-weight: 600;
  background-color: white;
  cursor: pointer;
`;
