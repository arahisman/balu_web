import React, { useEffect, useState } from "react";
import { Dimensions, Text, TextInput, TouchableOpacity, View, } from "react-native";

import { useDispatch, useSelector } from "react-redux";
import CollapsibleView from "react-native-collapsible-view-faq";
import HeaderBack from "./../../components/HeaderBack";
import colors from "./../../components/styles";
import { ask_q, find_q, get_qs } from "./../../api/qApi";
import { useNavigate } from "react-router-dom";

function SupportMenu() {
    const navigation = useNavigate()
    const dispatch = useDispatch();
    const width = Dimensions.get("window").width;
    const height = Dimensions.get("window").height;
    const [read, setRead] = useState(false);
    const [taleText, setTaleText] = useState("");
    const [nameText, setNameText] = useState("");
    const [sq, setSq] = useState("");
    const [tt, setTt] = useState({});
    const theme = useSelector((state) => state.app.theme);
    const [role, setRole] = useState("");
    const [chats, setChats] = useState([]);
    const user = useSelector((state) => state.usr);
    useEffect(() => {
        get_qs({}).then((res) => {

            res.data && setChats(res.data.qs);
        });
    }, []);
    return (
        <View
            key={role}
            style={{
                backgroundColor: colors[theme].color2,
                width: "100%",
                height: "100%",
                alignSelf: "stretch",
            }}
        >
            <HeaderBack onClick={() => navigation(-1)} text="FAQ"/>
            <TextInput
                value={sq}
                onChangeText={(t) => {
                    setSq(t);
                    console.log(t);
                    find_q({q: t}).then((res) => {
                        res.data && setChats(res.data.qs);
                    });
                }}
                numberOfLines={1}
                placeholder={"Ваш вопрос..."}
                placeholderTextColor={"#6b6a69"}
                style={{
                    width: "100%",
                    padding: 10,
                    color: colors[theme].color8,
                    borderBottomWidth: 2,
                    borderColor: colors[theme].color6,
                    marginTop: 20,
                    marginBottom: 20,
                    fontSize: 22,
                    fontWeight: "600",
                }}
            />
            {chats.length > 0 &&
                chats.map((item, index) => (
                    <CollapsibleView
                        title={item.q}
                        description={item.a.length > 0 ? item.a : "Ответа пока нет"}
                        containerWidth={"100%"}
                        titleFontSize={20}
                        descFontSize={17}
                        containerMarginTop={0}
                        containerBackgroundColor={colors[theme].color2}
                        containerBorderColor={colors[theme].color4}
                        containerBorderTopWidth={2}
                        containerPaddingVertical={10}
                        titleColor={colors[theme].color4}
                        iconColor={colors[theme].color4}
                        descColor={colors[theme].color4}
                    />
                ))}
            {chats.length == 0 && (
                <View style={{marginVertical: 20}}>
                    <Text
                        style={{
                            marginLeft: 30,
                            marginTop: 10,
                            color: colors[theme].color4,
                            fontSize: 19,
                            marginTop: 6,
                            fontWeight: "700",
                            overflow: "hidden",
                        }}
                    >
                        Мы не нашли ответ, вы можете отправить нам ваш вопрос
                    </Text>
                    <TouchableOpacity
                        onPress={(e) => {
                            ask_q({q: sq}).then((res) => {
                                res.data && setChats([res.data.q]);
                            });
                        }}
                        style={{
                            width: "70%",
                            height: 45,
                            borderWidth: 0,
                            backgroundColor: colors[theme].color1,
                            borderRadius: 30,
                            marginLeft: 10,
                            marginTop: 10,
                            justifyContent: "center",
                            alignSelf: "center",
                            zIndex: 7,
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
                        <Text
                            style={{
                                color: colors[theme].color3,
                                fontSize: 20,
                                justifyContent: "center",
                                textAlign: "center",
                                marginBottom: 5,
                            }}
                        >
                            Отправить вопрос
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            <View style={{flexDirection: "row", marginVertical: 20}}>
                <Text
                    style={{
                        marginLeft: 30,
                        color: colors[theme].color4,
                        fontSize: 19,
                        marginTop: 6,
                        fontWeight: "700",
                        overflow: "hidden",
                    }}
                >
                    Не нашли ответ?
                </Text>
                <TouchableOpacity
                    onPress={() => {
                        navigation("/support_list");
                    }}
                    style={{
                        width: "40%",
                        height: 40,
                        borderWidth: 0,
                        backgroundColor: colors[theme].color1,
                        borderRadius: 30,
                        marginLeft: 10,
                        justifyContent: "center",
                        alignSelf: "center",
                        zIndex: 7,
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
                    <Text
                        style={{
                            color: colors[theme].color3,
                            fontSize: 20,
                            justifyContent: "center",
                            textAlign: "center",
                            marginBottom: 5,
                        }}
                    >
                        Поддержка
                    </Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity
                onPress={() => {
                    navigation(-1);
                }}
                style={{
                    width: "100%",
                    height: 75,
                    backgroundColor: colors[theme].color5,
                    flexDirection: "row",
                    elevation: 9,
                    shadowColor: colors[theme].color12,
                    shadowOffset: {
                        width: 0,
                        height: 0,
                    },
                    shadowOpacity: 0.36,
                    shadowRadius: 20,
                }}
            >
                <Text
                    style={{
                        marginLeft: 30,
                        color: colors[theme].color4,
                        marginTop: 5,
                        fontSize: 20,
                        fontWeight: "500",
                        overflow: "hidden",
                    }}
                >
                    Назад
                </Text>
            </TouchableOpacity>
        </View>
    );
}

export default SupportMenu;

