# 조건부 렌더링

## 논리 연산 And (&&)

```jsx
import { View, Text, Button } from 'react-native';

const Card = ({ title, showButton }) => (
  <View>
    <Text style={{ fontSize: 30 }}>{title}</Text>
    {showButton && <Button title="Please, Press" />}
  </View>
);

export default function App() {
  return (
    <View>
      <Card title="Card-Title" showButton={false} />
      <Card title="Button for Card Title" showButton={true} />
    </View>
  );
}
```

## 조건 연산자 - 삼항 연산자

```jsx
import { View, Text, Button } from 'react-native';

const Card = ({ title, buttonTitle }) => (
  <View>
    <Text style={{ fontSize: 30 }}>{title}</Text>
    {buttonTitle ? <Button title={buttonTitle} /> : <Button title="false" />}
  </View>
);

export default function App() {
  return (
    <View>
      <Card title="Card-Title" />
      <Card title="Button for Card Title" buttonTitle="Press me" />
    </View>
  );
}
```

## if - else 구문

```jsx
import { View, Text, Button } from 'react-native';

const Card = ({ loading, error, title }) => {
  let content;

  if (error) {
    content = <Text style={{ fontSize: 24, color: 'red' }}>Error</Text>;
  } else if (loading) {
    content = <Text style={{ fontSize: 24, color: 'gray' }}>Loading...</Text>;
  } else {
    content = (
      <View>
        <Text style={{ fontSize: 60 }}>{title}</Text>
      </View>
    );
  }
  return <View style={{ padding: 24 }}>{content}</View>;
};

export default function App() {
  return (
    <View>
      <Card error={true} />
      <Card loading={true} />
      <Card loading={false} title="Title" />
    </View>
  );
}
```

---

# Component간 데이터 전달

## Props를 통한 데이터 전달

상위 Component에서 하위 Component로 property 전달 가능

하위 Component 작성을 위해 ChildComponent.js 파일 생성

```jsx
// ChildComponent.js
import { View, Text } from 'react-native';

const ChildComponent = (props) => {
  // props를 받음
  return (
    <View>
      <Text style={{ fontSize: 25 }}>Child Component</Text>
      <Text style={{ fontSize: 20 }}>Data from Parent: {props.data}</Text> // props에 있는 data를 꺼내 화면에 렌더링
    </View>
  );
};

export default ChildComponent;
```

```jsx
// app.js
import { View, Text } from 'react-native';
import ChildComponent from './ChildComponent';

export default function App() {
  const dataToPass = 'Hello from Parent';

  return (
    <View style={{ padding: 30 }}>
      <Text style={{ fontSize: 40 }}>Parent Component</Text>
      <ChildComponent data={dataToPass} /> // dataToPass 변수가 data라는 이름으로 ChildComponent로 넘겨지게 된다.
    </View>
  );
}
```

## 콜백(Callback) 함수를 통한 상호작용

- 하위 Component에서 상위 Component로 데이터 전달 가능 => 데이터를 역으로 전달 가능
- 상위 Component에서 Callback 함수를 정의하고 하위 Component에서 호출

```jsx
// app.js
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import ChildComponent from './ChildComponent';

const ParentComponent = () => {
  const [dataFromChild, setDataFromChild] = useState(null);
  // setA를 통해서 A 변수의 값을 바꾸게 되면 이 변화를 react-native가 감지
  const handleDataFromChild = (data) => {
    setDataFromChild(data);
  };
  return (
    <View style={{ padding: 20 }}>
      <Text>Parent Component</Text>
      <Text>Data from Child: {dataFromChild}</Text>
      <ChildComponent sendDataToParent={handleDataFromChild} />
    </View>
  );
};

export default ParentComponent;
```

```jsx
// ChildComponent.js
import { View, Text, TouchableOpacity } from 'react-native';

const ChildComponent = ({ sendDataToParent }) => {
  const dataToSend = 'Hello from Child';

  // Handler는 어떤 일이 발생했을 때 그 일을 처리할 것을 만들 때 Handler라는 이름을 많이 사용한다.
  const sendDataToParentHandler = () => {
    sendDataToParent(dataToSend);
    // [2] sendDataToParentHandler함수는 dataToSend라는 내용을 가지고 sendDataToParent라는 함수 실행
    // [3] sendDataToParent는 부모에게서 받은 함수
  };
  return (
    <View>
      <Text>Child Component</Text>
      <TouchableOpacity onPress={sendDataToParentHandler}>
        // [1] TouchableOpacity를 클릭 => sendDataToParentHandler함수 실행
        <Text>Send data to Parent</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChildComponent;
```

## Context API를 통한 데이터 공유

- Context를 생성하고 Context.Provider를 이용하여 데이터 공유
- 일종의 전역 상태를 관리한다. 즉, Context를 활용하여 데이터를 어디서든 주고받을 수 있게 만드는 것

```jsx
// app.js
import React, { createContext, useContext, useState } from 'react';
import { Text, View } from 'react-native';
import ChildComponent from './ChildComponent';

const MyContext = createContext();

const App = () => {
  const [data, setData] = useState('Hello from Context');

  return (
    <MyContext.Provider value={{ data, setData }}>
      <View style={{ flex: 1, padding: 30, alignItems: 'center' }}>
        <Text style={{ fontSize: 35, padding: 15 }}>Parent Component</Text>
        <ChildComponent />
      </View>
    </MyContext.Provider>
  );
};

export default App;
export { MyContext };
```

```jsx
// ChildComponent.js
import React, { useContext } from 'react';
import { View, Text, Button } from 'react-native';
import { MyContext } from './App';

const ChildComponent = () => {
  const { data, setData } = useContext(MyContext);

  const updateData = () => {
    setData('Updated data from Child');
  };

  return (
    <View>
      <Text style={{ fontSize: 20 }}>Child Component</Text>
      <Text style={{ fontSize: 30 }}>Data from Context : {data}</Text>
      <Button title="Update data" onPress={updateData} />
    </View>
  );
};

export default ChildComponent;
```

---

# 이벤트 처리

## ButtonComponent를 통한 이벤트 핸들링

- Button의 onPress를 활용

```jsx
// app.js
import React, { Component } from 'react';
import { Alert, Button, StyleSheet, View } from 'react-native';

export default class ButtonBasics extends Component {
  _onPressButton() {
    Alert.alert('You tapped the button!');
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.container}>
          <Button onPress={this._onPressButton} title="Press me" color="ff0000" />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 60,
  },
});
```

## Touchable Component를 통한 이벤트 핸들링

- TouchableHighlight : Android/IOS
- TouchableOpacity : Android/IOS
- TouchableWithoutFeedback : Android/IOS
- TouchableNativeFeedback : Android

## 텍스트 입력 및 키보드 이벤트 처리

### onChangeText 이벤트

```jsx
// app.js
import React, { useState } from 'react';
import { View, TextInput, Text, Keyboard, Button } from 'react-native';

const TextEntryScreen = () => {
  const [text, setText] = useState('');
  const [submittedText, setSubmittedText] = useState('');
  const handleTextChange = (newText) => {
    setText(newText);
  };
  const handleSubmit = () => {
    setSubmittedText(text);
    Keyboard.dismiss();
  };

  return (
    <View style={{ flex: 1, padding: 40, alignItems: 'center' }}>
      <Text>Enter Text : </Text>
      <TextInput
        style={{ width: 200, borderColor: 'gray', borderWidth: 1, padding: 5 }}
        placeholder="Type something..."
        onChangeText={handleTextChange}
        value={text}
      />
      <Text>You typed : {submittedText}</Text>
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

export default TextEntryScreen;
```
