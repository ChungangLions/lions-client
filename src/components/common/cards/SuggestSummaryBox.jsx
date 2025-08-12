import React from 'react';
import styled from 'styled-components';

// 한 박스에 표시할 항목
function SuggestSummaryBox({ items }) {
  return (
    <SummaryBoxWrapper>
      {items.map((item, idx) => (
        <SummaryItem key={item.label}>
          <Count>{item.count}</Count>
          <Label>{item.label}</Label>
        </SummaryItem>
      ))}
    </SummaryBoxWrapper>
  );
}
export default SuggestSummaryBox;

const SummaryBoxWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0;
  margin: 35px auto;
  min-width: 1225px;
  max-width: 1290px;
  height: 137px;
  box-sizing: border-box;
  overflow: hidden;
  border: 1px solid #959595;
`;


const SummaryItem = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;

  &:not(:last-child)::after {
    content: "";
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 1px;
    height: 97px;         // 수직 라인 길이
    background: #959595;
  }
`;


const Count = styled.div`
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 6px;
`;

const Label = styled.div`
  font-size: 20px;
  color: black;
  font-weight: 400;
`;

