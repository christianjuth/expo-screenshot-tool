import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Icon from './Icon';


export default function FakeStatusbar({barStyle, hasNotch = false}) {
  const color = barStyle == 'light-content' ? '#fff' : '#000';

  return hasNotch ? (
    <View style={[styles.container, {top: 10, left: 30, right: 30}]}>
      <View style={styles.left}>
        <Text style={[styles.time, {color}]}>12:00</Text>
      </View>
      <View style={styles.right}>
        <Icon name='wifi' color={color} size={17}></Icon>
        <Icon name='battery' color={color} size={17}></Icon>
      </View>
    </View>
  ) : (
    <View style={[styles.container, {top: 1, left: 3, right: 5}]}>
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
    height: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
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
  },

  right: {
    width: 100,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

});
