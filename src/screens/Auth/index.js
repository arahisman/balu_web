import React, { useEffect, useState } from "react";
import { Spinner } from "../../components/Spinner";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { clearApp } from "../../redux/actions/appActions";
import {
  auth,
  check_code,
  check_phone_auth,
  check_phone_reg,
  is_user_exist,
  sign_up,
} from "../../api/userApi";
import { clearUser, saveUser } from "../../redux/actions/usrActions";

function Auth({ navigation }) {
  const width = 300;
  const height = 720;

  const dispatch = useDispatch();
  const user = useSelector((state) => state.usr);
  const [response, setResponse] = useState(null);
  const [localUser, setLocalUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [codeValid, setCodeValid] = useState(false);
  const [phone, setPhone] = useState("");
  const [notified, setNotified] = useState(false);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState("A");
  const [role, setRole] = useState("user");
  const [points, setPoints] = useState("0");
  const [err, setErr] = useState("");
  const [err2, setErr2] = useState("");
  const [type, setType] = useState("default");
  const selectFile = () => {
    var options = {
      title: "Select Image",
      customButtons: [
        {
          name: "customOptionKey",
          title: "Choose file from Custom Option",
        },
      ],
      storageOptions: {
        skipBackup: true,
        path: "images",
      },
    };
    /*
        ImagePicker.launchImageLibrary(options, async (res) => {
            if (!res["assets"][0]) {
                return;
            }

            setResponse(res);
            const result = await Image.compress(res.assets[0]["uri"], {
                maxWidth: 300,
                maxHeight: 300,
                quality: 0.3,
                returnableOutputType: "base64",
            });
            setPhoto(`data:image/jpeg;base64,${result}`);
        });
        */
  };
  const inputRange = [0, 1, 2];
  const outputRange = ["0%", "28%", "100%"];
  const [animatedWidth, setAnimatedWidth] = useState(null);
  const inputRange2 = [0, 1, 2];
  const outputRange2 = ["0%", "70%", "100%"];
  const [animatedWidth2, setAnimatedWidth2] = useState(null);
  const [photo, setPhoto] = useState("");
  const [redo, setRedo] = useState(false);
  const apiClient = () => {
    const apiClient = axios.create({
      baseURL: "http://45.9.43.60:3000",
    });

    return apiClient;
  };

  useEffect(() => {
    if (user.logged) {
      is_user_exist({ _id: user._id })
        .then((res) => {
          setLoading(false);
          return navigation.replace("Main");
        })
        .catch((err) => {
          if (!err.response) {
            console.log("redo");
            return setRedo(!redo);
          }
          if (err.response.status == 400) {
            setLoading(false);
            if (user.logged) {
              dispatch(clearApp());
              dispatch(clearUser());
            }
          }
        });
      //return navigation.replace("Main");
    }
  }, [user, redo]);

  const check_auth = (phone) => {
    check_phone_auth({ phone: "7" + phone })
      .then((res) => {
        setType("auth");
        if (res.status == 201) {
          setErr("");
          setCodeSent(true);
        } else {
        }
      })
      .catch((err) => {
        if (err.response.status == 421) {
          check_reg(phone);
        } else {
          err.response?.data?.message && setErr(err.response?.data?.message);
        }
      });
  };
  const check_reg = (phone) => {
    check_phone_reg({ phone: "7" + phone })
      .then((res) => {
        setType("reg");
        if (res.status == 201) {
          setErr("");
          setCodeSent(true);
        } else {
        }
      })
      .catch((err) => {
        if (err.response.status == 421) {
          check_auth(phone);
        } else {
          err.response?.data?.message && setErr(err.response?.data?.message);
        }
      });
  };

  const renderReg = () => {
    return (
      <div style={{ width: "100%", marginTop: 20 }}>
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            marginTop: 10,
            padding: 10,
          }}
        >
          <div
            style={{
              backgroundColor: "#444",
              height: 48,
              width: 90,
              padding: 5,
              marginTop: 2,
              borderRadius: 4,
              paddingBottom: 10,
            }}
          >
            <p style={{ color: "#ffffff", fontSize: 20, textAlign: "center" }}>
              Имя
            </p>
          </div>
          <input
            value={name}
            onChange={(t) => {
              setName(t.target.value);
            }}
            numberOfLines={1}
            maxLength={10}
            placeholder={"Пользователь"}
            placeholderTextColor={"#6b6a69"}
            style={{
              color: "#2b2a29",
              borderBottomWidth: 1,
              borderColor: "#444",
              marginLeft: 7,

              width: "100%",
              height: 50,
              fontSize: 20,
              fontWeight: "500",
            }}
          />
        </div>
        <div onPress={(e) => selectFile()}>
          {response?.assets ? (
            response?.assets.map(({ uri }) => (
              <div key={uri} style={styles.imageContainer}>
                <img
                  resizeMode="cover"
                  resizeMethod="scale"
                  style={{
                    width: width / 1.5,
                    height: width / 1.5,
                    borderRadius: width / 1.5,
                    marginTop: 25,
                    marginBottom: 100,
                    alignSelf: "center",
                    backgroundColor: "#eee",
                  }}
                  src={{ uri: uri }}
                />
              </div>
            ))
          ) : (
            <img
              key="photo"
              src={
                !photo.length
                  ? require("../../icons/photo.png")
                  : { uri: photo }
              }
              resizeMode="contain"
              style={{
                width: width / 1.5,
                height: width / 1.5,
                borderRadius: width / 1.5,
                marginTop: 25,
                marginBottom: 100,

                tintColor: "#444",
                alignSelf: "center",
                backgroundColor: "#eee",
              }}
            />
          )}
        </div>
      </div>
    );
  };

  const renderButtons = () => {
    if (type !== "default") {
      return (
        <div style={{ width: "100%" }}>
          <input
            value={code}
            onChange={(e) => {
              let t = e.target.value;
              setCode(t);
              if (t.length >= 3) {
                if (type == "auth") {
                  auth({ phone: "7" + phone, code: t })
                    .then((res) => {
                      if (res.status == 200) {
                        setErr2("");
                        setLocalUser(res.data.user);
                        setCodeValid(true);
                      } else {
                        setCodeValid(false);
                      }
                    })
                    .catch((err) => {
                      err.response?.data?.message &&
                        setErr2(err.response?.data?.message);
                    });
                }
                if (type == "reg") {
                  check_code({ phone: "7" + phone, code: t })
                    .then((res) => {
                      if (res.status == 200) {
                        setErr2("");
                        setCodeValid(true);
                      } else {
                        setCodeValid(false);
                      }
                    })
                    .catch((err) => {
                      err.response?.data?.message &&
                        setErr2(err.response?.data?.message);
                    });
                }
              }
            }}
            numberOfLines={1}
            keyboardType="numeric"
            maxLength={4}
            placeholder={"####"}
            placeholderTextColor={"#ffffff"}
            style={{
              width: "100%",
              height: 70,
              borderWidth: 0,
              backgroundColor: "#444",
              borderRadius: 8,
              justifyContent: "center",
              alignSelf: "center",
              zIndex: 7,
              marginTop: 30,
              elevation: 4,
              shadowColor: "#444",
              shadowOffset: {
                width: 0,
                height: 0,
              },
              shadowOpacity: 0.16,
              shadowRadius: 20,
              color: "#ffffff",
              fontSize: 40,
              textAlign: "center",
            }}
          />
          <p
            style={{
              color: "#f44",
              fontSize: 20,
              margin: 5,
              textAlign: "center",
            }}
          >
            {err2}
          </p>

          <div
            onPress={() => {
              if (!codeValid) {
                return null;
              }
              if (type == "auth") {
                return dispatch(saveUser({ ...localUser, logged: true }));
              }
              if (type == "reg") {
                if (!name.length || !photo.length) {
                  if (notified) {
                    return sign_up({
                      phone: "7" + phone,
                      code,
                      name: name || "&7" + phone,
                      photo: photo || "",
                      status: "A",
                      role: "user",
                      points: "0",
                    })
                      .then((res) => {
                        if (res.status == 201) {
                          setErr("");
                          dispatch(
                            saveUser({ ...res.data.user, logged: true })
                          );
                          navigation.replace("Main");
                        } else {
                        }
                      })
                      .catch((err) => {
                        err.response?.data?.message &&
                          setErr(err.response?.data?.message);
                      });
                  } else {
                    return setNotified(true);
                  }
                }
                sign_up({
                  phone: "7" + phone,
                  code,
                  name: name || "&7" + phone,
                  photo: photo || "",
                  status: "A",
                  role: "user",
                  points: "0",
                })
                  .then((res) => {
                    if (res.status == 201) {
                      setErr("");
                      dispatch(saveUser({ ...res.data.user, logged: true }));
                      navigation.replace("Main");
                    } else {
                    }
                  })
                  .catch((err) => {
                    err.response?.data?.message &&
                      setErr(err.response?.data?.message);
                  });
              }
            }}
            style={{
              width: "100%",
              height: 70,
              borderWidth: 0,
              backgroundColor: "#444",
              borderRadius: 8,
              justifyContent: "center",
              alignSelf: "center",
              zIndex: 7,
              marginTop: 30,
              elevation: 4,
              shadowColor: "#444",
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
                color: "#ffffff",
                fontSize: 29,
                justifyContent: "center",
                textAlign: "center",
                fontWeight: "800",
              }}
            >
              {"Начать Общение"}
            </p>
          </div>
          <div
            onPress={() => "https://dzen.ru/a/ZIXqRW1BgnT5Re_W"}
            style={{
              width: "100%",
              height: 65,
              borderWidth: 0,
              backgroundColor: "#444",
              borderRadius: 8,
              justifyContent: "center",
              alignSelf: "center",
              zIndex: 7,
              marginTop: 10,
              elevation: 4,
              shadowColor: "#444",
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
                color: "#ffffff",
                fontSize: 23,
                justifyContent: "center",
                textAlign: "center",
                fontWeight: "600",
              }}
            >
              {"Политика конфиденциальности"}
            </p>
          </div>
        </div>
      );
    }
    return (
      <div
        style={{
          width: 360,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <div
          onPress={() => {
            /*
            Animated.timing(animatedWidth, {
              toValue: width * 0.8,
              duration: 500,
              useNativeDriver: false,
            }).start();
            */
            /*
            Animated.timing(animatedWidth2, {
              toValue: width * 0,
              duration: 500,
              useNativeDriver: false,
            }).start(() => check_auth(phone));
            */
            check_auth(phone);
          }}
          style={{
            width: 300, //animatedWidth
            height: 70,
            marginRight: 10,
            borderWidth: 0,
            backgroundColor: "#444",
            borderRadius: 8,
            justifyContent: "center",
            alignSelf: "center",
            alignItems: "center",
            alignContent: "center",
            zIndex: 7,
            marginTop: 30,
            elevation: 4,
            shadowColor: "#444",
            shadowOffset: {
              width: 0,
              height: 0,
            },
            shadowOpacity: 0.16,
            shadowRadius: 20,
          }}
        >
          <p
            numberOfLines={1}
            style={{
              color: "#ffffff",
              overflow: "hidden",
              fontSize: 25,
              justifyContent: "center",
              textAlign: "center",
              fontWeight: "600",
            }}
          >
            {"Войти"}
          </p>
        </div>
        <div
          onPress={() => {
            /*
            Animated.timing(animatedWidth2, {
              toValue: width * 0.8,
              duration: 500,
              useNativeDriver: false,
            }).start();
            Animated.timing(animatedWidth, {
              toValue: width * 0,
              duration: 500,
              useNativeDriver: false,
            }).start(() => check_reg(phone));*/
            check_reg(phone);
          }}
          style={{
            width: 300, //animatedWidth
            height: 70,
            borderWidth: 0,
            backgroundColor: "#444",
            borderRadius: 8,
            justifyContent: "center",
            alignSelf: "center",
            alignItems: "center",
            alignContent: "center",
            zIndex: 7,
            marginTop: 30,
            elevation: 4,
            shadowColor: "#444",
            shadowOffset: {
              width: 0,
              height: 0,
            },
            shadowOpacity: 0.16,
            shadowRadius: 20,
          }}
        >
          <p
            numberOfLines={1}
            style={{
              color: "#ffffff",
              overflow: "hidden",
              fontSize: 25,
              justifyContent: "center",
              textAlign: "center",
              fontWeight: "600",
            }}
          >
            {"Зарегистрироваться"}
          </p>
        </div>
      </div>
    );
  };

  const renderTop = () => {
    if (notified) {
      return (
        <div
          style={{
            backgroundColor: "#444",
            width: "100%",
            height: 250,
            marginTop: 30,
            padding: 12,
            borderRadius: 8,
            elevation: 4,
            shadowColor: "#444",
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
              color: "#ffffff",
              fontSize: 20,
              fontWeight: "500",
            }}
          >
            В продолжение регистрации вы можете ввести ваше имя или никнейм, а
            так же выбрать фотографию.
          </p>
          <p
            style={{
              color: "#ffffff",
              fontSize: 20,
              marginTop: 10,
              fontWeight: "500",
            }}
          >
            Вы так же можете воздержаться от этих действий
          </p>
        </div>
      );
    }
    if (type !== "default") {
      return (
        <div
          style={{
            backgroundColor: "#444",
            width: "100%",
            height: 250,
            marginTop: 30,
            padding: 12,
            borderRadius: 8,

            elevation: 4,
            shadowColor: "#444",
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
              color: "#ffffff",
              fontSize: 20,
              fontWeight: "500",
            }}
          >
            В качестве кода авторизации, введите в поле ниже, пожалуйста, 4
            последние цифры номера, с которого вам позвонят в течении нескольких
            секунд.
          </p>
          <p
            style={{
              color: "#ffffff",
              fontSize: 20,
              marginTop: 10,
              fontWeight: "500",
            }}
          >
            Отвечать на звонок не нужно.
          </p>
        </div>
      );
    }

    return (
      <div
        style={{
          display:'flex',
          flexDirection:'row',
          width: 360,
          justifyContent:'space-between',
          backgroundColor: "#eee",
          height:'100%',
          alignSelf: "center",
          alignItems: "center",
        }}
      >
        
        <div
          style={{
            color: "#444",
            fontSize: 80,
            fontWeight: "bold",
            textAlign:'center',
            textShadowColor: "rgba(50,50,50, 0.15)",
            textShadowOffset: { width: -0.3, height: 0.3 },
            textShadowRadius: 10,
          }}
        >
          BALU
        </div>
        <img
          key="logo"
          src={require("../../icons/logo.png")}
          resizeMode="cover"
          style={{
            width: 100,
            height: 100,
            alignSelf: "center",
            tintColor: "#444",
            marginLeft: 10,
            marginBottom:10
          }}
        />
      </div>
    );
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          height: "100vh",
          backgroundColor: "#ffffff",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spinner />
      </div>
    );
  }

  return (
    <div
      style={{
        display:'flex',
        flexDirection:'column',
        justifyContent:'center',
        backgroundColor: "#eee",
        minHeight:'100vh',
        width: "100%",
      }}
    >
      <div  style={{
        display:'flex',
        flexDirection:'column',
        justifyContent:'center',
        alignContent:'center',
        width: 360,
        alignSelf: "center",
        alignItems: "center",
      }}>
      {renderTop()}
      <div
        style={{
          width: 360,
          display: "flex",
          flexDirection: "row",
          marginTop: 50,
          padding: 10,
        }}
      >
        <div
          style={{
            display:'flex',
            backgroundColor: "#444",
            height: 48,
            width: 40,
            borderRadius: 4,
            paddingRight:5,
            alignContent:'center',
            alignItems:'center',
            justifyContent:'center',
            justifyItems: 'center'
          }}
        >
          <div style={{ color: "#ffffff", fontSize: 25, textAlign: "center", alignSelf:'center' }}>
            +7
          </div>
        </div>
        <input
          value={phone}
          onChange={(e) => {
            let t = e.target.value;
            setPhone(t);
            setType("default");
            setCode("");
            /*
            animatedWidth.setValue(width * 0.8 * 0.3);
            animatedWidth2.setValue(width * 0.8 * 0.7);*/
          }}
          keyboardType="numeric"
          numberOfLines={1}
          maxLength={10}
          placeholder={"9991234567"}
          placeholderTextColor={"#6b6a69"}
          style={{
            color: "#2b2a29",
            borderWidth:0,
            borderBottomWidth: 1,
            borderRadius:3,
            borderColor: "#444",
            marginLeft: 7,
            width: 300,
            height: 46,
            fontSize: 24,
            paddingLeft:15,
            fontWeight: "500",
          }}
        />
      </div>
      <p
        style={{ color: "#f44", fontSize: 20, margin: 5, textAlign: "center" }}
      >
        {err}
      </p>

      {renderButtons()}
      {type == "reg" && renderReg()}
      </div>
      
    </div>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: "aliceblue",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 8,
  },
  imageContainer: {
    marginVertical: 24,
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
  },
};

export default Auth;
