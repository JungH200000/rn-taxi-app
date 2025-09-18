// driverApp/src/Main_Setting_NickName.tsx
import { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NickNameScreen = () => {
  const [nickName, setNickName] = useState('');
  const [inputNickName, setInputNickName] = useState('');

  useEffect(() => {
    const loadNickName = async () => {
      try {
        const storeNickName = await AsyncStorage.getItem('nickName');
        if (storeNickName !== null) {
          setNickName(storeNickName);
        }
      } catch (error) {
        console.error('Failed to load nickname', error);
      }
    };
    loadNickName();
  });

  const saveNickName = async () => {
    if (inputNickName === '') {
      Alert.alert('오류', '닉네임을 입력하세요.');
      return;
    }

    try {
      await AsyncStorage.setItem('nickName', inputNickName);
      setNickName(inputNickName);
      Alert.alert('성공', '닉네임이 저장되었습니다.');
    } catch (error) {
      console.error('Failed to save nickname.', error);
      Alert.alert('오류', '닉네임 저장을 실패했습니다.');
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="닉네임 입력"
          value={inputNickName}
          onChangeText={setInputNickName}
        />
        <TouchableOpacity style={styles.button} onPress={saveNickName}>
          <Text style={styles.buttonText}>저장</Text>
        </TouchableOpacity>
        <Text style={styles.text}>
          {nickName
            ? `현재 닉네임: ${nickName}`
            : '닉네임이 설정되지 않았습니다.'}
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default NickNameScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonDisable: {
    backgroundColor: 'gray',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  text: {
    color: 'black',
    fontSize: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderWidth: 2,
    borderColor: 'gray',
    marginVertical: 1,
    padding: 10,
  },
});
