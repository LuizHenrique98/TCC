import React from 'react';
import {View, Text, ActivityIndicator, Modal, StyleSheet} from 'react-native';

export default function LoadingModal(props) {
  return (
    <View>
      <Modal transparent={true} animationType="slide">
        <View style={styles.header}>
          <Text style={styles.text}> {props.text} </Text>
          <ActivityIndicator />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    elevation: 10,
    margin: 20,
    marginTop: 200,
    backgroundColor: '#f8f8ff',
    borderRadius: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
});
