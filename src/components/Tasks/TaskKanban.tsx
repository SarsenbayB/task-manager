"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import DropdownDefault from "@/components/Dropdowns/DropdownDefault";
import { useTaskContext } from "./TaskContext";

const TaskKanban = () => {
  const { lanes = [], moveTask, isLoading } = useTaskContext();
  console.log("lanes:", lanes);

  useEffect(() => {
    const draggables = document.querySelectorAll(".task");
    const droppables = document.querySelectorAll(".swim-lane");

    draggables.forEach((task) => {
      (task as HTMLElement).addEventListener("dragstart", (e: DragEvent) => {
        task.classList.add("is-dragging");

        if (e.dataTransfer) {
          const taskId = task.getAttribute("data-task-id");
          const laneStatus = task.closest(".swim-lane")?.getAttribute("data-lane-status");
          if (taskId && laneStatus) {
            e.dataTransfer.setData("text/plain", JSON.stringify({ taskId, laneStatus }));
          }
        }
      });

      task.addEventListener("dragend", () => {
        task.classList.remove("is-dragging");
        task.parentElement?.removeChild(task);
      });
    });

    droppables.forEach((zone) => {
      (zone as HTMLElement).addEventListener("dragover", (e: DragEvent) => {
        e.preventDefault();
        const bottomTask = insertAboveTask(
          zone as HTMLElement,
          (e as DragEvent).clientY,
        );
        const curTask = document.querySelector(".is-dragging");

        if (curTask && curTask.parentElement !== zone) {
          if (!bottomTask) {
            zone.appendChild(curTask);
          } else {
            zone.insertBefore(curTask, bottomTask);
          }
        }
      });

      zone.addEventListener("drop", (e: Event) => {
        e.preventDefault();
        const dropEvent = e as DragEvent;

        if (dropEvent.dataTransfer) {
          try {
            const data = JSON.parse(dropEvent.dataTransfer.getData("text/plain"));
            const taskId = data.taskId;
            const newLaneStatus = (zone as HTMLElement).getAttribute("data-lane-status") as "todo" | "inProgress" | "completed";

            if (taskId && ["todo", "inProgress", "completed"].includes(newLaneStatus)) {
              moveTask(taskId, newLaneStatus as "todo" | "inProgress" | "completed");
            } else {
              console.error("Invalid lane status:", newLaneStatus);
            }
          } catch (error) {
            console.error("Error parsing drop data:", error);
          }
        }
      });
    });

    const insertAboveTask = (
      zone: HTMLElement,
      mouseY: number,
    ): HTMLElement | null => {
      const els = Array.from(zone.querySelectorAll(".task:not(.is-dragging)"));

      let closestTask: HTMLElement | null = null;
      let closestOffset = Number.NEGATIVE_INFINITY;

      els.forEach((task) => {
        const { top } = task.getBoundingClientRect();

        const offset = mouseY - top;

        if (offset < 0 && offset > closestOffset) {
          closestOffset = offset;
          closestTask = task as HTMLElement;
        }
      });

      return closestTask;
    };
  }, [lanes, moveTask]);

  return (
    <>
      <div className="mt-9 grid grid-cols-1 gap-7.5 sm:grid-cols-2 xl:grid-cols-3">
        {isLoading ? (
          <p>Loading tasks...</p>
        ) : Array.isArray(lanes) && lanes.length > 0 ? (
          lanes.map((lane, laneIndex) => (
            <div
              key={laneIndex}
              className="swim-lane flex flex-col gap-5.5"
              data-lane-status={lane.status}
            >
              <h4 className="text-xl font-bold text-dark dark:text-white">
                {lane.title} ({lane.tasks?.length ?? 0})
              </h4>

              {Array.isArray(lane.tasks) && lane.tasks.length > 0 ? (
                lane.tasks.map((task, taskIndex) => (
                  <div
                    key={taskIndex}
                    draggable="true"
                    data-task-id={task.id}
                    className="task relative flex cursor-move justify-between rounded-[10px] bg-white p-7 shadow-1 dark:bg-gray-dark dark:shadow-card"
                  >
                    <div>
                      <h5 className="mb-4 text-lg font-medium text-black dark:text-white">
                        {task.title}
                      </h5>

                      {task.description && <p>{task.description}</p>}

                      {task.image && (
                        <div className="my-4">
                          <Image
                            src={task.image}
                            width={268}
                            height={155}
                            alt="Task"
                            priority={true}
                          />
                        </div>
                      )}

                      <div className="flex flex-col gap-2">
                        {Array.isArray(task.taskItems) &&
                          task.taskItems.map((item, index) => (
                            <label
                              key={index}
                              htmlFor={`taskCheckbox-${laneIndex}-${taskIndex}-${index}`}
                              className="cursor-pointer"
                            >
                              <div className="relative flex items-center pt-0.5">
                                <input
                                  type="checkbox"
                                  id={`taskCheckbox-${laneIndex}-${taskIndex}-${index}`}
                                  className="taskCheckbox sr-only"
                                  defaultChecked={item.completed}
                                />
                                <div className="box mr-3 flex h-5 w-5 items-center justify-center rounded border border-stroke dark:border-dark-3 dark:bg-dark-2">
                                  <span className="text-white opacity-0">
                                    <svg
                                      className="fill-current"
                                      width="10"
                                      height="7"
                                      viewBox="0 0 10 7"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M9.70685 0.292804C9.89455 0.480344 10 0.734667 10 0.999847C10 1.26503 9.89455 1.51935 9.70685 1.70689L4.70059 6.7072C4.51283 6.89468 4.2582 7 3.9927 7C3.72721 7 3.47258 6.89468 3.28482 6.7072L0.281063 3.70701C0.0986771 3.5184 -0.00224342 3.26578 3.785e-05 3.00357C0.00231912 2.74136 0.10762 2.49053 0.29326 2.30511C0.4789 2.11969 0.730026 2.01451 0.992551 2.01224C1.25508 2.00996 1.50799 2.11076 1.69683 2.29293L3.9927 4.58607L8.29108 0.292804C8.47884 0.105322 8.73347 0 8.99896 0C9.26446 0 9.51908 0.105322 9.70685 0.292804Z"
                                        fill=""
                                      />
                                    </svg>
                                  </span>
                                </div>
                                <p>{item.name}</p>
                              </div>
                            </label>
                          ))}
                      </div>
                    </div>

                    <div className="absolute right-4 top-4">
                      <DropdownDefault task={task} />
                    </div>
                  </div>
                ))
              ) : (
                <p>No tasks available</p>
              )}
            </div>
          ))
        ) : (
          <p>No lanes available</p>
        )}
      </div>
    </>
  );
};

export default TaskKanban;
