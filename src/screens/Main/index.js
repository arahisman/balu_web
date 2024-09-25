import React, { useEffect } from "react";
import useState from "react-usestateref";
import { Spinner } from "./../../components/Spinner";
import { useDispatch, useSelector } from "react-redux";
import {
  saveTheme,
  saveUserList,
  saveFirst,
  saveSponsors,
} from "../../redux/actions/appActions";
import HeaderText from "./../../components/HeaderText";
import ChatItem from "./../../components/ChatItem";
import GroupItem from "./../../components/GroupItem";
import {
  TouchableOpacity,
  Text,
  View,
  Modal,
} from 'react-native';
import {
  get_new_msgs,
  get_users_chats,
  get_users_groups,
  exit_chat,
  exit_group,
} from "./../../api/chatApi";

import {
  addMessages,
  read,
  setChats,
  setGroups,
} from "../../redux/actions/chatActions";

import { get_users, set_fb_token, add_device } from "./../../api/userApi";
import colors from "./../../components/styles";
import { saveFavorite } from "../../redux/actions/usrActions";

import {
  add_sponsor,
  sponsors_list,
  delete_sponsors_list,
} from "../../api/newsApi";
import { Image } from "react-native";
import { useNavigate } from "react-router-dom";
import Menu from "../Menu";
function MainScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigate();

  const chats = useSelector((state) => state.chats.chats);
  const theme = useSelector((state) => state.app.theme);
  const first = useSelector((state) => state.app.first);
  const users = useSelector((state) => state.app.user_list);

  const sponsors = useSelector((state) => state.app.sponsors);
  console.log(sponsors);
  const user = useSelector((state) => state.usr);
  const groups = useSelector((state) => state.groups.groups);

  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [current, setCurrent] = useState(0);
  const [currentChat, setCurrentChat] = useState(null);
  const [update, setUpdate] = useState(false);
  const [newR, setNewR] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [plusModalVisible, setPlusModalVisible] = useState(false);
  const [deleteType, setDeleteType] = useState("chat");
  const [wconn, setWConn] = useState(new WebSocket("ws://45.9.43.60:3000/ws"));
  const [noty, setNoty] = useState(null);
  const [showCall, setShowCall] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [answered, setAnswered] = React.useState(false);
  const width = 300;
  const height = 300;
  const hPoint = height / 15;
  const wPoint = width / 10;

  useEffect(() => {
    if (!user.logged) {
      return navigation("/");
    }
    setModalVisible(first);

    get_users().then((res) => {
      dispatch(saveUserList(res.data.users));
    });
    get_users_chats({ user: user._id }).then((a) => {
      dispatch(setChats(a.data.chats));
    });
    get_users_groups({ user: user._id }).then((a) => {
      dispatch(setGroups(a.data.groups));
    });
    sponsors_list().then((res) => {
      dispatch(saveSponsors(res.data.qs));
    });

    const device_id = `${user._id}-web`;
    add_device({ phone: user.phone, device: device_id });
    setLoading(false);

   

    dispatch(saveFirst(false));
  }, [update, newR]);

  useEffect(() => {
    const device_id = `${user._id}-web`;

    if (wconn.readyState == 1) {
      handleSend({
        type: "messaging",
        device: device_id,
        user_id: user._id,
      });
    }
    wconn.onopen = () => {
      handleSend({
        type: "messaging",
        device: device_id,
        user_id: user._id,
      });
    };

    wconn.onmessage = (msg) => {
      let data;
      data = JSON.parse(msg.data);
      if (data.type == "new_chat") {
        get_users_chats({ user: user._id }).then((a) => {
          dispatch(setChats(a.data.chats));
        });
      }
      if (data.type == 'new_message') {
        console.log('new message')
        console.log(data)
        dispatch(addMessages(data))
      }
    };
  }, []);

  const handleSend = (data) => {
    wconn.send(JSON.stringify(data));
  };

  const processMessages = async (items) => {
    let mess = [];
    for (let message of items) {
      if (message.video) {
        user.favorite && user.favorite.length
          ? dispatch(saveFavorite([message, ...user.favorite]))
          : dispatch(saveFavorite([message]));
      }

      if (message.image && message.image.length) {
        mess = [...mess, message];
      } else {
        mess = [...mess, message];
      }
    }
    return mess;
  };
  const renderTooltip = (point, div, show) => {
    if (!show) {
      return null;
    }
    return (
      <div
        key={point}
        style={{
          marginLeft: 0,
          position: "absolute",
          left: point.x < 6 ? 3 : width * 0.09,
          top:
            point.y < 11 ? point.y * hPoint + 20 : (point.y - 2) * hPoint - 30,
        }}
      >
        <div
          style={{
            height: "100%",
            width: width * 0.9,
            backgroundColor: "#444",
            borderRadius: 7,
          }}
        >
          <div
            style={{
              color: "#fff",
              fontWeight: "800",
              fontSize: 20,
              display: "flex",
              justifyContent: "center",
              divAlign: "center",
              margin: 20,
            }}
          >
            {div}
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            top: point.y < 11 ? -15 : null,
            bottom: point.y > 10 ? -15 : null,
            left:
              point.x > 7
                ? (point.x - 2) * wPoint - 7
                : (point.x - 1) * wPoint + 7,
            width: 0,
            height: 0,
            backgroundColor: "transparent",
            borderStyle: "solid",
            borderLeftWidth: 16,
            borderRightWidth: 16,
            borderBottomWidth: point.y < 11 ? 15 : null,
            borderTopWidth: point.y > 10 ? 15 : null,
            borderLeftColor: "transparent",
            borderRightColor: "transparent",
            borderBottomColor: "#444",
          }}
        />
      </div>
    );
  };

  const renderDeleteChatModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        style={{position:'absolute', zIndex:999, borderWidth:0, top: "40%", left:'50%', right:'50%' }}

        visible={deleteModalVisible}>
        <TouchableOpacity
          onPress={() => {
            setDeleteModalVisible(false);
          }}
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 0,
            width:'100%',
            height:'100%',
            opacity: 1,
            alignContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              backgroundColor: '#fff',
              borderWidth: 1,
              borderColor: '#999',
              borderRadius: 10,
              height: 81,
              width: 300,
              alignSelf: 'center',
            }}>
            <TouchableOpacity
              onPress={() => {
                const chat_id = currentChat._id;
                if (deleteType == 'chat') {
                  exit_chat({user_id: user._id, _id: chat_id}).then(
                    response => {
                      get_users_chats({user: user._id}).then(a => {
                        dispatch(setChats(a.data.chats));
                      });
                    },
                  );
                } else {
                  exit_group({user_id: user._id, _id: chat_id}).then(
                    response => {
                      get_users_groups({user: user._id}).then(a => {
                        dispatch(setGroups(a.data.groups));
                      });
                    },
                  );
                }

                setDeleteModalVisible(false);
                setCurrentChat(null);
              }}
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                borderBottomWidth: 1,
                borderColor: '#999',
                height: 40,
                width: '100%',
                alignContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{color: '#f00', fontWeight: '600', fontSize: 18}}>
                Выйти из чата
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setDeleteModalVisible(false);
              }}
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                height: 40,
                width: '100%',
                alignContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{color: '#444', fontWeight: '600', fontSize: 18}}>
                Назад
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };
  const renderPlusModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        style={{position:'absolute', zIndex:999, borderWidth:0, top: "40%", left:'50%', right:'50%' }}
        visible={plusModalVisible}>
        <TouchableOpacity
          onPress={() => {
            setPlusModalVisible(false);
          }}
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 0,
            width:'100%',
            height:'100%',
            opacity: 1,
            alignContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              borderRadius: 10,
              height: 75,
              width: 300,
              alignSelf: 'center',
            }}>
            <View
              style={{
                width: '100%',
                height: 75,
                borderRadius: 10,
                flexDirection: 'row',
                backgroundColor: colors[theme].color1,
                justifyContent: 'space-around',
                elevation: 4,
                shadowColor: colors[theme].color12,
                shadowOffset: {
                  width: 0,
                  height: 0,
                },
                shadowOpacity: 0.16,
                shadowRadius: 20,
              }}>
              <TouchableOpacity
                onPress={() => {
                  navigation('/new_group');
                  setPlusModalVisible(false);
                }}
                style={{
                  flexDirection: 'row',
                  marginRight: 10,
                  justifyContent: 'flex-start',
                }}>
                <Image
                  key="plus"
                  source={require('../../icons/group.png')}
                  resizeMode="contain"
                  style={{
                    width: 50,
                    height: 50,
                    tintColor: colors[theme].color3,
                    alignSelf: 'center',
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  navigation('/new_chat');
                }}
                style={{
                  flexDirection: 'row',
                  marginRight: 10,
                  justifyContent: 'flex-start',
                }}>
                <Image
                  key="plus"
                  source={require('../../icons/plus.png')}
                  resizeMode="contain"
                  style={{
                    width: 50,
                    height: 50,
                    tintColor: colors[theme].color3,
                    alignSelf: 'center',
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setPlusModalVisible(false)}
                style={{
                  flexDirection: 'row',
                  marginRight: 10,
                  justifyContent: 'flex-start',
                }}>
                <Image
                  key="cross"
                  source={require('../../icons/cross.png')}
                  resizeMode="contain"
                  style={{
                    width: 50,
                    height: 50,
                    tintColor: colors[theme].color3,
                    alignSelf: 'center',
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
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
            display: "flex",
            justifyContent: "space-around",
          },
          ...{ paddingTop: 40 },
        }}
      >
        <Spinner />
      </div>
    );
  }
  if (showCall) {
    return (
      <div
        style={{
          backgroundColor: "#555",
          width: "100%",
          height: "100%",
        }}
      >
        <div
          style={{
            color: "#fff",
            marginTop: 130,
            fontSize: 34,
            alignSelf: "center",
            divAlign: "center",
            fontWeight: "600",
          }}
        >
          {noty.data.title}
        </div>
      </div>
    );
  }

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
      onClick={()=>{

        plusModalVisible && setPlusModalVisible(false)
        deleteModalVisible && setDeleteModalVisible(false)
      }}
    >
      {deleteModalVisible && renderDeleteChatModal()}
      {plusModalVisible && renderPlusModal()}
      <HeaderText
        onClick={() => {
          let themes = ["main", "dark", "forest", "beach"];
          let index = themes.indexOf(theme);
          if (index == 3) {
            dispatch(saveTheme(themes[0]));
          } else {
            dispatch(saveTheme(themes[index + 1]));
          }
        }}
        onPress2={() => {
          navigation("/call_list");
        }}
        onPress3={() => {
          navigation("/");
        }}
        onPress4={() => {
          setShowMenu(!showMenu);
        }}
        div={"Список чатов"}
        screen={"Main"}
      />
      <div
        style={{
          width: "100%",
          minHeight: "80vh",
          maxHeight: "95vh",
          overflow: "scroll",
        }}
      >
        {user && user.favorite && user.favorite.length > 0 && (
          <div
            style={{ backgroundColor: "#77b", width: "100%" }}
            onClick={() => navigation("/favorite")}
          >
            <div
              style={{
                color: "#fff",
                padding: 15,
                fontSize: 20,
                divAlign: "center",
                fontWeight: "600",
              }}
            >
              Избранное
            </div>
          </div>
        )}

        <div
          style={{
            color: colors[theme].color4,
            fontWeight: "600",
            fontSize: 20,
            margin: 20,
          }}
        >
          Группы
        </div>
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
                right: 0,
                top: 155,
                height: "50%",
                width: "40%",
                zIndex: 99999,
              }}
            >
              <Menu
                navigation={navigation}
                params={{
                  onPop: () => {
                    setModalVisible(true);
                    setShowMenu(false);
                  },
                  close: () => {
                    setShowMenu(false);
                  },
                  type: "main",
                }}
              />
            </div>
          </div>
        )}

        {groups &&
          users.length > 0 &&
          groups.map((item, index) => (
            <GroupItem
              key={item._id + item.name}
              onClick={() => {
                navigation("/group", { state: { group: item } });
              }}
              removeChat={() => {
                setDeleteModalVisible(true);
                setDeleteType("group");
                setCurrentChat(item);
              }}
              item={item}
            />
          ))}
        <div
          style={{
            color: colors[theme].color4,
            fontWeight: "600",
            fontSize: 20,
            margin: 20,
          }}
        >
          Чаты
        </div>
        
        {chats &&
          users.length > 0 &&
          chats
            .filter((i) => !i.group_id || !i.group_id.length)
            .map((item, index) => (
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
            ))}
      </div>
      <div
        style={{
          width: "100%",
          height: 60,
          display: "flex",
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
            height: 70,
            marginLeft: 2,
            overflow: "hidden",
          }}
        ></div>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div
            onClick={() => {
              setPlusModalVisible(true);
            }}
            style={{
              display: "flex",
              flexDirection: "row",
              marginRight: 10,
              display: "flex",
              justifyContent: "flex-start",
            }}
          >
            <Image
              source={require("../../icons/plus_round.png")}
              color={colors[theme].color3}
              style={{
                width: 50,
                height: 50,
                alignSelf: "center",
                tintColor: colors[theme].color3,
              }}
              maxHeight={50}
              maxWidth={50}
            />
          </div>
          <div
            onClick={() => navigation("/contacts")}
            //onClick={()=>setUpdate(!update)}
            style={{
              display: "flex",
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
                alignSelf: "center",
                tintColor: colors[theme].color3,
              }}
              maxHeight={50}
              maxWidth={50}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainScreen;
