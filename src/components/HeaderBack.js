import React from "react";
import { useSelector } from "react-redux";
import colors from "./styles";
import { Image } from "react-native";
const HeaderBack = ({ onClick, color = "#AAAAAA", text="screen" }) => {
  const theme = useSelector((state) => state.app.theme);

  return (
    <div
      style={{
        width: "100%",
        height: 60,
        backgroundColor: colors[theme].color1,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        alignContent: "center",
        elevation: 4,
        shadowColor: colors[theme].color12,
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 0.16,
        shadowRadius: 20,
      }}
    >
      <div
        onClick={onClick}
        style={{
          display: "flex",
          flexDirection: "row",
          display: "flex",
          justifyContent: "flex-start",
          zIndex: 9999,
          width: 70,
        }}
      >
        <Image
          source={require("../icons/BackArrow.png")}
          color={colors[theme].color3}
          style={{
            width: 40,
            height: 40,
            marginRight: 20,
            marginLeft: 10,
            tintColor: colors[theme].color3,
            alignSelf: "center",
            cursor: 'pointer'
          }}
          maxHeight={40}
          maxWidth={40}
        />
      </div>
      <p
        style={{
          color: colors[theme].color3,
          fontWeight: "600",
          fontSize: 20,
          display: "flex",
          justifyContent: "center",
          textAlign: "center",
          margin: 10,
          position: "absolute",
          left: 0,
          right: 0,
        }}
      >
        {text}
      </p>
    </div>
  );
};

export default HeaderBack;
