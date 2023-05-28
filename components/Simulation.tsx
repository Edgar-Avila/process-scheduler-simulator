import { intervalToDataset } from "@/utils/mapper";
import { Config } from "@/types/config";
import { ChartData, ChartOptions } from "chart.js";
import { Bar } from "react-chartjs-2";
import { Interval } from "@/types/interval";


interface Props extends React.HTMLAttributes<HTMLDivElement> {
  config: Config
  intervals: Interval[]
}

const Simulation: React.FC<Props> = ({ config, intervals, ...props }) => {
  const datasets = intervals.map(intervalToDataset);
  const data: ChartData<"bar"> = { labels: ["Execution"], datasets };

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
    <div className="relative" {...props}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default Simulation;
