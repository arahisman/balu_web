import React, { useEffect, useState } from "react";
import { Bubble, GiftedChat, Send } from "react-native-gifted-chat";
import {
  get_messages,
  get_users_chats,
  update_chat,
} from "./../../api/chatApi";
import { saveFavorite } from "../../redux/actions/usrActions";
import Resizer from "react-image-file-resizer";

import { Spinner } from "./../../components/Spinner";
import colors from "./../../components/styles";
import { useDispatch, useSelector } from "react-redux";
import { saveTheme } from "../../redux/actions/appActions";
import HeaderChat from "./../../components/HeaderChat";
import { addMessages, read, setChats } from "../../redux/actions/chatActions";
import { new_msg } from "./../../api/chatApi";
import renderSubEventList from "./SubEventList";
import renderEvent from "./Event";
import { useLocation, useNavigate } from "react-router-dom";
import Menu from "../Menu";
import {
  ActivityIndicator,
  Dimensions,
  Image as RNImage,
  Modal,
  PermissionsAndroid,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Clipboard,
} from "react-native";
import { useAudioRecorder } from "react-audio-voice-recorder";
import config from "../../config";
import MessageItem from "./MessageItem";

const Chat = () => {
  const dispatch = useDispatch();
  const navigation = useNavigate();
  const location = useLocation();
  const route = { params: location.state };
  const recorderControls = useAudioRecorder();

  const chats = useSelector((state) => state.chats.chats);
  const allchats = useSelector((state) => state.chats);
  const mesg = useSelector((state) => state.chats.messages);
  const theme = useSelector((state) => state.app.theme);
  const users = useSelector((state) => state.app.user_list);
  const user = useSelector((state) => state.usr);
  const width = "100%";
  const height = "100vh";
  if(!route?.params?.id){
      navigation(-1);
  }
  const chat = Object.values(chats).find((i) => i._id == route?.params?.id);
  if (!chat) {
    navigation(-1);
  }
  const [showMenu, setShowMenu] = useState(false);
  const [wconn, setWConn] = useState(new WebSocket("ws://45.9.43.60:3000/ws"));
  const [messages, setMessages] = useState([]);
  const [subEvents, setSubEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({});
  const [eventLocal, setEventLocal] = useState({});
  const [messageLocal, setMessageLocal] = useState({});
  const [showEventModal, setShowEventModal] = useState(false);
  const [showFileMenu, setShowFileMenu] = useState(false);
  const [showSubEventListModal, setShowSubEventListModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState("");
  const [cname, setCname] = useState("Чат");
  const [renderAudio, setRenderAudio] = useState(false);
  const [photoLocal, setPhotoLocal] = useState("");
  const [player, setPlayer] = useState(null);
  const [recording, setRecording] = useState(false);
  const [showCall, setShowCall] = useState(false);
  const [audioFile, setAudioFile] = useState("");
  const [eTime, setETime] = useState(null);
  const [error, setError] = useState("");
  const [divEdit, setdivEdit] = useState(false);
  const [messageToEdit, setMessageToEdit] = useState({});
  const [counter, setCounter] = useState(4);
  const [open, setOpen] = React.useState(false);
  let [img, setImg] = useState(null);

  const isAdmin =
    chat && chat?.admin_list && chat?.admin_list.some((i) => i == user._id);
  const checkPermission = async () => {};

  useEffect(() => {
    checkPermission();
    setCname(getName(users));
    get_messages({ chat_id: chat?._id, user_id: user._id }).then((res) =>
      setMessages(
        res.data.messages.map((i) => {
          if (i.image) {
            i.image = config.baseURL + i.image;
          }
          if (i.audio) {
            i.audio = config.baseURL + i.audio;
          }
          return i;
        })
      )
    );
    setLoading(false);
  }, [chats, allchats, users]);

  useEffect(() => {
    renderAudio && setTimeout(() => setCounter(counter + 1), 1000);
  }, [counter]);

  const start = () => {
    setRecording(true);
    setAudioFile("empty");
    recorderControls.startRecording();
    //AudioRecord.start();
  };

  useEffect(() => {
    if (!recorderControls.recordingBlob || audioFile === "empty") return;
    var reader = new FileReader();
    reader.readAsDataURL(recorderControls.recordingBlob);
    reader.onloadend = function () {
      var base64data = reader.result;
      setAudioFile(base64data);
      setRecording(false);
    };
  }, [recorderControls]);

  const stop = async () => {
    if (!recording) return;
    setAudioFile("");
    recorderControls.stopRecording();
  };
  const renderMessage = props => {
    const {currentMessage} = props;
    if (!currentMessage.text.length) {
      currentMessage.text = 'crhsnj%$dhdh...573';
    }
    return (
      <View>
        <Bubble
          {...props}
          wrapperStyle={{
            right: {
              // Here is the color change
              marginBottom: 5,
              backgroundColor: colors[theme].color1,
              minWidth: !currentMessage.text.length ? '70%' : undefined,
              minHeight: !currentMessage.text.length ? 40 : undefined,
            },
            left: {
              backgroundColor: colors[theme].color6,
              marginBottom: 5,
              minHeight: !currentMessage.text.length ? 40 : undefined,
              minWidth: !currentMessage.text.length ? '70%' : undefined,
            },
          }}
          textStyle={{
            right: {
              color:
                currentMessage.text === 'crhsnj%$dhdh...573'
                  ? 'transparent'
                  : colors[theme].color3,
            },
            left: {
              color:
                currentMessage.text === 'crhsnj%$dhdh...573'
                  ? 'transparent'
                  : colors[theme].color5,
            },
          }}></Bubble>
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

  const renderMessageEvent = (props) => {
    const { currentMessage } = props;

    const event = currentMessage.video;

    return (
      <div>
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: 15,
            borderColor: "#444",
          }}
        >
          <div
            style={{
              color: "#444",
              margin: 6,
              fontSize: 19,
              fontWeight: "800",
            }}
          >
            {event.name.toString()}
          </div>

          {event.endDate ? (
            <div
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <div
                style={{
                  backgroundColor: "#ddd",
                  borderRadius: 10,
                  padding: 8,
                  margin: 5,
                }}
              >
                <div
                  style={{
                    color: "#444",
                    margin: 6,
                    fontSize: 18,
                    fontWeight: "600",
                  }}
                >
                  {ftodate(event.startDate.toString())}
                </div>
                <div
                  style={{
                    color: "#444",
                    margin: 6,
                    fontSize: 18,
                    fontWeight: "600",
                    divAlign: "center",
                  }}
                >
                  {ftotime(event.startTime)}
                </div>
              </div>
              <div
                style={{
                  backgroundColor: "#ddd",
                  borderRadius: 10,
                  padding: 8,
                  margin: 5,
                }}
              >
                <div
                  style={{
                    color: "#444",
                    margin: 6,
                    fontSize: 18,
                    fontWeight: "600",
                  }}
                >
                  {ftodate(event.endDate.toString())}
                </div>
                <div
                  style={{
                    color: "#444",
                    margin: 6,
                    fontSize: 18,
                    fontWeight: "600",
                    divAlign: "center",
                  }}
                >
                  {event.endTime
                    ? ftotime(event.endTime)
                    : ftotime(event.startTime)}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ width: "100%", justifyContent: "center" }}>
              <div
                style={{
                  backgroundColor: "#ddd",
                  borderRadius: 10,
                  padding: 8,
                  margin: 5,
                }}
              >
                <div
                  style={{
                    color: "#444",
                    margin: 6,
                    fontSize: 18,
                    fontWeight: "600",
                    divAlign: "center",
                  }}
                >
                  {event.startDate ? ftodate(event.startDate.toString()) : ""}
                </div>
                <div
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                  }}
                >
                  <div
                    style={{
                      color: "#444",
                      margin: 6,
                      fontSize: 18,
                      fontWeight: "600",
                      divAlign: "center",
                    }}
                  >
                    {event.startTime ? ftotime(event.startTime) : ""}
                  </div>
                  {event.endTime && (
                    <div
                      style={{
                        color: "#444",
                        margin: 6,
                        fontSize: 18,
                        fontWeight: "600",
                        divAlign: "center",
                      }}
                    >
                      {"-"}
                    </div>
                  )}
                  {event.endTime && (
                    <div
                      style={{
                        color: "#444",
                        margin: 6,
                        fontSize: 18,
                        fontWeight: "600",
                        divAlign: "center",
                      }}
                    >
                      {ftotime(event.endTime)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div
            style={{
              color: "#444",
              margin: 6,
              fontSize: 16,
              fontWeight: "600",
            }}
          >
            {event.description.toString()}
          </div>
          {(isAdmin ||
            (event && event.subEvents && event.subEvents.length)) && (
            <div
              style={{ backgroundColor: "#f66", borderRadius: 10, margin: 5 }}
              onClick={() => {
                let index = "";
                if (event.id) {
                  index = chat?.events.findIndex((e) => e.id == event.id);
                } else {
                  index = chat?.events.findIndex(
                    (e) => e.startTime == event.startTime
                  );
                }
                setMessageLocal(currentMessage);
                setShowSubEventListModal(true);
                if (chat?.events[index]) {
                  setEventLocal(chat?.events[index]);
                } else {
                  setEventLocal(event);
                }
              }}
            >
              <div
                style={{
                  color: "#fff",
                  padding: 7,
                  fontSize: 18,
                  marginBottom: 6,
                }}
              >
                Расписание событий
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderAudioRecord = () => {
    var date = new Date(0);
    date.setSeconds(counter); // specify value for SECONDS here
    var timeString = date.toISOString().substring(14, 19);
    return (
      <div
        style={{
          width: 300,
          flexDirection: "row",
          justifyContent: "space-between",
          right: 10,
          height: 200,
          padding: 8,
          position: "absolute",
          borderRadius: 6,
          bottom: 60,
          backgroundColor: "#fff",
        }}
      >
        <div style={{ color: "#333", fontSize: 17 }}>{timeString}</div>
        <div
          style={{ height: 60 }}
          onClick={() => {
            //AudioRecord.stop();
            setAudioFile("");
            setRenderAudio(false);
          }}
        >
          <div
            style={{
              color: "#a00",
              fontWeight: "bold",
              fontSize: 17,
              marginLeft: 15,
            }}
          >
            Отменить
          </div>
        </div>
        <div
          style={{ height: 60 }}
          onClick={() => {
            stop();
            setRenderAudio(false);
          }}
        >
          <div
            style={{
              color: "#00a",
              fontWeight: "bold",
              fontSize: 17,
              marginLeft: 15,
            }}
          >
            Прикрепить
          </div>
        </div>
      </div>
    );
  };

  const renderFileMenu = () => {
    let event = newEvent;
    return (
      <Modal animationType="slide" transparent={true} visible={showFileMenu}>
        <TouchableOpacity
          onPress={() => {
            setShowFileMenu(false);
          }}
          style={{
            marginTop: 0,
            width,
            height,
            backgroundColor: "rgba(255,255,255,0.5)",
          }}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={{
              borderRadius: 10,
              position: "absolute",
              bottom: 70,
              right: 10,
              borderWidth: 0,
              alignSelf: "center",
              width: width / 1.3,
              backgroundColor: "#fff",
              padding: 18,
            }}
          >
            <TouchableOpacity
              style={{
                height: 40,
                borderBottomWidth: 2,
                marginTop: 10,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
              onPress={() => {
                setShowFileMenu(false);
                selectFile();
              }}
            >
              {photoLocal.length > 0 && (
                <Text
                  style={{
                    color: "#fff",
                    zIndex: 999999,
                    backgroundColor: "#77f",
                    height: 20,
                    width: 20,
                    borderRadius: 18,
                    textAlign: "center",
                    fontSize: 16,
                    position: "absolute",
                    right: 10,
                    bottom: 15,
                  }}
                >
                  1
                </Text>
              )}
              <Text
                style={{
                  color: "#555",
                  fontWeight: "bold",
                  fontSize: 17,
                  marginLeft: 15,
                }}
              >
                Прикрепить фото
              </Text>
              <RNImage
                key="file"
                source={require("../../icons/photo.png")}
                resizeMode="contain"
                style={{
                  marginRight: 0,
                  width: 32,
                  height: 32,
                  marginBottom: 6,
                  tintColor: colors[theme].color4,
                  alignSelf: "center",
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                height: 40,
                borderBottomWidth: 2,
                marginTop: 10,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
              onPress={() => {
                setShowFileMenu(false);
                if (renderAudio) {
                  setRenderAudio(false);
                } else {
                  setRenderAudio(true);
                  setCounter(0);
                  start();
                }
              }}
            >
              {audioFile.length > 0 && (
                <Text
                  style={{
                    color: "#fff",
                    zIndex: 999999,
                    backgroundColor: "#77f",
                    height: 20,
                    width: 20,
                    borderRadius: 18,
                    textAlign: "center",
                    fontSize: 16,
                    position: "absolute",
                    right: 10,
                    bottom: 15,
                  }}
                >
                  1
                </Text>
              )}
              <Text
                style={{
                  color: "#555",
                  fontWeight: "bold",
                  fontSize: 17,
                  marginLeft: 15,
                }}
              >
                Прикрепить аудио
              </Text>
              <RNImage
                key="file"
                source={require("../../icons/mic.png")}
                resizeMode="contain"
                style={{
                  marginRight: 0,
                  width: 25,
                  height: 25,
                  marginBottom: 6,
                  tintColor: colors[theme].color4,
                  alignSelf: "center",
                }}
              />
            </TouchableOpacity>
            {chat?.type == "group" && isAdmin && (
              <TouchableOpacity
                style={{
                  height: 40,
                  marginTop: 10,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
                onPress={(e) => {
                  setShowFileMenu(false);
                  setShowEventModal(!showEventModal);
                }}
              >
                <Text
                  style={{
                    color: "#555",
                    fontWeight: "bold",
                    fontSize: 17,
                    marginLeft: 15,
                  }}
                >
                  Прикрепить событие
                </Text>
                <RNImage
                  key="file"
                  source={require("../../icons/calendar.png")}
                  resizeMode="contain"
                  style={{
                    marginRight: 0,
                    width: 25,
                    height: 25,
                    marginBottom: 6,
                    tintColor: colors[theme].color4,
                    alignSelf: "center",
                  }}
                />
                {newEvent.saved && (
                  <Text
                    style={{
                      color: "#fff",
                      zIndex: 999999,
                      backgroundColor: "#77f",
                      height: 20,
                      width: 20,
                      borderRadius: 18,
                      textAlign: "center",
                      fontSize: 16,
                      position: "absolute",
                      right: 10,
                      bottom: 15,
                    }}
                  >
                    1
                  </Text>
                )}
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    );
  };

  const renderCallMenu = () => {
    let event = newEvent;
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={showCall}
        onDismiss={() => {}}
      >
        <TouchableOpacity
          onPress={() => {
            setShowCall(false);
          }}
          style={{
            marginTop: 0,
            width,
            height,
            backgroundColor: "rgba(255,255,255,0.5)",
          }}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={{
              borderRadius: 10,
              position: "absolute",
              top: 70,
              right: 10,
              borderWidth: 0,
              alignSelf: "center",
              width: width / 1.3,
              backgroundColor: "#fff",
              padding: 18,
            }}
          >
            <TouchableOpacity
              style={{
                height: 40,
                borderBottomWidth: 2,
                marginTop: 10,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
              onPress={() => {
                setShowCall(false);
                let i = users.find(
                  (i) => i._id == chat?.users.find((j) => j !== user._id)
                );
                navigation.navigate("Call", {
                  channel: chat?._id,
                  user_id: i,
                  video: true,
                  isCaller: true,
                  name: chat?.name,
                });
              }}
            >
              <Text
                style={{
                  color: "#555",
                  fontWeight: "bold",
                  fontSize: 17,
                  marginLeft: 15,
                }}
              >
                Видеозвонок
              </Text>
              <RNImage
                key="file"
                source={require("../../icons/photo.png")}
                resizeMode="contain"
                style={{
                  marginRight: 0,
                  width: 32,
                  height: 32,
                  marginBottom: 6,
                  tintColor: colors[theme].color4,
                  alignSelf: "center",
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                height: 40,
                borderBottomWidth: 2,
                marginTop: 10,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
              onPress={() => {
                setShowCall(false);
                let i = users.find(
                  (i) => i._id == chat?.users.find((j) => j !== user._id)
                );
                navigation.navigate("Call", {
                  channel: chat?._id,
                  user_id: i,
                  video: false,
                  isCaller: true,
                  name: chat?.name,
                });
              }}
            >
              <Text
                style={{
                  color: "#555",
                  fontWeight: "bold",
                  fontSize: 17,
                  marginLeft: 15,
                }}
              >
                Аудиозвонок
              </Text>
              <RNImage
                key="file"
                source={require("../../icons/mic.png")}
                resizeMode="contain"
                style={{
                  marginRight: 0,
                  width: 25,
                  height: 25,
                  marginBottom: 6,
                  tintColor: colors[theme].color4,
                  alignSelf: "center",
                }}
              />
            </TouchableOpacity>
            {chat?.type == "group" && isAdmin && (
              <TouchableOpacity
                style={{
                  height: 40,
                  marginTop: 10,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
                onPress={(e) => {
                  setShowFileMenu(false);
                  setShowEventModal(!showEventModal);
                }}
              >
                <Text
                  style={{
                    color: "#555",
                    fontWeight: "bold",
                    fontSize: 17,
                    marginLeft: 15,
                  }}
                >
                  Прикрепить событие
                </Text>
                <RNImage
                  key="file"
                  source={require("../../icons/calendar.png")}
                  resizeMode="contain"
                  style={{
                    marginRight: 0,
                    width: 25,
                    height: 25,
                    marginBottom: 6,
                    tintColor: colors[theme].color4,
                    alignSelf: "center",
                  }}
                />
                {newEvent.saved && (
                  <Text
                    style={{
                      color: "#fff",
                      zIndex: 999999,
                      backgroundColor: "#77f",
                      height: 20,
                      width: 20,
                      borderRadius: 18,
                      textAlign: "center",
                      fontSize: 16,
                      position: "absolute",
                      right: 10,
                      bottom: 15,
                    }}
                  >
                    1
                  </Text>
                )}
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    );
  };

  const getName = (users) => {
    if (chat?.type == "group") {
      return chat?.name;
    }
    if (users.length) {
      let u = {};
      if (users && users[0]) {
        let i = users.find(
          (i) => i._id == chat?.users.find((j) => j !== user._id)
        );
        if (i && i.phone !== user.phone) {
          u = i;
        } else {
          u = Object.assign(user) || {};
        }
      } else {
        u = Object.assign(user) || {};
      }
      return u.name?.length ? u.name : "Чат";
    }
    return "Чат";
  };

  const processMessages = async (items) => {
    let mess = [];
    for (let message of items) {
      if (message.event) {
        user.favorite && user.favorite.length
          ? dispatch(saveFavorite([message, ...user.favorite]))
          : dispatch(saveFavorite([message]));
      }
      if (message.image && message.image.length) {
        let base64Code = message.image.split("base64,")[1];
        //base64Image is my image base64 string
        const blob = b64toBlob(base64Code, "image/jpg");
        const blobUrl = URL.createObjectURL(blob);

        message.image = blobUrl;
        mess = [...mess, message];
      } else {
        mess = [...mess, message];
      }
    }
    return mess;
  };

  const b64toBlob = (b64Data, contentType = "", sliceSize = 512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  };

  const handleSendWS = (data) => {
    wconn.send(JSON.stringify(data));
  };

  const handleSend = async (newMessage) => {
    newMessage.createdAt = new Date(newMessage.createdAt).getTime();
    if (photo.length) {
      newMessage[0]["image"] = `${photo}`;
      //newMessage2[0]['image'] = photoLocal;
    }
    if (newEvent.saved) {
      newMessage[0]["video"] = newEvent;
      //newMessage2[0]['image'] = photoLocal;
    }
    if (audioFile.length && audioFile !== "empty") {
      newMessage[0]["audio"] = audioFile;
    }

    let c = Object.assign(chat) || {};
    let ids = c.users.filter((i) => i !== user._id);
    let id = ids.some((i) => i !== user._id)
      ? ids.find((i) => i !== user._id)
      : user._id;
    new_msg({
      sender: user._id,
      user: id,
      users: ids,
      type: chat?.type,
      chat_id: chat?._id,
      message: newMessage[0],
    });
    let res = await GiftedChat.append(messages, newMessage);
    setMessages(res);
    handleSendWS({
      sender: user._id,
      type: "new_message",
      c_type: chat?.type,
      message: newMessage[0],
      user: id,
      users: ids,
      chat_id: chat?._id,
    });

    if (newMessage[0].video) {
      user.favorite && user.favorite.length
        ? dispatch(saveFavorite([newMessage[0], ...user.favorite]))
        : dispatch(saveFavorite([newMessage[0]]));
    }
    newEvent.saved &&
      update_chat({
        ...chat,
        events:
          chat?.events && chat?.events.length
            ? [...chat?.events, newEvent]
            : [newEvent],
      })
        .then((res) => {
          get_users_chats({ user: user._id }).then((a) => {
            dispatch(setChats(a.data.chats));
          });
        })
        .catch((err) => console.log(err));
    setNewEvent({});
    setPhoto("");
    setPhotoLocal("");
    dispatch(read(chat?._id));
    setAudioFile("empty");
  };

  const renderBubble = (props) => {
    return (
      // Step 3: return the component
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            // Here is the color change
            backgroundColor: colors[theme].color1,
          },
        }}
        divStyle={{
          right: {
            color: colors[theme].color3,
          },
        }}
      />
    );
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
      setPhotoLocal(image);
    } catch (err) {
      console.log(err);
    }
  };

  const renderEdit = () => {
    let ttt = messageToEdit.div;
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={divEdit}
        onDismiss={() => {}}
      >
        <div
          onClick={() => {
            setdivEdit(false);
          }}
          style={{
            marginTop: 0,
            width,
            height,
            backgroundColor: "rgba(255,255,255,0.5)",
          }}
        >
          <div
            activeOpacity={1}
            style={{
              borderRadius: 10,
              borderWidth: 6,
              borderColor: "#ddd",
              alignSelf: "center",
              marginTop: height / 3,
              width: width / 1.1,
              height: height / 3,
              backgroundColor: "#fff",
            }}
          >
            <div
              style={{
                color: "#777",
                fontSize: 31,
                fontWeight: "800",
                divAlign: "center",
              }}
            >
              Редактирование сообщения
            </div>
            <input
              defaultValue={ttt}
              onChangediv={(t) => {
                ttt = t;
              }}
              numberOfLines={1}
              placeholderdivColor={"#6b6a69"}
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

            <div
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                marginTop: 25,
              }}
            >
              <div
                style={{ backgroundColor: "#f66", borderRadius: 20 }}
                onClick={() => {
                  setdivEdit(false);
                }}
              >
                <div
                  style={{
                    color: "#fff",
                    padding: 7,
                    fontSize: 18,
                    marginBottom: 6,
                  }}
                >
                  Отменить
                </div>
              </div>
              <div
                style={{ backgroundColor: "#66f", borderRadius: 20 }}
                onClick={() => {
                  let c = Object.assign(chat) || {};
                  let ids = c.users;
                  let id = ids.some((i) => i !== user._id)
                    ? ids.find((i) => i !== user._id)
                    : user._id;
                  new_msg({
                    user: id,
                    users: ids,
                    type: chat?.type,
                    chat_id: chat?._id,
                    oldId: messageToEdit._id,
                    message: {
                      ...messageToEdit,
                      oldId: messageToEdit._id,
                      div: ttt,
                    },
                  });
                  handleSendWS({
                    type: "new_message",
                    users: ids,
                    user: id,
                    chat_id: chat?._id,
                    oldId: messageToEdit._id,
                    message: {
                      ...messageToEdit,
                      oldId: messageToEdit._id,
                      div: ttt,
                    },
                  });
                  setdivEdit(false);
                }}
              >
                <div
                  style={{
                    color: "#fff",
                    padding: 7,
                    fontSize: 18,
                    marginBottom: 6,
                  }}
                >
                  Сохранить
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  };

  const renderSend = ({ onSend, text, sendButtonProps, ...sendProps }) => {
    let count = 0;
    if (photoLocal.length) {
      count = count + 1;
    }
    if (audioFile.length) {
      count = count + 1;
    }
    if (newEvent.saved) {
      count = count + 1;
    }
    return (
      <Send {...sendProps}>
        <div>
          {renderAudio && renderAudioRecord()}
          <div style={styles.sendingContainer}>
            <div
              onClick={() => {
                setShowFileMenu(true);
              }}
            >
              {count > 0 && (
                <div
                  style={{
                    color: "#fff",
                    zIndex: 999999,
                    backgroundColor: "#77f",
                    height: 20,
                    width: 20,
                    borderRadius: 18,
                    divAlign: "center",
                    fontSize: 16,
                    position: "absolute",
                    left: 10,
                    bottom: 15,
                  }}
                >
                  {count}
                </div>
              )}
              <RNImage
                source={require("../../icons/file.png")}
                color={colors[theme].color4}
                style={{
                  marginRight: 0,
                  width: 32,
                  height: 32,
                  tintColor: colors[theme].color4,
                  alignSelf: "center",
                }}
                maxHeight={32}
                maxWidth={32}
              />
            </div>

            <div
              onClick={() => {
                console.log("click");
                if (
                  (audioFile || photoLocal || newEvent.saved) &&
                  !text &&
                  onSend
                ) {
                  onSend({ text: text.trim() }, true);
                } else if (text && onSend) {
                  onSend({ text: text.trim() }, true);
                } else {
                  return false;
                }
              }}
            >
              <RNImage
                source={require("../../icons/send.png")}
                color={colors[theme].color4}
                style={{
                  width: 40,
                  height: 40,
                  marginRight: 15,
                  marginLeft: 5,
                  marginBottom: 0,
                  tintColor: colors[theme].color6,
                  alignSelf: "center",
                }}
                maxHeight={40}
                maxWidth={40}
              />
            </div>
          </div>
        </div>
      </Send>
    );
  };

  const renderLoading = () => {
    return (
      <div style={styles.loadingContainer}>
        <Spinner size="large" color={colors[theme].color9} />
      </div>
    );
  };

  if (loading) {
    return (
      <div
        style={{
          ...{
            flex: 1,
            width: "100%",
            backgroundColor: colors[theme].color3,
            padding: 15,
            justifyContent: "space-around",
          },
          ...{ paddingTop: 40 },
        }}
      >
        <Spinner />
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: colors[theme].color2,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <HeaderChat
        onPress={() => {
          navigation(-1);
        }}
        onPress2={() => {
          if (chat?.type !== "group") {
            setShowCall(true);
          }
        }}
        onPress3={() => {
          navigation("/");
        }}
        onPress4={() => {
          setShowMenu(!showMenu);
        }}
        text={chat?.name}
        screen={"Chat"}
      />

{img !== null && (
        <View
          style={{
            zIndex: 4,
            position: 'absolute',
            top: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#000000aa',

          }}>
          <TouchableOpacity
            onPress={() => setImg(null)}
            style={{
              position: 'absolute',
              top: 0,
              right: 5,
              zIndex: 5,
              backgroundColor: '#ffffffaa',
              borderRadius: 50,
              width: 50,
              height: 50,
              alignItems:'center',
              justifyContent:'center'
            }}>
            <RNImage
                key="file"
                source={require("../../icons/cross.png")}
                resizeMode="cover"
                style={{
                  width: 32,
                  height: 32,
                  tintColor: '#222',
                  alignSelf: "center",
                }}
              />
          </TouchableOpacity>
          <RNImage
            style={{
              width: Dimensions.get('window').width,
              height: '100%',
              resizeMode:'contain'
            }}
            source={{uri: img}}
          />
        </View>
      )}
      <div
        style={{
          backgroundColor: colors[theme].color2,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
        className="chatBubble"
      >
        {renderSubEventList(
          eventLocal,
          setEventLocal,
          showSubEventListModal,
          setShowSubEventListModal,
          chat
        )}
        {renderEvent(
          showEventModal,
          setShowEventModal,
          newEvent,
          error,
          setError,
          setNewEvent
        )}
        {renderFileMenu()}
        {renderCallMenu()}
        {renderEdit()}

        {showMenu && (
          <div
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              height: "100%",
              width: "100%",
              zIndex: 888,
            }}
            onClick={() => setShowMenu(false)}
          >
            <div
              style={{
                position: "absolute",
                zIndex: 9999999,
                right: 0,
                top: 115,
                height: "50%",
                width: "40%",
              }}
            >
              <Menu
                navigation={navigation}
                params={{
                  onPop: () => {
                    setShowMenu(false);
                  },
                  close: () => {
                    setShowMenu(false);
                  },
                  type: "chat",
                  chat: chat,
                }}
              />
            </div>
          </div>
        )}

        <GiftedChat
          key={theme}
          textInputStyle={{ color: "#222", fontSize: 20 }}
          messages={messages}
          renderMessage={renderMessage}
          renderMessageText={(props) => (
            <MessageItem
              key={props.currentMessage._id}
              isAdmin={isAdmin}
              chat={chat}
              {...props}
              setImg={setImg}
              eventCallback={(currentMessage, event) => {
                let index = "";
                if (event.id) {
                  index = chat?.events.findIndex((e) => e.id == event.id);
                } else {
                  index = chat?.events.findIndex(
                    (e) => e.startTime == event.startTime
                  );
                }
                setShowSubEventListModal(true);
                if (chat?.events[index]) {
                  setEventLocal(chat?.events[index]);
                } else {
                  setEventLocal(event);
                }
              }}
            />
          )}
          onSend={(newMessage) => handleSend(newMessage)}
          user={user}
          placeholder="Cообщение..."
          showUserAvatar
          alwaysShowSend={true}
          renderSend={renderSend}
          onLongPress={(props, props2) => {
            let crat = new Date(props2.createdAt);
            let now = new Date();
            const showedit =
              props2.user._id == user._id && (now - crat) / 1000 / 3600 / 24;

            props.actionSheet().showActionSheetWithOptions(
              {
                options: showedit
                  ? [
                      "В избранные",
                      "Копировать текст",
                      "Редактировать текст",
                      "Отмена",
                    ]
                  : ["В избранные", "Копировать текст", "Отмена"],
                cancelButtonIndex: showedit ? 3 : 2,
              },
              (buttonIndex) => {
                switch (buttonIndex) {
                  case 0:
                    user.favorite && user.favorite.length
                      ? dispatch(saveFavorite([props2, ...user.favorite]))
                      : dispatch(saveFavorite([props2]));
                    break;
                  case 1:
                    //Clipboard.setString(props2.div);
                    break;
                  case 2:
                    if (showedit) {
                      setdivEdit(true);
                      setMessageToEdit(props2);
                    }

                    break;
                }
              }
            );
          }}
          className="chatBubble"
          renderLoading={!chat && renderLoading}
        />
        <input id="selectImage" hidden type="file" onChange={processFile} />
      </div>
    </div>
  );
};

const styles = {
  // rest remains same
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomComponentContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  sendingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    flexDirection: "row",
  },
};
export default Chat;
