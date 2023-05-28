import { Config, ConfigSchema } from "@/types/config";
import { NextPage } from "next";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Fragment, useState } from "react";
import Simulation from "@/components/Simulation";

const App: NextPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    control,
    formState: { errors },
  } = useForm<Config>({
    resolver: zodResolver(ConfigSchema),
    defaultValues: {
      algorithm: "FCFS",
      burstTime: 100,
      processes: [],
    },
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeModal = () => setIsModalOpen(false);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "processes",
  });

  let algorithm = watch("algorithm");
  let burstTime = watch("burstTime");
  let processes = watch("processes");

  const onSubmit: SubmitHandler<Config> = (data) => {
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
          </select>
          {errors.algorithm && (
            <small className="text-error label-text-alt">
              {errors.algorithm.message}
            </small>
          )}
        </div>
        <div className="form-group w-full">
          <label className="label">Burst Time Duration (ms)</label>
          <input
            type="number"
            placeholder="Burst time (ms)"
            className={`input input-bordered w-full ${errors.burstTime ? "input-error" : ""}`}
            {...register("burstTime", {
              setValueAs: (v) => (v === "" ? undefined : parseInt(v, 10)),
            })}
          />
          {errors.burstTime && (
            <small className="text-error label-text-alt">
              {errors.burstTime.message}
            </small>
          )}
        </div>

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
                  quantum: 1,
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
            algorithm === "RR"
              ? "grid-cols-[4rem_1fr_1fr_1fr]"
              : "grid-cols-[4rem_1fr_1fr]"
          }`}
        >
          <span className="text-center">Id</span>
          <span className="text-center">Arrival Time</span>
          <span className="text-center">Burst Time</span>
          {algorithm === "RR" && <span className="text-center">Quantum</span>}
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
                className={`input input-bordered min-w-0 ${
                  errors.processes?.[index]?.arrivalTime ? "input-error" : ""
                }`}
                {...register(`processes.${index}.arrivalTime`, {
                  setValueAs: (v) => (v === "" ? undefined : parseInt(v, 10)),
                })}
              />
              <input
                className={`input input-bordered min-w-0 ${
                  errors.processes?.[index]?.burstTime ? "input-error" : ""
                }`}
                {...register(`processes.${index}.burstTime`, {
                  setValueAs: (v) => (v === "" ? undefined : parseInt(v, 10)),
                })}
              />
              {algorithm === "RR" && (
                <input
                  className={`input input-bordered min-w-0 ${
                    errors.processes?.[index]?.quantum ? "input-error" : ""
                  }`}
                  {...register(`processes.${index}.quantum`, {
                    setValueAs: (v) => (v === "" ? undefined : parseInt(v, 10)),
                  })}
                />
              )}
            </Fragment>
          ))}
        </div>
        {errors.processes && <span className="text-error">{errors.processes.message}</span>}
        <button className="btn btn-primary">Start Simulation</button>
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
        <div className="modal-box">
          <div className="flex justify-between gap-2">
            <h3 className="text-lg font-bold">
              Scheduler
            </h3>
            <button
              className="btn btn-sm btn-circle"
              onClick={() => closeModal()}
            >
              ✕
            </button>
          </div>
          { getValues().processes?.length &&
            <Simulation config={getValues()}/>
          }
        </div>
      </div>
    </div>
  );
};

export default App;
