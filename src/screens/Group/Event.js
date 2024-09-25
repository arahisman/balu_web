import React, { useState } from 'react';

import Modal from "@mui/material/Modal";

import { useSelector, useDispatch } from 'react-redux';
import colors from './../../components/styles';

const RenderEvent = (
  showEventModal,
  setShowEventModal,
  newEvent,
  error,
  setError,
  setNewEvent,
  update_group,
  updateGroup,
  group,
  events, setEvents
) => {
  const dispatch = useDispatch();
  const width = 300
  const height = 300
  const theme = useSelector(state => state.app.theme);
  const [name, setName] = useState('');
  const [description, setDescription] = useState(newEvent.description || '');
  const [startDate, setStartDate] = useState(newEvent.endDate);
  const [endDate, setEndDate] = useState(newEvent.endDate);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showEventModal}
      onDismiss={() => {
      }}>
      <div
        onPress={() => {
          setShowEventModal(false);
        }}
        style={{
          marginTop: 0,
          width,
          height,
          backgroundColor: 'rgba(255,255,255,0.5)',
        }}>
        <div
          activeOpacity={1}
          style={{
            borderRadius: 10,
            borderWidth: 6,
            borderColor: '#ddd',
            alignSelf: 'center',
            marginTop: 30,
            width: width / 1.1,
            height: height / 1.1,
            backgroundColor: '#fff',
          }}>
          <div
            style={{
              color: '#777',
              fontSize: 31,
              fontWeight: '800',
              textAlign: 'center',
            }}>
            Новое событие
          </div>
          <input
            defaultValue={name}
            onChangeText={t => {
              setName(t);
            }}
            numberOfLines={1}
            placeholder={'Название...'}
            placeholderTextColor={'#6b6a69'}
            style={{
              width: '100%',
              padding: 10,
              color: colors[theme].color8,
              borderBottomWidth: 2,
              borderColor: colors[theme].color6,
              marginTop: 20,
              marginBottom: 20,
              fontSize: 22,
              fontWeight: '600',
            }}
          />
          <input
            defaultValue={description}
            onChangeText={t => {
              setDescription(t);
            }}
            numberOfLines={1}
            placeholder={'Описание...'}
            placeholderTextColor={'#6b6a69'}
            style={{
              width: '100%',
              padding: 10,
              color: colors[theme].color8,
              borderBottomWidth: 2,
              borderColor: colors[theme].color6,
              marginBottom: 20,
              fontSize: 22,
              fontWeight: '600',
            }}
          />
         //CalendarPicker
          <div
            style={{
              backgroundColor: '#555',
              marginTop: 15,
              borderRadius: 20,
              width: '90%',
              alignSelf: 'center',
            }}
            onPress={() => {
             /* DateTimePickerAndroid.open({
                value: newEvent.startTime
                  ? new Date(newEvent.startTime)
                  : new Date(),
                mode: 'time',
                is24Hour: true,
                onChange: t => {
                  setStartTime(t.nativeEvent.timestamp);
                },
              });
              */
              //setShowTime(true)
            }}>
            <div
              style={{
                color: '#fff',
                padding: 7,
                fontSize: 18,
                marginBottom: 6,
                textAlign: 'center',
                alignSelf: 'center',
                fontWeight: '600',
              }}>
              {startTime
                ? new Date(startTime).toLocaleTimeString()
                : 'Время начала'}
            </div>
          </div>

          <div
            style={{
              backgroundColor: '#555',
              marginTop: 15,
              borderRadius: 20,
              width: '90%',
              alignSelf: 'center',
            }}
            onPress={() => {
              /*DateTimePickerAndroid.open({
                value: newEvent.endTime
                  ? new Date(newEvent.endTime)
                  : new Date(),
                mode: 'time',
                is24Hour: true,
                onChange: u => {
                  setEndTime(u.nativeEvent.timestamp);
                },
              });*/
              //setShowTime(true)
            }}>
            <div
              style={{
                color: '#fff',
                padding: 7,
                fontSize: 18,
                marginBottom: 6,
                textAlign: 'center',
                alignSelf: 'center',
                fontWeight: '600',
              }}>
              {endTime
                ? new Date(endTime).toLocaleTimeString()
                : 'Время окончания'}
            </div>
          </div>
          <div
            style={{
              color: '#f44',
              fontSize: 20,
              fontWeight: '600',
              textAlign: 'center',
            }}>
            {error}
          </div>
          <div
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginTop: 25,
            }}>
            <div
              style={{backgroundColor: '#f66', borderRadius: 20}}
              onPress={() => {
                setShowEventModal(false);
              }}>
              <div
                style={{
                  color: '#fff',
                  padding: 7,
                  fontSize: 18,
                  marginBottom: 6,
                }}>
                Отменить
              </div>
            </div>
            <div
              style={{backgroundColor: '#66f', borderRadius: 20}}
              onPress={() => {
                let err = '';
                if (
                  !startTime ||
                  !startTime.toString().length ||
                  !startDate ||
                  !startDate.toString().length ||
                  !name ||
                  !name.length ||
                  !description ||
                  !description.length
                ) {
                  if (!startTime || !startTime.toString().length) {
                    err = 'Не выбрано время события';
                  }
                  if (!startDate || !startDate.toString().length) {
                    err = 'Не выбрана дата/даты события';
                  }
                  if (!name || !name.length) {
                    err = 'Название не заполнено';
                  }
                  if (!description || !description.length) {
                    err = 'Описание не заполнено';
                  }
                  setError(err);
                } else {
                  setError('');
                  setNewEvent({
                    name,
                    description,
                    startTime,
                    endTime,
                    startDate,
                    endDate,
                    saved: true,
                    id: new Date().toString(),
                    subEvents: [],
                  });
                  update_group({
                    ...group,
                    events: [
                      ...group.events,
                      {
                        name,
                        description,
                        startTime,
                        endTime,
                        startDate,
                        endDate,
                        saved: true,
                        id: new Date().toString(),
                        subEvents: [],
                      },
                    ],
                  });
                  dispatch(
                    updateGroup({
                      ...group,
                      events: [
                        ...group.events,
                        {
                          name,
                          description,
                          startTime,
                          endTime,
                          startDate,
                          endDate,
                          saved: true,
                          id: new Date().toString(),
                          subEvents: [],
                        },
                      ],
                    }),
                  );
                  setEvents([...events, {
                    name,
                    description,
                    startTime,
                    endTime,
                    startDate,
                    endDate,
                    saved: true,
                    id: new Date().toString(),
                    subEvents: [],
                  }])
                  setShowEventModal(false);
                }
              }}>
              <div
                style={{
                  color: '#fff',
                  padding: 7,
                  fontSize: 18,
                  marginBottom: 6,
                }}>
                Создать
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default RenderEvent;
