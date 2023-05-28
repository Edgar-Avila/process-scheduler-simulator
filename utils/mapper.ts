import { Interval } from "@/types/interval";
import { ChartDataset } from "chart.js";
import { randomHSLColor } from "@/utils/color";
import { Timestamp } from "@/types/timestamp";

export const intervalToDataset = (interval: Interval): ChartDataset<"bar"> => {
  if (interval.process) {
    return {
      label: `P${interval.process.id.toString()}`,
      data: [interval.duration],
      backgroundColor: randomHSLColor(interval.process.id),
      borderColor: "rgb(255,255,255)",
      borderWidth: 1,
    };
  }
  return {
    label: "empty",
    data: [interval.duration],
    backgroundColor: "rgba(0,0,0,0)",
  };
};

// Convert timestamps to intervals with run-length encoding
export const timestampsToIntervals = (timestamps: Timestamp[]): Interval[] => {
  const intervals: Interval[] = [];
  const n = timestamps.length;
  for (let i = 0; i < n; i++) {
    let startTime = timestamps[i].time;
    let duration = 1;
    while (i < n - 1 && timestamps[i].process?.id === timestamps[i + 1].process?.id) {
      duration++;
      i++;
    }
    intervals.push({ duration, startTime, process: timestamps[i].process })
  }
  return intervals;
};
