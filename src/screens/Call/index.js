import React, {useEffect} from 'react';
import {Dimensions, Text, View, TouchableOpacity, Image} from 'react-native';
import useState from 'react-usestateref';

import Icon from 'react-native-vector-icons/dist/MaterialIcons';

import colors from './../../components/styles';
import {useSelector} from 'react-redux';
import DeviceInfo from 'react-native-device-info';
import HeaderBack from './../../components/HeaderBack';

import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStream,
  mediaDevices,
} from 'react-native-webrtc-web-shim';
import {call, updateCall} from './../../api/userApi';
import InCallManager from 'react-native-incall-manager';

function Call({navigation, route}) {
  const {channel, user_id, video, isCaller, name} = route.params;
  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;
  const theme = useSelector(state => state.app.theme);
  const user = useSelector(state => state.usr);
  const [conn, setConn] = useState(new WebSocket('ws://45.9.43.60:3000/ws'));
  const [localStream, setLocalStream] = useState(null);
  const [ns, setNS] = useState(null);
  const [localStreamUrl, setLocalStreamUrl] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [remoteStreamUrl, setRemoteStreamUrl] = useState(null);

  const channelId = channel;
  const [ready, setReady] = useState(false);
  const [pc, setPc] = useState(null);
  const [answered, setAnswered, aRef] = useState(false);
  const [type, setType] = useState(video ? 'front' : 'disabled');
  const [micEnabled, setMicEnabled] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  let conv = {};

  let candidates = [];
  const [rCall, setRCall, rRef] = useState(null);
  const [remNs, setRemNs] = useState(null);
  const [remoteVideoState, setRemoteVideoState] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);

  const servers = {
    iceServers: [
      {
        urls: 'stun:stun.relay.metered.ca:80',
      },
      {
        urls: 'turn:a.relay.metered.ca:80',
        username: '1e8c4fbccdddedd224c7bee4',
        credential: 'ItnAweqvZxEutMq0',
      },
      {
        urls: 'turn:a.relay.metered.ca:80?transport=tcp',
        username: '1e8c4fbccdddedd224c7bee4',
        credential: 'ItnAweqvZxEutMq0',
      },
      {
        urls: 'turn:a.relay.metered.ca:443',
        username: '1e8c4fbccdddedd224c7bee4',
        credential: 'ItnAweqvZxEutMq0',
      },
      {
        urls: 'turn:a.relay.metered.ca:443?transport=tcp',
        username: '1e8c4fbccdddedd224c7bee4',
        credential: 'ItnAweqvZxEutMq0',
      },
    ],
  };
  let device_id = DeviceInfo.getUniqueId().then(device_id => {
    return device_id;
  });

  const processCandidates = () => {
    if (candidates.length < 1) {
      return;
    }
    candidates.map(candidate => pc.addIceCandidate(candidate));
    candidates = [];
  };

  const inviteToCall = async (recipient_id) => {
    let sessionConstraints = {
      mandatory: {
        OfferToReceiveAudio: true,
        OfferToReceiveVideo: true,
      },
    };

    pc.createOffer(sessionConstraints).then(offerDescription => {
      pc.setLocalDescription(offerDescription).then(() => {
        const offer = {
          sdp: offerDescription.sdp,
          type: offerDescription.type,
        };

        handleSend({
          type: 'offer',
          call_id: conv.channel_id,
          user_id: conv.id,
          recipient_id: conv.other_id,
          caller_id: conv.id,
          offer,
        });
      });
    });
  };

  useEffect(() => {
    let i1 = null;
    setTimeout(() => {
      if (!aRef.current) {
        if (rRef.current) {
          updateCall({
            ...rRef.current,
            status: 'stop_by_caller',
            channel: channelId,
          });
        }
        InCallManager.stop({busytone: '_DTMF_'});
        closeConnection();
      }
    }, 40000);
    if (answered) {
      InCallManager.stopRingback();
      InCallManager.stop();
      i1 = setInterval(function () {
       
          handleSend({
            type: 'ping',
            call_id: channelId,
            user_id: device_id._z,
            info: {
              download: 100,
              upload: 100,
            },
          });
      }, 2000);
    } else {
      InCallManager.start({media: 'audio', ringback: '_DTMF_'});
    }

    return () => {
      InCallManager.stopRingback();
      InCallManager.stop();
      clearInterval(i1);
    };
  }, [answered]);

  const joinCall = async offer => {
    const offerDescription = offer;
    let desc = new RTCSessionDescription(offerDescription);
    if (pc) {
      pc.setRemoteDescription(desc).then(() => {
        pc.createAnswer().then(answerDescription =>
          pc.setLocalDescription(answerDescription).then(() => {
            const answer = {
              type: answerDescription.type,
              sdp: answerDescription.sdp,
            };
            processCandidates();
            handleSend({
              type: 'answer',
              call_id: conv.channel_id,
              user_id: conv.id,
              recipient_id: conv.id,
              caller_id: conv.other_id,
              answer,
            });
          }),
        );
      });
    }
  };

  const handleAnswer = async answer => {
    try {
      if (pc && pc.localDescription) {
        const answerDescription = new RTCSessionDescription(answer);
        pc.setRemoteDescription(answerDescription);
        processCandidates();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleIce = async data => {
    let message = data.rtcMessage;
    if (pc.remoteDescription !== null) {
      pc.addIceCandidate(
        new RTCIceCandidate({
          candidate: message.candidate,
          sdpMid: message.id,
          sdpMLineIndex: message.label,
        }),
      );
    } else {
      candidates.push(
        new RTCIceCandidate({
          candidate: message.candidate,
          sdpMid: message.id,
          sdpMLineIndex: message.label,
        }),
      );
    }
  };

  const initLocalVideo = () => {
    mediaDevices
      .getUserMedia({
        audio: true,
        video: video
          ? {
              frameRate: 30,
              facingMode: 'user',
            }
          : false,
      })
      .then(local => {
        setLocalStream(local);
        setLocalStreamUrl(local.toURL());

        setRemoteStream(new MediaStream());
      });
  };

  const setPcEvents = () => {
    pc.ontrack = event => {
      remoteStream.addTrack(event.track, remoteStream);
      if (event.streams) {
        setRemoteStream(event.streams[0]);
        setRemoteStreamUrl(event.streams[0].toURL());
      }
    };

    pc.oniceconnectionstatechange = event => {
      if (!pc) {
        return;
      }
      switch (pc.iceConnectionState) {
        case 'connected':
          setAnswered(true);
          InCallManager.stop();
          break;

        case 'completed':
          setAnswered(true);
          InCallManager.stop();
          break;
        case 'disconnected':
          if (localStreamUrl) {
            closeConnection();
          }
          break;
        case 'closed':
          if (localStreamUrl) {
            closeConnection();
          }
          break;
      }
    };
    pc.onnegotiationneeded = () => {
      if (conv.other_id) {
        inviteToCall(conv.other_id);
      }
    };
    pc.onicecandidate = event => {
      if (event.candidate) {
        handleSend({
          type: 'ice',
          call_id: conv.channel_id,
          user_id: conv.id,
          sendTo: conv.other_id,
          rtcMessage: {
            label: event.candidate.sdpMLineIndex,
            id: event.candidate.sdpMid,
            candidate: event.candidate.candidate,
          },
        });
      }
    };
  };

  useEffect(() => {
    if (pc && localStream && remoteStream && !ready) {
      setReady(true);
      localStream.getTracks().forEach(track => {
        pc.addTrack(track, localStream);
      });
      setPcEvents();
      if (conn.readyState === 1) {
        handleSend({
          type: 'connect',
          call_id: channelId,
          user_id: device_id._z,
        });
      }
      conn.onopen = () => {
        handleSend({
          type: 'connect',
          call_id: channelId,
          user_id: device_id._z,
        });
      };
      conn.onmessage = msg => {
        let data;
        data = JSON.parse(msg.data);
        if (data.type == 'connect') {
          conv = {
            id: device_id._z,
            other_id: data.candidate,
            channel_id: channelId,
          };
          inviteToCall(data.candidate);
        }
        if (data.type == 'close') {
          closeConnectionOnMsg();
        }
        if (data.type == 'decline_call') {
          closeConnectionOnMsg();
        }
        if (data.type == 'offer') {
          conv = {
            id: device_id._z,
            other_id: data.caller_id,
            channel_id: channelId,
          };
          joinCall(data.offer);
        }
        if (data.type == 'answer') {
          handleAnswer(data.answer);
        }
        if (data.type == 'ping') {
          setRemNs(data.info);
        }
        if (data.type == 'type') {
          setRemoteVideoState(data.video);
        }
        if (data.type == 'ice') {
          handleIce(data);
        }
      };
    }
  }, [localStream, remoteStream, pc]);

  useEffect(() => {
    if (pc) {
      initLocalVideo();
    }
  }, [pc]);

  useEffect(() => {
    if (answered) {
      if (type === 'disabled') {
        handleSend({
          type: 'type',
          call_id: channelId,
          user_id: device_id._z,
          video: false,
        });
      } else {
        handleSend({
          type: 'type',
          call_id: channelId,
          user_id: device_id._z,
          video: true,
        });
      }
    }
  }, [type]);

  useEffect(() => {
    setPc(new RTCPeerConnection(servers));
    if (!user_id) {
      return [];
    }
    if (isCaller) {
      call({channelId, user_id: user_id._id, caller: user._id}).then(res => {
        setRCall(res.data.call);
      });
    }
  }, []);

  const handleSend = data => {
    conn.send(JSON.stringify(data));
  };

  const closeConnection = () => {
    if (rRef.current) {
      if (!aRef.current) {
        if (isCaller) {
          updateCall({
            ...rRef.current,
            status: 'stop_by_caller',
            channel: channelId,
          });
        }
      } else {
        updateCall({
          ...rRef.current,
          status: 'success_stop',
          channel: channelId,
        });
      }
    }
    handleSend({
      type: 'close',
      call_id: channelId,
      user_id: device_id._z,
    });
    if (localStream) {
      localStream.getTracks().forEach(t => t.stop());
      localStream.release();
      setLocalStream(null);
      setLocalStreamUrl(null);
    }
    if (remoteStream) {
      remoteStream.getTracks().forEach(t => t.stop());
      remoteStream.release();
      setRemoteStream(null);
    }
    if (pc) {
      pc.close();
      setPc(null);
    }
    conn.onopen = null;
    conn.onmessage = null;
    conn.close();
    conv = {};
    try {
      navigation.pop();
    } catch (err) {
      console.log(err);
    }
  };
  const closeConnectionOnMsg = () => {
    handleSend({
      type: 'close',
      call_id: channelId,
      user_id: device_id._z,
    });
    if (localStream) {
      localStream.getTracks().forEach(t => t.stop());
      localStream.release();
      setLocalStream(null);
      setLocalStreamUrl(null);
    }
    if (remoteStream) {
      remoteStream.getTracks().forEach(t => t.stop());
      remoteStream.release();
      setRemoteStream(null);
    }
    if (pc) {
      pc.close();
      setPc(null);
    }
    conn.onopen = null;
    conn.onmessage = null;
    conn.close();
    conv = {};
    try {
      navigation.pop();
    } catch (err) {
      console.log(err);
    }
  };

  const hideAndOpenCamera = () => {
    let isHideCam;
    localStream?.getVideoTracks().forEach(track => {
      track.enabled = !track.enabled;
      isHideCam = !track.enabled;
    });
  };

  const muteAndUnmute = async () => {
    localStream?.getAudioTracks().map(track => {
      track.enabled = !track.enabled;
    });
    setMicEnabled(!micEnabled);
    if (conv.other_id) {
      inviteToCall(conv.other_id);
    }
  };

  

  const upgrade = () => {
    if (conv.other_id) {
      inviteToCall(conv.other_id);
    }
  };

  const restartCamera = set => {
    let audio = set.audio;
    let video = set.video;
    localStream.getVideoTracks().forEach(t => t.stop());
    localStream.release();
    mediaDevices
      .getUserMedia({
        audio,
        video,
      })
      .then(local => {
        local.getTracks().forEach(track => {
          pc.addTrack(track, local);
        });
        upgrade();
        setLocalStream(local);
        setLocalStreamUrl(local.toURL());
      });
  };

  const changeVideo = () => {
    if (type == 'front') {
      setType('main');
      localStream.getVideoTracks().forEach(track => {
        track._switchCamera();
      });
    }
    if (type == 'main') {
      setType('disabled');
      restartCamera({audio: true, video: false});
    }
    if (type == 'disabled') {
      setType('front');
      restartCamera({
        audio: true,
        video: {
          frameRate: 30,
          facingMode: 'user',
        },
      });
    }
    if (type == 'display') {
      setType('front');
      restartCamera({
        audio: true,
        video: {
          frameRate: 30,
          facingMode: 'user',
        },
      });
    }
  };

  const renderStop = () => {
    return (
      <TouchableOpacity
        onPress={e => closeConnection()}
        style={{
          position: 'absolute',
          alignSelf: 'center',
          bottom: 36,
          zIndex: 999999999,
          borderRadius: 50,
          padding: 12,
          backgroundColor: '#c00',
        }}>
        <Icon name="call-end" size={36} color="#fff" />
      </TouchableOpacity>
    );
  };

  const renderNetwork = () => {
    return (
      <View
        style={{
          position: 'absolute',
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignSelf: 'center',
          top: 80,
          zIndex: 999999999,
          width: width,
          borderRadius: 3,
          backgroundColor: '#777',
          opacity: 0.8,
        }}>
        <View
          style={{
            opacity: 1.5,
            width: width,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              width: '50%',
              maxWidth: '50%',
              flexDirection: 'column',
              alignItems: 'center',
              alignContent: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{color: '#fff', fontSize: 15, margin: 5}}>Вы</Text>
            <Text
              style={{color: '#fff', fontSize: 13, margin: 5, marginTop: 0}}>
              Загрузка {ns.download}
            </Text>
            <Text
              style={{color: '#fff', fontSize: 13, margin: 5, marginTop: 0}}>
              Отправка {ns.upload}
            </Text>
          </View>
          <View
            style={{
              width: '50%',
              maxWidth: '50%',
              flexDirection: 'column',
              alignItems: 'center',
              alignContent: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{color: '#fff', fontSize: 15, margin: 5}}>
              Собеседник
            </Text>
            <Text
              style={{color: '#fff', fontSize: 13, margin: 5, marginTop: 0}}>
              Загрузка {remNs?.download}
            </Text>
            <Text
              style={{color: '#fff', fontSize: 13, margin: 5, marginTop: 0}}>
              Отправка {remNs?.upload}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderState = () => {
    return (
      <View
        style={{
          alignSelf: 'center',
          zIndex: 999999999,
          width: width,
          height: height - 70,
          borderRadius: 3,
          backgroundColor: '#fff',
          opacity: 1,
          flexDirection: 'column',
          alignItems: 'center',
          alignContent: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            width: '100%',
            flexDirection: 'column',
            alignItems: 'center',
            alignContent: 'center',
            justifyContent: 'center',
          }}>
          <Image
            key="logo"
            source={require('../../icons/sound.gif')}
            resizeMode="contain"
            style={{
              width: 101,
              alignSelf: 'center',
            }}
          />
        </View>
      </View>
    );
  };

  const renderMenu = () => {
    let color = '#66f';
    let videoIcon = 'photo-camera';
    if (type == 'front') {
      videoIcon = 'cameraswitch';
    }
    if (type == 'main') {
      videoIcon = 'no-photography';
      color = '#f00';
    }
    if (type == 'disabled' || type == 'display') {
      videoIcon = 'photo-camera';
      color = '#0b0';
    }
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
          height: 60,
          backgroundColor: '#555',
          opacity: 0.7,
        }}>
        <TouchableOpacity
          onPress={e => {
            muteAndUnmute();
          }}
          style={{
            margin: 5,
            borderRadius: 50,
            padding: 10,
            backgroundColor: micEnabled ? '#f00' : '#0b0',
            opacity: 1.5,
          }}>
          <Icon name={micEnabled ? 'mic-off' : 'mic'} size={30} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={e => {
            InCallManager.setSpeakerphoneOn(!isSpeaker);
            setIsSpeaker(!isSpeaker);
          }}
          style={{
            margin: 5,
            borderRadius: 50,
            padding: 10,
            backgroundColor: '#0b0',
            opacity: 1.5,
          }}>
          <Icon
            name={isSpeaker ? 'phone-in-talk' : 'campaign'}
            size={30}
            color="#fff"
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={e => changeVideo()}
          style={{
            margin: 5,
            borderRadius: 50,
            padding: 10,
            backgroundColor: color,
            opacity: 1.5,
          }}>
          <Icon name={videoIcon} size={30} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={e => {
              changeVideo();
          }}
          style={{
            margin: 5,
            borderRadius: 50,
            padding: 10,
            backgroundColor: type == 'display' ? '#f00' : '#0b0',
            opacity: 1.5,
          }}>
          <Icon
            name={type == 'display' ? 'stop-screen-share' : 'screen-share'}
            size={30}
            color="#fff"
          />
        </TouchableOpacity>
      </View>
    );
  };

  const renderMenuButton = () => {
    return (
      <View
        style={{
          position: 'absolute',
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignSelf: 'center',
          bottom: 120,
          zIndex: 999999999,
          width: width / 2.4,
          borderRadius: 50,
          backgroundColor: '#444',
          opacity: 0.6,
        }}>
        <TouchableOpacity
          onPress={e => {
            setShowMenu(true);
            setTimeout(() => {
              setShowMenu(false);
            }, 5000);
          }}
          style={{
            borderRadius: 50,
            opacity: 1.5,
            width: width / 2.4,
          }}>
          <Icon
            name={'keyboard-arrow-up'}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignSelf: 'center',
            }}
            size={60}
            color="#fff"
          />
        </TouchableOpacity>
      </View>
    );
  };

  if (!answered && isCaller) {
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
          Вызов...
        </Text>
        {renderStop()}
      </View>
    );
  }
  if (!answered && !isCaller) {
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
          Соединение ...
        </Text>
        {renderStop()}
      </View>
    );
  }
  return (
    <View
      style={{
        backgroundColor: colors[theme].color2,
        width: '100%',
        height: '100%',
      }}>
      <HeaderBack onPress={() => navigation.pop()} text={name} />
      {!remoteVideoState && renderState()}
      {remoteStreamUrl && (
        <View style={{width: width, height: height}}>
          <RTCView
            streamURL={remoteStreamUrl}
            style={{width: width, height: height}}
            zOrder={0}
            objectFit="cover"
          />
        </View>
      )}
     
      {ns && renderNetwork()}
      {renderStop()}
      {showMenu ? renderMenu() : renderMenuButton()}
    </View>
  );
}

export default Call;