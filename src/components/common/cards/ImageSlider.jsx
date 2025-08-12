import React, { useState } from 'react';
import styled from 'styled-components';

const sampleImages = [ {}, {}, {}, {}, {}, {} ]; // 임의 6개 박스
const BOX_COUNT = sampleImages.length;
const VISIBLE_COUNT = 3.5;
const BOX_WIDTH = 407;
const BOX_GAP = 20;

const sliderViewportWidth = VISIBLE_COUNT * BOX_WIDTH + (VISIBLE_COUNT - 1) * BOX_GAP;
const totalWidth = BOX_COUNT * BOX_WIDTH + (BOX_COUNT - 1) * BOX_GAP;
const maxStart = BOX_COUNT - VISIBLE_COUNT; // 6 - 3.5 = 2.5

const ImageSlider = () => {
  const [start, setStart] = useState(0);

  const handleNext = () => {
    setStart(prev =>
      Math.min(prev + 1, maxStart)
    );
  };
  const handlePrev = () => {
    setStart(prev => Math.max(prev - 1, 0));
  };

  const translateX = -(start * (BOX_WIDTH + BOX_GAP));

  return (
    <SliderSection style={{ width: sliderViewportWidth }}>
      {start > 0 && (
        <ArrowBtn left onClick={handlePrev}>
          &lt;
        </ArrowBtn>
      )}
      <ImageList
        style={{
          width: totalWidth,
          transform: `translateX(${translateX}px)`,
          transition: 'transform 0.5s cubic-bezier(0.57,0.21,0.56,1.17)',
        }}
      >
        {sampleImages.map((_, idx) => (
          <ImageBox key={idx}/>
        ))}
      </ImageList>
      <ArrowBtn
        onClick={handleNext}
        disabled={start >= maxStart}
      >
        &gt;
      </ArrowBtn>
    </SliderSection>
  );
};

const SliderSection = styled.div`
  position: relative;
  margin: 20px auto 35px auto;
  overflow: hidden;
`;

const ImageList = styled.div`
  display: flex;
  gap: 20px;
  position: relative;
  left: 0;
  top: 0;
`;

const ImageBox = styled.div`
  width: 407px;
  height: 200px;
  background: #D9D9D9;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
`;

const ArrowBtn = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${({ left }) => left ? 'left: 2px;' : 'right: 2px;'}
  width: 6px;
  height: 12px;
  cursor: pointer;
  background: none;
  border: none;
  z-index: 2;
  margin: 0 5px;
  font-weight: 600;
  color: #333;
  transition: background 0.15s;
  opacity: ${({ disabled }) => disabled ? 0.35 : 1};
  visibility: ${({ disabled }) => disabled ? 'hidden' : 'visible'}; // 버튼 필요할 때만 보이도록
`;

export default ImageSlider;
