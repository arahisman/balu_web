import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import UserAvatar from "react-native-user-avatar";
import colors from "./styles";
import { useSelector } from "react-redux";
import config from "../config";

const getlm = (messages, item) => {
  let m = messages[item._id];
  let lastMessage = "";
  if (m && m.length) {
    lastMessage = m[0].text;
  }
  return lastMessage;
};
const renderImage = (item, users, user, theme) => {
  const type = item.type;

  let u = { name: "", photo: "" };
  if (!item || !item.users) {
    return null;
  }
  if (type == "group") {
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
  console.log(user)
  if (u.photo?.length) {
    return (
      <img
        src={ config.baseURL+u.photo}
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
      <View
        style={{
          width: 50,
          margin: 10,
          height: 50,
          borderRadius: 137,
        }}
      >
        <UserAvatar size={50} name={u?.name ? u.name : u.phone} />
      </View>
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

const ChatItem = ({ onClick, item, removeChat }) => {
  const user = useSelector((state) => state.usr);
  const users = useSelector((state) => state.app.user_list);
  const theme = useSelector((state) => state.app.theme);
  const messages = useSelector((state) => state.chats.messages);

  const nm = useSelector((state) => state.chats.new_messages);
  const count = nm[item._id] || 0;

  return (
    <TouchableOpacity
      key={item._id}
      activeOpacity={1}
      onPress={onClick}
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
      {renderImage(item, users, user, theme)}
      <View>
        <Text
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
        </Text>
        <Text
          numberOfLines={1}
          style={{
            marginLeft: 10,
            color: colors[theme].color4,
            marginBottom: 5,
            fontSize: 16,
            fontWeight: "400",
            overflow: "hidden",
          }}
        >
          {item.last_msg_text||''}
        </Text>
      </View>
      {count > 0 && (
        <Text
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
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default ChatItem;
