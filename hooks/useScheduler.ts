import { Config } from "@/types/config";
import { Interval } from "@/types/interval";
import { Process } from "@/types/process";
import { Timestamp } from "@/types/timestamp";
import { timestampsToIntervals } from "@/utils/mapper";
import Heap from "heap";

export const simulateFCFS = (config: Config): Interval[] => {
  const processes = config.processes.map((a) => {
    return { ...a };
  });
  const heap = new Heap<Process>((a, b) => a.arrivalTime - b.arrivalTime);
  processes.sort((a, b) => a.arrivalTime - b.arrivalTime);
  const timestamps: Timestamp[] = [];
  let time = 0;
  let i = 0;
  while (true) {
    // Receive processes
    while (i < processes.length && processes[i].arrivalTime === time) {
      let nextProcess = processes[i];
      heap.push({ ...nextProcess });
      i++;
    }
    // Generate timestamps
    const runningProcess = heap.peek();
    if (runningProcess) {
      timestamps.push({ time, process: { ...runningProcess } });
      runningProcess.burstTime -= 1;
      if (runningProcess.burstTime <= 0) heap.pop();
    } else if (i < processes.length) {
      timestamps.push({ time });
    } else {
      break;
    }
    time += 1;
  }
  const intervals = timestampsToIntervals(timestamps);
  return intervals;
};

export const simulateSJF = (config: Config): Interval[] => {
  const processes = config.processes.map((a) => {
    return { ...a };
  });
  const heap = new Heap<Process>((a, b) => a.burstTime - b.burstTime);
  processes.sort((a, b) => a.arrivalTime - b.arrivalTime);
  const timestamps: Timestamp[] = [];
  let time = 0;
  let i = 0;
  while (true) {
    // Receive processes
    while (i < processes.length && processes[i].arrivalTime === time) {
      let nextProcess = processes[i];
      heap.push({ ...nextProcess });
      i++;
    }
    // Generate timestamps
    const runningProcess = heap.peek();
    if (runningProcess) {
      timestamps.push({ time, process: { ...runningProcess } });
      runningProcess.burstTime -= 1;
      if (runningProcess.burstTime <= 0) heap.pop();
    } else if (i < processes.length) {
      timestamps.push({ time });
    } else {
      break;
    }
    time += 1;
  }
  const intervals = timestampsToIntervals(timestamps);
  return intervals;
};

export const simulateRR = (config: Config): Interval[] => {
  if (!config.quantum) return [];
  const processes = config.processes.map((a) => {
    return { ...a };
  });
  const heap = new Heap<Process>((a, b) => a.arrivalTime - b.arrivalTime);
  processes.sort((a, b) => a.arrivalTime - b.arrivalTime);
  const timestamps: Timestamp[] = [];
  let time = 0;
  let i = 0;
  let quantumRemaining = config.quantum;
  while (true) {
    // Receive processes
    while (i < processes.length && processes[i].arrivalTime === time) {
      let nextProcess = processes[i];
      heap.push({ ...nextProcess, arrivalTime: 0 });
      i++;
    }
    console.log(heap.peek(), quantumRemaining);
    // Generate timestamps
    const runningProcess = heap.peek();
    if (runningProcess) {
      timestamps.push({ time, process: { ...runningProcess } });
      runningProcess.burstTime -= 1;
      quantumRemaining -= 1;
      if (runningProcess.burstTime <= 0) {
        heap.pop();
        quantumRemaining = config.quantum;
      }
      else if (quantumRemaining <= 0) {
        const reInserted = heap.pop()!;
        reInserted.arrivalTime = 0;
        heap.push(reInserted);
        quantumRemaining = config.quantum;
      }
    } else if (i < processes.length) {
      timestamps.push({ time });
      quantumRemaining = config.quantum;
    } else {
      break;
    }
    time += 1;
  }
  const intervals = timestampsToIntervals(timestamps);
  return intervals;
};

export const _simulateRR = (config: Config): Interval[] => {
  if (!config.quantum) return [];
  const intervals: Interval[] = [];
  const processes = config.processes.map((a) => {
    return { ...a };
  });
  processes.sort((a, b) => a.arrivalTime - b.arrivalTime);
  let time = 0;
  while (true) {
    let done = true;
    for (let el of processes) {
      if (el.arrivalTime > time) {
        // intervals.push({ startTime: time, duration: el.arrivalTime - time });
        // time = el.arrivalTime;
        continue;
      }
      const timeTaken = Math.min(config.quantum, el.burstTime);
      intervals.push({
        process: { ...el },
        startTime: time,
        duration: timeTaken,
      });
      el.burstTime -= timeTaken;
      time += timeTaken;
      if (el.burstTime > 0) done = false;
    }
    if (done) break;
  }
  return intervals;
};

export const useScheduler = (config: Config) => {
  let start = () => simulateFCFS(config);
  if (config.algorithm === "SJF") start = () => simulateSJF(config);
  if (config.algorithm === "RR") start = () => simulateRR(config);
  return { start };
};
