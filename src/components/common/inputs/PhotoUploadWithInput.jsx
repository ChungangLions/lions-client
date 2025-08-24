// 원래 photoupload에 input까지 기능 합치려고 했는데 그러면 유지보수 힘들다고 따로 하라는 ai의 조언을 따름,, :)

import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const PhotoUploadWithInput = ({ 
  value = [],
  onChange = () => {},
  onDelete,
  maxCount = 10, 
  inputPlaceholder1 = "메뉴명", 
  inputPlaceholder2 = "0,000원" 
}) => {
  const fileInputRef = useRef(null);
  const [photos, setPhotos] = useState([]);

  // sync 부모에서 오는 value와 내부 상태 동기화
  useEffect(() => {
    setPhotos(value);
  }, [value]);

  const updatePhotos = (newArr) => {
    setPhotos(newArr);
    onChange(newArr);
  };

  const handleAddPhoto = (e) => {
    const files = Array.from(e.target.files);
    const newItems = files.slice(0, maxCount - photos.length)
      .map(file => ({ file, value1: "", value2: "" }));
    updatePhotos([...photos, ...newItems]);
  };

  const handleDeletePhoto = (idx) => {
    // 부모 컴포넌트의 삭제 핸들러가 있으면 호출
    if (onDelete) {
      onDelete(idx);
    } else {
      // 기본 동작
      updatePhotos(photos.filter((_, i) => i !== idx));
    }
  };

  const handleInputChange = (idx, field, val) => {
    const newPhotos = photos.map(
      (item, i) => i === idx ? { ...item, [field]: val } : item
    );
    updatePhotos(newPhotos);
  };


  // 파일 미리보기 URL : photo가 없을 때 오류 해결 
  const getPreviewUrl = (item) => {
      // item이 File 또는 Blob 객체인지 확인
      if (item instanceof File || item instanceof Blob) {
          return URL.createObjectURL(item);
      }
      // item이 객체이고 image 속성을 가지고 있는 경우 (예: { id: 1, image: "url" })
      else if (item && typeof item === 'object' && item.image) {
          return item.image;
      }
      // File 객체가 아니면 이미 URL 문자열로 간주
      else if (typeof item === 'string') {
          return item;
      }
      // 그 외의 경우 (예: null, undefined)
      return null;
  };
  
  return (
    <PhotoBox>
      {/* + 박스 */}
      {photos.length < maxCount && (
        <ImageContainer onClick={() => fileInputRef.current.click()}>
          <Plus>+</Plus>
          <input
            type="file"
            accept="image/*"
            multiple
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleAddPhoto}
            disabled={photos.length >= maxCount}
          />
        </ImageContainer>
      )}
      {/* 업로드된 사진들 */}
      {photos.map((item, idx) => (
        <ImageInputWrapper key={idx}>
          <ImageContainer>
            <PreviewImg src={getPreviewUrl(item.file)} alt={`preview-${idx}`} />
            <DeleteBtn onClick={() => handleDeletePhoto(idx)}>×</DeleteBtn>
          </ImageContainer>
          
          <DescInput
            type="text"
            placeholder={inputPlaceholder1}
            value={item.value1}
            onChange={e => handleInputChange(idx, "value1", e.target.value)}
            maxLength={25}
          />
          <DescInput
            type="number"
            placeholder={inputPlaceholder2}
            value={item.value2}
            onChange={e => handleInputChange(idx, "value2", e.target.value)}
            maxLength={25}
          />

        </ImageInputWrapper>
      ))}
    </PhotoBox>
  );
};

const ImageInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  width: 128px;
  justify-content: center;
`;

const PhotoBox = styled.div`
  display: flex;
  flex-wrap: wrap;        // 여러 줄로 자동 배치
  gap: 12px;
  align-items: start;
  max-width: 795px;       // 예시로 한 줄 크기를 제한
  min-height: 140px;      // 높이 살짝 확보(안정감)
  margin-top: 10px;
`;

const ImageContainer = styled.div`
    position: relative;
    display: flex;
    width: 128px;
    height: 128px;
    align-items: center;
    justify-content: center;
    gap: 10px;
    background: #BCBCBC;
    border-radius: 5px;
`;
const Plus = styled.span`
  font-size: 24px;
  color: black;
  user-select: none;
  padding: 52px;
`;
const PreviewImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  background-color: white;
  border-radius: 5px;
`;

const DeleteBtn = styled.button`
  position: absolute;
  top: 6px;
  right: 6px;
  border: none;
  background-color: transparent;
  font-size: 18px;
  color: black;
  width: 24px;
  height: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
`;

const DescInput = styled.input`
display: flex;
padding: 5px;
justify-content: center;
align-items: center;
gap: 10px;
align-self: stretch;
border-radius: 5px;
border: 0px;
background: #FFF;
color: #1A2D06;
font-family: Pretendard;
font-size: 16px;
font-style: normal;
font-weight: 400;
line-height: normal;
text-align: center;

& ::placeholder {
  color: #898989;
}

  /* ===== 숫자 입력 시 스피너(화살표) 제거 ===== */
  /* Chrome, Safari, Edge */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

export default PhotoUploadWithInput;
