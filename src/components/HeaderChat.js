import React from "react";
import {Image, Text, TouchableOpacity, View,} from "react-native";
import colors from "./styles";
import {useSelector} from "react-redux";

const HeaderChat = ({
                        onPress,
                        onPress2,
                        onPress3,
                        onPress4,
                        text = "screen",
                        screen = "",
                        color = "#AAAAAA",
                    }) => {
    const theme = useSelector((state) => state.app.theme);
    const count = useSelector((state) => state.chats.count);

    return (
        <View
            style={{
                width: "100%",
                height: 60,
                flexDirection: "row",
                backgroundColor: colors[theme].color1,
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
            <TouchableOpacity
                onPress={onPress}
                style={{flexDirection: "row", justifyContent: "flex-start"}}
            >
                <Image
                    key='logo'
                    source={require("../icons/logo.png")}
                    resizeMode="cover"
                    style={{
                        width: 40,
                        height: 40,
                        alignSelf: "center",
                        tintColor: colors[theme].color3,
                        marginLeft: 10,
                    }}
                />
            </TouchableOpacity>
            <View
                style={{
                    flexDirection: "column",
                    justifyContent: "center",
                    alignContent: "center",
                    alignSelf: "center",
                    alignItems: "center",
                    width: '57%'
                }}
            >
                <Text
                    numberOfLines={1}
                    style={{
                        color: colors[theme].color3,
                        fontWeight: "600",
                        fontSize: 20,
                        justifyContent: "center",
                        textAlign: "center",
                        margin:10, marginLeft: 0, marginRight: 0,
                        overflow: "hidden",
                    }}
                >
                    {text}
                </Text>
            </View>
            <View style={{flexDirection: "row"}}>
                {screen !== "Call" && (
                    <TouchableOpacity
                        onPress={onPress2}
                        style={{
                            flexDirection: "row",
                            marginRight: 10,
                            justifyContent: "flex-start",
                        }}
                    >
                        <Image
                            key='call'

                            source={require("../icons/call.png")}
                            resizeMode="contain"
                            style={{
                                width: 38,
                                height: 38,
                                tintColor: colors[theme].color3,
                                alignSelf: "center",
                            }}
                        />
                    </TouchableOpacity>
                )}
                <TouchableOpacity
                    onPress={onPress4}
                    style={{
                        flexDirection: "row",
                        marginRight: 10,
                        justifyContent: "flex-start",
                    }}
                >
                    <Image
                        key='menu'

                        source={require("../icons/menu.png")}
                        resizeMode="contain"
                        style={{
                            width: 38,
                            height: 38,
                            tintColor: colors[theme].color3,
                            alignSelf: "center",
                        }}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default HeaderChat;

