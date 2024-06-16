import React from "react";
import { NameInitialsAvatar } from "react-name-initials-avatar";
import colors from "./styles";
import { useSelector } from "react-redux";

const getlm = (messages, item) => {
  let m = messages[item._id];
  let lastMessage = "";
  if (m && m.length) {
    lastMessage = m[0].p;
  }
  return lastMessage;
};
const renderImg = (item, users, user, theme) => {
  const type = item.type;

  let u = { name: "", photo: "" };
  if (!item || !item.users) {
    return null;
  }
  if (type === "group") {
    if (item.name && item.name.length) {
      u.name = item.name;
      u.photo = item.photo;
    }
  } else {
    if (users && users.length) {
      let i = users.find(
        (i) => i._id == item.users.find((j) => j !== user._id)
      );
      if (i) {
        if (!i.name || !i.name.length > 0) {
          u.name = i.phone;
          u.photo = i.photo;
        } else {
          u.name = i.name;
          u.photo = i.photo;
        }
      } else {
        u.name = user.name;
        u.photo = user.photo;
      }
    }
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
          borderColor: colors[theme].color4,
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
          name={u?.name ? u.name : u.phone}
        />
      </div>
    );
  }
};
const getName = (item, users, user, theme) => {
  const type = item.type;
  let u = { name: "", photo: "" };
  if (!item || !item.users) {
    return "";
  }
  if (type !== "private") {
    if (item.name && item.name.length) {
      u.name = item.name;
    }
  } else {
    if (users && users.length) {
      let i = users.find(
        (i) => i._id == item.users.find((j) => j !== user._id)
      );
      if (i) {
        if (!i.name || !i.name.length > 0) {
          u.name = i.phone;
        } else {
          u.name = i.name;
        }
      } else {
        u.name = user.name;
      }
    }
  }
  return u.name;
};
const renderButton = (signTo, theme) => {
  return (
    <div
      style={{
        width: "83%",
        flexDirection: "row",
        justifyContent: "flex-end",
        paddingRight: 0,
      }}
    >
      <div
        style={{
          width: 150,
          height: 30,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors[theme].color1,
          borderRadius: 20,
        }}
        onPress={signTo}
      >
        <p style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>
          Вступить
        </p>
      </div>
    </div>
  );
};

const ChatItem = ({ onPress, item, removeChat, signTo }) => {
  const user = useSelector((state) => state.usr);
  const users = useSelector((state) => state.app.user_list);
  const theme = useSelector((state) => state.app.theme);
  const messages = useSelector((state) => state.chats.messages);

  const nm = useSelector((state) => state.chats.new_messages);
  const count = nm[item._id] || 0;

  return (
    <div
      key={item._id}
      activeOpacity={1}
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
            marginTop: 3,
            fontSize: 18,
            fontWeight: "500",
            overflow: "hidden",
            width: "100%",
          }}
        >
          {getName(item, users, user, theme)}
        </p>
        {renderButton(signTo, theme)}
      </div>
      {count > 0 && (
        <p
          style={{
            color: "#ffffff",
            backgroundColor: "#e88",
            fontSize: 20,
            right: 20,
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
  );
};

export default ChatItem;
