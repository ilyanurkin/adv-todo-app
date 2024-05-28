import { act, useEffect, useState } from "react";
import axios from "axios";
import { Route, useHistory } from "react-router-dom";

import "./App.scss";
import "./index.scss";

import SideBar from "./components/SideBar";
import Tasks from "./components/Tasks/Tasks";
import { Statistic } from "./components/Statistic/Statistic";
import Settings from "./components/Settings/Settings";

import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import classNames from "classnames";

function App() {
  const [groupList, setGroupList] = useState(null);
  const [colors, setColors] = useState(null);
  const [activeGroup, setActiveGroup] = useState(null);
  const [activeCategory, setActiveCategory] = useState("statistic");
  const [settings, setSettings] = useState({});
  useEffect(() => {
    axios
      .get("http://localhost:3000/lists?_expand=color&_embed=tasks")
      .then(({ data }) => setGroupList(data));

    axios
      .get("http://localhost:3000/colors")
      .then(({ data }) => setColors(data));
    axios
      .get("http://localhost:3000/settings")
      .then(({ data }) => setSettings(data));
  }, []);
  const getTasksCounter = (list) => {
    let counter = 0;
    if (list) {
      list.map((listItem) => {
        counter += listItem.tasks.length;
      });
    }
    return counter;
  };

  const onAddGroup = (obj) => {
    const newGroups = [...groupList, obj];
    setGroupList(newGroups);
  };

  const addTaskButtonHandler = (groupId, task) => {
    console.log(groupId, task);
    const newGroups = groupList.map((group) => {
      if (group.id === groupId) {
        group.tasks = [...group.tasks, task];
      }
      return group;
    });
    setGroupList(newGroups);
  };

  const onRemoveGroup = (id) => {
    const newGroups = groupList.filter((group) => group.id !== id);
    setGroupList(newGroups);
  };

  const onEditGroupTitle = (id, title) => {
    const newGroups = groupList.map((group) => {
      if (group.id === id) {
        group.name = title;
      }
      return group;
    });
    setGroupList(newGroups);
  };

  const onRemoveTask = (groupId, taskId) => {
    const newGroup = groupList.map((group) => {
      if (group.id === groupId) {
        group.tasks = group.tasks.filter((task) => task.id !== taskId);
      }
      return group;
    });
    setGroupList(newGroup);
    if (window.confirm("Вы действительно хотите удалить задачу")) {
      axios.delete("http://localhost:3000/tasks/" + taskId).catch(() => {
        alert("Ошибка удаленияя");
      });
    }
  };

  const onEditTask = (groupId, taskObj) => {
    const newTaskText = window.prompt("Изменить текст задачи", taskObj.text);
    console.log(groupId, taskObj);
    const newGroups = groupList.map((group) => {
      if (group.id === groupId) {
        group.tasks.map((task) => {
          if (task.id === taskObj.id) {
            task.text = newTaskText;
          }
        });
      }
      return group;
    });
    setGroupList(newGroups);
    axios.patch("http://localhost:3000/tasks/" + taskObj.id, {
      text: newTaskText,
    });
  };

  let history = useHistory();
  let location = useLocation();

  const onChangeCategory = (group) => {
    setActiveCategory(group);
  };
  useEffect(() => {
    const activeGroupId = Number(location.pathname.split("lists/")[1]);

    if (groupList) {
      const group = groupList.find((group) => group.id === activeGroupId);
      setActiveGroup(group);
    }
  }, [groupList, location]);

  const onChangeFontSize = (value) => {
    setSettings((prev) => ({ ...prev, fontSize: value }));
    console.log(settings);
  };

  const onChangeFontFamily = (value) => {
    setSettings((prev) => ({ ...prev, fontFamily: value }));
    console.log(settings);
  };

  const onChangeTheme = (value) => {
    setSettings((prev) => ({ ...prev, theme: value }));
    console.log(settings);
  };

  return (
    <div
      className={classNames(
        "todo",
        { "text-small": settings.fontSize === "small" },
        { "text-large": settings.fontSize === "large" },
        { [`text-${settings.fontFamily}`]: settings.fontFamily },
        { dark: settings.theme === "dark" }
      )}
    >
      <SideBar
        activeGroup={activeGroup}
        groupList={groupList}
        onAdd={onAddGroup}
        onRemove={onRemoveGroup}
        colors={colors}
        tasksCounter={getTasksCounter(groupList)}
        history={history}
        onChangeCategory={onChangeCategory}
      />
      <div className="todo__tasks">
        <Route exact path="/">
          {activeCategory === "tasks"
            ? groupList &&
              groupList.map((group) => (
                <Tasks
                  onEdit={onEditTask}
                  onRemove={onRemoveTask}
                  key={group.id}
                  group={group}
                  onEditTitle={onEditGroupTitle}
                  addTaskButtonHandler={addTaskButtonHandler}
                  emptySkip={true}
                />
              ))
            : null}
        </Route>
        {activeCategory === "tasks"
          ? groupList &&
            activeGroup && (
              <Tasks
                onEdit={onEditTask}
                onRemove={onRemoveTask}
                group={activeGroup}
                onEditTitle={onEditGroupTitle}
                addTaskButtonHandler={addTaskButtonHandler}
              />
            )
          : null}
        {activeCategory === "statistic"
          ? groupList && <Statistic data={groupList} colors={colors} />
          : null}
        {activeCategory === "settings"
          ? settings && (
              <Settings
                settings={settings}
                onChangeFontSize={onChangeFontSize}
                onChangeFontFamily={onChangeFontFamily}
                onChangeTheme={onChangeTheme}
              />
            )
          : null}
      </div>
    </div>
  );
}

export default App;
