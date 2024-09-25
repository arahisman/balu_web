import React from "react";
import colors from "./styles";
import { useSelector } from "react-redux";
import { Image } from "react-native";

const HeaderBack = ({
  onClick,
  onPress2,
  onPress3,
  onPress4,
  text="",
  screen = "",
  color = "#AAAAAA",
}) => {
  const theme = useSelector((state) => state.app.theme);
  const count = useSelector((state) => state.chats.count);

  return (
    <div
      style={{
        width: "100%",
        height: 60,
        display: "flex",
        flexDirection: "row",
        backgroundColor: colors[theme].color1,
        display: "flex",
        justifyContent: "space-between",
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
        }}
      >
        <Image
          source={require("../icons/logo.png")}
          color={colors[theme].color3}
          style={{
            width: 40,
            height: 40,
            alignSelf: "center",
            tintColor: colors[theme].color3,
            marginLeft: 10,
            cursor: 'pointer'
          }}
          maxHeight={40}
          maxWidth={40}
        />
      </div>
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
          numberOfLines={1}
          style={{
            color: colors[theme].color3,
            fontWeight: "600",
            fontSize: 20,
            display: "flex",
            justifyContent: "center",
            textAlign: "center",
            margin: 10,
            overflow: "hidden",
          }}
        >
          {text}
        </p>
      </div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        {screen !== "Call" && (
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
              source={require("../icons/call.png")}
              color={colors[theme].color3}
              style={{
                width: 38,
                height: 38,
                alignSelf: "center",
                tintColor: colors[theme].color3,
                cursor: 'pointer'
              }}
            />
          </div>
        )}
        {screen !== "Main" && (
          <div
            onClick={onPress3}
            style={{
              display: "flex",
              flexDirection: "row",
              marginRight: 10,
              display: "flex",
              justifyContent: "flex-start",
            }}
          >
            <Image
              source={require("../icons/messages.png")}
              color={colors[theme].color3}
              style={{
                width: 40,
                height: 40,
                alignSelf: "center",
                tintColor: colors[theme].color3,
                marginLeft: 10,
                cursor: 'pointer'
              }}
              maxHeight={40}
              maxWidth={40}
            />
            {count > 0 && (
              <p
                style={{
                  color: "#ffffff",
                  backgroundColor: "#e88",
                  fontSize: 20,
                  left: 13,
                  top: 6,
                  padding: 2,
                  paddingLeft: 8,
                  paddingRight: 8,
                  borderRadius: 20,
                  position: "absolute",
                  zIndex: 999,
                }}
              >
                {count}
              </p>
            )}
          </div>
        )}
        <div
          onClick={onPress4}
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
              width: 40,
              height: 40,
              alignSelf: "center",
              tintColor: colors[theme].color3,
              marginLeft: 10,
              cursor: 'pointer'
            }}
            maxHeight={40}
            maxWidth={40}
          />
        </div>
      </div>
    </div>
  );
};

export default HeaderBack;
