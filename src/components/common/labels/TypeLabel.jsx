import React from 'react';
import styled, { css } from 'styled-components';
import useVenueStore from '../../../stores/venueStore';
import { PiDropSimple } from 'react-icons/pi';

const storeTypes = {
  RESTAURANT: { label: '일반 음식점', icon: '🍚' },
  CAFE: { label: '카페 및 디저트', icon: '☕' },
  BAR: { label: '주점', icon: '🍺' },
};

function TypeLabel({ storeType, background }) {
  const { stores } = useVenueStore();

  const currentType = storeType || stores.storeType;
  const style = storeTypes[currentType];

  if (!style) return null;

  return (
    <LabelBox
      $storeType={storeType}
      $background={background}
    >
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
  padding: 5px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  align-self: stretch;
  border-radius: 5px;
  background: ${(props) => props.$background || "transparent"};
  width: ${(props) => {
    switch(props.$storeType) {
      case 'RESTAURANT':
        return '110px';
      case 'CAFE':
        return '120px';
      case 'BAR':
        return '70px';
      default:
        return 'auto';
    }
  }};  
`;

const LabelText = styled.span`
  color: #3F6113;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;
