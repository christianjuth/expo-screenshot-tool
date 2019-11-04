import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Icon from './Icon';


export default function FakeStatusbar({barStyle}) {
  const color = barStyle == 'light-content' ? '#fff' : '#000';

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text style={[styles.text, {color}]}><Text style={styles.elipse}></Text> Carrier </Text>
        <Icon name='wifi' color={color} size={17}></Icon>
      </View>
      <Text style={[styles.time, {color}]}>12:00 AM</Text>
      <View style={styles.right}>
        <Icon name='battery' color={color} size={17}></Icon>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    padding: 3,
    height: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    // top: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    // backgroundColor: '#eee'
  },

  text: {
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '400'
  },

  time: {
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '500'
  },

  elipse: {
    opacity: 0.3,
    fontSize: 16,
    letterSpacing: -1,
    fontWeight: '800',
  },

  left: {
    flexDirection: 'row',
    width: 100,
    paddingLeft: 1
  },

  right: {
    width: 100,
    alignItems: 'flex-end',
    paddingRight: 3
  },

});
