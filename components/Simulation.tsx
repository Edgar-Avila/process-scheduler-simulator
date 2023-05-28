import { intervalToDataset, timestampsToIntervals } from "@/utils/mapper";
import { Config, Mode } from "@/types/config";
import { ChartData, ChartDataset, ChartOptions } from "chart.js";
import { Bar } from "react-chartjs-2";
import { Timestamp } from "@/types/timestamp";
import { useEffect, useMemo, useState } from "react";
import { Interval } from "@/types/interval";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  config: Config;
  timestamps: Timestamp[];
  mode: Mode;
}

const Simulation: React.FC<Props> = ({
  config,
  timestamps,
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
        </>
      )}
    </>
  );
};

export default Simulation;
