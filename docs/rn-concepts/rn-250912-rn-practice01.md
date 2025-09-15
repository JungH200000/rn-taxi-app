# 250912 실습01

상단에는 "데이터 추가"라는 텍스트가 쓰여있는 버튼을 배치하고, 그 아래에는 비어있는 FlatList를 배치한다. 상단의 버튼을 누를 때마다, "아이템 1", "아이템 2"와 같은 방식으로 쓰여진 라인이 FlatList에 추가되도록 React Native 코드를 작성해본다.

## 내가 작성한 답안

```jsx
// app.js
import { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import FlatListComponent from './FlatListComponent';
/* 
import { ChildComponent } from './ChildComponent';
- 위 코드는 `export ChildComponent`로 내보냈을 때만 가능
- 현재 코드에서는 `export default ChildComponent`로 내보내고 있으므로 불 가능한 형태

export ChildComponent
- 파일에서 여러 개 내보낼 수 있고, 각각 고유한 이름을 가짐
- import할 때 반드시 내보낸 이름과 동일해야 함
*/
function newItems(n) {
  return `아이템 ${n + 1}`;
}

const App = () => {
  const [items, setItems] = useState([]);
  const handleClick = () => {
    const newArray = [...items, newItems(items.length)];
    setItems(newArray);
  };
  return (
    <View style={styles.container}>
      <Button title="데이터 추가" onPress={handleClick} />
      <FlatListComponent sendClickData={items} />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#e0e0e0ff',
  },
});
```

```jsx
// FlatListComponent.js
import { View, Text, FlatList, StyleSheet } from 'react-native';

const FlatListComponent = (props) => {
  return (
    <View style={styles.list}>
      <FlatList
        data={props.sendClickData}
        // 배열에 있는 요소 하나하나씩 item으로 이동동
        renderItem={({ item }) => <Text style={styles.listItem}>{item}</Text>}
      />
    </View>
  );
};

export default FlatListComponent;

const styles = StyleSheet.create({
  list: {
    padding: 15,
    margin: 10,
    backgroundColor: '#ffffff',
  },
  listItem: {
    padding: 15,
    margin: 5,
    backgroundColor: '#ffff00',
  },
});
```

## 모범 답안

```jsx
// app.js
import { useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';

let counter = 0;

const App = () => {
  const [data, setData] = useState([]);

  const addItem = () => {
    const newData = Array.from(data);
    counter++;
    const newItem = { key: String(counter), value: `아이템 ${counter}` };
    newData.push(newItem);
    setData(newData);
  };
  const renderItem = ({ item }) => (
    <View style={styles.listItem}>
      <Text>{item.value}</Text>
    </View>
  );
  return (
    <View style={styles.container}>
      <Button title="데이터 추가" onPress={addItem} />
      <FlatList data={data} renderItem={renderItem} keyExtracotr={(item) => item.key} />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  listItem: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#f9c2ff',
  },
});
```
