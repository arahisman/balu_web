import React, { useState } from "react";
import { Image } from "react-native";s
import { useSelector } from "react-redux";

const PasswordInput = ({
  value = "",
  error = "",
  onChangep,
  label,
  showPassword = false,
  onClick,
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
          onClick={onClick}
          style={{
            textAlign: "center",
            alignSelf: "center",
            alignItems: "center",
          }}
        >
          <Image
            src={
              showPassword
                ? require("../icons/eye.png")
                : require("../icons/eyeclosed.png")
            }
            color="#aaa"
            style={{
              width: 20,
              height: 20,
              tintColor: "#aaa",
            }}
            maxHeight={20}
            maxWidth={20}
          />
        </div>
      </div>
      <p style={style.error}>{error}</p>
    </div>
  );
};

export default PasswordInput;
