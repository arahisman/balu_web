import React, { useState } from "react";
import {
  Dimensions,
  Image as RNImage,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { clearApp } from "../../redux/actions/appActions";

import Button from "./../../components/Button";
import Resizer from "react-image-file-resizer";
import { useDispatch, useSelector } from "react-redux";
import { clearUser, saveUser } from "../../redux/actions/usrActions";
import { clearMessages } from "../../redux/actions/chatActions";
import HeaderBack from "./../../components/HeaderBack";
import { get_user, set_fb_token, update_user } from "./../../api/userApi";
import { useNavigate } from "react-router-dom";
import colors from "./../../components/styles";
import config from "../../config";

function Profile() {
  const navigation = useNavigate();
  const width = Dimensions.get("window").width;
  const height = Dimensions.get("window").height;
  const dispatch = useDispatch();
  const user = useSelector((state) => state.usr);
  const [response, setResponse] = useState(null);
  const theme = useSelector((state) => state.app.theme);

  const [value, setValue] = useState(user?.name);

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
      setResponse({ assets: [{ uri: image }] });
      let u = Object.assign(user) || {};
      u.photo = image;
      update_user({ ...u }).then(()=>{
        get_user({phone: user.phone}).then(res => {
          dispatch(saveUser({...res.data.user, logged:true}));
        })
      })
      

      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View
      style={{
        backgroundColor: colors[theme].color2,
        width: "100%",
        height: "100%",
        alignSelf: "stretch",
        alignItems: "center",
      }}
    >
      <input id="selectImage" hidden type="file" onChange={processFile} />

      <HeaderBack onClick={() => navigation(-1)} text="Мой профиль" />

      <ScrollView
        contentContainerStyle={{ minHeight: height, alignItems: "center" }}
      >
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
              key="photo"
              source={
                !user?.photo?.length
                  ? require("../../icons/photo.png")
                  : { uri: config.baseURL + user?.photo }
              }
              resizeMode="contain"
              style={{
                width: 300,
                height: 300,
                borderRadius: 300,
                marginTop: 25,
                tintColor: !user?.photo?.length ? colors[theme].color6 : null,
                alignSelf: "center",
                backgroundColor: colors[theme].color3,
              }}
            />
          )}
        </TouchableOpacity>

        <TextInput
          value={value}
          onChangeText={(t) => {
            setValue(t);
            let usr = Object.assign(user) || {};
            usr.name = t;
            dispatch(saveUser(usr));
          }}
          numberOfLines={1}
          placeholder={"Пользователь"}
          placeholderTextColor={"#6b6a69"}
          style={{
            color: colors[theme].color8,
            borderBottomWidth: 2,
            borderColor: colors[theme].color6,
            margin: 5,
            marginTop: 20,
            fontSize: 20,
            alignSelf: "center",
            textAlign: "center",
            fontWeight: "500",
          }}
        />
        <Text
          style={{
            color: colors[theme].color8,
            margin: 5,
            marginTop: 20,
            fontSize: 20,
            fontWeight: "500",
          }}
        >
          Мои баллы:{" "}
          <Text style={{ color: colors[theme].color6, fontWeight: "800" }}>
            {user.points}
          </Text>
        </Text>
        <Button onPress={() => update_user({ ...user }).then(()=>{
          get_user({phone: user.phone}).then(res => {
            dispatch(saveUser({...res.data.user, logged:true}));
          })
        })} text="Сохранить" />

        <Button
          onPress={() => {
            dispatch(clearUser());
            dispatch(clearMessages());
            dispatch(clearApp());

            navigation("/");
          }}
          text="Выйти из аккаунта"
        />
      </ScrollView>
    </View>
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
export default Profile;
