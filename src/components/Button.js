import React from "react";
import colors from "./styles";
import { useSelector } from "react-redux";

const Button = ({ onPress, text = "screen" }) => {
  const theme = useSelector((state) => state.app.theme);

  return (
    <div
      onClick={onPress}
      style={{
        width: "80%",
        height: 40,
        borderWidth: 0,
        backgroundColor: colors[theme].color1,
        borderRadius: 30,
        display: "flex",
        justifyContent: "center",
        alignContent:'center',
        alignItems:'center',
        alignSelf: "center",
        zIndex: 7,
        marginTop: 15,
        marginBottom: 15,
        elevation: 4,
        shadowColor: colors[theme].color12,
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 0.16,
        shadowRadius: 20,
        cursor: "pointer",
      }}
    >
      <div
        style={{
          color: colors[theme].color3,
          fontSize: 25,
          fontWeight: "800",
          display: "flex",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        {text}
      </div>
    </div>
  );
};

export default Button;
