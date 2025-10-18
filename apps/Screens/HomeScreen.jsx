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

return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {}
      <View style={styles.topContainer}>
        <View style={styles.searchBar}>
          <TextInput
            placeholder="Search here ..."
            placeholderTextColor="#999"
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
          />
          <Ionicons name="search" size={20} color="#333" />
        </View>
      </View>

      {}
      <View style={styles.middleContainer}>
        <Text style={styles.categoryTitle}>Category</Text>

        <FlatList
  data={categories}
  renderItem={renderCategory}
  keyExtractor={(item) => item.id.toString()}
  numColumns={4}
  ItemSeparatorComponent={() => <View style={{ height: 15 }} />} 
  columnWrapperStyle={{ justifyContent: 'space-between' }}     
   showsVerticalScrollIndicator={false} 
/>

 <Text style={styles.allTitle}>All</Text>
        <View style={styles.underline}></View>

        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3}
          contentContainerStyle={styles.productList}
           showsVerticalScrollIndicator={false} 
        />
      </View>


      {}
      <View style={styles.bottomContainer}></View>
    </SafeAreaView>
  );

}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7E7C8' },
  topContainer: {
    backgroundColor: '#2E6E3E',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
   searchBar: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#e2d3b2ff',
  borderRadius: 25,
  paddingHorizontal: 15,
  height: 40,
  width: '70%',        
  alignSelf: 'center', 
  marginRight:120
},
  searchInput: { flex: 1, color: '#333' },

    middleContainer: { flex: 1, padding: 20 },
  categoryTitle: { fontSize: 18, color: '#2E6E3E', fontWeight: 'bold', marginBottom: 10 },
  categoryList: { gap: 15 },
 categoryBox: {
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#462e23ff',
  padding: 15,
  borderRadius: 15,
  width: 80,     
  height: 75,    
  elevation: 3,
},

categoryImage: {
  width: 100,     
  height: 80,    
},
categoryText: {
  fontSize: 13,  
  color: '#2E6E3E',
  marginTop: 5,
  fontWeight: '500',
},

 allTitle: { fontSize: 16, color: '#2E6E3E', fontWeight: 'bold', marginTop: 20 },
  underline: { height: 2, backgroundColor: '#faf8f7ff', width: 180, marginBottom: 10, marginTop: 3 }, // Ndryshuar ngjyra e vijës

  productList: { gap: 10 }, 

  

  productCard: {
    
    borderRadius: 15,
    margin: 5,
    width: '31%', 
    overflow: 'hidden', 
    elevation: 3,
    position: 'relative', 
     
  },

  productImageWrapper: {
    
    width: '100%',
    aspectRatio: 1, 
    borderRadius: 15,
    borderWidth: 3,
    borderColor: '#2E6E3E',
    overflow: 'hidden',
    padding: 0, 
  },

  productImageNew: {
    width: '100%',
    height: '100%',
    borderRadius: 12, 
  },

  bottomInfoBox: {
    backgroundColor: '#462E23',
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    alignItems: 'center',
    position: 'absolute', 
    bottom: 0,
    width: '100%',
    zIndex: 1,
  },

  });