import React, {useEffect, useState} from 'react';
import {Linking, Text, TouchableOpacity, View} from 'react-native';

import {useSelector} from 'react-redux';
import HeaderTitle from './../../components/HeaderTitle';
import colors from './../../components/styles';
import {get_user} from './../../api/userApi';

function Menu({navigation, params}) {
  const theme = useSelector(state => state.app.theme);
  const [role, setRole] = useState('');
  const user = useSelector(state => state.usr);

  useEffect(() => {
    get_user({phone: user.phone}).then(res => {
      setRole(res.data.user.role);
    });
  }, []);
  return (
    <View
      key={role}
      style={{
        backgroundColor: colors[theme].color2,
        width: '100%',
        height: '100%',
        alignSelf: 'stretch',
      }}>
      {params?.type == 'chat' && params?.chat?.type == 'group' && (
        <TouchableOpacity
          onPress={() => {
            navigation('/settings_chat', {state:{chat: params.chat}});
            params.close();
          }}
          style={{
            width: '100%',
            height: 55,
            backgroundColor: colors[theme].color5,
            flexDirection: 'row',
            elevation: 9,
            shadowColor: colors[theme].color12,
            shadowOffset: {
              width: 0,
              height: 0,
            },
            shadowOpacity: 0.36,
            shadowRadius: 20,
          }}>
          <Text
            style={{
              marginLeft: 30,
              color: colors[theme].color4,
              marginTop: 5,
              fontSize: 20,
              fontWeight: '500',
              overflow: 'hidden',
            }}>
            Настройки Чата
          </Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        onPress={() => {
          navigation('/settings');
          params.close();
        }}
        style={{
          width: '100%',
          height: 55,
          backgroundColor: colors[theme].color5,
          flexDirection: 'row',
          elevation: 9,
          shadowColor: colors[theme].color12,
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: 0.36,
          shadowRadius: 20,
        }}>
        <Text
          style={{
            marginLeft: 30,
            color: colors[theme].color4,
            marginTop: 5,
            fontSize: 20,
            fontWeight: '500',
            overflow: 'hidden',
          }}>
          Настройки
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          navigation('/profile');
          params.close();
        }}
        style={{
          width: '100%',
          height: 55,
          backgroundColor: colors[theme].color5,
          flexDirection: 'row',
          elevation: 9,
          shadowColor: colors[theme].color12,
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: 0.36,
          shadowRadius: 20,
        }}>
        <Text
          style={{
            marginLeft: 30,
            color: colors[theme].color4,
            marginTop: 5,
            fontSize: 20,
            fontWeight: '500',
            overflow: 'hidden',
          }}>
          Профиль
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation('/about');
          params.close();
        }}
        style={{
          width: '100%',
          height: 55,
          backgroundColor: colors[theme].color5,
          flexDirection: 'row',
          elevation: 9,
          shadowColor: colors[theme].color12,
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: 0.36,
          shadowRadius: 20,
        }}>
        <Text
          style={{
            marginLeft: 30,
            color: colors[theme].color4,
            marginTop: 5,
            fontSize: 20,
            fontWeight: '500',
            overflow: 'hidden',
          }}>
          Поддержать проект
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          Linking.openURL('https://dzen.ru/a/ZIXqRW1BgnT5Re_W');
        }}
        style={{
          width: '100%',
          height: 55,
          backgroundColor: colors[theme].color5,
          flexDirection: 'row',
          elevation: 9,
          shadowColor: colors[theme].color12,
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: 0.36,
          shadowRadius: 20,
        }}>
        <Text
          style={{
            marginLeft: 30,
            color: colors[theme].color4,
            marginTop: 5,
            fontSize: 20,
            fontWeight: '500',
            overflow: 'hidden',
          }}>
          О компании
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation('/faq');
          params.close();
        }}
        style={{
          width: '100%',
          height: 55,
          backgroundColor: colors[theme].color5,
          flexDirection: 'row',
          elevation: 9,
          shadowColor: colors[theme].color12,
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: 0.36,
          shadowRadius: 20,
        }}>
        <Text
          style={{
            marginLeft: 30,
            color: colors[theme].color4,
            marginTop: 5,
            fontSize: 20,
            fontWeight: '500',
            overflow: 'hidden',
          }}>
          Вопросы и поддержка
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
            params.close();
        }}
        style={{
          width: '100%',
          height: 55,
          backgroundColor: colors[theme].color5,
          flexDirection: 'row',
          elevation: 9,
          shadowColor: colors[theme].color12,
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: 0.36,
          shadowRadius: 20,
        }}>
        <Text
          style={{
            marginLeft: 30,
            color: colors[theme].color4,
            marginTop: 5,
            fontSize: 20,
            fontWeight: '500',
            overflow: 'hidden',
          }}>
          Закрыть меню
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default Menu;
