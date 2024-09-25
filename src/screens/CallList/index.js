import React, { useEffect, useState } from "react";
import { Dimensions, Text, TouchableOpacity, View, ScrollView } from "react-native";

import { useDispatch, useSelector } from "react-redux";
import HeaderBack from "./../../components/HeaderBack";
import colors from "./../../components/styles";
import { getCalls } from "./../../api/userApi";
import moment from "moment";
import { useNavigate } from "react-router-dom";
function CallList() {
    const navigation = useNavigate()
    const dispatch = useDispatch();
    const width = Dimensions.get("window").width;
    const height = Dimensions.get("window").height;
    const theme = useSelector((state) => state.app.theme);
    const user = useSelector((state) => state.usr);
    const [calls, setCalls] = useState([]);

    useEffect(() => {
        getCalls({user: user._id}).then((res) => {
            console.log(res.data.calls)
            setCalls(res.data.calls);
        });
    }, []);

    const secondsToDhms = (seconds) => {
      seconds = Number(seconds);
      var d = Math.floor(seconds / (3600 * 24));
      var h = Math.floor((seconds % (3600 * 24)) / 3600);
      var m = Math.floor((seconds % 3600) / 60);
      var s = Math.floor(seconds % 60);

      var dDisplay = d > 0 ? d + " д. " : "";
      var hDisplay = h > 0 ? h + " ч. " : "";
      var mDisplay = m > 0 ? m + " м. " : "";
      var sDisplay = !d > 0 && !h > 0 && !m > 0 && s > 0 ? s + " с. " : "";
      return dDisplay + hDisplay + mDisplay + sDisplay;
    }

    const renderCall = (item) => {
        let title = item.caller == user._id ? "Исходящий к " + item.name : "Входящий от " + item.callerName
        let status = item.status == 'success_stop' ? 'Завершен' : 'Пропущенный'
        let statusColor = item.status == 'success_stop' ? '#0b0' : '#b00'
        let start = new Date(item.start)
        let end = item.status == 'success_stop' ? new Date(item.end) : ''
        let time = ''
        let startTime = new moment(item.start).format("DD.MM  HH:mm:ss")
        title = title + '\n' + startTime
        console.log(startTime)
        if(item.status == 'success_stop'){
            time = secondsToDhms((end - start)/1000)
            console.log(time)
            status = status + "   -   " + time
        }
        return(
             <TouchableOpacity
                                    key={item._id}
                                    onPress={() => {

                                    }}
                                    style={{
                                        width: "100%",
                                        maxWidth:'100%',

                                        backgroundColor: colors[theme].color5,

                                        elevation: 9,
                                        shadowColor: colors[theme].color12,
                                        shadowOffset: {
                                            width: 0,
                                            height: 0,
                                        },
                                        shadowOpacity: 0.36,
                                        shadowRadius: 20,
                                    }}

                                ><Text
                                    style={{
                                        margin: 10,
                                        marginBottom:0,
                                        color: colors[theme].color4,
                                        fontSize: 20,
                                        fontWeight: "500",
                                        overflow: "hidden",
                                    }}
                                >
                                    {title}
                                </Text>
                                <Text
                                                                    style={{
                                                                        margin: 10,
                                                                        color: statusColor,
                                                                        fontSize: 20,
                                                                        fontWeight: "500",
                                                                        overflow: "hidden",
                                                                    }}
                                                                >
                                                                    {status}
                                                                </Text>
                                </TouchableOpacity>
        )
    }
    return (
        <ScrollView
            containerStyle={{
                backgroundColor: colors[theme].color2,
                width: "100%",
                height: "100%",
                alignSelf: "stretch",
            }}
        >
            <HeaderBack onClick={() => navigation(-1)} text="История звонков"/>

            {calls &&
                calls.length > 0 &&
                calls.sort((b, a)=> new Date(a.start).getTime() - new Date(b.start).getTime()).map((item, index) => renderCall(item))}
            <View style={{height:100}}></View>
        </ScrollView>
    );
}

export default CallList;

