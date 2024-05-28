import React, { useEffect, useState } from "react";

import SideBarList from "../SideBarList/SideBarList";
import Badge from "../Badge/Badge";

import "./AddList.scss";
import closeSVG from "../../assets/img/close.svg";
import axios from "axios";

function AddList({ colors, onAdd }) {
  const [visibleForm, setVisibleForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const [addGroupInputValue, setAddGroupInputValue] = useState("");

  const addButtonHandler = () => {
    if (!addGroupInputValue) {
      alert("Одно из требуемых полей не заполнено");
      return;
    }
    setIsLoading(true);

    axios
      .post("http://localhost:3000/lists", {
        name: addGroupInputValue,
        colorId: selectedColor,
        tasks: [],
      })
      .then(({ data }) => {
        let selectedColorName = colors.filter(
          (color) => color.id === selectedColor
        )[0].name;
        const newListObj = { ...data, color: { name: selectedColorName } };
        onAdd(newListObj);
        resetAddForm();
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const resetAddForm = () => {
    setAddGroupInputValue("");
    setSelectedColor(null);
    setVisibleForm(false);
  };

  return (
    <div className="add-list">
      <SideBarList
        onClick={() => setVisibleForm((prev) => !prev)}
        items={[
          {
            className: "list__add-button",
            icon: (
              <svg
                width="10"
                height="10"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="list__icon-add"
              >
                <path
                  d="M8 1V15"
                  stroke="black"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M1 8H15"
                  stroke="black"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ),
            name: "Добавить группу",
          },
        ]}
      />
      {visibleForm && (
        <div className="add-list__form">
          <img
            onClick={resetAddForm}
            src={closeSVG}
            alt="Close form"
            className="add-list__form-close-button"
          />
          <input
            value={addGroupInputValue}
            onChange={(e) => {
              setAddGroupInputValue(e.target.value);
            }}
            type="text"
            placeholder="Название папки"
            className="field"
          />
          <div className="add-list__form-colors">
            {colors.map((color) => (
              <Badge
                key={color.id}
                color={color.name}
                onClick={() => setSelectedColor(color.id)}
                className={selectedColor === color.id && "active"}
              />
            ))}
          </div>
          <button onClick={addButtonHandler} className="button">
            {isLoading ? "Добавление..." : "Добавить"}
          </button>
        </div>
      )}
    </div>
  );
}

export default AddList;
