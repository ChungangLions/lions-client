import React from 'react';
import styled from 'styled-components';

const DetailInfo = () => {
  return (
    <DetailWrapper>
      <Row>
        <Label>소속 학생 수</Label>
        <Value>1000명</Value>
      </Row>
      <Row>
        <Label>희망 제휴 기간</Label>
        <Value>2025.08 ~ 2025.10 (3개월)</Value>
      </Row>
      <Row>
        <Label>제휴 이력</Label>
        <Value>3회</Value>
      </Row>
    </DetailWrapper>
  );
};

export default DetailInfo;

const DetailWrapper = styled.div`
align-self: stretch;
display: flex;
flex-direction: column;
align-items: flex-start;
justify-content: flex-start;
font-size: 16px;
gap: 8px;
`;

const Row = styled.div`
display: flex;
flex-direction: row;
align-items: center;
justify-content: flex-start;
gap: 34px;
width: 100%;
`;

const Label = styled.div`
width: 120px;
`;

const Value = styled.div`

`;