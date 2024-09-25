import React, { useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  Modal,
  Dimensions,
  TextInput,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import colors from "./../../components/styles";
import CalendarPicker from "react-native-calendar-picker";



const RenderEvent = (
  showEventModal,
  setShowEventModal,
  newEvent,
  error,
  setError,
  setNewEvent
) => {
  const width = Dimensions.get("window").width;
  const height = Dimensions.get("window").height;
  const chats = useSelector((state) => state.chats.chats);
  const theme = useSelector((state) => state.app.theme);
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [description, setDescription] = useState(newEvent.description || "");
  const [startDate, setStartDate] = useState(newEvent.endDate);
  const [endDate, setEndDate] = useState(newEvent.endDate);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showEventModal}
      onDismiss={() => {}}
    >
      <TouchableOpacity
        onPress={() => {
          setShowEventModal(false);
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
            borderWidth: 6,
            borderColor: "#ddd",
            alignSelf: "center",
            marginTop: 30,
            width: 500,
            height: 800,
            backgroundColor: "#fff",
            overflow: "scroll",
          }}
        >
          <Text
            style={{
              color: "#777",
              fontSize: 31,
              fontWeight: "800",
              textAlign: "center",
            }}
          >
            Новое событие
          </Text>
          <TextInput
            defaultValue={name}
            onChangeText={(t) => {
              setName(t);
            }}
            numberOfLines={1}
            placeholder={"Название..."}
            placeholderTextColor={"#6b6a69"}
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
          <TextInput
            defaultValue={description}
            onChangeText={(t) => {
              setDescription(t);
            }}
            numberOfLines={1}
            placeholder={"Описание..."}
            placeholderTextColor={"#6b6a69"}
            style={{
              width: "100%",
              padding: 10,
              color: colors[theme].color8,
              borderBottomWidth: 2,
              borderColor: colors[theme].color6,
              marginBottom: 20,
              fontSize: 22,
              fontWeight: "600",
            }}
          />
          <CalendarPicker
            startFromMonday={true}
            initialDate={new Date()}
            weekdays={["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"]}
            months={[
              "Январь",
              "Февраль",
              "Март",
              "Апр",
              "Май",
              "Июнь",
              "Июль",
              "Август",
              "Сентябрь",
              "Октябрь",
              "Ноябрь",
              "Декабрь",
            ]}
            width={500}
            firstDay={1}
            minDate={new Date()}
            previousTitle={"Назад"}
            nextTitle={"Вперед"}
            previousTitleStyle={{
              color: "#444",
              fontSize: 16,
              fontWeight: "800",
            }}
            nextTitleStyle={{
              color: "#444",
              fontSize: 16,
              fontWeight: "800",
            }}
            monthTitleStyle={{
              color: "#444",
              fontSize: 18,
              fontWeight: "500",
            }}
            yearTitleStyle={{
              color: "#444",
              fontSize: 18,
              fontWeight: "500",
            }}
            allowRangeSelection
            selectYearTitle={"Выберите год"}
            selectMonthTitle={"Выберите месяц"}
            onDateChange={(d, b) => {
              if (b == "START_DATE") {
                setStartDate(d);
              } else {
                setEndDate(d);
              }
            }}
          />

          <TouchableOpacity
            style={{
              backgroundColor: "#555",
              marginTop: 15,
              borderRadius: 20,
              width: "90%",
              alignSelf: "center",
            }}
            onPress={() => {
              /*DateTimePickerAndroid.open({
                value: newEvent.startTime
                  ? new Date(newEvent.startTime)
                  : new Date(),
                mode: "time",
                is24Hour: true,
                onChange: (t) => {
                  setStartTime(t.nativeEvent.timestamp);
                },
              });*/
              //setShowTime(true)
            }}
          >
            <Text
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
              {startTime
                ? new Date(startTime).toLocaleTimeString()
                : "Время начала"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: "#555",
              marginTop: 15,
              borderRadius: 20,
              width: "90%",
              alignSelf: "center",
            }}
            onPress={() => {
              /*DateTimePickerAndroid.open({
                value: newEvent.endTime
                  ? new Date(newEvent.endTime)
                  : new Date(),
                mode: "time",
                is24Hour: true,
                onChange: (u) => {
                  setEndTime(u.nativeEvent.timestamp);
                },
              });*/
              //setShowTime(true)
            }}
          >
            <Text
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
              {endTime
                ? new Date(endTime).toLocaleTimeString()
                : "Время окончания"}
            </Text>
          </TouchableOpacity>
          <Text
            style={{
              color: "#f44",
              fontSize: 20,
              fontWeight: "600",
              textAlign: "center",
            }}
          >
            {error}
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              marginTop: 25,
            }}
          >
            <TouchableOpacity
              style={{ backgroundColor: "#f66", borderRadius: 20 }}
              onPress={() => {
                setShowEventModal(false);
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  padding: 7,
                  fontSize: 18,
                  marginBottom: 6,
                }}
              >
                Отменить
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ backgroundColor: "#66f", borderRadius: 20 }}
              onPress={() => {
                let err = "";
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
                    err = "Не выбрано время события";
                  }
                  if (!startDate || !startDate.toString().length) {
                    err = "Не выбрана дата/даты события";
                  }
                  if (!name || !name.length) {
                    err = "Название не заполнено";
                  }
                  if (!description || !description.length) {
                    err = "Описание не заполнено";
                  }
                  setError(err);
                } else {
                  setError("");
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
                  setShowEventModal(false);
                }
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  padding: 7,
                  fontSize: 18,
                  marginBottom: 6,
                }}
              >
                Сохранить
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default RenderEvent;
