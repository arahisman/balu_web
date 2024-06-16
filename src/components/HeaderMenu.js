import React from "react";
import colors from "./styles";
import { useSelector } from "react-redux";

const HeaderBack = ({ onPress, onPress2, color = "#AAAAAA" }) => {
  const theme = useSelector((state) => state.app.theme);

  return (
    <div
      style={{
        width: "100%",
        height: 60,
        backgroundColor: colors[theme].color1,
        flexDirection: "row",
        elevation: 4,
        shadowColor: colors[theme].color12,
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 0.16,
        shadowRadius: 20,
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          flexDirection: "column",
          justifyContent: "center",
          alignContent: "center",
          alignSelf: "center",
          alignItems: "center",
        }}
      >
        <p
          style={{
            color: colors[theme].color3,
            margin: 10,
            marginLeft: 30,
            maxWidth: "60%",
            fontSize: 22,
            fontWeight: "600",
            overflow: "hidden",
          }}
        >
          Меню
        </p>
      </div>
      <div style={{ flexDirection: "row" }}>
        <div
          onPress={onPress2}
          style={{
            flexDirection: "row",
            marginRight: 10,
            justifyContent: "flex-start",
          }}
        >
          <Img
            key="menu"
            source={require("../icons/menu.png")}
            resizeMode="contain"
            style={{
              width: 38,
              height: 38,
              tintColor: colors[theme].color3,
              alignSelf: "center",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default HeaderBack;
