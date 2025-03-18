import React, { useState } from "react";
import ClickOutside from "@/components/ClickOutside";
import { useTaskContext } from "./TaskContext";
import { Task } from "./types";



interface TaskPopupProps {
  popupOpen: boolean;
  setPopupOpen: (open: boolean) => void;
  task?: Task;
  addTask?: (newTask: Task) => void;
  updateTask?: (updatedTask: Task) => void;
}

const TaskPopup: React.FC<TaskPopupProps> = ({ popupOpen, setPopupOpen, task,
  updateTask }) => {
  const { addTask } = useTaskContext();
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [status, setStatus] = useState(task?.status);



  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim()) return;

    const updatedTask = {
      id: task?.id || Date.now().toString(), // Если это новая задача, генерируем ID
      title,
      description,
      status: status as "todo" | "inProgress" | "completed",
      taskItems: task?.taskItems || [],
      isLoading: task?.isLoading ?? false,
    };

    if (task) {
      // Если есть задача для редактирования, вызываем updateTask
      updateTask?.(updatedTask);
    } else {
      // Если задачи нет, вызываем addTask
      addTask?.(updatedTask);
    }

    setPopupOpen(false);
    setTitle("");
    setDescription("");
    setStatus("todo");
  };

  return (
    <div
      className={`fixed left-0 top-0 z-99999 flex h-screen w-full justify-center overflow-y-scroll bg-[#111928]/70 px-4 py-5`}
    >
      <ClickOutside
        onClick={() => setPopupOpen(false)}
        className="w-full max-w-[730px]"
      >
        <div className="relative m-auto rounded-xl border border-stroke bg-gray-2 p-4 shadow-3 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-8 xl:p-10">
          <button
            onClick={() => setPopupOpen(false)}
            className="absolute right-1 top-1 sm:right-5 sm:top-5"
          >
            <svg
              className="fill-current"
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12.8908 10.996L20.5038 3.38635C21.0315 2.85888 21.0315 2.02306 20.5038 1.49559C19.9763 0.968267 19.1405 0.968267 18.613 1.49559L10.9996 9.10559L3.38624 1.49559C2.85868 0.968267 2.02294 0.968267 1.49538 1.49559C0.967684 2.02306 0.967684 2.85888 1.49538 3.38635L9.10839 10.996L1.49538 18.6056C0.967684 19.1331 0.967684 19.9689 1.49538 20.4964C1.71682 20.7177 2.05849 20.9001 2.44081 20.9001C2.75323 20.9001 3.13233 20.7971 3.40557 20.4771L10.9996 12.8864L18.613 20.4964C18.8344 20.7177 19.1761 20.9001 19.5584 20.9001C19.8719 20.9001 20.2526 20.7964 20.526 20.4737C21.0314 19.9452 21.024 19.1256 20.5038 18.6056L12.8908 10.996Z"
                fill=""
              />
            </svg>
          </button>

          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label
                htmlFor="taskTitle"
                className="mb-2.5 block font-medium text-dark dark:text-white"
              >
                Task title
              </label>
              <input
                type="text"
                name="taskTitle"
                id="taskTitle"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title"
                className="w-full rounded-[7px] border border-stroke bg-white px-4.5 py-3 text-dark focus:border-primary focus-visible:outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
              />
            </div>

            <div className="mb-5">
              <label
                htmlFor="taskDescription"
                className="mb-2.5 block font-medium text-dark dark:text-white"
              >
                Task description
              </label>
              <textarea
                name="taskDescription"
                id="taskDescription"
                cols={30}
                rows={7}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter task description"
                className="w-full rounded-[7px] border border-stroke bg-white px-4.5 py-3 text-dark focus:border-primary focus-visible:outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
              ></textarea>
            </div>

            <div className="mb-5">
              <label
                htmlFor="taskStatus"
                className="mb-2.5 block font-medium text-dark dark:text-white"
              >
                Status
              </label>
              <select
                id="taskStatus"
                value={status}
                onChange={(e) => setStatus(e.target.value as "todo" | "inProgress" | "completed")}
                className="w-full rounded-[7px] border border-stroke bg-white px-4.5 py-3 text-dark focus:border-primary focus-visible:outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
              >
                <option value="todo">To Do</option>
                <option value="inProgress">In Progress</option>
                <option value="completed">Done</option>
              </select>
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-[7px] bg-primary px-4.5 py-3.5 font-medium text-white hover:bg-opacity-90"
            >
              <svg
                className="fill-current"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.6253 7.49984C10.6253 7.15466 10.3455 6.87484 10.0003 6.87484C9.65515 6.87484 9.37533 7.15466 9.37533 7.49984L9.37533 9.37486H7.50033C7.15515 9.37486 6.87533 9.65468 6.87533 9.99986C6.87533 10.345 7.15515 10.6249 7.50033 10.6249H9.37533V12.4998C9.37533 12.845 9.65515 13.1248 10.0003 13.1248C10.3455 13.1248 10.6253 12.845 10.6253 12.4998L10.6253 10.6249H12.5003C12.8455 10.6249 13.1253 10.345 13.1253 9.99986C13.1253 9.65468 12.8455 9.37486 12.5003 9.37486H10.6253V7.49984Z"
                  fill=""
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M10.0003 1.0415C5.05278 1.0415 1.04199 5.05229 1.04199 9.99984C1.04199 14.9474 5.05278 18.9582 10.0003 18.9582C14.9479 18.9582 18.9587 14.9474 18.9587 9.99984C18.9587 5.05229 14.9479 1.0415 10.0003 1.0415ZM2.29199 9.99984C2.29199 5.74264 5.74313 2.2915 10.0003 2.2915C14.2575 2.2915 17.7087 5.74264 17.7087 9.99984C17.7087 14.257 14.2575 17.7082 10.0003 17.7082C5.74313 17.7082 2.29199 14.257 2.29199 9.99984Z"
                  fill=""
                />
              </svg>
              {task ? "Update task" : "Add task"}
            </button>
          </form>
        </div>
      </ClickOutside>
    </div>
  );
};

export default TaskPopup;