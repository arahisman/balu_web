import React, { useState } from "react";

import { useSelector } from "react-redux";

const PasswordInput = ({
  value = "",
  error = "",
  onChangep,
  label,
  showPassword = false,
  onPress,
  color = "#fff",
  backgroundColor = "#fff",
  placeholder = "empty",
  theme = "dark",
}) => {
  const [focus, setFocus] = useState(false);
  const theme = useSelector((state) => state.app.theme);

  return (
    <div style={{ width: "74%" }}>
      <div
        style={{
          ...style.inputContainer,
          ...(focus && { borderWidth: 2 }),
          ...(error.length && { borderColor: "#FF0000", borderWidth: 2 }),
        }}
      >
        <input
          value={value}
          onChange={onChangep}
          numberOfLines={1}
          onFocus={() => {
            setFocus(true);
          }}
          onBlur={() => {
            setFocus(false);
          }}
          placeholder={placeholder}
          securepEntry={!showPassword}
          placeholderColor={theme == "light" ? "#777777" : "#AAAAAA"}
          style={{ ...style.textInput, ...{ textAlign: "left", width: "80%" } }}
        />
        {/*Кнопка скрывающая и показывающая пароль по нажатию */}
        <div
          onPress={onPress}
          style={{
            textAlign: "center",
            alignSelf: "center",
            alignItems: "center",
          }}
        >
          <Img
            source={
              showPassword
                ? require("../icons/eye.png")
                : require("../icons/eyeclosed.png")
            }
            resizeMode="cover"
            style={{ width: 20, height: 20, tintColor: "#aaa" }}
          />
        </div>
      </div>
      <p style={style.error}>{error}</p>
    </div>
  );
};

export default PasswordInput;
