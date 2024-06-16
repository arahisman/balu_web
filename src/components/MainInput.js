import React, {useState} from 'react';
import {useSelector} from "react-redux";

export default MainInput = React.memo(
    ({
         value = '', error = 'v',
         onChangep,
         label,
         onPress,
         color = '#fff',
         backgroundColor = '#fff',
         placeholder = 'empty',
         theme = 'dark'
     }) => {
        const [focus, setFocus] = useState(false);
        const theme = useSelector((state) => state.app.theme);

        return (
            <div style={style.inputWrapper}>
                <div
                    style={{
                        ...style.inputContainer,
                        ...focus && {borderWidth: 2},
                        ...error.length && {borderColor: '#FF0000', borderWidth: 2}

                    }}>
                    <input
                        value={value}
                        onChange={onChangep}
                        numberOfLines={1}
                        placeholder={placeholder}
                        onFocus={() => {
                            setFocus(true)
                        }}
                        onBlur={() => {
                            setFocus(false)
                        }}
                        placeholderColor={theme == 'light' ? '#777777' : '#AAAAAA'}
                        style={
                            style.textInput
                        }
                    />

                </div>
                <p style={style.error}>{error}</p>
            </div>
        )
    }
);
