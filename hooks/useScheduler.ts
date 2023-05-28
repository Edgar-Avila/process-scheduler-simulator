import { Config } from "@/types/config";
import { Process } from "@/types/process";
import { Timestamp } from "@/types/timestamp";
import Heap from "heap";

export const simulateFCFS = (config: Config): Timestamp[] => {
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
  return timestamps
};

export const simulateSJF = (config: Config): Timestamp[] => {
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
  return timestamps;
};

export const simulateRR = (config: Config): Timestamp[] => {
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
  return timestamps;
};

export const simulatePS = (config: Config): Timestamp[] => {
  const processes = config.processes.map((a) => {
    return { ...a };
  });
  const heap = new Heap<Process>((a, b) => b.priority - a.priority);
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
  return timestamps;
};

export const useScheduler = (config: Config) => {
  let start = () => simulateFCFS(config);
  if (config.algorithm === "SJF") start = () => simulateSJF(config);
  if (config.algorithm === "RR") start = () => simulateRR(config);
  if (config.algorithm === "PS") start = () => simulatePS(config);
  return { start };
};
