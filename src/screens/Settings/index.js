import React, { useState } from "react";
// import {ScrollView, StyleSheet, Alert, Image} from 'react-native';
import { Dimensions, Text, View, } from "react-native";
import Button from "./../../components/Button";
import colors from "./../../components/styles";


import { useDispatch, useSelector } from "react-redux";
import { saveTheme, } from "../../redux/actions/appActions";
import HeaderBack from "./../../components/HeaderBack";
import { useNavigate } from "react-router-dom";

function Settings() {
    const navigation = useNavigate()
    const dispatch = useDispatch();
    //Глобальный язык(По умолчанию eng)
    const lang = useSelector((state) => state.app.lang);
    const width = Dimensions.get("window").width;
    const height = Dimensions.get("window").height;
    //Локальный язык для выбора
    const [value, setValue] = useState("");
    const theme = useSelector((state) => state.app.theme);

    const [localLang, setLocalLang] = useState("Eng");
    const themes2 = {'main': 'Классическая', 'dark': 'Темная', 'forest': 'Лес', 'beach': 'Пляж'}
    return (
        <View
            style={{
                backgroundColor: colors[theme].color2,
                width: "100%",
                height: "100vh",
                alignSelf: "stretch",
                alignItems: "center",
            }}
        >
            <HeaderBack onClick={() => navigation(-1)} text="Настройки"/>

            <View
                style={{width: "100%", height: height - 200, alignItems: "center"}}
            >
                <Button onPress={() => {
                    let themes = ['main', 'dark', 'forest', 'beach']
                    let index = themes.indexOf(theme)
                    if (index == 3) {
                        dispatch(saveTheme(themes[0]))
                    } else {
                        dispatch(saveTheme(themes[index + 1]))
                    }
                }} text={"Тема: " + themes2[theme]}/>
                <Button onPress={() => null} text="Разрешения приложения"/>
                <Button onPress={() => null} text="Язык: Русский"/>
                <Button onPress={() => navigation('/sponsors')} text="Наши спонсоры"/>


            </View>
            <Text
                style={{
                    color: "#999",
                    margin: 5,
                    marginTop: 20,
                    fontSize: 18,
                    fontWeight: "500",
                }}
            >
                Версия: 0.0.1-alpha
            </Text>
        </View>
    );
}

export default Settings;

