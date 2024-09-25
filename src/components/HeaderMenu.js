import React from "react";
import colors from "./styles";
import { useSelector } from "react-redux";
import { Image } from "react-native";
const HeaderBack = ({ onClick, onPress2, color = "#AAAAAA" }) => {
  const theme = useSelector((state) => state.app.theme);

  return (
    <div
      style={{
        width: "100%",
        height: 60,
        backgroundColor: colors[theme].color1,
        display: "flex",
        flexDirection: "row",
        elevation: 4,
        shadowColor: colors[theme].color12,
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 0.16,
        shadowRadius: 20,
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          display: "flex",
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
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div
          onClick={onPress2}
          style={{
            display: "flex",
            flexDirection: "row",
            marginRight: 10,
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          <Image
            source={require("../icons/menu.png")}
            color={colors[theme].color3}
            style={{
              width: 38,
              height: 38,
              alignSelf: "center",
              tintColor: colors[theme].color3,
              cursor: 'pointer'
            }}
            maxHeight={38}
            maxWidth={38}
          />
        </div>
      </div>
    </div>
  );
};

export default HeaderBack;
