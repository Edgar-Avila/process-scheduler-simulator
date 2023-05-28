import { mulberry32 } from "./random";

export const randomHSLColor = (seed: number) => {
  return "hsl(" + (Math.floor(mulberry32(seed) * 24000) % 360) + ",70%,70%)";
}