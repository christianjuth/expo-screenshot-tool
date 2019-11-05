import React, {Fragment, useEffect, useRef} from 'react';
import {Text, TouchableOpacity, StyleSheet, View, StatusBar as NativeStatusBar} from 'react-native';
import ViewShot from 'react-native-view-shot';
import axios from 'react-native-axios';
import devices from './devices';

import useInterval from './useInterval';
import FakeStatusbar from './FakeStatusbar';

import {StateProvider, StateContext, getState } from './state';
const SET_STATUSBAR_PROPS = 'SET_STATUSBAR_PROPS';
const SET_ENABLED = 'SET_ENABLED';
const SET_DEVICE = 'SET_DEVICE';
const END_CAPTURE = 'SET_CAPTURING';



export function Provider(props) {

  const initialState = {
    statusBarProps: {
      barStyle: 'default'
    },
    enabled: false,
    capturing: false,
    captureTimestamp: 0,
    device: {
      height: '100%',
      width: '100%'
    }
  }

  function reducer(state, action) {
    switch (action.type) {
      case SET_STATUSBAR_PROPS:
        return {
          ...state,
          statusBarProps: action.payload
        };
      case SET_ENABLED: 
        return {
          ...state,
          enabled: action.payload
        };
      case SET_DEVICE:
        return {
          ...state,
          device: action.payload,
          capturing: true
        };
      case END_CAPTURE:
        return {
          ...state,
          device: {
            height: '100%',
            width: '100%'
          },
          capturing: false
        }
      default:
        return state;
    }
  }

  return (
    <StateProvider initialState={initialState} reducer={reducer}>
      <ScreenshotEngine>
        {props.children}
      </ScreenshotEngine>
    </StateProvider>
  );
}



function ScreenshotEngine(props) {
  const screen = useRef(null);

  let [{
    device,
    enabled,
    capturing,
    statusBarProps,
  }, dispatch] = getState();

  async function capture({ deviceName, next, timestamp }) {
    screen.current.capture().then(uri => {
      axios.post('http://localhost:3030/save', {
        deviceName,
        file: uri,
        timestamp
      }).then(() => {
        next();
      });
    });
  }

  function startCapture() {
    const timestamp = Date.now();
    let queue = Object.keys(devices.ios)
    .map(name => {
      const device = devices.ios[name],
        { height, width} = device;

      return (next) => {
        dispatch({
          type: SET_DEVICE,
          payload: {
            height,
            width,
            hasNotch: device.hasNotch
          }
        });
        setTimeout(() => {
          capture({
            deviceName: name,
            timestamp,
            next
          });
        }, 1000);
      };
    });

    // last item in the que
    // should reset the screen
    queue.unshift(() => {
      dispatch({type: END_CAPTURE});
    });

    function dequeue(queue) {
      let fn = queue.pop();
      fn(() => {
        if(queue.length > 0){
          dequeue(queue);
        }
      });
    }
    dequeue(queue);
  }

  async function getStatus() {
    let status = true;
    try{
      await fetch('http://localhost:3030/status', {
        method: "get"
      });
    } catch(e) {
      status = false;
    } finally {
      return status;
    }
  }

  useInterval(async () => {
    let status = await getStatus();
    if(status != enabled) {
      dispatch({
        type: SET_ENABLED,
        payload: status
      });
    }
  }, 5000);

  let {height, width} = device;
  return enabled ? (
    <View style={styles.container}>
      <ViewShot style={{height, width}} ref={screen}>
        {props.children}
        {capturing ? <FakeStatusbar {...statusBarProps} hasNotch={device.hasNotch}/> : null}
        <TouchableOpacity
          style={capturing ? styles.hide : styles.button}
          onPress={startCapture}
        >
          <Text>Capture</Text>
        </TouchableOpacity>
      </ViewShot>
    </View>
  ) : props.children;
}


export function StatusBar(props) {
  let [, dispatch] = getState();

  useEffect(() => {
    dispatch({
      type: SET_STATUSBAR_PROPS,
      payload: props
    });
  }, [props.barStyle])

  return <NativeStatusBar {...props}/>
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center'
  },

  button: {
    height: 50,
    backgroundColor: '#0f0',
    alignItems: 'center',
    justifyContent: 'center'
  },

  hide: {
    display: 'none'
  }
});