export type Tool =
  | "none"
  | "crop"
  | "resize"
  | "transform"
  | "adjustments"
  | "filters";

export interface NaturalDims {
  w: number;
  h: number;
}

export interface CropRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type FilterType = "none" | "grayscale" | "sepia" | "invert";
