import React from "react";
import {useSelector} from "react-redux";
import colors from "./styles";

const HeaderBack = ({onPress, color = "#AAAAAA", p = "screen"}) => {
    const theme = useSelector((state) => state.app.theme);

    return (
        <div
            style={{
                width: "100%",
                height: 60,
                backgroundColor: colors[theme].color1,
                flexDirection: "row",
                alignItems:'center',
                alignContent:'center',
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
                onPress={onPress}
                style={{
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    zIndex: 9999,
                    width: 70,
                }}
            >
                <img
                    key='back'

                    src={require("../icons/BackArrow.png")}
                    resizeMode="cover"
                    style={{
                        width: 40,
                        height: 40,
                        marginRight: 20,
                        marginLeft: 10,
                        tintColor: colors[theme].color3,
                        alignSelf: "center",
                    }}
                />
            </div>
            <p
                style={{
                    color: colors[theme].color3,
                    fontWeight: "600",
                    fontSize: 20,
                    justifyContent: "center",
                    textAlign: "center",
                    margin:10,
                    position: 'absolute',
                    left: 0,
                    right: 0
                }}
            >
                {p}
            </p>
        </div>
    );
};

export default HeaderBack;

