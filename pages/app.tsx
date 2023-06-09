import { Config, ConfigSchema } from "@/types/config";
import { NextPage } from "next";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Fragment, useState } from "react";
import Simulation from "@/components/Simulation";
import { useScheduler } from "@/hooks/useScheduler";
import { Timestamp } from "@/types/timestamp";

const App: NextPage = () => {
  const [timestamps, setTimestamps] = useState<Timestamp[]>([]);
  const {
    register,
    handleSubmit,
    watch,
    setError,
    getValues,
    control,
    formState: { errors },
  } = useForm<Config>({
    resolver: zodResolver(ConfigSchema),
    defaultValues: {
      algorithm: "FCFS",
      quantum: 4,
      mode: "ALL",
      processes: [],
    },
  });
  const { start } = useScheduler(getValues());

  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeModal = () => setIsModalOpen(false);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "processes",
  });

  let algorithm = watch("algorithm");
  let processes = watch("processes");
  let mode = watch("mode");

  const onSubmit: SubmitHandler<Config> = (data) => {
    if (data.algorithm === "RR" && !data.quantum) {
      setError("quantum", { message: "Quantum is required" });
      return;
    }
    setTimestamps(start());
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto max-w-2xl p-4">
      <h1 className="text-center mb-4 text-2xl font-bold">Process Scheduler</h1>
      <form
        className="flex flex-col gap-2 sm:gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="form-group w-full">
          <label className="label">Algorithm</label>
          <select
            className={`select select-bordered w-full ${
              errors.algorithm ? "select-error" : ""
            }`}
            {...register("algorithm")}
          >
            <option value="FCFS">First Come First Served</option>
            <option value="SJF">Shortest Job First</option>
            <option value="RR">Round Robin</option>
            <option value="PS">Priority Scheduling</option>
          </select>
          {errors.algorithm && (
            <small className="text-error label-text-alt">
              {errors.algorithm.message}
            </small>
          )}
        </div>
        <div className="form-group w-full">
          <label className="label">Mode</label>
          <select
            className={`select select-bordered w-full ${
              errors.mode ? "select-error" : ""
            }`}
            {...register("mode")}
          >
            <option value="ALL">All at once</option>
            <option value="STEP">Step by step</option>
          </select>
          {errors.mode && (
            <small className="text-error label-text-alt">
              {errors.mode.message}
            </small>
          )}
        </div>
        {algorithm === "RR" && (
          <div className="form-group w-full">
            <label className="label">Quantum</label>
            <input
              type="number"
              min={1}
              className={`input input-bordered w-full ${
                errors.quantum ? "input-error" : ""
              }`}
              {...register(`quantum`, {
                setValueAs: (v) => (v === "" ? undefined : parseInt(v, 10)),
              })}
            />
            {errors.quantum && (
              <small className="text-error label-text-alt">
                {errors.quantum.message}
              </small>
            )}
          </div>
        )}

        <div className="flex justify-between items-center">
          <h3 className="font-bold">Processes</h3>
          <div className="flex gap-2">
            <button
              className="btn btn-primary rounded-full text-lg"
              type="button"
              onClick={() =>
                append({
                  id: processes.length,
                  burstTime: 1,
                  arrivalTime: 0,
                  priority: 1,
                })
              }
            >
              +
            </button>
            <button
              className="btn btn-error rounded-full text-lg"
              type="button"
              onClick={() => remove(-1)}
            >
              &times;
            </button>
          </div>
        </div>

        <div
          className={`grid gap-2 sm:gap-4 ${
            algorithm === "PS"
              ? "grid-cols-[4rem_1fr_1fr_1fr]"
              : "grid-cols-[4rem_1fr_1fr]"
          }`}
        >
          <span className="text-center">Id</span>
          <span className="text-center">Arrival Time</span>
          <span className="text-center">Burst Time</span>
          {algorithm === "PS" && <span className="text-center">Priority</span>}
          {fields.map((field, index) => (
            <Fragment key={field.id}>
              <input
                className={`input input-bordered input-disabled text-center ${
                  errors.processes?.[index]?.id ? "input-error" : ""
                }`}
                disabled
                {...register(`processes.${index}.id`, {
                  setValueAs: (v) => (v === "" ? undefined : parseInt(v, 10)),
                })}
              />
              <input
                type="number"
                min={0}
                className={`input input-bordered min-w-0 ${
                  errors.processes?.[index]?.arrivalTime ? "input-error" : ""
                }`}
                {...register(`processes.${index}.arrivalTime`, {
                  setValueAs: (v) => (v === "" ? undefined : parseInt(v, 10)),
                })}
              />
              <input
                type="number"
                min={1}
                className={`input input-bordered min-w-0 ${
                  errors.processes?.[index]?.burstTime ? "input-error" : ""
                }`}
                {...register(`processes.${index}.burstTime`, {
                  setValueAs: (v) => (v === "" ? undefined : parseInt(v, 10)),
                })}
              />
              {algorithm === "PS" && (
                <input
                  type="number"
                  min={1}
                  className={`input input-bordered min-w-0 ${
                    errors.processes?.[index]?.priority ? "input-error" : ""
                  }`}
                  {...register(`processes.${index}.priority`, {
                    setValueAs: (v) => (v === "" ? undefined : parseInt(v, 10)),
                  })}
                />
              )}
            </Fragment>
          ))}
        </div>
        {errors.processes && (
          <span className="text-error">{errors.processes.message}</span>
        )}
        <button className="btn btn-primary">Start Simulation</button>
        {algorithm === "PS" && <div className="text-sm text-center"><b>Important:</b> Lowest priority comes first</div>}
      </form>

      {/* Modal */}
      <input
        type="checkbox"
        id="simulation-modal"
        className="modal-toggle"
        checked={isModalOpen}
        readOnly
      />
      <div className="modal">
        <div className="modal-box max-w-5xl">
          <div className="flex justify-between gap-2">
            <h3 className="text-lg font-bold">Scheduler</h3>
            <button
              className="btn btn-sm btn-circle"
              onClick={() => closeModal()}
            >
              ✕
            </button>
          </div>
          {getValues().processes?.length && (
            <Simulation
              config={getValues()}
              timestamps={timestamps}
              processes={processes}
              mode={mode}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
