import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image as RNImage,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import colors from "./../../components/styles";
import Resizer from "react-image-file-resizer";

import Button from "./../../components/Button";
import UserItem from "./../../components/UserItem";

import { useDispatch, useSelector } from "react-redux";

import HeaderBack from "./../../components/HeaderBack";
import { get_users_chats, update_chat } from "./../../api/chatApi";
import { setChats } from "../../redux/actions/chatActions";
import { useLocation, useNavigate } from "react-router-dom";
import config from "../../config";

function SettingsChat() {
  const dispatch = useDispatch();

  const navigation = useNavigate();
  const location = useLocation();
  const chat = location.state.chat;

  const width = Dimensions.get("window").width;
  const chats = useSelector((state) => state.chats.chats);

  const user = useSelector((state) => state.usr);
  const height = Dimensions.get("window").height;
  const [type, setType] = useState("group");
  const [typeLabel, setTypeLabel] = useState("Групповой");
  const [loading, setLoading] = useState(false);
  const users = useSelector((state) => state.app.user_list);
  const [showParams, setShowParams] = useState(false);
  const [showParams2, setShowParams2] = useState(false);
  const [select, setSelect] = useState(false);
  const theme = useSelector((state) => state.app.theme);
  const [photo, setPhoto] = useState(chat.photo ? chat.photo : "");
  const [name, setName] = useState(chat.name ? chat.name : "");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [response, setResponse] = useState(null);
  const check_chat = (o) => {
    if (o._id == user._id) {
      return false;
    }
    if (chats.some((i) => i.users.includes(o._id) && i.type == "private")) {
      let m = chats.find((i) => i.users.includes(o._id) && i.type == "private");
      return false;
    }
    return true;
  };
  const selectFile = () => {
    document.getElementById("selectImage").click();
  };

  const resizeFile = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        300,
        300,
        "JPEG",
        100,
        0,
        (uri) => {
          resolve(uri);
        },
        "base64"
      );
    });

  const processFile = async (event) => {
    try {
      const file = event.target.files[0];
      const image = await resizeFile(file);
      setPhoto(image);
      setResponse({ assets: [{ uri: image }] });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    let s = users.filter((i) => chat.users.some((j) => j == i._id));
    setSelectedUsers(s);
  }, []);

  return (
    <ScrollView
      style={{ width: "100%" }}
      key={selectedUsers}
      contentContainerStyle={{
        backgroundColor: colors[theme].color2,
        minHeight: "100vh",
        alignSelf: "stretch",
        alignItems: "center",
      }}
    >
      <HeaderBack onClick={() => navigation(-1)} text="Настройки чата" />

      {type == "group" && (
        <View>
          <TouchableOpacity onPress={(e) => selectFile()}>
            {response?.assets ? (
              response?.assets.map(({ uri }) => (
                <View key={uri} style={styles.imageContainer}>
                  <RNImage
                    resizeMode="cover"
                    resizeMethod="scale"
                    style={{
                      width: 300,
                      height: 300,
                      borderRadius: 300,
                      marginTop: 25,
                      alignSelf: "center",
                      backgroundColor: colors[theme].color10,
                    }}
                    source={{ uri: uri }}
                  />
                </View>
              ))
            ) : (
              <RNImage
                key={photo}
                source={
                  !photo.length
                    ? require("../../icons/photo.png")
                    : { uri: config.baseURL + photo }
                }
                resizeMode="contain"
                style={{
                  width: 300,
                  height: 300,
                  borderRadius: 300,
                  marginTop: 25,
                  tintColor: !user.photo.length ? colors[theme].color6 : null,
                  alignSelf: "center",
                  backgroundColor: colors[theme].color3,
                }}
              />
            )}
          </TouchableOpacity>
          <TextInput
            value={name}
            onChangeText={(t) => {
              setName(t);
            }}
            numberOfLines={1}
            placeholder={"Название чата"}
            placeholderTextColor={colors[theme].color6}
            style={{
              color: colors[theme].color8,
              borderBottomWidth: 2,
              borderColor: colors[theme].color6,
              margin: 5,
              marginTop: 20,
              marginBottom: 20,
              fontSize: 20,
              alignSelf: "center",
              textAlign: "center",
              fontWeight: "500",
            }}
          />
        </View>
      )}

      <Text
        style={{
          color: colors[theme].color8,
          margin: 5,
          marginTop: 20,
          fontSize: 20,
          fontWeight: "500",
        }}
      >
        {"Выбранные пользователи"}
      </Text>

      {type == "group" && selectedUsers.length > 0 && (
        <Button
          key={selectedUsers}
          onPress={() => {
            let k = [];
            for (let si of selectedUsers) {
              k.push(si._id);
            }
            k.push(user._id);

            update_chat({
              ...chat,
              users: k,
              type: "group",
              name,
              photo,
            })
              .then((res) => {
                get_users_chats({ user: user._id }).then((a) => {
                  dispatch(setChats(a.data.chats));
                  navigation(-1);
                });
              })
              .catch((err) => console.log(err));
          }}
          text={"Сохранить"}
        />
      )}
      {type == "group" && selectedUsers.length == 0 && (
        <Text
          style={{
            color: "red",
            margin: 5,
            marginTop: 20,
            fontSize: 20,
            fontWeight: "500",
          }}
        >
          Нужно выбрать хотя бы одного пользователя
        </Text>
      )}
      {type == "group" && selectedUsers.length != 0 && (
        <ScrollView style={{ width: "80%" }}>
          {selectedUsers.map((item, index) => (
            <UserItem
              key={index}
              onPress={() => {}}
              user={user}
              item={item}
              index={index}
            />
          ))}
        </ScrollView>
      )}

      {type == "group" && (
        <Button
          onPress={() => {
            setSelect(!select);
          }}
          text={select ? "Применить" : "Выбрать еще"}
        />
      )}

      {select && (
        <ScrollView style={{ width: "80%" }}>
          {users &&
            users.map(
              (item, index) =>
                (type == "group" || check_chat(item)) && (
                  <UserItem
                    key={index}
                    onClick={() => {
                      let su = selectedUsers;
                      if (!su.some((i) => i._id == item._id)) {
                        su = [...su, item];
                      } else {
                        su = su.filter((i) => i._id !== item._id);
                      }
                      setSelectedUsers(su);
                    }}
                    user={user}
                    item={item}
                    index={index}
                  />
                )
            )}
        </ScrollView>
      )}
      <input id="selectImage" hidden type="file" onChange={processFile} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "aliceblue",
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 8,
  },
  imageContainer: {
    marginVertical: 24,
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
  },
});
export default SettingsChat;
