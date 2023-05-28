import { Interval } from "@/types/interval"
import { ChartDataset } from "chart.js"
import { randomHSLColor } from "@/utils/color"

export const intervalToDataset = (interval: Interval): ChartDataset<'bar'> => {
  if(interval.process) {
    return {
      label: `P${interval.process.id.toString()}`,
      data: [interval.duration],
      backgroundColor: randomHSLColor(interval.process.id),
      borderColor: 'rgb(255,255,255)',
      borderWidth: 1,
    }
  }
  return {
    label: "empty",
    data: [interval.duration],
    backgroundColor: 'rgba(0,0,0,0)',
  }
}

export const useMapper = () => {
  return { intervalToDataset }
}