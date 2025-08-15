import React from 'react';
import styled, { css } from 'styled-components';
import useVenueStore from '../../../stores/venueStore';

const storeTypes = {
  restaurant: { label: '일반 음식점', icon: '🍚' },
  cafe: { label: '카페 및 디저트', icon: '☕' },
  bar: { label: '주점', icon: '🍺' },
};


function TypeLabel({ storeType }) {
  const { stores } = useVenueStore();

  const currentType = storeType || stores.storeType;
  const style = storeTypes[currentType];

  if (!style) return null;

  return (
    <LabelBox>
      <LabelText>
        {style.icon} {style.label}
      </LabelText>
    </LabelBox>
  );
}

export default TypeLabel;

// 스타일 컴포넌트
const LabelBox = styled.div`
    display: flex;
    padding: 10px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    border-radius: 5px;
    border: 1px solid #000;
`;

const Icon = styled.span`
  font-size: 17px;
`;

const LabelText = styled.span`
    color: #000;
    font-family: Pretendard;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
`;
