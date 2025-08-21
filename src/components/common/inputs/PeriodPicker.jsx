import React from "react";
import styled from "styled-components";
import { Dropdown } from "./Dropdown";

// 연, 월, 일 선택용 데이터 예시
const yearData = { options: Array.from({ length: 10 }, (_, i) => ({
  label: `${2020 + i}년`, value: `${2020 + i}`
}))};
const monthData = { options: Array.from({ length: 12 }, (_, i) => ({
  label: `${i + 1}월`, value: `${i + 1}`
}))};
const dayData = { options: Array.from({ length: 31 }, (_, i) => ({
  label: `${i + 1}일`, value: `${i + 1}`
}))};

/**
 * @param {object} props
 * @param {object} value - { startYear, startMonth, startDay, endYear, endMonth, endDay }
 * @param {function} onChange - (field, value) => void
 * @param {boolean} withDay - 일 선택이 포함되는지 여부 (true: 일까지, false: 년/월만)
 */
const PeriodPicker = ({ value, onChange, withDay = false }) => {
  return (
    <PickerRow>
      {/* 시작 */}
      <Dropdown
        props={yearData}
        width="78px"
        onChange={(val) => onChange("startYear", val)}
        value={value.startYear}
        placeholder="년도"
      />
      <Dropdown
        props={monthData}
        width="56px"
        onChange={(val) => onChange("startMonth", val)}
        value={value.startMonth}
        placeholder="월"
      />
      {withDay && (
        <Dropdown
          props={dayData}
          width="56px"
          onChange={(val) => onChange("startDay", val)}
          value={value.startDay}
          placeholder="일"
        />
      )}

      <Text>~</Text>
      {/* 종료 */}
      <Dropdown
        props={yearData}
        width="78px"
        onChange={(val) => onChange("endYear", val)}
        value={value.endYear}
        placeholder="년도"
      />
      <Dropdown
        props={monthData}
        width="56px"
        onChange={(val) => onChange("endMonth", val)}
        value={value.endMonth}
        placeholder="월"
      />
      {withDay && (
        <Dropdown
          props={dayData}
          width="56px"
          onChange={(val) => onChange("endDay", val)}
          value={value.endDay}
          placeholder="일"
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

