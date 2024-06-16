import React from "react";
import { NameInitialsAvatar } from "react-name-initials-avatar";
import colors from "./styles";
import { useSelector } from "react-redux";

const renderImg = (item, theme) => {
  if (item.photo?.length) {
    return (
      <Img
        source={{ uri: item.photo }}
        resizeMode="contain"
        style={{
          width: 50,
          margin: 5,
          overflow: "hidden",
          height: 50,
          borderRadius: 137,
          borderWidth: item.chatted || item.black_listed ? 2 : 0,
          borderColor: item.black_listed ? "red" : "green",
        }}
      />
    );
  } else {
    return (
      <div
        style={{
          width: 50,
          margin: 5,
          overflow: "hidden",
          height: 50,
          borderRadius: 50,
          borderWidth: item.chatted || item.black_listed ? 4 : 0,
          borderColor: item.black_listed ? "#f00" : "#0f0",
        }}
      >
        <NameInitialsAvatar
          size={"50px"}
          bgColor="#9af"
          borderColor="#fff"
          textColor="#fff"
          textSize="50px"
          name={item.name}
        />
      </div>
    );
  }
};
const UserItem = ({ onPress, item, user, index }) => {
  const theme = useSelector((state) => state.app.theme);

  return (
    <div
      key={index}
      activeOpacity={1}
      onPress={onPress}
      style={{
        width: "100%",
        height: 60,
        backgroundColor: colors[theme].color5,
        flexDirection: "row",
        elevation: 7,
        shadowColor: colors[theme].color12,

        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 0.36,
        shadowRadius: 20,
      }}
    >
      {renderImg(item, theme)}
      <div>
        <p
          numberOfLines={1}
          style={{
            marginLeft: 10,
            opacity: item.unregistered ? 0.7 : 1,
            color: colors[theme].color4,
            marginTop: 2,
            fontSize: 20,
            fontWeight: "500",
            overflow: "hidden",
          }}
        >
          {item.name}
        </p>
        <p
          numberOfLines={1}
          style={{
            marginLeft: 10,
            color: colors[theme].color4,
            opacity: item.unregistered ? 0.7 : 1,
            marginTop: 5,
            fontSize: 16,
            fontWeight: "500",
            overflow: "hidden",
          }}
        >
          {"+" + item.phone}
        </p>
      </div>
    </div>
  );
};

export default UserItem;
