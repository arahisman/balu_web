import React, { useState } from "react";
import MaskInput from "react-native-mask-input";
import { useSelector } from "react-redux";

const MainInputMask = ({
  value = "",
  active = true,
  error = "",
  isCode = false,
  type,
  onChangep,
  label,
  onClick,
  color = "#fff",
  backgroundColor = "#fff",
  placeholder = "empty",
  theme = "dark",
}) => {
  const theme = useSelector((state) => state.app.theme);

  const [focus, setFocus] = useState(false);
  return (
    <div style={style.inputWrapper}>
      <div
        style={{
          ...style.inputContainer,
          ...(focus && { borderWidth: 2 }),
          ...(error.length && { borderColor: "#FF0000", borderWidth: 2 }),
        }}
      >
        <MaskInput
          value={value}
          editable={active}
          onChangeText={(masked, unmasked) => {
            if (active) {
              onChangep(masked);
            }
          }}
          numberOfLines={1}
          placeholder={" " + placeholder}
          onFocus={() => {
            setFocus(true);
          }}
          onBlur={() => {
            setFocus(false);
          }}
          mask={type}
          keyboardType="numeric"
          placeholderColor={theme == "light" ? "#777777" : "#AAAAAA"}
          // style={style.textInput, {opacity: active ? 1 : 0.3, textAlign: !isCode ? 'left' : 'center'}}
          style={{
            ...style.textInput,
            ...{
              opacity: active ? 1 : 0.3,
              textAlign: !isCode ? "left" : "center",
            },
          }}
        />
      </div>
      <p style={style.error}>{error}</p>
    </div>
  );
};

export default MainInputMask;
