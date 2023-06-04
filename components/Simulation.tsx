import { intervalToDataset, timestampsToIntervals } from "@/utils/mapper";
import { Config, Mode } from "@/types/config";
import { ChartData, ChartDataset, ChartOptions } from "chart.js";
import { Bar } from "react-chartjs-2";
import { Timestamp } from "@/types/timestamp";
import { Fragment, useEffect, useMemo, useState } from "react";
import { Interval } from "@/types/interval";
import { Process } from "@/types/process";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  config: Config;
  timestamps: Timestamp[];
  processes: Process[];
  mode: Mode;
}

const Simulation: React.FC<Props> = ({
  config,
  timestamps,
  processes,
  mode,
  ...props
}) => {
  const [current, setCurrent] = useState(0);

  const data = useMemo<ChartData<"bar">>(() => {
    let intervals: Interval[] = [];
    if (mode === "STEP") {
      intervals = timestampsToIntervals(timestamps.slice(0, current + 1));
    } else {
      intervals = timestampsToIntervals(timestamps);
    }
    return {
      labels: ["Execution"],
      datasets: intervals.map(intervalToDataset),
    };
  }, [current, timestamps]);

  const averageWaitTime = useMemo<number>(() => {
    let intervals: Interval[] = [];
    if (mode === "STEP") {
      intervals = timestampsToIntervals(timestamps.slice(0, current + 1));
    } else {
      intervals = timestampsToIntervals(timestamps);
    }

    const set = new Set();
    let avg = 0;

    intervals.reverse();

    for(let interval of intervals) {
      if(!interval.process) continue;
      if(set.has(interval.process.id)) {
        avg -= interval.duration;
      }
      else {
        avg += interval.startTime;
        set.add(interval.process.id);
      }
    }

    avg /= set.size;

    return avg;
  }, [current, timestamps]);

  useEffect(() => {
    setCurrent(0);
  }, [timestamps]);

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y",
    scales: {
      x: { stacked: true },
      y: { stacked: true },
    },
    plugins: {
      // colors: { enabled: true, forceOverride: true },
      legend: { display: false },
    },
  };
  return (
    <>
      <div className="relative" {...props}>
        <Bar data={data} options={options} />
      </div>
      <div className="text-center">
        <div className="tooltip" data-tip="For each process, add the last interval start time and substract the sum of its interval durations except the last. Lastly divide by the amount of processes">
          &#9432; Average Wait Time: {averageWaitTime.toFixed(2)}
        </div>
      </div>
      {mode === "STEP" && (
        <>
          <div className="text-right">Time: {current}</div>
          <div className="btn-group flex justify-center mt-4">
            <button
              className={`btn btn-primary ${
                current === 0 ? "btn-disabled" : ""
              }`}
              onClick={() => setCurrent(current - 1)}
            >
              Prev
            </button>
            <button
              className={`btn btn-primary ${
                current >= timestamps.length - 1 ? "btn-disabled" : ""
              }`}
              onClick={() => setCurrent(current + 1)}
            >
              Next
            </button>
          </div>
          <div className="text-center mt-1 font-bold">
            {processes.map((process, i) => (
              <Fragment key={i}>
                {process.arrivalTime === current && (
                  <div>Process {process.id} arrives</div>
                )}
              </Fragment>
            ))}
            {timestamps[current]?.process && (
              <>
                {current > 0 &&
                  timestamps[current].process?.id !=
                    timestamps[current - 1].process?.id && (
                    <div>Process {timestamps[current].process?.id} starts</div>
                  )}
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Simulation;
