import React from "react";
import colors from "./styles";
import {useSelector} from "react-redux";

const HeaderBack = ({
                        onPress,
                        onPress2,
                        onPress3,
                        onPress4,
                        p = "screen",
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
            <div
                onPress={onPress}
                style={{flexDirection: "row", justifyContent: "flex-start"}}
            >
                <Img
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
            </div>
            <div
                style={{
                    flexDirection: "column",
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
                        justifyContent: "center",
                        textAlign: "center",
                        margin:10,
                        overflow: "hidden",
                    }}
                >
                    {p}
                </p>
            </div>
            <div style={{flexDirection: "row"}}>
                {screen !== "Call" && (
                    <div
                        onPress={onPress2}
                        style={{
                            flexDirection: "row",
                            marginRight: 10,
                            justifyContent: "flex-start",
                        }}
                    >
                        <Img
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
                    </div>
                )}
                {screen !== "Main" && (
                    <div
                        onPress={onPress3}
                        style={{
                            flexDirection: "row",
                            marginRight: 10,
                            justifyContent: "flex-start",
                        }}
                    >
                        <Img
                            key='messages'

                            source={require("../icons/messages.png")}
                            resizeMode="contain"
                            style={{
                                width: 38,
                                height: 38,
                                tintColor: colors[theme].color3,
                                alignSelf: "center",
                            }}
                        />
                        {count > 0 && (<p style={{
                            color: '#ffffff',
                            backgroundColor: '#e88',
                            fontSize: 20,
                            left: 13,
                            top: 6,
                            padding: 2,
                            paddingLeft: 8,
                            paddingRight: 8,
                            borderRadius: 20,
                            position: 'absolute',
                            zIndex: 999,
                        }}>
                            {count}
                        </p>)}
                    </div>
                )}
                <div
                    onPress={onPress4}
                    style={{
                        flexDirection: "row",
                        marginRight: 10,
                        justifyContent: "flex-start",
                    }}
                >
                    <Img
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
                </div>
            </div>
        </div>
    );
};

export default HeaderBack;

