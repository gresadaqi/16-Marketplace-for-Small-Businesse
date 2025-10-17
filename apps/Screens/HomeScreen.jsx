import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function Home() {
  const [search, setSearch] = useState('');

  
const categories = [
  { id: 1, name: 'All', image: require('../../assets/all.png.png') },
  { id: 2, name: 'Clothes', image: require('../../assets/tshirt.png') },
  { id: 3, name: 'Accessories', image: require('../../assets/accesories.png') },
  { id: 4, name: 'Art', image: require('../../assets/art.png') },
  { id: 5, name: 'Other', image: require('../../assets/others.png') },
];


const renderCategory = ({ item }) => {
  const isArt = item.name === 'Art'; 
 const isTshirt= item.name==='Clothes';
  return (
    <View style={{ alignItems: 'center' }}>
      <TouchableOpacity
        style={[
          styles.categoryBox,
          isArt && { width: 85, height: 76, backgroundColor: '#462e23ff' }, 
        ]}
      >
        <Image
          source={item.image}
          style={[
            styles.categoryImage,
            isArt && { width: 210, height: 100 , marginTop:20 }, 
       isTshirt && { width: 210, height: 90, marginBottom: 15, marginLeft: -5 },
          ]}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <Text style={styles.categoryText}>{item.name}</Text>
    </View>
  );
};



}