// taxiApp/src/Login.tsx
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { useNavigation, ParamListBase } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome';
import { TextInput } from 'react-native-gesture-handler';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './API';

function Login() {
  console.log('-- Login()');

  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();

  const [userId, setUserId] = useState('');
  const [userPw, setUserPw] = useState('');
  const [disable, setDisable] = useState(true);

  const onIdChange = (newId: string) => {
    // 새로운 ID 값(newId)과 현재 저장된 비밀번호 값(userPw)이 모두 비어있지 않다면 버튼 활성화, 둘 중 하나라도 비어있다면 버튼 비활성화
    newId && userPw ? setDisable(false) : setDisable(true);
    setUserId(newId); // 바뀐 newId 변수는 userId에 저장
  };

  const onPwChange = (newPw: string) => {
    newPw && userId ? setDisable(false) : setDisable(true);
    setUserPw(newPw);
  };

  const gotoRegister = () => {
    navigation.push('Register');
  };

  const onLogin = () => {
    api
      .login(userId, userPw)
      .then(response => {
        console.log('API login / data = ' + JSON.stringify(response.data[0]));
        let { code, message } = response.data[0];
        console.log('API login / code = ' + code + ', message = ' + message);

        if (code == 0) {
          gotoMain();
        } else {
          Alert.alert('오류', message, [
            {
              text: '확인',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
          ]);
        }
      })
      .catch(err => {
        console.log(JSON.stringify(err));
      });
  };

  const gotoMain = () => {
    AsyncStorage.setItem('userId', userId).then(() => {
      navigation.push('Main');
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Icon name="taxi" size={80} color={'#3498db'} />
      </View>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder={'ID'}
          onChangeText={onIdChange}
        />
        <TextInput
          style={styles.input}
          placeholder={'Password'}
          secureTextEntry={true}
          onChangeText={onPwChange}
        />
      </View>

      <View style={styles.container}>
        <TouchableOpacity
          style={disable ? styles.buttonDisable : styles.button}
          onPress={onLogin}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { marginTop: 5 }]}
          onPress={gotoRegister}
        >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  button: {
    width: '70%',
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonDisable: {
    width: '70%',
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
  input: {
    width: '70%',
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    marginVertical: 10,
    padding: 10,
  },
});

export default Login;
