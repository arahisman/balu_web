import React from "react";
import {Image, Text, TouchableOpacity, View,} from "react-native";
import UserAvatar from 'react-native-user-avatar';
import colors from "./styles";
import {useSelector} from "react-redux";
import config from "../config";

const renderImage = (item, theme) => {
    if (item.photo?.length) {
        return (
            <img
                src={config.baseURL + item.photo}
                resizeMode="contain"
                style={{
                    width: 50,
                    margin: 5,
                    overflow: "hidden",
                    height: 50,
                    borderRadius: 137,
                    borderWidth: item.chatted || item.black_listed ? 2 : 0,
                    borderColor: item.black_listed ? 'red' : 'green',
                }}
            />
        )
    } else {
        return (<View style={{
                width: 50,
                margin: 5,
                overflow: "hidden",
                height: 50,
                borderRadius: 50,
                borderWidth: item.chatted || item.black_listed ? 4 : 0,
                borderColor: item.black_listed ? '#f00' : '#0f0',
            }}
            >
                <UserAvatar size={50} name={item.name}/>

            </View>
        )
    }
}
const UserItem = ({onClick, item, user, index}) => {
    const theme = useSelector((state) => state.app.theme);

    return (
        <TouchableOpacity
            key={index}
            activeOpacity={1}
            onPress={onClick}
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

            {renderImage(item, theme)}
            <View>
                <Text
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
                </Text>
                <Text
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
                </Text>
            </View>
        </TouchableOpacity>
    );
};

export default UserItem;

