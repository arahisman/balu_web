import React, { useState } from "react";
import { Text, TouchableOpacity, Image, View, Dimensions } from "react-native";
import colors from "../../components/styles";
import { useSelector } from "react-redux";
import {
  Bubble,
  GiftedChat,
  MessageText,
  Send,
} from "react-native-gifted-chat";
import config from "../../config";
import { Link } from "react-router-dom";

const MessageItem = ({ isAdmin, chat, eventCallback, setImg, ...props }) => {
  const theme = useSelector((state) => state.app.theme);
  const { currentMessage } = props;
  if (!currentMessage) return null;

  const images = currentMessage?.attachments?.filter((i) =>
    i.type.includes("image")
  );
  const event = currentMessage?.event;
  return (
    <View>
      <MessageText {...props} />
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-around",
          width: "98%",
          margin: 2,
          marginBottom: 5,
          borderRadius: 5,
        }}
      >
        {images?.length > 0 &&
          images.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={{
                width:
                  images.length % 2 && index === images.length - 1
                    ? "100%"
                    : "49%",
                height:
                  images.length % 2 && index === images.length - 1 ? 300 : 200,
                borderBottomLeftRadius:
                  images.length % 2 && index === images.length - 1 ? 10 : 0,
                borderBottomRightRadius:
                  images.length % 2 && index === images.length - 1 ? 10 : 0,
                margin: 1,
              }}
              onPress={() => setImg(config.baseURL + item.url)}
            >
              <Image
                key={index}
                style={{
                  width: "100%",
                  height:
                    images.length % 2 && index === images.length - 1
                      ? 300
                      : 200,
                  borderBottomLeftRadius:
                    images.length % 2 && index === images.length - 1 ? 10 : 0,
                  borderBottomRightRadius:
                    images.length % 2 && index === images.length - 1 ? 10 : 0,
                  margin: 1,
                }}
                source={{ uri: config.baseURL + item.url }}
              />
            </TouchableOpacity>
          ))}
      </View>

      {currentMessage?.attachments?.map((item, index) => {
        if (item.type.includes("image")) {
          return;
        }
        if (item.type.includes("audio")) {
          let audio = new Audio(config.baseURL + item.url);

          return (
            <TouchableOpacity
              style={{
                padding: 5,
                alignSelf: "center",
                marginVertical: 5,
                width: Dimensions.get("window").width / 1.48,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
              onPress={() => {
                if (!audio.paused) {
                  audio.pause();
                } else {
                  audio.play();
                }
              }}
            >
              <Image
                key="smile"
                source={require("../../icons/play.png")}
                resizeMode="contain"
                style={{
                  marginRight: 5,
                  width: 32,
                  height: 32,
                  tintColor: "#ffffff",
                  alignSelf: "center",
                }}
              />
              <View
                style={{
                  height: 3,
                  width: Dimensions.get("window").width / 2,
                  marginTop: 13,
                  backgroundColor: "#ffffff",
                  borderRadius: 10,
                }}
              ></View>
            </TouchableOpacity>
          );
        }
        console.log(config.baseURL+item.url)
        return (
          <View style={{ padding: 5 }}>
            <Link
              to={config.baseURL+item.url}
              style={{
                padding: 5,
                marginBottom: 3,
                width: Dimensions.get("window").width / 1.48,
                flexDirection: "row",
                justifyContent: "space-between",
                backgroundColor: colors[theme].color7,
                borderRadius: 5,
              }}
              target="_blank"
              download
            >
              <Image
                key="file"
                source={require("../../icons/file.png")}
                resizeMode="contain"
                style={{
                  marginRight: 5,
                  width: 32,
                  height: 32,
                  tintColor: colors[theme].color5,
                  alignSelf: "center",
                }}
              />
              <View
                style={{ width: Dimensions.get("window").width / 1.48 - 40 }}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="head"
                  style={{ color: colors[theme].color5 }}
                >
                  {item.name}
                </Text>
              </View>
            </Link>
          </View>
        );
      })}

      {event && (
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 15,
            borderColor: "#444",
          }}
        >
          <Text
            style={{
              color: "#444",
              margin: 6,
              fontSize: 19,
              fontWeight: "800",
            }}
          >
            {event.name.toString()}
          </Text>

          {event.endDate ? (
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View
                style={{
                  backgroundColor: "#ddd",
                  borderRadius: 10,
                  padding: 8,
                  margin: 5,
                }}
              >
                <Text
                  style={{
                    color: "#444",
                    margin: 6,
                    fontSize: 18,
                    fontWeight: "600",
                  }}
                >
                  {ftodate(event.startDate.toString())}
                </Text>
                <Text
                  style={{
                    color: "#444",
                    margin: 6,
                    fontSize: 18,
                    fontWeight: "600",
                    textAlign: "center",
                  }}
                >
                  {ftotime(event.startTime)}
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: "#ddd",
                  borderRadius: 10,
                  padding: 8,
                  margin: 5,
                }}
              >
                <Text
                  style={{
                    color: "#444",
                    margin: 6,
                    fontSize: 18,
                    fontWeight: "600",
                  }}
                >
                  {ftodate(event.endDate.toString())}
                </Text>
                <Text
                  style={{
                    color: "#444",
                    margin: 6,
                    fontSize: 18,
                    fontWeight: "600",
                    textAlign: "center",
                  }}
                >
                  {event.endTime
                    ? ftotime(event.endTime)
                    : ftotime(event.startTime)}
                </Text>
              </View>
            </View>
          ) : (
            <View style={{ width: "100%", justifyContent: "center" }}>
              <View
                style={{
                  backgroundColor: "#ddd",
                  borderRadius: 10,
                  padding: 8,
                  margin: 5,
                }}
              >
                <Text
                  style={{
                    color: "#444",
                    margin: 6,
                    fontSize: 18,
                    fontWeight: "600",
                    textAlign: "center",
                  }}
                >
                  {event.startDate ? ftodate(event.startDate.toString()) : ""}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                  }}
                >
                  <Text
                    style={{
                      color: "#444",
                      margin: 6,
                      fontSize: 18,
                      fontWeight: "600",
                      textAlign: "center",
                    }}
                  >
                    {event.startTime ? ftotime(event.startTime) : ""}
                  </Text>
                  {event.endTime && (
                    <Text
                      style={{
                        color: "#444",
                        margin: 6,
                        fontSize: 18,
                        fontWeight: "600",
                        textAlign: "center",
                      }}
                    >
                      {"-"}
                    </Text>
                  )}
                  {event.endTime && (
                    <Text
                      style={{
                        color: "#444",
                        margin: 6,
                        fontSize: 18,
                        fontWeight: "600",
                        textAlign: "center",
                      }}
                    >
                      {ftotime(event.endTime)}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          )}

          <Text
            style={{
              color: "#444",
              margin: 6,
              fontSize: 16,
              fontWeight: "600",
            }}
          >
            {event.description.toString()}
          </Text>
          {(isAdmin ||
            (event && event.subEvents && event.subEvents.length)) && (
            <TouchableOpacity
              style={{ backgroundColor: "#f66", borderRadius: 10, margin: 5 }}
              onPress={() => eventCallback(currentMessage, event)}
            >
              <Text
                style={{
                  color: "#fff",
                  padding: 7,
                  fontSize: 18,
                  marginBottom: 6,
                }}
              >
                Расписание событий
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const ftodate = (dd) => {
  let day = new Date(dd);
  const days = new Date(day).getDate();
  const month = new Date(day).getMonth() + 1;
  return `${days < 10 ? `0${days}` : days}.${
    month < 10 ? `0${month}` : month
  }.${new Date(day).getFullYear()}`;
};

const ftotime = (dd) => {
  let day = new Date(dd);
  const hours = new Date(day).getHours();
  const minutes = new Date(day).getMinutes() + 1;
  return `${hours < 10 ? `0${hours}` : hours}:${
    minutes < 10 ? `0${minutes}` : minutes
  }`;
};
export default MessageItem;
