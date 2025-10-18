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

  const products = [
    { id: 1, name: 'T Shirts', price: '$10',image: require('../../assets/maicat.png') },
    { id: 2, name: 'Jeans', price: '$15',image: require('../../assets/trousers.png') },
    { id: 3, name: 'Bags', price: '$25',image: require('../../assets/bag.png') },
    { id: 4, name: 'Crochet Bag', price: '$10',image: require('../../assets/crochet.png') },
    { id: 5, name: 'Ashtray', price: '$15', image: require('../../assets/artt.png')  },
    { id: 6, name: 'Shell necklaces', price: '$25',image: require('../../assets/necklace.png')  },
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

const renderProduct = ({ item }) => (
  <TouchableOpacity
    style={styles.productCard}
    activeOpacity={0.8}
    onPress={() => console.log('Klikove', item.name)}
  >
    {}
    <View style={styles.productImageWrapper}>
      <Image
        source={item.image}
        style={styles.productImageNew}
        resizeMode="cover"
      />
    </View>

    {}
    <View style={styles.bottomInfoBoxSeparated}>
      <Text style={styles.productNameNew}>{item.name}</Text>
      <Text style={styles.productPriceNew}>{item.price}</Text>
    </View>
  </TouchableOpacity>
);



}