import { useMapper } from "@/hooks/useMapper";
import { useScheduler } from "@/hooks/useScheduler";
import { Config } from "@/types/config";
import { ChartData, ChartOptions } from "chart.js";
import { Bar } from "react-chartjs-2";


interface Props extends React.HTMLAttributes<HTMLDivElement> {
  config: Config;
}

const Simulation: React.FC<Props> = ({ config, ...props }) => {
  const { start } = useScheduler(config);
  const { intervalToDataset } = useMapper();
  const intervals = start();

  const datasets = intervals.map(intervalToDataset);

  const data: ChartData<"bar"> = { labels: ["Execution"], datasets };

  const options: ChartOptions<"bar"> = {
    responsive: true,
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
    <div {...props}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default Simulation;
