import React from "react";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import "./EasyCropWrapper.css";

interface EasyCropWrapperProps {
  imageSrc: string;
  crop: { x: number; y: number };
  zoom: number;
  onCropChange: (location: { x: number; y: number }) => void;
  onZoomChange: (zoom: number) => void;
  onCropComplete: (croppedArea: Area, croppedAreaPixels: Area) => void;
}

const EasyCropWrapper: React.FC<EasyCropWrapperProps> = ({
  imageSrc,
  crop,
  zoom,
  onCropChange,
  onZoomChange,
  onCropComplete,
}) => {
  return (
    <div className="easy-crop-container">
      <Cropper
        image={imageSrc}
        crop={crop}
        zoom={zoom}
        aspect={undefined}
        onCropChange={onCropChange}
        onZoomChange={onZoomChange}
        onCropComplete={onCropComplete}
        showGrid={true}
        restrictPosition={false}
        style={{
          containerStyle: {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "transparent",
          },
        }}
      />
    </div>
  );
};

export default EasyCropWrapper;
