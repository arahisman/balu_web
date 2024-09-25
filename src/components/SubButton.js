import React from "react";
import colors from "./styles";
import { useSelector } from "react-redux";

const SubButton = ({ onClick, text="screen" }) => {
  const theme = useSelector((state) => state.app.theme);

  return (
    <div
      onClick={onClick}
      style={{
        width: "80%",
        height: 30,
        display: 'flex',
justifyContent: "center",
        alignSelf: "center",
        zIndex: 7,
        marginTop: 20,
        cursor: 'pointer'
      }}
    >
      <p
        style={{
          color: colors[theme].color1,
          fontSize: 20,
          display: 'flex',
justifyContent: "center",
          textAlign: "center",
          pDecorationLine: "underline",
          pDecorationStyle: "solid",
          pDecorationColor: colors[theme].color1,
        }}
      >
        {text}
      </p>
    </div>
  );
};

export default SubButton;
