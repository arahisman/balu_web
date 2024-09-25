import React, { useEffect, useState } from "react";

import Modal from "@mui/material/Modal";

import HeaderBack from "../../components/HeaderBack";
import { useDispatch, useSelector } from "react-redux";
import ChatItem from "./../../components/ChatItem";
import ChatItemOpen from "./../../components/ChatItemOpen";
import { Image } from "react-native";
import Resizer from "react-image-file-resizer";

import {
  get_users_groups,
  exit_chat,
  exit_group,
  get_groups_chats,
  update_chat,
  update_group,
} from "./../../api/chatApi";
import {
  read,
  updateGroup,
  setGroups,
  setGroupChats,
} from "../../redux/actions/chatActions";
import colors from "./../../components/styles";
import renderEvent from "./Event";
import renderSubEventList from "./SubEventList";
import { useLocation, useNavigate } from "react-router-dom";
import config from "../../config";
function Group() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigation = useNavigate();
  const theme = useSelector((state) => state.app.theme);
  const users = useSelector((state) => state.app.user_list);
  const user = useSelector((state) => state.usr);
  const width = 300;
  const height = 300;
  const groups = useSelector((state) => state.groups.groups);
  const group = groups.find((i) => i._id == location.state.group._id);
  const ch = useSelector((state) => state.groups.chats);
  const [currentChat, setCurrentChat] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteType, setDeleteType] = useState("chat");
  const [name, setName] = useState(group.name);
  const [ads, setAds] = useState(group.ads);
  const [photo, setPhoto] = useState(group.photo);
  const [description, setDescription] = useState(group.description);
  const [response, setResponse] = useState(null);
  const [ad, setAd] = useState("");
  const [events, setEvents] = useState(group.events);
  const [eventLocal, setEventLocal] = useState({});
  const [showEventModal, setShowEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState({});
  const [error, setError] = useState("");
  const [showSubEventListModal, setShowSubEventListModal] = useState(false);
  const [eventListModalVisible, setEventListModalVisible] = useState(false);

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

  const renderMessageEvent = (event) => {
    const isAdmin = group.admin_list.includes(user._id);
    return (
      <div
        style={{ borderBottomWidth: 2, paddingBottom: 20, marginBottom: 10 }}
      >
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
              style={{
                flexDirection: "row",
                display: "flex",
                justifyContent: "space-between",
              }}
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
                    textAlign: "center",
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
                    textAlign: "center",
                  }}
                >
                  {event.endTime
                    ? ftotime(event.endTime)
                    : ftotime(event.startTime)}
                </div>
              </div>
            </div>
          ) : (
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
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
                    textAlign: "center",
                  }}
                >
                  {event.startDate ? ftodate(event.startDate.toString()) : ""}
                </div>
                <div
                  style={{
                    flexDirection: "row",
                    display: "flex",
                    justifyContent: "space-around",
                  }}
                >
                  <div
                    style={{
                      color: "#444",
                      margin: 6,
                      fontSize: 18,
                      fontWeight: "600",
                      textAlign: "center",
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
                        textAlign: "center",
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
                        textAlign: "center",
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
              style={{
                backgroundColor: "#f66",
                borderRadius: 10,
                margin: 5,
                marginBottom: 10,
              }}
              onClick={() => {
                let index = "";
                if (event.id) {
                  index = group.events.findIndex((e) => e.id == event.id);
                } else {
                  index = group.events.findIndex(
                    (e) => e.startTime == event.startTime
                  );
                }
                setShowSubEventListModal(true);
                if (group.events[index]) {
                  setEventLocal(group.events[index]);
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

  useEffect(() => {
    get_groups_chats({ group_id: group._id }).then((a) => {
      dispatch(setGroupChats(a.data.chats, group._id));
    });
  }, [group]);

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

  const renderDeleteChatModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={deleteModalVisible}
      >
        <div
          onClick={() => {
            setDeleteModalVisible(false);
          }}
          style={{
            flexDirection: "row",
            display: "flex",
            justifyContent: "center",
            marginTop: 0,
            width,
            height,
            opacity: 1,
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderWidth: 1,
              borderColor: "#999",
              borderRadius: 10,
              height: 81,
              width: 300,
              alignSelf: "center",
            }}
          >
            <div
              onClick={() => {
                const chat_id = currentChat._id;
                if (deleteType == "chat") {
                  exit_chat({ user_id: user._id, _id: chat_id }).then(
                    (response) => {
                      get_groups_chats({ group_id: group._id }).then((a) => {
                        dispatch(setGroupChats(a.data.chats, group._id));
                      });
                    }
                  );
                } else {
                  exit_group({ user_id: user._id, _id: chat_id }).then(
                    (response) => {
                      get_users_groups({ user: user._id }).then((a) => {
                        dispatch(setGroups(a.data.groups));
                      });
                    }
                  );
                }

                setDeleteModalVisible(false);
                setCurrentChat(null);
              }}
              style={{
                flexDirection: "row",
                display: "flex",
                justifyContent: "center",
                borderBottomWidth: 1,
                borderColor: "#999",
                height: 40,
                width: "100%",
                alignContent: "center",
                alignItems: "center",
              }}
            >
              <div style={{ color: "#f00", fontWeight: "600", fontSize: 18 }}>
                Выйти из чата
              </div>
            </div>
            <div
              onClick={() => {
                setDeleteModalVisible(false);
              }}
              style={{
                flexDirection: "row",
                display: "flex",
                justifyContent: "center",
                height: 40,
                width: "100%",
                alignContent: "center",
                alignItems: "center",
              }}
            >
              <div style={{ color: "#444", fontWeight: "600", fontSize: 18 }}>
                Назад
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  };
  const renderEditModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
      >
        <div
          activeOpacity={1}
          style={{
            flexDirection: "row",
            display: "flex",
            justifyContent: "center",
            marginTop: 0,
            width,
            height,
            opacity: 1,
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderColor: "#999",
              borderRadius: 10,
              height: 600,
              width: 330,
              alignSelf: "center",
              alignContent: "center",
              alignItems: "center",
              display: "flex",
              justifyContent: "space-between",
              zIndex: 9,
            }}
          >
            <div
              style={{
                color: colors[theme].color1,
                textAlign: "center",
                fontWeight: "800",
                fontSize: 20,
                margin: 20,
              }}
            >
              Редактирование группы
            </div>
            <div>
              <div
                style={{
                  width: width / 1.5,
                  height: width / 1.5,
                  borderRadius: width / 1.5,
                  alignSelf: "center",
                }}
                onClick={(e) => selectFile()}
              >
                {response?.assets ? (
                  response?.assets.map(({ uri }) => (
                    <img
                      resizeMode="cover"
                      resizeMethod="scale"
                      style={{
                        width: width / 1.5,
                        height: width / 1.5,
                        borderRadius: width / 1.5,
                        alignSelf: "center",
                        backgroundColor: colors[theme].color10,
                      }}
                      src={{ uri: uri }}
                    />
                  ))
                ) : (
                  <Image
                    src={
                      !photo.length
                        ? require("../../icons/photo.png")
                        : { uri: config.baseURL+ photo }
                    }
                    color={colors[theme].color3}
                    style={{
                      width: width / 1.5,
                      height: width / 1.5,
                      borderRadius: width / 1.5,
                      marginTop: 25,
                      tintColor: !photo.length ? colors[theme].color6 : null,
                      alignSelf: "center",
                      backgroundColor: colors[theme].color3,
                    }}
                    maxHeight={width / 1.5}
                    maxWidth={width / 1.5}
                  />
                )}
              </div>
              <input
                value={name}
                onChangeText={(t) => {
                  setName(t);
                }}
                numberOfLines={1}
                placeholder={"Название"}
                placeholderTextColor={"#6b6a69"}
                style={{
                  minWidth: "90%",
                  maxWidth: "90%",
                  color: colors[theme].color8,
                  borderBottomWidth: 2,
                  borderColor: colors[theme].color6,
                  margin: 5,
                  marginTop: 10,
                  fontSize: 20,
                  alignSelf: "center",
                  textAlign: "center",
                  fontWeight: "500",
                }}
              />
              <input
                value={description}
                onChangeText={(t) => {
                  setDescription(t);
                }}
                multiline
                numberOfLines={3}
                placeholder={"Описание группы"}
                placeholderTextColor={"#6b6a69"}
                style={{
                  minWidth: "90%",
                  maxWidth: "90%",
                  color: colors[theme].color8,
                  borderBottomWidth: 2,
                  borderColor: colors[theme].color6,
                  margin: 5,
                  marginTop: 10,
                  fontSize: 20,
                  alignSelf: "center",
                  textAlign: "center",
                  fontWeight: "500",
                }}
              />
              <div
                style={{
                  color: colors[theme].color1,
                  fontWeight: "600",
                  fontSize: 20,
                  margin: 20,
                }}
              >
                Объявления
              </div>
              <div style={{ marginBottom: 100 }}>
                {ads.map((item) => (
                  <div
                    style={{
                      maxWidth: "100%",
                      flexDirection: "row",
                      display: "flex",
                      justifyContent: "space-between",
                      padding: 5,
                      margin: 5,
                      backgroundColor: colors[theme].color2,
                    }}
                  >
                    <div
                      style={{
                        color: colors[theme].color6,
                        fontWeight: "400",
                        fontSize: 18,
                        maxWidth: "70%",
                      }}
                    >
                      {item}
                    </div>
                    <div
                      style={{ height: 30 }}
                      onClick={() => {
                        setAds(ads.filter((i) => i !== item));
                      }}
                    >
                      <div
                        style={{
                          color: "#c00",
                          fontWeight: "400",
                          fontSize: 18,
                        }}
                      >
                        Удалить
                      </div>
                    </div>
                  </div>
                ))}
                <div
                  style={{
                    maxWidth: "100%",
                    flexDirection: "row",
                    display: "flex",
                    justifyContent: "space-between",
                    margin: 5,
                    marginTop: 0,
                    alignContent: "center",
                    alignItems: "center",
                  }}
                >
                  <input
                    value={ad}
                    onChangeText={(t) => {
                      setAd(t);
                    }}
                    multiline
                    numberOfLines={3}
                    placeholder={"Новое"}
                    placeholderTextColor={"#6b6a69"}
                    style={{
                      color: colors[theme].color6,
                      fontWeight: "400",
                      fontSize: 18,
                      maxWidth: "70%",
                      minWidth: "70%",
                      borderBottomWidth: 2,
                      borderColor: colors[theme].color6,
                      alignSelf: "center",
                      marginBottom: 20,
                    }}
                  />
                  <div
                    style={{
                      height: 37,
                      backgroundColor: "#090",
                      padding: 5,
                      borderRadius: 15,
                    }}
                    onClick={() => {
                      if (!ad.length) {
                        return;
                      }
                      setAds([...ads, ad]);
                    }}
                  >
                    <div
                      style={{
                        color: "#fff",
                        fontWeight: "400",
                        fontSize: 18,
                      }}
                    >
                      Добавить
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              style={{
                marginBottom: 30,
                width: "100%",
                flexDirection: "row",
                display: "flex",
                justifyContent: "space-around",
              }}
            >
              <div
                onClick={() => {
                  update_group({
                    ...group,
                    name,
                    description,
                    photo,
                    ads,
                  });
                  dispatch(
                    updateGroup({ ...group, name, description, photo, ads })
                  );
                  setEditModalVisible(false);
                }}
                style={{
                  width: 120,
                  height: 40,
                  alignItems: "center",
                  display: "flex",
                  justifyContent: "center",
                  backgroundColor: colors[theme].color1,
                  borderRadius: 20,
                }}
              >
                <div style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>
                  Сохранить
                </div>
              </div>
              <div
                onClick={() => setEditModalVisible(false)}
                style={{
                  width: 120,
                  height: 40,
                  alignItems: "center",
                  display: "flex",
                  justifyContent: "center",
                  backgroundColor: colors[theme].color1,
                  borderRadius: 20,
                }}
              >
                <div style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>
                  Отмена
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  };

  const renderEventListModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={eventListModalVisible}
      >
        <div
          activeOpacity={1}
          style={{
            flexDirection: "row",
            display: "flex",
            justifyContent: "center",
            marginTop: 0,
            width,
            height,
            opacity: 1,
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderColor: "#999",
              borderRadius: 10,
              height: 600,
              width: 330,
              alignSelf: "center",
              alignContent: "center",
              alignItems: "center",
              display: "flex",
              justifyContent: "space-between",
              zIndex: 9,
            }}
          >
            <div
              style={{
                color: colors[theme].color1,
                textAlign: "center",
                fontWeight: "800",
                fontSize: 20,
                margin: 20,
              }}
            >
              События группы
            </div>
            <div>{events.map((event) => renderMessageEvent(event))}</div>
            <div
              style={{
                marginBottom: 30,
                width: "100%",
                flexDirection: "row",
                display: "flex",
                justifyContent: "space-around",
              }}
            >
              <div
                onClick={() => {
                  setEventListModalVisible(false);
                  setShowEventModal(true);
                }}
                style={{
                  width: 120,
                  height: 40,
                  alignItems: "center",
                  display: "flex",
                  justifyContent: "center",
                  backgroundColor: colors[theme].color1,
                  borderRadius: 20,
                }}
              >
                <div style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>
                  Новое
                </div>
              </div>
              <div
                onClick={() => setEventListModalVisible(false)}
                style={{
                  width: 120,
                  height: 40,
                  alignItems: "center",
                  display: "flex",
                  justifyContent: "center",
                  backgroundColor: "#f66",
                  borderRadius: 20,
                }}
              >
                <div style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>
                  Закрыть
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  };

  return (
    <div
      style={{
        backgroundColor: colors[theme].color2,
        width: "100%",
        minHeight: "100vh",
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {renderDeleteChatModal()}
      {renderEditModal()}
      {renderEventListModal()}
      {renderEvent(
        showEventModal,
        setShowEventModal,
        newEvent,
        error,
        setError,
        setNewEvent,
        update_group,
        updateGroup,
        group,
        events,
        setEvents
      )}
      {renderSubEventList(
        eventLocal,
        setEventLocal,
        showSubEventListModal,
        setShowSubEventListModal,
        group
      )}
      <HeaderBack onClick={() => navigation(-1)} text={group.name} />
      <div
        style={{
          width: "100%",
          minHeight: "80vh",
          maxHeight: "95vh",
          overflow: "scroll",
        }}
      >
        <div
          style={{
            color: colors[theme].color1,
            fontWeight: "600",
            fontSize: 20,
            marginLeft: 20,
          }}
        >
          Описание
        </div>
        <div
          style={{
            color: colors[theme].color1,
            fontWeight: "400",
            fontSize: 16,
            margin: 5,
            marginLeft: 20,
          }}
        >
          {group.description}
        </div>
        <div
          style={{
            color: colors[theme].color1,
            fontWeight: "600",
            fontSize: 20,
            marginLeft: 20,
          }}
        >
          Объявления
        </div>
        {!group.ads?.length ? (
          <div
            style={{
              color: colors[theme].color1,
              fontWeight: "400",
              fontSize: 16,
              margin: 3,
              marginLeft: 20,
            }}
          >
            Нет новых объявлений
          </div>
        ) : (
          group.ads.map((item) => (
            <div
              style={{
                color: colors[theme].color1,
                fontWeight: "400",
                fontSize: 16,
                margin: 3,
                marginLeft: 20,
              }}
            >
              {item}
            </div>
          ))
        )}
        <div
          style={{
            color: colors[theme].color1,
            fontWeight: "600",
            fontSize: 20,
            margin: 20,
          }}
        >
          Чаты
        </div>
        {ch[group._id] &&
          users.length > 0 &&
          ch[group._id]
            .filter((i) => i.users.includes(user._id))
            .map((item, index) => {
              return (
                <ChatItem
                  key={item._id + item.name}
                  onClick={() => {
                    navigation("/chat", { state: { id: item._id } });
                    dispatch(read(item._id));
                  }}
                  removeChat={() => {
                    setDeleteModalVisible(true);
                    setDeleteType("chat");
                    setCurrentChat(item);
                  }}
                  item={item}
                />
              );
            })}
        <div style={{ marginBottom: 30 }}>
          {ch[group._id] &&
            users.length > 0 &&
            ch[group._id]
              .filter((i) => !i.users.includes(user._id) && !i.isClosed)
              .map((item, index) => {
                return (
                  <ChatItemOpen
                    key={item._id + item.name}
                    onClick={() => {
                      navigation("/chat", { state: { id: item._id } });
                      dispatch(read(item._id));
                    }}
                    removeChat={() => {
                      setDeleteModalVisible(true);
                      setDeleteType("chat");
                      setCurrentChat(item);
                    }}
                    signTo={() => {
                      update_chat({
                        ...item,
                        users: [...item.users, user._id],
                      })
                        .then((res) => {
                          get_groups_chats({ group_id: group._id }).then(
                            (a) => {
                              dispatch(setGroupChats(a.data.chats, group._id));
                            }
                          );
                        })
                        .catch((err) => console.log(err));
                    }}
                    item={item}
                  />
                );
              })}
        </div>
      </div>
      <div
        style={{
          width: "100%",
          minWidth: "100%",
          height: 60,
          flexDirection: "row",
          backgroundColor: colors[theme].color1,
          display: "flex",
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
          style={{
            width: "100%",
            flexDirection: "row",
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          {group.admin_list.includes(user._id) && (
            <div
              onClick={() => {
                setEditModalVisible(true);
              }}
              style={{
                flexDirection: "row",
                marginRight: 10,
                display: "flex",
                justifyContent: "flex-start",
              }}
            >
              <Image
                source={require("../../icons/pencil.png")}
                color={colors[theme].color3}
                style={{
                  width: 40,
                  height: 40,
                  tintColor: colors[theme].color3,
                  alignSelf: "center",
                  cursor: "pointer",
                }}
                maxHeight={40}
                maxWidth={40}
              />
            </div>
          )}

          <div
            onClick={() => {
              setEventListModalVisible(true);
            }}
            style={{
              flexDirection: "row",
              marginRight: 10,
              display: "flex",
              justifyContent: "flex-start",
            }}
          >
            <Image
              source={require("../../icons/calendar.png")}
              color={colors[theme].color3}
              style={{
                width: 40,
                height: 40,
                marginRight: 10,

                tintColor: colors[theme].color3,
                alignSelf: "center",
                cursor: "pointer",
              }}
              maxHeight={40}
              maxWidth={40}
            />
          </div>
          {group.admin_list.includes(user._id) && (
            <div
              onClick={() => {
                navigation("/new_chat", { state: { group: group } });
              }}
              style={{
                flexDirection: "row",
                marginRight: 10,
                display: "flex",
                justifyContent: "flex-start",
              }}
            >
              <Image
                source={require("../../icons/plus.png")}
                color={colors[theme].color3}
                style={{
                  width: 50,
                  height: 50,
                  tintColor: colors[theme].color3,
                  alignSelf: "center",
                  cursor: "pointer",
                }}
                maxHeight={50}
                maxWidth={50}
              />
            </div>
          )}
          {group.admin_list.includes(user._id) && (
            <div
              onClick={() =>
                navigation("/contacts", { state: { group: group } })
              }
              style={{
                flexDirection: "row",
                marginRight: 10,
                display: "flex",
                justifyContent: "flex-start",
              }}
            >
              <Image
                source={require("../../icons/search.png")}
                color={colors[theme].color3}
                style={{
                  width: 50,
                  height: 50,
                  tintColor: colors[theme].color3,
                  alignSelf: "center",
                  cursor: "pointer",
                }}
                maxHeight={50}
                maxWidth={50}
              />
            </div>
          )}
        </div>
      </div>
      <input id="selectImage" hidden type="file" onChange={processFile} />
    </div>
  );
}

const styles = {
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
};
export default Group;
