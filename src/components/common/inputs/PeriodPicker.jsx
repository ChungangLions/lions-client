import React from "react";
import styled from "styled-components";
import { Dropdown } from "./Dropdown";

// 연, 월, 일 선택용 데이터 예시
const yearData = { data: Array.from({ length: 10 }, (_, i) => `${2025 + i}년`) };
const monthData = { data: Array.from({ length: 12 }, (_, i) => `${i + 1}월`) };
const dayData = { data: Array.from({ length: 31 }, (_, i) => `${i + 1}일`) };

/**
 * @param {object} props
 * @param {object} value - { startYear, startMonth, startDay, endYear, endMonth, endDay }
 * @param {function} onChange - (field, value) => void
 * @param {boolean} withDay - 일 선택이 포함되는지 여부 (true: 일까지, false: 년/월만)
 * @param {boolean} disabled - 비활성화 여부
 */
const PeriodPicker = ({ value, onChange, withDay = false, disabled = false }) => {
  return (
    <PickerRow>
      {/* 시작 */}
      <Dropdown
        props={yearData}
        width="78px"
        onChange={(val) => onChange("startYear", val.replace('년', ''))}
        value={value.startYear ? `${value.startYear}년` : ''}
        placeholder="년도"
        disabled={disabled}
      />
      <Dropdown
        props={monthData}
        width="56px"
        onChange={(val) => onChange("startMonth", val.replace('월', ''))}
        value={value.startMonth ? `${value.startMonth}월` : ''}
        placeholder="월"
        disabled={disabled}
      />
      {withDay && (
        <Dropdown
          props={dayData}
          width="56px"
          onChange={(val) => onChange("startDay", val.replace('일', ''))}
          value={value.startDay ? `${value.startDay}일` : ''}
          placeholder="일"
          disabled={disabled}
        />
      )}

      <Text>~</Text>
      {/* 종료 */}
      <Dropdown
        props={yearData}
        width="78px"
        onChange={(val) => onChange("endYear", val.replace('년', ''))}
        value={value.endYear ? `${value.endYear}년` : ''}
        placeholder="년도"
        disabled={disabled}
      />
      <Dropdown
        props={monthData}
        width="56px"
        onChange={(val) => onChange("endMonth", val.replace('월', ''))}
        value={value.endMonth ? `${value.endMonth}월` : ''}
        placeholder="월"
        disabled={disabled}
      />
      {withDay && (
        <Dropdown
          props={dayData}
          width="56px"
          onChange={(val) => onChange("endDay", val.replace('일', ''))}
          value={value.endDay ? `${value.endDay}일` : ''}
          placeholder="일"
          disabled={disabled}
        />
      )}
    </PickerRow>
  );
};

export default PeriodPicker;

// 스타일 예시
const PickerRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  font-size: 16px;
`;

const Text = styled.div`
  color: #1A2D06;
  font-family: Pretendard;
  font-size: 16px;
  font-weight: 400;
`;

