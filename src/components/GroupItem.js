import React from "react";
import { NameInitialsAvatar } from "react-name-initials-avatar";
import colors from "./styles";
import { useSelector } from "react-redux";

const renderImg = (item, theme) => {
  let u = { name: "", photo: "" };
  if (!item || !item.users) {
    return null;
  }
  if (item.name && item.name.length) {
    u.name = item.name;
    u.photo = item.photo;
  }

  if (u.photo?.length) {
    return (
      <Img
        source={{ uri: u.photo }}
        resizeMode="contain"
        style={{
          width: 50,
          margin: 7,
          height: 50,
          borderRadius: 137,
          borderColor: colors[theme]?.color4 || "#fff",
        }}
      />
    );
  } else {
    return (
      <div
        style={{
          width: 50,
          margin: 10,
          height: 50,
          borderRadius: 137,
        }}
      >
        <NameInitialsAvatar
          size={"50px"}
          bgColor="#9af"
          borderColor="#fff"
          textColor="#fff"
          textSize="50px"
          name={u?.name}
        />{" "}
      </div>
    );
  }
};
const getName = (item) => {
  return item.name;
};

const GroupItem = ({ onPress, item, removeChat }) => {
  const user = useSelector((state) => state.usr);
  const users = useSelector((state) => state.app.user_list);
  const theme = useSelector((state) => state.app.theme);

  return (
    <div
      key={item._id}
      activeOpacity={1}
      onPress={onPress}
      onLongPress={removeChat}
      style={{
        width: "100%",
        height: 65,
        backgroundColor: colors[theme].color5,
        flexDirection: "row",
        elevation: 6,
        shadowColor: colors[theme].color12,
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 0.36,
        shadowRadius: 20,
      }}
    >
      {renderImg(item, users, user, theme)}
      <div>
        <p
          numberOfLines={1}
          style={{
            marginLeft: 10,
            color: colors[theme].color6,
            marginTop: 5,
            fontSize: 18,
            fontWeight: "500",
            overflow: "hidden",
            width: "100%",
          }}
        >
          {getName(item, users, user, theme)}
        </p>
        <p
          numberOfLines={1}
          style={{
            marginLeft: 10,
            color: colors[theme].color4,
            marginBottom: 5,
            fontSize: 16,
            fontWeight: "400",
            overflow: "hidden",
          }}
        ></p>
      </div>
    </div>
  );
};

export default GroupItem;
