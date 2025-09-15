# React Navigation

- 모바일 앱은 단일 화면이 아닌 여러 화면으로 이루어져 있다.
- 화면 간 전환을 관리할 라이브러리가 필요하다.

- Navigation 라이브러리

  - React Natvigation: 가장 널리 사용되며, IOS와 Android에서 공통으로 사용 가능한 라이브러리
  - react-native-navigation: 네이티브 성능을 이끌어 내지만 초기 설정이 복잡한 라이브러리

- Navigation 종류

  - Tab Navigation
    - 화면 상단이나 하단의 탭으로 화면 전환
  - Stack Navigation
    - 새 화면을 한 겹씩 쌓아가는 방식으로 화면 전환
  - Drawer Navigation
    - 화면 왼쪽에 메뉴를 표시할 수 있는 Navigation
    - 제스처를 통해 측면에서 메뉴를 꺼내는 방식으로 화면 전환

보통 실제 앱에서는 Stack Navigation을 기본으로 하고, 그 안에 Tab Navigation이나 Drawer Navigation을 중첩해서 사용하는 경우가 많습니다.

---

# Stack Navigation

새 화면을 한 겹씩 쌓아가는 방식으로 화면을 전환하는 Navigation

```jsx
import { Button, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <Button title="Go to Notification" onPress={() => navigation.navigate('Notifications')} />
    </View>
  );
}

function NotificationsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
}

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}
```

---

# Tab Navigation

화면 상단이나 하단의 탭으로 화면을 전환하는 Navigation

```jsx
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 30 }}>Home</Text>
    </View>
  );
}

function settingsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 30 }}>Settings</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

function MyTab() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Settings" component={settingsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MyTab />
    </NavigationContainer>
  );
}
```

---

# Drawer Navigation

- 화면 왼쪽에 메뉴를 표시할 수 있는 Navigation
- 제스처를 통해 측면에서 메뉴를 꺼내는 방식으로 화면 전환

```jsx
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 30 }}>Home</Text>
    </View>
  );
}

function settingsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 30 }}>Settings</Text>
    </View>
  );
}

const Drawer = createDrawerNavigator();

function MyDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Settings" component={settingsScreen} />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MyDrawer />
    </NavigationContainer>
  );
}
```
