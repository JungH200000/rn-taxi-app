# Style

## Inline Style

```jsx
import { Text, View } from 'react-native';

export default function App() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
      }}
    >
      <Text style={{ fontSize: 30, fontWeight: 'bold' }}>Hello React Native</Text>
    </View>
  );
}
```

## StyleSheet

```jsx
import { Text, View, StyleSheet } from 'react-native';

const App = () => (
  <View style={styles.container}>
    <Text style={styles.title}>React Native</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    felx: 1,
    padding: 24,
  },
  title: {
    marginTop: 16,
    borderWidth: 8,
    borderColor: '#20232a',
    borderRadius: 6,
    backgroundColor: '#61dafb',
    color: '#20232a',
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
  },
});

export default App;
```

---

# Flexbox

- 하위 Component가 Layout을 지정할 때 사용
- View가 상위 Component일 때만 사용 가능

- 안드로이드 환경으로 설정해서 예시 확인

```jsx
import React, { Component } from 'react';
import { View } from 'react-native';

export default class justifyContentBasics extends Component {
  render() {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column', // 주축이 세로
          //justifyContent: 'space-between', // 균형
          // justifyContent: 'flex-start', // 앞
          justifyContent: 'flex-end', // 끝
          //alignItems: 'center',
          //alignItems: 'flex-end',
          alignItems: 'stretch', // stretch: 사이즈에 꽉 채움
        }}
      >
        <View style={{ width: 50, height: 50, backgroundColor: 'powderblue' }} />
        <View style={{ width: 50, height: 50, backgroundColor: 'skyblue' }} />
        <View style={{ height: 50, backgroundColor: 'steelblue' }} />
      </View>
    );
  }
}
```

---

# List

## ScrollView

- 화면에서 스코롤되어야할 요소들을 배치한 View
- 화면에 보이지 않는 부분도 전부 렌더링

```jsx
import { Image, ScrollView, Text } from 'react-native';

const logo = {
  uri: 'https://reactnative.dev/img/tiny_logo.png',
  width: 32,
  height: 32,
};

const App = () => (
  <ScrollView>
    <Text style={{ fontSize: 20 }}>Scroll me</Text>
    <Image source={logo} />
    <Text style={{ fontSize: 20 }}>Scroll me</Text>
    <Image source={logo} />
    <Text style={{ fontSize: 20 }}>Scroll me</Text>
    <Image source={logo} />
    <Text style={{ fontSize: 20 }}>Scroll me</Text>
    <Image source={logo} />
    <Text style={{ fontSize: 20 }}>Scroll me</Text>
    <Image source={logo} />
    <Text style={{ fontSize: 20 }}>Scroll me</Text>
    <Image source={logo} />
    <Text style={{ fontSize: 20 }}>Scroll me</Text>
    <Image source={logo} />
    <Text style={{ fontSize: 20 }}>Scroll me</Text>
    <Image source={logo} />
    <Text style={{ fontSize: 20 }}>Scroll me</Text>
    <Image source={logo} />
    <Text style={{ fontSize: 20 }}>Scroll me</Text>
    <Image source={logo} />
    <Text style={{ fontSize: 20 }}>Scroll me</Text>
    <Image source={logo} />
    <Text style={{ fontSize: 20 }}>Scroll me</Text>
    <Image source={logo} />
    <Text style={{ fontSize: 20 }}>Scroll me</Text>
    <Image source={logo} />
    <Text style={{ fontSize: 20 }}>Scroll me</Text>
    <Image source={logo} />
    <Text style={{ fontSize: 20 }}>Scroll me</Text>
    <Image source={logo} />
    <Text style={{ fontSize: 20 }}>Scroll me</Text>
    <Image source={logo} />
    <Text style={{ fontSize: 20 }}>Scroll me</Text>
    <Image source={logo} />
    <Text style={{ fontSize: 20 }}>Scroll me</Text>
    <Image source={logo} />
    <Text style={{ fontSize: 20 }}>Scroll me</Text>
    <Image source={logo} />
    <Text style={{ fontSize: 20 }}>Scroll me</Text>
    <Image source={logo} />
    <Text style={{ fontSize: 20 }}>Scroll me</Text>
    <Image source={logo} />
    <Text style={{ fontSize: 20 }}>Scroll me</Text>
    <Image source={logo} />
    <Text style={{ fontSize: 20 }}>Scroll me</Text>
    <Image source={logo} />
  </ScrollView>
);

export default App;
```

### ListView - FlatList

- 단순한 리스트를 표현할 때 사용
- 화면에 보이는 부분만 렌더링

```jsx
import { FlatList, StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
  item: {
    padding: 5,
    fontSize: 15,
    height: 45,
  },
});

const FlatListBasics = () => {
  return (
    <View>
      <FlatList
        data={[
          { key: 'A' },
          { key: 'AB' },
          { key: 'ABC' },
          { key: 'ABCD' },
          { key: 'ABCDE' },
          { key: 'ABCD' },
          { key: 'ABC' },
          { key: 'AB' },
          { key: 'A' },
          { key: 'AB' },
          { key: 'ABC' },
          { key: 'ABCD' },
          { key: 'ABCDE' },
          { key: 'ABCD' },
          { key: 'ABC' },
          { key: 'AB' },
          { key: 'A' },
          { key: 'AB' },
          { key: 'ABC' },
          { key: 'ABCD' },
          { key: 'ABCDE' },
          { key: 'ABCD' },
          { key: 'ABC' },
          { key: 'AB' },
        ]}
        renderItem={({ item }) => <Text style={styles.item}>{item.key}</Text>}
      />
    </View>
  );
};

export default FlatListBasics;
```

### ListView - SectionList

```jsx
import { SectionList, StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: '#e0e0e0',
  },
  item: {
    padding: 5,
    fontSize: 15,
    height: 45,
  },
});

const SectionListBasics = () => {
  return (
    <View>
      <SectionList
        sections={[
          { title: 'A', data: ['Abc', 'zvxz', 'Dfqf'] },
          { title: 'B', data: ['qfbc', 'ht2rge', 'Dfqf'] },
          { title: 'C', data: ['baAc', 'adfgsdg123wz', 'Dfsagsqf'] },
          { title: 'D', data: ['wonb', 'zqqrn', 'Dfqf'] },
          { title: 'E', data: ['139gs', 'gwsfdgasgs', 'Dfasgsqf'] },
          { title: 'F', data: ['3hwnwt', 'g,p249', 'oozu2'] },
        ]}
        renderItem={({ item }) => <Text style={styles.item}>{item}</Text>}
        renderSectionHeader={({ section }) => <Text style={styles.sectionHeader}>{section.title}</Text>}
      />
    </View>
  );
};

export default SectionListBasics;
```
