import React from "react";
import colors from "./styles";
import {useSelector} from "react-redux";

const Button = ({onPress, p = "screen"}) => {
    const theme = useSelector((state) => state.app.theme);

    return (
        <div
            onPress={onPress}
            style={{
                width: "80%",
                height: 40,
                borderWidth: 0,
                backgroundColor: colors[theme].color1,
                borderRadius: 30,
                justifyContent: "center",
                alignSelf: "center",
                zIndex: 7,
                marginTop: 15,
                marginBottom: 15,
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
            <p
                style={{
                    color: colors[theme].color3,
                    fontSize: 25,
                    fontWeight:'800',
                    justifyContent: "center",
                    textAlign: "center",
                }}
            >
                {p}
            </p>
        </div>
    );
};

export default Button;

