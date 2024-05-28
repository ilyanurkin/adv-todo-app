import React from "react";
import axios from "axios";

import AddTaskForm from "./AddTaskForm";
import Task from "./Task";

import "./Tasks.scss";

import editIconSVG from "../../assets/img/edit.svg";

function Tasks({
  group,
  onEditTitle,
  addTaskButtonHandler,
  emptySkip,
  onRemove,
  onEdit,
}) {
  const editTitle = () => {
    const newTitle = window.prompt(
      // Переписать на модальное окно
      "Введите измененное название списка",
      group.name
    );
    if (newTitle) {
      onEditTitle(group.id, newTitle);
      axios
        .patch("http://localhost:3000/lists/" + group.id, {
          name: newTitle,
        })
        .catch(() => alert("Ошибка обновления данных на сервере"));
    }
  };

  return (
    <div className="tasks">
      <h2 style={{ color: group.color.hex }} className="task__title ">
        {group.name}{" "}
        <img onClick={editTitle} src={editIconSVG} alt="edit group" />
      </h2>

      <div className="tasks__items ">
        {emptySkip ? null : !group.tasks.length && <h2>Задачи отсутствуют</h2>}
        {group.tasks.map((task) => (
          <Task
            key={task.id}
            id={task.id}
            groupId={group.id}
            text={task.text}
            onEdit={onEdit}
            onRemove={onRemove}
          />
        ))}
      </div>
      <AddTaskForm
        addTaskButtonHandler={addTaskButtonHandler}
        taskGroup={group}
      />
    </div>
  );
}

export default Tasks;
