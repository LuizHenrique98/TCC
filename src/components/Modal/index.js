import React, {useState} from 'react';
import {View, Text, Modal, StyleSheet, TouchableOpacity} from 'react-native';

export default function ModalComponent(params) {
  const [visivel, setVisivel] = useState(true);

  return (
    <View>
      <Modal animationType="slide" transparent={true} visible={visivel}>
        <View style={styles.modal}>
          <Text> {params.mensagem} </Text>
          <TouchableOpacity onPress={() => setVisivel(false)}>
            <Text>Ok</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 20,
    elevation: 10,
  },
});
