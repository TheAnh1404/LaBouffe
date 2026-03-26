import { View, Text, FlatList } from 'react-native';

const foods = [
  { id: '1', name: 'Burger', price: '50.000đ' },
  { id: '2', name: 'Pizza', price: '120.000đ' },
  { id: '3', name: 'Trà sữa', price: '30.000đ' },
];

export default function HomeScreen() {
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
        ByteFood 🍔
      </Text>

      <FlatList
        data={foods}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{
            padding: 15,
            marginTop: 10,
            backgroundColor: '#eee',
            borderRadius: 10
          }}>
            <Text>{item.name}</Text>
            <Text>{item.price}</Text>
          </View>
        )}
      />
    </View>
  );
}