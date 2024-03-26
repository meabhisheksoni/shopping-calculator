import React, { useState,  useRef, useEffect} from 'react';
import { View, Share,TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, Text, SafeAreaView } from 'react-native';
import CheckBox from '@react-native-community/checkbox'; // Assuming you're using this package


export default function App() {
  const [items, setItems] = useState([{ name: '', price: '', checked: false, nameRef: React.createRef(), priceRef: React.createRef() }]);
  const [masterChecked, setMasterChecked] = useState(false);
  const nameRefs = useRef([]);
  const priceRefs = useRef([]);

  useEffect(() => {
    // Adjust refs array size when items change
    nameRefs.current = nameRefs.current.slice(0, items.length);
    priceRefs.current = priceRefs.current.slice(0, items.length);
  }, [items]);

  const handleAddItem = () => {
    setItems([...items, { name: '', price: '', checked: masterChecked, nameRef: React.createRef(), priceRef: React.createRef() }]);
  };

  const updateField = (index: number, field: string, value: string) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const toggleCheckbox = (index: number) => {
    const newItems = [...items];
    newItems[index].checked = !newItems[index].checked;
    setItems(newItems);
    // Update master checkbox based on individual item checks
    setMasterChecked(newItems.every(item => item.checked));
  };

  const deleteItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    // Update master checkbox based on remaining items
    setMasterChecked(newItems.every(item => item.checked));
  };

  const toggleMasterCheckbox = () => {
    const newCheckedState = !masterChecked;
    setMasterChecked(newCheckedState);
    const newItems = items.map(item => ({ ...item, checked: newCheckedState }));
    setItems(newItems);
  };
 
  const shareItems = async () => {
    let header = "No.        *Item*                      *Price*\n";
    let separator = "----------------------------------------------\n";
    let itemList = header + separator;
    let total = 0;
    let serialNumber = 1;
  
    items.forEach(item => {
      if (item.checked) {
        const { name, price } = item;
        total += parseFloat(price);
        // Adjust the padding and include "| Rs. " before the price
        itemList += `${serialNumber++}.        ${name.padEnd(25)}      | Rs. ${price}\n`;
        itemList += separator; 
        // Add a separator after each item
      }
    });
    itemList += "\n";
    // Format the total to include "| Rs. " and ensure it aligns with the prices above
    let totalLine = `Total: Rs. ${total.toFixed(2)}\n`;
  
    itemList += totalLine;
  
    try {
      await Share.share({
        message: itemList,
      });
    } catch (error) {
      console.error(error);
    }
  };
  
  const totalItems = items.length;
  const checkedItems = items.filter(item => item.checked).length;
  const totalSum = items.reduce((total, item) => total + (item.price ? parseFloat(item.price) : 0), 0);
const checkedSum = items.reduce((total, item) => item.checked ? total + (item.price ? parseFloat(item.price) : 0) : total, 0);


  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topContainer}>
      <Text style={styles.topLabel}>{totalItems} Total Sum:                                            Rs. {totalSum.toFixed(0)}</Text>
        <Text style={styles.topLabel}>{checkedItems} Checked Sum:                                      Rs. {checkedSum.toFixed(0)}</Text>
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          {items.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <CheckBox
                value={item.checked}
                onValueChange={() => toggleCheckbox(index)}
              />
              <TextInput
                placeholder="Item Name"
                value={item.name}
                onChangeText={(text) => updateField(index, 'name', text)}
                style={styles.input}
                ref={el => nameRefs.current[index] = el}
                onSubmitEditing={() => {
                  const nextIndex = index + 1;
                  if (nextIndex < items.length) {
                    nameRefs.current[nextIndex].focus();
                  }
                }}
                blurOnSubmit={false}
              />
              <TextInput
                placeholder="Price"
                value={item.price}
                onChangeText={(text) => updateField(index, 'price', text)}
                keyboardType="numeric"
                style={styles.input}
                ref={item.priceRef}
                ref={el => priceRefs.current[index] = el}
                  onSubmitEditing={() => {
                 const nextIndex = index + 1;
                  if (nextIndex < items.length) {
                  priceRefs.current[nextIndex].focus();
                 }
                 }}
                 blurOnSubmit={false}
                 />
              <TouchableOpacity onPress={() => deleteItem(index)} style={styles.deleteButton}>
              <Text style={{ color: 'white', fontSize: 30 }}>🗑️</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
      <View style={styles.masterCheckboxContainer}>
      <TouchableOpacity onPress={shareItems} style={styles.shareButton}>
    <Text style={styles.shareButtonText}>📨</Text>
  </TouchableOpacity>
        <CheckBox
          value={masterChecked}
          onValueChange={toggleMasterCheckbox}
        />
        <Text></Text>
      </View>
      <View style={styles.addButtonContainer}>
      <TouchableOpacity
        onPress={handleAddItem}
        style={{
          width: 60,
          height: 60,
          borderRadius: 30,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#007AFF',
        }}
      >
        <Text style={{ color: 'white', fontSize: 30 }}>+</Text>
      </TouchableOpacity>
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  topContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: 'black',
  },
  topLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollView: {
    marginBottom: 60,
  },
  container: {
    padding: 2,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  input: {
    flex: 1,
    borderWidth: 1.1,
    padding: 10,
    marginRight: 10,
    marginLeft: 5,
    borderRadius: 15,

  },
  addButtonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007AFF',
  },
  masterCheckboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
   padding: 2,
   
   backgroundColor: 'black',
    borderTopColor: '#ccc',
    justifyContent: 'center',
  },
   shareButton: {
    marginRight: 20, // Add some margin if needed
    padding: 0, // Make it easier to tap
  },
  shareButtonText: {
    fontSize: 30, // Adjust the emoji size
  },
  deleteButton: {
    padding: 0,
    
    borderRadius: 60,
  },
});

// comment