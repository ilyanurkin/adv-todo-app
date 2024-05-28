import React from "react";
import { Select, Space } from "antd";
import axios from "axios";

import "./Settings.scss";
export default function Settings({
  settings,
  onChangeFontSize,
  onChangeFontFamily,
  onChangeTheme,
}) {
  const handleChangeFontFamily = (value) => {
    axios.patch("http://localhost:3000/settings", {
      ...settings,
      fontFamily: value,
    });
    onChangeFontFamily(value);
  };

  const handleChangeFontSize = (value) => {
    axios.patch("http://localhost:3000/settings", {
      ...settings,
      fontSize: value,
    });
    onChangeFontSize(value);
  };

  const handleChangeTheme = (value) => {
    axios.patch("http://localhost:3000/settings", {
      ...settings,
      theme: value,
    });
    onChangeTheme(value);
  };

  return (
    <div className="settings">
      <h2>Настройки</h2>
      <Space wrap>
        <div className="settings__item">
          <p>Шрифт:</p>
          <Select
            id="1"
            defaultValue={settings.fontFamily}
            style={{ width: 120, color: "black !important" }}
            onChange={handleChangeFontFamily}
            options={[
              { value: "amatic", label: "amatic" },
              { value: "roboto", label: "roboto" },
              { value: "oswald", label: "oswald" },
              { value: "caveat", label: "caveat" },
              { value: "pacifico", label: "pacifico" },
              { value: "playfair", label: "playfair" },
            ]}
          />
        </div>
        <div className="settings__item">
          <p>Размер шрифта:</p>
          <Select
            defaultValue={settings.fontSize}
            style={{ width: 120 }}
            onChange={handleChangeFontSize}
            options={[
              { value: "small", label: "small" },
              { value: "standard", label: "standard" },
              { value: "large", label: "large" },
            ]}
          />
        </div>
        <div className="settings__item">
          <p>Тема:</p>
          <Select
            defaultValue={settings.theme}
            style={{ width: 120 }}
            onChange={handleChangeTheme}
            options={[
              { value: "light", label: "light" },
              { value: "dark", label: "dark" },
            ]}
          />
        </div>
      </Space>
    </div>
  );
}
