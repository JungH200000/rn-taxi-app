# 개념 간단히 학습 - rn01 ~ rn04

**[Expo Snack](https://snack.expo.dev/?platform=web)** 사이트는 별도의 설치 없이 **React Native**를 학습할 수 있는 환경을 제공

# JSX

JavaScript 내에 HTML과 유사한 XML 태그를 활용하여 UI를 선언하는 방식

```jsx
import { Text, View } from 'react-native';

const MyJSX = () => {
  const name = 'Maru';
  return (
    <View style={{ backgroundColor: '#fff000', flex: 0.3 }}>
      <Text>This is {name === 'Maru' ? 'Maru' : 'who?'}</Text>
      {name === 'Maru' ? <Text>'Maru'</Text> : <Text>'who?'</Text>}
      <Text>This is Closing Tag</Text>
      {
        // 태그 내에 commet 사용
      }
      {/** 태그 내에 commet 사용 */}
    </View>
  );
};

export default MyJSX;
```

---

# Props

상위 컴포넌트가 하위 컴포넌트로 데이터 전달하기 위해 사용하는 방법

```jsx
import { Text, View } from 'react-native';

const ChildComPN = (props) => {
  return (
    <View>
      <Text>Hellow, I am {props.name}</Text>
    </View>
  );
};

const ParentComPN = () => {
  return (
    <View>
      <ChildComPN name="Parent1" />
      <ChildComPN name="Parent2" />
    </View>
  );
};

export default ParentComPN;
```

---

# State

상황에 따라 변화하는 Component를 만들기 위해 사용하는 방법

```jsx
import React, { Component } from 'react';
import { Text, View } from 'react-native';

export default class App extends Component {
  state = {
    myState: 'It will change on clicking it',
  };
  updateState = () => this.setState({ myState: 'The state is updated' });
  render() {
    return (
      <View>
        <Text onPress={this.updateState} style={{ fontsize: 20 }}>
          {'\n'}
          {'\n'}
          {this.state.myState}
        </Text>
      </View>
    );
  }
}
```
