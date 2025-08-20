import React from 'react';
import styled from 'styled-components';

const DetailInfo = ({cardDetail}) => {
  return (
    <DetailWrapper>
        {cardDetail.map((item) => (
      <Row key= {item.label}>
        <Label>{item.label}</Label>
        <Value>{item.value}</Value>
      </Row>
      ))}
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
gap: 5px;
font-size: 16px;
width: 100%;
`;

const Row = styled.div`
display: flex;
flex-direction: row;
align-items: center;
gap: 10px;
width: 100%;
`;

const Label = styled.div`
min-width: 120px;
flex-shrink: 0;
padding: 0;
font-weight: 600;
margin-left : 10px;
`;

const Value = styled.div`
flex: 1;
word-break: break-word;
`;