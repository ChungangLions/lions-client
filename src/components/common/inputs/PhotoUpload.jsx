import React, { useRef, useState } from "react";
import styled from "styled-components";

const PhotoUpload = ({ value = [], onChange, maxCount = 10 }) => {
  const fileInputRef = useRef(null);

  const handleAddPhoto = (e) => {
    const files = Array.from(e.target.files);
    const newArr = [...value, ...files].slice(0, maxCount);
    onChange(newArr);
  };

  const handleDeletePhoto = (idx) => {
    const newArr = value.filter((_, i) => i !== idx);
    onChange(newArr);
  };

  const getPreviewUrl = (photo) =>
    typeof photo === "string" ? photo : URL.createObjectURL(photo);

  return (
    <PhotoBox>
      {value.length < maxCount && (
        <ImageContainer onClick={() => fileInputRef.current.click()}>
          <Plus>+</Plus>
          <input
            type="file"
            accept="image/*"
            multiple
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleAddPhoto}
            disabled={value.length >= maxCount}
          />
        </ImageContainer>
      )}
      {value.map((photo, i) => (
        <ImageContainer key={i}>
          <PreviewImg src={getPreviewUrl(photo)} alt={`preview-${i}`} />
          <DeleteBtn onClick={() => handleDeletePhoto(i)}> x </DeleteBtn>
        </ImageContainer>
      ))}
    </PhotoBox>
  );
};


const PhotoBox = styled.div`
  display: flex;
  flex-wrap: wrap;        // 여러 줄로 자동 배치
  gap: 12px;
  align-items: center;
  max-width: 795px;       // 예시로 한 줄 크기를 제한
  min-height: 140px;      // 높이 살짝 확보(안정감)
  margin-top: 10px;
`;

const ImageContainer = styled.div`
    position: relative;
    display: flex;
    width: 128px;
    height: 128px;
    // padding: 52px;
    align-items: center;
    justify-content: center;
    gap: 10px;
    background-color: #D9D9D9;
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

export default PhotoUpload;