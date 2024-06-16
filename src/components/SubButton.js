import React from "react";
import colors from "./styles";
import { useSelector } from "react-redux";

const SubButton = ({ onPress, p = "screen" }) => {
  const theme = useSelector((state) => state.app.theme);

  return (
    <div
      onPress={onPress}
      style={{
        width: "80%",
        height: 30,
        justifyContent: "center",
        alignSelf: "center",
        zIndex: 7,
        marginTop: 20,
      }}
    >
      <p
        style={{
          color: colors[theme].color1,
          fontSize: 20,
          justifyContent: "center",
          textAlign: "center",
          pDecorationLine: "underline",
          pDecorationStyle: "solid",
          pDecorationColor: colors[theme].color1,
        }}
      >
        {p}
      </p>
    </div>
  );
};

export default SubButton;
