import React, { useState } from "react";
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
import colors from "../../components/styles";
import Button from "../../components/Button";
import UserItem from "../../components/UserItem";
import { useDispatch, useSelector } from "react-redux";
import HeaderBack from "../../components/HeaderBack";
import { new_group } from "./../../api/chatApi";
import Resizer from "react-image-file-resizer";
import { useNavigate } from "react-router-dom";
import config from "../../config";

function NewGroup( ) {
    const navigation = useNavigate()
    const dispatch = useDispatch();
    const width = Dimensions.get("window").width;
    const user = useSelector((state) => state.usr);
    const users = useSelector((state) => state.app.user_list);
    const [select, setSelect] = useState(false);
    const theme = useSelector((state) => state.app.theme);
    const [photo, setPhoto] = useState("");
    const [name, setName] = useState("");
    const [gName, setGName] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [response, setResponse] = useState(null);
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
    

    return (
        <ScrollView
            key={selectedUsers}
            contentContainerStyle={{
                backgroundColor: colors[theme].color2,
                minHeight: "100vh",
                alignSelf: "stretch",
                alignItems: "center",
            }}
        >
            <HeaderBack onClick={() => navigation(-1)} text="Новая Группа" />
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
                            key='photo'

                            source={
                                !photo.length
                                    ? require("../../icons/photo.png")
                                    : { uri: config.baseURL+ photo }
                            }
                            resizeMode="contain"
                            style={{
                                width: 300,
                                height: 300,
                                borderRadius: 300,
                                marginTop: 25,
                                tintColor: !photo.length ? colors[theme].color6 : null,
                                alignSelf: "center",
                                backgroundColor: colors[theme].color3,
                            }}
                        />
                    )}
                </TouchableOpacity>
                <TextInput
                    value={gName}
                    onChangeText={(t) => {
                        setGName(t);
                    }}
                    numberOfLines={1}
                    placeholder={"Название группы"}
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
            <Button
                key={selectedUsers}
                onPress={() => {
                    let k = []
                    for (let si of selectedUsers) {
                        k.push(si._id)
                    }
                    k.push(user._id)

                    new_group({
                        users: k,
                        name: gName,
                        photo,
                        admin_list: [user._id],
                        isOpen:true,
                    }).then((res) => {
                        console.log(res.data)
                        navigation(-1);
                    }).catch((err)=>console.log(err.response))
                }}
                text={"Создать"}
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
                {"Выбранные пользователи"}
            </Text>

            {(selectedUsers.length != 0) && (
                <ScrollView style={{width:'80%'}}>
                    {
                        selectedUsers.map((item, index) => (
                            <UserItem
                                key={index}
                                onPress={() => {
                                }}
                                user={user}
                                item={item}
                                index={index}
                            />
                        ))}
                </ScrollView>
            )}

            <Button
                onPress={() => {
                    setSelect(!select);
                }}
                text={select ? "Применить" : "Выбрать еще"}
            />
            {(select) && (
                <ScrollView style={{width:'80%'}}>
                    {users &&
                        users.map(
                            (item, index) =>
                                (
                                    <UserItem
                                        key={index}
                                        onClick={() => {
                                            let su = selectedUsers;
                                            if (!su.some((i) => i._id == item._id)) {
                                                su = [...su, item]
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
export default NewGroup;

