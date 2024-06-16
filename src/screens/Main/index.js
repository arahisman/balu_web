import React, {useEffect} from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  TouchableOpacity,
  Text,
  View,
  Modal,
} from 'react-native';
import useState from 'react-usestateref';
import messaging from '@react-native-firebase/messaging';
import {Spinner} from './../../components/Spinner';
import {initialize} from './../../utils/ads';
import {useDispatch, useSelector} from 'react-redux';
import {
  saveTheme,
  saveUserList,
  saveFirst,
  saveSponsors
} from '../../redux/actions/appActions';
import HeaderText from './../../components/HeaderText';
import ChatItem from './../../components/ChatItem';
import GroupItem from './../../components/GroupItem';
import Menu from '../Menu';

import {
  get_new_msgs,
  get_users_chats,
  get_users_groups,
  exit_chat,
  exit_group,
} from './../../api/chatApi';
import {
  addMessages,
  read,
  setChats,
  setGroups,
} from '../../redux/actions/chatActions';
import {get_users, set_fb_token, add_device} from './../../api/userApi';
import RNFetchBlob from 'rn-fetch-blob';
import colors from './../../components/styles';
import {AppodealBanner} from 'react-native-appodeal';
import {saveFavorite} from '../../redux/actions/usrActions';
import DeviceInfo from 'react-native-device-info';
import notifee, {AndroidImportance} from '@notifee/react-native';
import InCallManager from 'react-native-incall-manager';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import {Drawer} from 'react-native-drawer-layout';
import {
  add_sponsor,
  sponsors_list,
  delete_sponsors_list,
} from '../../api/newsApi';

