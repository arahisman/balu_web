import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Linking,
  Text,
  View,
  TextInput,
  ScrollView,
} from 'react-native';
import Button from '../../components/Button';
import colors from '../../components/styles';
import UserItem from './../../components/UserItem';
import {saveSponsors} from '../../redux/actions/appActions';
import {useDispatch, useSelector} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import HeaderBack from '../../components/HeaderBack';
import {
  add_sponsor,
  sponsors_list,
  delete_sponsors_list,
} from '../../api/newsApi';

function About() {
  const navigation = useNavigate()
  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;
  const [sponsors, setSponsors] = useState([]);
  const theme = useSelector(state => state.app.theme);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const user = useSelector(state => state.usr);
  const dispatch = useDispatch();

  useEffect(() => {
    sponsors_list().then(res => {
      setSponsors(res.data.qs);
      dispatch(saveSponsors(res.data.qs));
    });
  }, []);

  return (
    <View
      style={{
        backgroundColor: colors[theme].color2,
        width: '100%',
        height: '100%',
        alignSelf: 'stretch',
        alignItems: 'center',
      }}>
      <HeaderBack onClick={() => navigation(-1)} text="Наши спонсоры" />
      <ScrollView
        style={{
          width: '100%',
          height,
        }}>

        {sponsors.map((item, index) => (
          <UserItem key={index} user={user} item={item} index={index} />
        ))}
      </ScrollView>
      <View
        style={{
          width: '100%',
        }}>
        <Button
          onPress={() => Linking.openURL('https://donate.stream/nbs_wt')}
          text="Стать спонсором"
        />
      </View>
    </View>
  );
}

export default About;
