import React, { useState } from "react";
import addIconSVG from "../../assets/img/add.svg";
import axios from "axios";

export default function AddTaskForm({ addTaskButtonHandler, taskGroup }) {
  const [formVisibility, setFormVisibility] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const toggleVisibility = () => {
    setFormVisibility((prev) => !prev);
    setInputValue("");
  };

  const addTask = () => {
    setIsLoading(true);
    const newTask = {
      listId: taskGroup.id,
      text: inputValue,
      completed: false,
    };
    axios
      .post("http://localhost:3000/tasks/", newTask)
      .then(({ data }) => {
        addTaskButtonHandler(taskGroup.id, data);
        setIsLoading(false);
        setInputValue("");
        setFormVisibility((prev) => !prev);
      })
      .catch(() => {
        alert("Ошибка при добавлении задачи");
      });
  };

  return (
    <div className="tasks__form">
      {!formVisibility ? (
        <div onClick={toggleVisibility} className="tasks__form-new">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 1V15"
              stroke="black"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M1 8H15"
              stroke="black"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span>Новая задача</span>
        </div>
      ) : (
        <div className="tasks__form-opened">
          <input
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            type="text"
            placeholder="Текст задачи"
            className="field"
          />
          <button disabled={isLoading} className="button" onClick={addTask}>
            {isLoading ? "Добавление..." : "Добавить задачу"}
          </button>
          <button className="button button-grey" onClick={toggleVisibility}>
            Отмена
          </button>
        </div>
      )}
    </div>
  );
}