function MainScreen({navigation}) {
  const dispatch = useDispatch();
  const chats = useSelector(state => state.chats.chats);
  const theme = useSelector(state => state.app.theme);
  const first = useSelector(state => state.app.first);
  const users = useSelector(state => state.app.user_list);

  const sponsors = useSelector(state => state.app.sponsors);
  console.log(sponsors)
  const user = useSelector(state => state.usr);
  const groups = useSelector(state => state.groups.groups);

  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [currentChat, setCurrentChat] = useState(null);
  const [update, setUpdate] = useState(false);
  const [newR, setNewR] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [plusModalVisible, setPlusModalVisible] = useState(false);
  const [deleteType, setDeleteType] = useState('chat');
  const [wconn, setWConn] = useState(new WebSocket('ws://45.9.43.60:3000/ws'));
  const [noty, setNoty] = useState(null);
  const [showCall, setShowCall] = useState(null);
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    try {
      messaging().requestPermission(res => {});
      messaging()
        .getToken()
        .then(token => {
          let device_id = DeviceInfo.getUniqueId().then(device_id => {
            set_fb_token({device: device_id, user, token});
          });
        });
    } catch (err) {}
  }, []);
  useEffect(() => {
    try {
      const unsubscribe = messaging().onMessage(async remoteMessage => {
        onNotifeeMessageReceived(remoteMessage);
      });

      return unsubscribe;
    } catch (err) {}
  }, []);
  useEffect(() => {
    try {
      const unsubscribe = messaging().setBackgroundMessageHandler(
        async remoteMessage => {
          onNotifeeMessageReceived(remoteMessage);
        },
      );

      return unsubscribe;
    } catch (err) {}
  }, []);
  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;
  const hPoint = height / 15;
  const wPoint = width / 10;

  useEffect(() => {
    initialize(false);
    if (!user.logged) {
      return navigation.replace('Auth');
    }
    setModalVisible(first);

    get_users().then(res => {
      dispatch(saveUserList(res.data.users));
    });
    get_users_chats({user: user._id}).then(a => {
      dispatch(setChats(a.data.chats));
    });
    get_users_groups({user: user._id}).then(a => {
      dispatch(setGroups(a.data.groups));
    });
    sponsors_list().then(res => {
      dispatch(saveSponsors(res.data.qs));
    });
    let device_id = DeviceInfo.getUniqueId().then(device_id => {
      add_device({phone: user.phone, device: device_id});
      get_new_msgs({user: user._id, device: device_id}).then(async a => {
        let ch = {...a.data.chats};
        for (let i in ch) {
          let mm = await processMessages(ch[i]);
          dispatch(addMessages(i, mm));
        }
        setLoading(false);
      });
    });
    dispatch(saveFirst(false));
  }, [update, newR]);

  useEffect(() => {
    DeviceInfo.getUniqueId().then(device_id => {
      if (wconn.readyState === 1) {
        handleSend({
          type: 'messaging',
          device: device_id,
          user_id: user._id,
        });
      }
      wconn.onopen = () => {
        handleSend({
          type: 'messaging',
          device: device_id,
          user_id: user._id,
        });
      };
    });
    wconn.onmessage = msg => {
      let data;
      data = JSON.parse(msg.data);
      if (data.type == 'new_chat') {
        get_users_chats({user: user._id}).then(a => {
          dispatch(setChats(a.data.chats));
        });
      }
      if (data.type == 'new_message') {
        processMessages([data.message]).then(mm => {
          dispatch(addMessages(data.chat_id, mm));
        });
      }
    };
  }, []);

  const handleSend = data => {
    wconn.send(JSON.stringify(data));
  };

  const processMessages = async items => {
    let mess = [];
    for (let message of items) {
      if (message.video) {
        user.favorite && user.favorite.length
          ? dispatch(saveFavorite([message, ...user.favorite]))
          : dispatch(saveFavorite([message]));
      }

      if (message.image && message.image.length) {
        let dirs = RNFetchBlob.fs.dirs;
        let base64Code = message.image.split('data:image/jpg;base64,'); //base64Image is my image base64 string
        const result = Math.random().toString(36).substring(2, 7);
        var path = dirs.DocumentDir + '/' + result + '.jpg';
        RNFetchBlob.fs.writeFile(path, base64Code[1], 'base64');
        message.image = 'file://' + path;
        mess = [...mess, message];
      } else {
        mess = [...mess, message];
      }
    }
    return mess;
  };
  const renderTooltip = (point, text, show) => {
    if (!show) {
      return null;
    }
    return (
      <View
        key={point}
        style={{
          marginLeft: 0,
          position: 'absolute',
          left: point.x < 6 ? 3 : width * 0.09,
          top:
            point.y < 11 ? point.y * hPoint + 20 : (point.y - 2) * hPoint - 30,
        }}>
        <View
          style={{
            height: '100%',
            width: width * 0.9,
            backgroundColor: '#444',
            borderRadius: 7,
          }}>
          <Text
            style={{
              color: '#fff',
              fontWeight: '800',
              fontSize: 20,
              justifyContent: 'center',
              textAlign: 'center',
              margin: 20,
            }}>
            {text}
          </Text>
        </View>

        <View
          style={{
            position: 'absolute',
            top: point.y < 11 ? -15 : null,
            bottom: point.y > 10 ? -15 : null,
            left:
              point.x > 7
                ? (point.x - 2) * wPoint - 7
                : (point.x - 1) * wPoint + 7,
            width: 0,
            height: 0,
            backgroundColor: 'transparent',
            borderStyle: 'solid',
            borderLeftWidth: 16,
            borderRightWidth: 16,
            borderBottomWidth: point.y < 11 ? 15 : null,
            borderTopWidth: point.y > 10 ? 15 : null,
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderBottomColor: '#444',
          }}
        />
      </View>
    );
  };
  const renderLesson = () => {
    let lessons = [
      {point: {x: 1, y: 1}, text: 'Сменить тему оформления', i: 0},
      {point: {x: 10, y: 1}, text: 'Открыть меню', i: 1},
      {point: {x: 9, y: 1}, text: 'Совершить звонок', i: 2},
      {point: {x: 1, y: 15}, text: 'Реклама', i: 3},
      {point: {x: 8, y: 15}, text: 'Начать новый чат', i: 4},
      {point: {x: 10, y: 15}, text: 'Найти собеседника', i: 5},
    ];
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onDismiss={() => {
          alert('Modal has been closed.');
        }}>
        <TouchableOpacity
          onPress={() => {
            if (current + 1 >= lessons.length) {
              setModalVisible(false);
              setCurrent(0);
            } else {
              setCurrent(current + 1);
            }
          }}
          style={{marginTop: 0, width, height, opacity: 1}}>
          <View>
            {lessons &&
              lessons.length > 0 &&
              lessons.map((item, index) =>
                renderTooltip(item.point, item.text, item.i === current),
              )}
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };
  const renderDeleteChatModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={deleteModalVisible}>
        <TouchableOpacity
          onPress={() => {
            setDeleteModalVisible(false);
          }}
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 0,
            width,
            height,
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
        visible={plusModalVisible}>
        <TouchableOpacity
          onPress={() => {
            setPlusModalVisible(false);
          }}
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 0,
            width,
            height,
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
                  navigation.navigate('NewGroup');
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
                  navigation.navigate('NewChat');
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
  const renderMenu = () => {
    let videoIcon = 'photo-camera';
    let message = noty;
    return (
      <View
        style={{
          position: 'absolute',
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignSelf: 'center',
          bottom: 120,
          zIndex: 999999999,
          width: width / 1.4,
          borderRadius: 50,
          height: 80,
          backgroundColor: '#555',
          opacity: 0.7,
        }}>
        <TouchableOpacity
          onPress={e => {
            setAnswered(true);
            setShowCall(false);
            InCallManager.stopRingtone();
            navigation.navigate('Call', {
              channel: message.data.channel,
              user_id: message.data.caller._id,
              video: false,
              isCaller: false,
            });
          }}
          style={{
            margin: 5,
            borderRadius: 50,
            padding: 15,
            backgroundColor: '#0b0',
            opacity: 1.5,
          }}>
          <Icon name={'mic'} size={40} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={e => {
            setAnswered(true);
            InCallManager.stopRingtone();
            setShowCall(false);
            navigation.navigate('Call', {
              channel: message.data.channel,
              user_id: message.data.caller._id,
              video: true,
              isCaller: false,
            });
          }}
          style={{
            margin: 5,
            borderRadius: 50,
            padding: 15,
            backgroundColor: '#0b0',
            opacity: 1.5,
          }}>
          <Icon name={videoIcon} size={40} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={e => {
            InCallManager.stopRingtone();
            setShowCall(false);
            handleSend({
              type: 'decline_call',
              call_id: message.data.channel,
            });
          }}
          style={{
            margin: 5,
            borderRadius: 50,
            padding: 15,
            backgroundColor: '#f00',
            opacity: 1.5,
          }}>
          <Icon name={'call-end'} size={40} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  };
  const onNotifeeMessageReceived = async message => {
    const channelId = await notifee.createChannel({
      id: 'cc678',
      name: 'cc678 Channel',
      importance: AndroidImportance.HIGH,
    });
    let title = '';
    let body = '';
    let android = {};

    if (
      message.data &&
      message.data.title &&
      message.data.title.includes('вызов')
    ) {
      setNoty(message);
      title = message.data.title;
      body = message.data.body;
      android = {
        channelId: channelId,
        pressAction: {
          launchActivity: 'default',
          id: 'Open',
        },
        actions: [
          {
            title: 'Принять',
            pressAction: {
              launchActivity: 'default',
              id: 'Accept',
            },
          },
          {
            title: 'Отклонить',
            pressAction: {
              launchActivity: 'default',
              id: 'Decline',
            },
          },
        ],
      };

      InCallManager.startRingtone('_DEFAULT_');
      notifee.displayNotification({
        id: message.messageId,
        title: title,
        body: body,
        data: message.data,
        android: android,
      });
      setTimeout(() => {
        if (!aRef.current) {
          handleSend({
            type: 'decline_call',
            call_id: message.data.channel,
          });
        } else {
          setAnswered(false);
        }

        setShowCall(false);
        notifee.cancelAllNotifications();
      }, 40000);
    } else {
      if (
        message.data &&
        message.data.title &&
        message.data.title.includes('Пропущен')
      ) {
        setAnswered(true);
        notifee.cancelAllNotifications();
        setShowCall(false);
        InCallManager.stopRingtone();
        notifee.displayNotification({
          id: message.messageId,
          title: 'Пропущенный вызов',
          body: '',
          data: message.data,
          android: {
            channelId: channelId,
          },
        });
      } else {
        title = message.notification.title;
        body = message.notification.body;
        android = {
          channelId: channelId,
        };
        notifee.displayNotification({
          id: message.messageId,
          title: title,
          body: body,
          data: message.data,
          android: android,
        });
      }
    }

    notifee.onForegroundEvent(async ({type, detail}) => {
      if (detail.pressAction.id) {
        if (detail.pressAction.id == 'Accept') {
          setAnswered(true);
          InCallManager.stopRingtone();
          navigation.navigate('Call', {
            channel: message.data.channel,
            user_id: message.data.caller._id,
            video: false,
            isCaller: false,
          });
        }
        if (detail.pressAction.id == 'Decline') {
          handleSend({
            type: 'decline_call',
            call_id: message.data.channel,
          });
          InCallManager.stopRingtone();
        }
        if (detail.pressAction.id == 'Open') {
          navigation.navigate('Main');
          setShowCall(true);
        }
      }
    });
    notifee.onBackgroundEvent(async ({type, detail}) => {
      if (detail.pressAction.id) {
        if (detail.pressAction.id == 'Accept') {
          setAnswered(true);
          InCallManager.stopRingtone();
          navigation.navigate('Call', {
            channel: message.data.channel,
            user_id: message.data.caller._id,
            video: false,
            isCaller: false,
          });
        }
        if (detail.pressAction.id == 'Decline') {
          handleSend({
            type: 'decline_call',
            call_id: message.data.channel,
          });

          InCallManager.stopRingtone();
          setShowCall(false);
        }
        if (detail.pressAction.id == 'Open') {
          navigation.navigate('Main');
          setShowCall(true);
        }
      }
    });
  };
  if (loading) {
    return (
      <View
        style={{
          ...{
            flex: 1,
            width: '100%',
            backgroundColor: colors[theme].color3,
            padding: 15,
            justifyContent: 'space-around',
          },
          ...{paddingTop: 40},
        }}>
        <Spinner />
      </View>
    );
  }
  if (showCall) {
    return (
      <View
        style={{
          backgroundColor: '#555',
          width: '100%',
          height: '100%',
        }}>
        <Text
          style={{
            color: '#fff',
            marginTop: 130,
            fontSize: 34,
            alignSelf: 'center',
            textAlign: 'center',
            fontWeight: '600',
          }}>
          {noty.data.title}
        </Text>
        {renderMenu()}
      </View>
    );
  }

  return (
    <Drawer
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      swipeEnabled={true}
      renderDrawerContent={() => {
        return (
          <Menu
            navigation={navigation}
            params={{
              onPop: () => {
                setModalVisible(true);
                setOpen(false);
              },
              close: () => {
                setOpen(false); 
              },
              type:"main"
            }}
          />
        );
      }}>
      <View
        style={{
          backgroundColor: colors[theme].color2,
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        {renderLesson()}
        {renderDeleteChatModal()}
        {renderPlusModal()}
        <HeaderText
          onPress={() => {
            let themes = ['main', 'dark', 'forest', 'beach'];
            let index = themes.indexOf(theme);
            if (index == 3) {
              dispatch(saveTheme(themes[0]));
            } else {
              dispatch(saveTheme(themes[index + 1]));
            }
          }}
          onPress2={() => {
            navigation.navigate('CallList');
          }}
          onPress3={() => {
            navigation.navigate('Main');
          }}
          onPress4={() => {
            setOpen(true);
          }}
          text={'Список чатов'}
          screen={'Main'}
        />
        <ScrollView style={{width: '100%'}}>
          {user && user.favorite && user.favorite.length > 0 && (
            <TouchableOpacity
              style={{backgroundColor: '#77b', width: '100%'}}
              onPress={() => navigation.navigate('FavoriteChat')}>
              <Text
                style={{
                  color: '#fff',
                  padding: 15,
                  fontSize: 20,
                  textAlign: 'center',
                  fontWeight: '600',
                }}>
                Избранное
              </Text>
            </TouchableOpacity>
          )}

          <Text
            style={{
              color: colors[theme].color1,
              fontWeight: '600',
              fontSize: 20,
              margin: 20,
            }}>
            Группы
          </Text>

          {groups &&
            users.length > 0 &&
            groups.map((item, index) => (
              <GroupItem
                key={item._id + item.name}
                onPress={() => {
                  navigation.navigate('Group', {group: item});
                }}
                removeChat={() => {
                  setDeleteModalVisible(true);
                  setDeleteType('group');
                  setCurrentChat(item);
                }}
                item={item}
              />
            ))}
          <Text
            style={{
              color: colors[theme].color1,
              fontWeight: '600',
              fontSize: 20,
              margin: 20,
            }}>
            Чаты
          </Text>
          {chats &&
            users.length > 0 &&
            chats
              .filter(i => !i.group_id || !i.group_id.length)
              .map((item, index) => (
                <ChatItem
                  key={item._id + item.name}
                  onPress={() => {
                    navigation.navigate('Chat', {id: item._id});
                    dispatch(read(item._id));
                  }}
                  removeChat={() => {
                    setDeleteModalVisible(true);
                    setDeleteType('chat');
                    setCurrentChat(item);
                  }}
                  item={item}
                />
              ))}
        </ScrollView>
        <View
          style={{
            width: '100%',
            height: 60,
            flexDirection: 'row',
            backgroundColor: colors[theme].color1,
            justifyContent: 'space-between',
            elevation: 4,
            shadowColor: colors[theme].color12,
            shadowOffset: {
              width: 0,
              height: 0,
            },
            shadowOpacity: 0.16,
            shadowRadius: 20,
          }}>
          <View
            style={{
              height: 70,
              marginLeft: 2,
              overflow: 'hidden',
            }}>
            <AppodealBanner
              style={{
                width: width - 130,
                marginVertical: 12,
                alignContent: 'stretch',
              }}
              adSize={'phone'}
              usesSmartSizing
            />
          </View>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={() => {
                setPlusModalVisible(true);
              }}
              style={{
                flexDirection: 'row',
                marginRight: 10,
                justifyContent: 'flex-start',
              }}>
              <Image
                key="plus_round"
                source={require('../../icons/plus_round.png')}
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
              onPress={() => navigation.navigate('Contacts')}
              //onPress={()=>setUpdate(!update)}
              style={{
                flexDirection: 'row',
                marginRight: 10,
                justifyContent: 'flex-start',
              }}>
              <Image
                key="search"
                source={require('../../icons/search.png')}
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
      </View>
    </Drawer>
  );
}

export default MainScreen;
