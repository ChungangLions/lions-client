import React, { useState } from 'react';
import styled from 'styled-components';

const sampleImages = [ {}, {}, {}, {}, {}, {} ]; // 임의 6개 박스
const VISIBLE_COUNT = 3.5;
const BOX_WIDTH = 407;
const BOX_GAP = 20;

const ImageSlider = ({photos}) => {
  const BOX_COUNT = photos.length;

  const sliderViewportWidth = VISIBLE_COUNT * BOX_WIDTH + (VISIBLE_COUNT - 1) * BOX_GAP;
  const totalWidth = BOX_COUNT * BOX_WIDTH + (BOX_COUNT - 1) * BOX_GAP;
  const maxStart = BOX_COUNT - VISIBLE_COUNT; // 6 - 3.5 = 2.5


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
    <SliderSection 
      style={{ 
        width: sliderViewportWidth 
    }}>
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
          margin: BOX_COUNT <= 2 ? '0px auto' : '',
          gap: BOX_COUNT <= 2 ? '50px' : '',
        }}
      >
        {photos.map((photo) => (
          <ImageBox key={photo.id} src={photo.image || ''}/>
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
  width: 100%;
  max-width: 100%;
`;

const ImageList = styled.div`
  display: flex;
  gap: 20px;
  position: relative;
  left: 0;
  top: 0;
  width: 100%;
`;

const ImageWrapper = styled.div`
  // width: 407px;
  // height: 200px;
  // display: flex;
  // align-items: center;
  // justify-content: center;
  // box-sizing: border-box;
  // border-radius: 5px;
`;

const ImageBox = styled.img`
  width: 407px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  border-radius: 5px;
  background-image: url('${props => props.imageUrl}');
  background-size: cover;
  background-position: center;
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
