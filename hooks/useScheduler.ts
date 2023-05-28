import { Config } from "@/types/config"
import { Interval } from "@/types/interval"
import { ChartDataset } from "chart.js";

export const simulateFCFS = (config: Config): Interval[] => {
  const processes = [...config.processes];
  processes.sort((a, b) => a.arrivalTime - b.arrivalTime);
  const intervals: Interval[] = [];
  let time = 0;
  for(const el of processes) {
    if(el.arrivalTime > time) {
      intervals.push({ startTime: time, duration: el.arrivalTime - time })
      time = el.arrivalTime;
    }
    intervals.push({
      duration: el.burstTime,
      process: el,
      startTime: time
    })
    time += el.burstTime;
  }
  return intervals;
}

export const simulateSJF = (config: Config): Interval[] => {
  const intervals: Interval[] = [];
  return intervals;
}

export const simulateRR = (config: Config): Interval[] => {
  const intervals: Interval[] = [];
  return intervals;
}


export const useScheduler = (config: Config) => {
  let start = () => simulateFCFS(config);
  if(config.algorithm === "SJF") start = () => simulateSJF(config);
  if(config.algorithm === "RR") start = () => simulateRR(config);
  return { start };
}