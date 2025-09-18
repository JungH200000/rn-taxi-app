// driverApp/src/Main_Setting.tsx
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, ParamListBase } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

function Main_Setting() {
  console.log('-- Main_Setting()');

  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();

  const onLogout = () => {
    AsyncStorage.removeItem('userId').then(() => {
      navigation.popToTop();
    });
  };
  const ChangeNickName = () => {
    navigation.navigate('NickName');
  };

  let arrSetMenu = [
    { id: 0, name: '닉네임 설정' },
    { id: 1, name: '로그아웃' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        style={{ width: '100%' }}
        data={arrSetMenu}
        renderItem={({ item, index }: { item: any; index: number }) => {
          console.log('row =' + JSON.stringify(item));
          if (item.id === 0) {
            return (
              <TouchableOpacity
                style={styles.container}
                onPress={ChangeNickName}
              >
                <Text style={styles.textForm}>{item.name}</Text>
              </TouchableOpacity>
            );
          } else if (item.id === 1) {
            return (
              <TouchableOpacity style={styles.container} onPress={onLogout}>
                <Text style={styles.textForm}>{item.name}</Text>
              </TouchableOpacity>
            );
          } else {
            return null;
          }
        }}
        keyExtractor={(item: any) => item.id}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textForm: {
    borderWidth: 1,
    borderColor: '#3498db',
    padding: 20,
    width: '100%',
    textAlign: 'center',
    color: '#3498db',
    marginBottom: 2,
  },
});

export default Main_Setting;
