import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import { useSelector, useDispatch } from "react-redux";
import { setGroups } from "../../redux/actions/chatActions";
import moment from "moment";
import colors from "./../../components/styles";
import { get_users_groups, update_group } from "./../../api/chatApi";

const RenderSubEventList = (
  eventLocal,
  setEventLocal,
  showSubEventListModal,
  setShowSubEventListModal,
  group
) => {
  const user = useSelector((state) => state.usr);
  const [seName, setSeName] = useState("");
  const [seAddress, setSeAddress] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [eTime, setETime] = useState(null);
  const [sTime, setSTime] = useState(null);
  const width = 300
  const height = 300
  const isAdmin =
    group && group.admin_list && group.admin_list.some((i) => i == user._id);
  const theme = useSelector((state) => state.app.theme);
  const dispatch = useDispatch();
  let name = "";
  let address = "";
  if (!eventLocal) {
    console.log("empty");
    return null;
  }
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showSubEventListModal}
      onDismiss={() => {
        
      }}
    >
      <div
        onPress={() => {
          setShowSubEventListModal(false);
        }}
        style={{
          marginTop: 0,
          width,
          height,
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      >
        <div
          style={{
            borderRadius: 10,
            borderWidth: 0,
            borderColor: "#ddd",
            alignSelf: "center",
            marginTop: 100,
            marginBottom: 100,
            width: width / 1.1,
            height: height / 1.3,
            backgroundColor: "#fff",
            padding: 15,
          }}
        >
          <div
            activeOpacity={1}
            style={{
              borderRadius: 10,
              borderWidth: 0,
              borderColor: "#ddd",
              alignSelf: "center",
              width: width / 1.2,
              minHeight: height / 1.3,
              backgroundColor: "#fff",
            }}
          >
            <div
              style={{
                color: "#444",
                fontSize: 31,
                fontWeight: "800",
                textAlign: "center",
              }}
            >
              Мероприятия события
            </div>
            {!showNew &&
              eventLocal &&
              eventLocal.subEvents &&
              eventLocal.subEvents.map((event) => (
                <div
                  style={{
                    borderBottomWidth: 3,
                    borderColor: "#555",
                    marginTop: 20,
                    marginBottom: 20,
                    flexDirection: "row",
                  }}
                >
                  <div style={{ width: "58%" }}>
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

                    <div
                      style={{
                        color: "#444",
                        margin: 6,
                        fontSize: 18,
                        fontWeight: "600",
                      }}
                    >
                      {event.address.toString()}
                    </div>
                  </div>
                  <div style={{ width: "25%" }}>
                    <div
                      style={{
                        color: "#555",
                        margin: 6,
                        fontSize: 17,
                        fontWeight: "600",
                      }}
                    >
                      {new moment(event.sTime).format("HH:mm")}
                    </div>

                    <div
                      style={{
                        color: "#555",
                        margin: 6,
                        fontSize: 17,
                        fontWeight: "600",
                      }}
                    >
                      {new moment(event.eTime).format("HH:mm")}
                    </div>
                  </div>
                  {isAdmin && (
                    <div
                      style={{
                        width: "15%",
                        alignItems: "center",
                        alignContent: "center",
                        justifyContent: "center",
                      }}
                      onPress={() => {
                        let index = "";
                        if (eventLocal.id) {
                          index = group.events.findIndex(
                            (e) => e.id == eventLocal.id
                          );
                        } else {
                          index = group.events.findIndex(
                            (e) => e.startTime == eventLocal.startTime
                          );
                        }
                        setEventLocal({
                          ...eventLocal,
                          subEvents: eventLocal.subEvents.filter(
                            (r) => r !== event
                          ),
                        });
                        update_group({
                          ...group,
                          events: [
                            ...group.events.filter(
                              (e) => e.startTime != eventLocal.startTime
                            ),
                            {
                              ...eventLocal,
                              subEvents: eventLocal.subEvents.filter(
                                (r) => r !== event
                              ),
                            },
                          ],
                        })
                          .then((res) => {
                            get_users_groups({ user: user._id }).then((a) => {
                              dispatch(setGroups(a.data.groups));
                            });
                          })
                          .catch((err) => console.log(err));
                      }}
                    >
                      <img
                        key="file"
                        source={require("../../icons/trash.png")}
                        resizeMode="contain"
                        style={{
                          marginRight: 0,
                          width: 50,
                          height: 50,
                          alignSelf: "center",
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
            {isAdmin && !showNew && (
              <div
                style={{
                  backgroundColor: "#555",
                  marginTop: 15,
                  borderRadius: 20,
                  width: "90%",
                  alignSelf: "center",
                }}
                onPress={() => {
                  setShowNew(true);
                }}
              >
                <div
                  style={{
                    color: "#fff",
                    padding: 7,
                    fontSize: 18,
                    marginBottom: 6,
                    textAlign: "center",
                    alignSelf: "center",
                    fontWeight: "600",
                  }}
                >
                  Добавить
                </div>
              </div>
            )}
            {isAdmin && showNew && (
              <div style={{ width: "100%", height: "100%" }}>
                <input
                  defaultValue={name}
                  onChangeText={(t) => {
                    setSeName(t);
                    name = t;
                  }}
                  numberOfLines={1}
                  placeholder={"Название мероприятия ..."}
                  placeholderTextColor={"#6b6a69"}
                  style={{
                    width: "100%",
                    padding: 10,
                    color: colors[theme].color8,
                    borderBottomWidth: 2,
                    borderColor: colors[theme].color6,
                    marginTop: 5,
                    marginBottom: 5,
                    fontSize: 22,
                    fontWeight: "600",
                  }}
                />
                <input
                  defaultValue={address}
                  onChangeText={(t) => {
                    setSeAddress(t);
                    address = t;
                  }}
                  numberOfLines={1}
                  placeholder={"Место мероприятия..."}
                  placeholderTextColor={"#6b6a69"}
                  style={{
                    width: "100%",
                    padding: 10,
                    color: colors[theme].color8,
                    borderBottomWidth: 2,
                    borderColor: colors[theme].color6,
                    marginTop: 5,
                    marginBottom: 5,
                    fontSize: 22,
                    fontWeight: "600",
                  }}
                />
                <div
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "#555",
                      marginTop: 15,
                      borderRadius: 20,
                      width: "45%",
                      alignSelf: "center",
                    }}
                    onPress={() => {
                      /*DateTimePickerAndroid.open({
                        value: sTime ? new Date(sTime) : new Date(),
                        mode: "time",
                        is24Hour: true,
                        onChange: (u) => {
                          setSTime(u.nativeEvent.timestamp);
                        },
                      });
                      */
                      //setShowTime(true)
                    }}
                  >
                    <div
                      style={{
                        color: "#fff",
                        padding: 7,
                        fontSize: 18,
                        marginBottom: 6,
                        textAlign: "center",
                        alignSelf: "center",
                        fontWeight: "600",
                      }}
                    >
                      {sTime ? new moment(sTime).format("HH:mm") : "Начало"}
                    </div>
                  </div>
                  <div
                    style={{
                      backgroundColor: "#555",
                      marginTop: 15,
                      borderRadius: 20,
                      width: "45%",
                      alignSelf: "center",
                    }}
                    onPress={() => {
                     /* DateTimePickerAndroid.open({
                        value: eTime ? new Date(eTime) : new Date(),
                        mode: "time",
                        is24Hour: true,
                        onChange: (u) => {
                          setETime(u.nativeEvent.timestamp);
                        },
                      });
                      */
                      //setShowTime(true)
                    }}
                  >
                    <div
                      style={{
                        color: "#fff",
                        padding: 7,
                        fontSize: 18,
                        marginBottom: 6,
                        textAlign: "center",
                        alignSelf: "center",
                        fontWeight: "600",
                      }}
                    >
                      {eTime ? new moment(eTime).format("HH:mm") : "Окончание"}
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    backgroundColor: "#5a5",
                    marginTop: 15,
                    borderRadius: 20,
                    width: "80%",
                    alignSelf: "center",
                  }}
                  onPress={() => {
                    let index = "";
                    if (eventLocal && eventLocal.id) {
                      index = group.events.findIndex(
                        (e) => e.id == eventLocal.id
                      );
                    } else {
                      index = group.events.findIndex(
                        (e) => e.startTime == eventLocal.startTime
                      );
                    }

                    eventLocal &&
                    eventLocal.subEvents &&
                    eventLocal.subEvents.length
                      ? setEventLocal({
                          ...eventLocal,
                          subEvents: [
                            ...eventLocal.subEvents,
                            {
                              name: seName,
                              address: seAddress,
                              sTime,
                              eTime,
                            },
                          ],
                        })
                      : setEventLocal({
                          ...eventLocal,
                          subEvents: [
                            {
                              name: seName,
                              address: seAddress,
                              sTime,
                              eTime,
                            },
                          ],
                        });
                    let ne = group.events;
                    ne[index] = eventLocal;
                    update_group({
                      ...group,
                      events:
                        group.events[index] &&
                        group.events[index].subEvents &&
                        group.events[index].subEvents.length
                          ? [
                              ...group.events.filter(
                                (e) => e.startTime != eventLocal.startTime
                              ),
                              {
                                ...eventLocal,
                                subEvents: [
                                  ...eventLocal.subEvents,
                                  {
                                    name: seName,
                                    address: seAddress,
                                    sTime,
                                    eTime,
                                  },
                                ],
                              },
                            ]
                          : [
                              ...group.events.filter(
                                (e) => e.startTime != eventLocal.startTime
                              ),
                              {
                                ...eventLocal,
                                subEvents: [
                                  {
                                    name: seName,
                                    address: seAddress,
                                    sTime,
                                    eTime,
                                  },
                                ],
                              },
                            ],
                    })
                      .then((res) => {
                        get_users_groups({ user: user._id }).then((a) => {
                          dispatch(setGroups(a.data.groups));
                        });
                      })
                      .catch((err) => console.log(err));

                    setSeAddress("");
                    setSeName("");
                    setETime(null);
                    setSTime(null);
                    setShowNew(false);
                  }}
                >
                  <div
                    style={{
                      color: "#fff",
                      padding: 7,
                      fontSize: 18,
                      marginBottom: 6,
                      textAlign: "center",
                      alignSelf: "center",
                      fontWeight: "600",
                    }}
                  >
                    Сохранить
                  </div>
                </div>
                <div
                  style={{
                    backgroundColor: "#a55",
                    marginTop: 15,
                    borderRadius: 20,
                    width: "80%",
                    alignSelf: "center",
                  }}
                  onPress={() => {
                    setSeAddress("");
                    setSeName("");
                    setETime(null);
                    setSTime(null);
                    setShowNew(false);
                  }}
                >
                  <div
                    style={{
                      color: "#fff",
                      padding: 7,
                      fontSize: 18,
                      marginBottom: 6,
                      textAlign: "center",
                      alignSelf: "center",
                      fontWeight: "600",
                    }}
                  >
                    Отменить
                  </div>
                </div>
              </div>
            )}
            {eventLocal &&
              eventLocal.subEvents &&
              eventLocal.subEvents.length > 0 && (
                <div
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "#555",
                      marginTop: 15,
                      borderRadius: 20,
                      width: "45%",
                      alignSelf: "center",
                    }}
                    onPress={() => {
                      let usr = Object.assign(user) || {};

                      let index = "";
                      if (eventLocal && eventLocal.id) {
                        index = group.events.findIndex(
                          (e) => e.id == eventLocal.id
                        );
                      } else {
                        index = group.events.findIndex(
                          (e) => e.startTime == eventLocal.startTime
                        );
                      }
                      if (
                        eventLocal["subscribers"] &&
                        eventLocal["subscribers"].some((i) => i == user._id)
                      ) {
                        setEventLocal({
                          ...eventLocal,
                          subscribers: [
                            ...eventLocal.subscribers.filter(
                              (o) => o != usr._id
                            ),
                          ],
                        });

                        let ne = group.events;
                        ne[index] = eventLocal;
                        update_group({
                          ...group,
                          events: [
                            ...group.events.filter(
                              (e) => e.startTime != eventLocal.startTime
                            ),
                            {
                              ...eventLocal,
                              subscribers: [
                                ...eventLocal.subscribers.filter(
                                  (o) => o != usr._id
                                ),
                              ],
                            },
                          ],
                        })
                          .then((res) => {
                            get_users_groups({ user: user._id }).then((a) => {
                              dispatch(setGroups(a.data.groups));
                            });
                          })
                          .catch((err) => console.log(err));
                      } else {
                        eventLocal &&
                        eventLocal.subscribers &&
                        eventLocal.subscribers.length
                          ? setEventLocal({
                              ...eventLocal,
                              subscribers: [...eventLocal.subscribers, usr._id],
                            })
                          : setEventLocal({
                              ...eventLocal,
                              subscribers: [usr._id],
                            });
                        let ne = group.events;
                        ne[index] = eventLocal;
                        update_group({
                          ...group,
                          events:
                            group.events[index] &&
                            group.events[index].subscribers &&
                            group.events[index].subscribers.length
                              ? [
                                  ...group.events.filter(
                                    (e) => e.startTime != eventLocal.startTime
                                  ),
                                  {
                                    ...eventLocal,
                                    subscribers: [
                                      ...eventLocal.subscribers,
                                      usr._id,
                                    ],
                                  },
                                ]
                              : [
                                  ...group.events.filter(
                                    (e) => e.startTime != eventLocal.startTime
                                  ),
                                  {
                                    ...eventLocal,
                                    subscribers: [usr._id],
                                  },
                                ],
                        })
                          .then((res) => {
                            get_users_groups({ user: user._id }).then((a) => {
                              dispatch(setGroups(a.data.groups));
                            });
                          })
                          .catch((err) => console.log(err));
                      }

                      //setShowTime(true)
                    }}
                  >
                    <div
                      style={{
                        color: "#fff",
                        padding: 7,
                        fontSize: 18,
                        marginBottom: 6,
                        textAlign: "center",
                        alignSelf: "center",
                        fontWeight: "600",
                      }}
                    >
                      {eventLocal["subscribers"] &&
                      eventLocal["subscribers"].length &&
                      eventLocal["subscribers"].some((i) => i == user._id)
                        ? "Отписаться"
                        : "Подписаться"}
                    </div>
                  </div>
                  <div
                    style={{
                      backgroundColor: "#555",
                      marginTop: 15,
                      borderRadius: 20,
                      width: "45%",
                      alignSelf: "center",
                    }}
                    onPress={() => {
                      let str = "";
                      eventLocal.subEvents.forEach((i) => {
                        str +=
                          "Мероприятие: " +
                          i.name +
                          ", Место: " +
                          i.address +
                          ", Начало: " +
                          new moment(i.sTime).format("HH:mm") +
                          ", Окончание: " +
                          new moment(i.eTime).format("HH:mm") +
                          "\n";
                      });
                    }}
                  >
                    <div
                      style={{
                        color: "#fff",
                        padding: 7,
                        fontSize: 18,
                        marginBottom: 6,
                        textAlign: "center",
                        alignSelf: "center",
                        fontWeight: "600",
                      }}
                    >
                      {"Рассказать"}
                    </div>
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default RenderSubEventList;

