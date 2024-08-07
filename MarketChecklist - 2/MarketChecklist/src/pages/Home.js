import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';

const { width } = Dimensions.get('window');

const Home = () => {
  const [newItem, setNewItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [items, setItems] = useState([]);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const loadItems = async () => {
      try {
        const storedItems = await AsyncStorage.getItem('items');
        if (storedItems) {
          setItems(JSON.parse(storedItems));
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadItems();
  }, []);

  const addItem = async () => {
    if (newItem.trim() === '' || quantity.trim() === '') {
      alert("Por favor, insira um nome e quantidade para o item.");
      return;
    }

    if (editId) {
      const updatedItems = items.map(item =>
        item.id === editId ? { ...item, name: newItem, quantity } : item
      );
      setItems(updatedItems);
      setEditId(null);
      await AsyncStorage.setItem('items', JSON.stringify(updatedItems));
    } else {
      const id = new Date().getTime().toString();
      const newItemObject = { id, name: newItem, quantity, bought: false };
      const updatedItems = [...items, newItemObject];
      setItems(updatedItems);
      await AsyncStorage.setItem('items', JSON.stringify(updatedItems));
    }

    setNewItem('');
    setQuantity('');
  };

  const editItem = (id) => {
    const itemToEdit = items.find(item => item.id === id);
    setNewItem(itemToEdit.name);
    setQuantity(itemToEdit.quantity);
    setEditId(id);
  };

  const deleteItem = async (id) => {
    const updatedItems = items.filter(item => item.id !== id);
    setItems(updatedItems);
    await AsyncStorage.setItem('items', JSON.stringify(updatedItems));
  };

  const toggleBought = async (id) => {
    const updatedItems = items.map(item => {
      if (item.id === id) {
        return { ...item, bought: !item.bought };
      }
      return item;
    });
    setItems(updatedItems);
    await AsyncStorage.setItem('items', JSON.stringify(updatedItems));
  };

  const unboughtItems = items.filter(item => !item.bought);
  const boughtItems = items.filter(item => item.bought);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Lista de Compras:</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, styles.inputHalf]}
            placeholder="Item"
            value={newItem}
            onChangeText={setNewItem}
          />
          <TextInput
            style={[styles.input, styles.inputHalf]}
            placeholder="Quantidade"
            value={quantity}
            onChangeText={setQuantity}
          />
        </View>
        <Button title={editId ? "Atualizar item" : "Adicionar item"} onPress={addItem} color="#2A5D34" />
        <View style={styles.listContainer}>
          <Text style={styles.sectionTitle}>Itens Pendentes:</Text>
          <FlatList
            data={unboughtItems}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.itemContainer}>
                <Text style={[styles.itemText, item.bought && styles.itemBought]}>{item.name} - {item.quantity}</Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity onPress={() => editItem(item.id)} style={styles.iconButton}>
                    <Icon name="edit" size={20} color="#FFD700" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteItem(item.id)} style={styles.iconButton}>
                    <Icon name="trash" size={20} color="#FF6347" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => toggleBought(item.id)} style={styles.iconButton}>
                    <Icon name={item.bought ? "check-square" : "square-o"} size={20} color="#2A5D34" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
          <Text style={styles.sectionTitle}>Itens Comprados:</Text>
          <FlatList
            data={boughtItems}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.itemContainer}>
                <Text style={[styles.itemText, item.bought && styles.itemBought]}>{item.name} - {item.quantity}</Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity onPress={() => editItem(item.id)} style={styles.iconButton}>
                    <Icon name="edit" size={20} color="#FFD700" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteItem(item.id)} style={styles.iconButton}>
                    <Icon name="trash" size={20} color="#FF6347" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => toggleBought(item.id)} style={styles.iconButton}>
                    <Icon name={item.bought ? "check-square" : "square-o"} size={20} color="#2A5D34" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>Criação by Market Checklist 2024</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F2F2F2',
    width: '100%',
    height: '100%',
  },
  scrollContainer: {
    flexGrow: 1,
    width: '100%',
    paddingBottom: 20,
  },
  title: {
    fontSize: width > 400 ? 24 : 20,
    fontWeight: 'bold',
    color: '#2A5D34',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  input: {
    borderColor: '#A8D5BA',
    borderWidth: 1,
    padding: 8,
    width: '40%',
    fontSize: width > 300 ? 16 : 14,
    borderRadius: 5,
  },
  inputHalf: {
    flex: 1,
    marginRight: 10,
  },
  listContainer: {
    flex: 1,
    width: '100%',
    maxHeight: 400,
    backgroundColor: '#FFF',
    borderRadius: 5,
    overflow: 'hidden',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#A8D5BA',
  },
  itemText: {
    fontSize: width > 400 ? 18 : 16,
    flex: 1,
  },
  itemBought: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  iconButton: {
    marginLeft: 10,
  },
  sectionTitle: {
    fontSize: width > 400 ? 20 : 18,
    fontWeight: 'bold',
    color: '#2A5D34',
    marginVertical: 10,
  },
  footer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
  },
  footerText: {
    color: '#2A5D34',
    fontWeight: 'bold',
  },
});

export default Home;
