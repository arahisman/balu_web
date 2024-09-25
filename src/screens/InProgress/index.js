import React, { useEffect, useState } from "react";
import { Dimensions, Linking, Text, View } from "react-native";
import Button from "./../../components/Button";
import colors from "./../../components/styles";
import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";

import HeaderBack from "./../../components/HeaderBack";
import { get_news } from "./../../api/newsApi";

function About() {
  const navigation = useNavigate();
  const width = Dimensions.get("window").width;
  const height = Dimensions.get("window").height;
  const [taleText, setTaleText] = useState("");
  const [loading, setLoading] = useState(false);
  const [news, setNews] = useState({});
  const [showParams, setShowParams] = useState(false);
  const [showParams2, setShowParams2] = useState(false);
  const theme = useSelector((state) => state.app.theme);

  useEffect(() => {
    get_news().then((res) => setNews(res.data.news));
  }, []);
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
      <HeaderBack onClick={() => navigation(-1)} text="Поддержать проект" />
      <View
        style={{
          flex: 1,
          width: "100%",
          height,
        }}
      >
        <Text
          style={{
            color: colors[theme].color6,
            fontSize: 40,
            margin: "10%",
            marginBottom: 0,
            fontWeight: "600",
            textAlign: "center",
          }}
        >
          Раздел находится в разработке
        </Text>
      </View>
    </View>
  );
}

export default About;
