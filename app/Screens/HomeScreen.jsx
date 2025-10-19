import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import ProfileIcon from '../components/ProfileIcon';
import { Modal } from 'react-native';
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


export default function HomeScreen() {
  const [search, setSearch] = useState('');
const [selectedProduct, setSelectedProduct] = useState(null);
const [modalVisible, setModalVisible] = useState(false);

const openProductModal = (product) => {
  setSelectedProduct(product);
  setModalVisible(true);
};

const closeModal = () => {
  setSelectedProduct(null);
  setModalVisible(false);
};


  
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
 
  const filteredProducts = products.filter(item =>
  item.name.toLowerCase().includes(search.toLowerCase())
);

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
    onPress={() => openProductModal(item)}
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
  <View style={styles.searchRow}>
    {}
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

    {}
    <TouchableOpacity style={styles.profileContainer} onPress={() => console.log('Profile pressed')}>
      
       <ProfileIcon/>
    </TouchableOpacity>
  </View>
</View>


    {}
    <View style={styles.contentContainer}>
      <FlatList
        ListHeaderComponent={
          <>
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
          </>
        }
      data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        contentContainerStyle={styles.productList}
        showsVerticalScrollIndicator={false}
      />
  

    
      {filteredProducts.length === 0 && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: -500 }}>
          <Text style={{ color: '#462E23', fontSize: 18, fontWeight: '500' }}>
            No products found 😔
          </Text>
        </View>
      )}

  
      {selectedProduct && (
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalBox}>
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Ionicons name="close" size={28} color="#462E23" />
              </TouchableOpacity>

              <Image
                source={selectedProduct.image}
                style={styles.modalImage}
                resizeMode="contain"
              />

              <Text style={styles.modalTitle}>{selectedProduct.name}</Text>
              <Text style={styles.modalText}>
                <Text style={{ fontWeight: 'bold' }}>From:</Text> Business Name
              </Text>
              <Text style={styles.modalText}>
                <Text style={{ fontWeight: 'bold' }}>Size:</Text> 
              </Text>
              <Text style={styles.modalText}>
                <Text style={{ fontWeight: 'bold' }}>Description:</Text> Here will be the description for each product.
              </Text>

              <View style={styles.modalFooter}>
                <Text style={styles.modalPrice}>{selectedProduct.price}</Text>
                <TouchableOpacity style={styles.addToCartButton}>
                  <Text style={styles.addToCartText}>Add To Cart</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  </SafeAreaView>
);



}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7E7C8' },
 
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

 bottomInfoBoxSeparated: {
  backgroundColor: '#462E23',
  paddingVertical: 6,
  borderRadius: 12,
  alignItems: 'center',
  marginTop: 8, 
},

productNameNew: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '600',
  },

  productPriceNew: {
    fontSize: 11,
    color: '#F7E7C8', 
    fontWeight: '500',
    marginTop: 2,
  },
contentContainer: {
  flex: 1,
  padding: 20,
  marginBottom: 60, 
},

navBarWrapper: {
  position: 'absolute',
  bottom: 0,
  width: '100%',
  backgroundColor: '#2E6E3E',
},
searchRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
},

topContainer: {
  backgroundColor: '#2E6E3E',
  paddingHorizontal: 15,
  paddingTop: 20,
  paddingBottom: 15,
  // borderBottomLeftRadius: 20,
  // borderBottomRightRadius: 20,
},

searchRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
},

searchBar: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#e2d3b2ff',
  borderRadius: 25,
  paddingHorizontal: 15,
  height: 40,
  flex: 1,              
  marginRight: 10,       
},

searchInput: {
  flex: 1,
  color: '#333',
},

// profileContainer: {
//   backgroundColor: '#e2d3b2ff',
//   borderRadius: 20,
//   padding: 5,
// },



modalContainer: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.5)',
  justifyContent: 'center',
  alignItems: 'center',
},
modalBox: {
  backgroundColor: '#FAEED8',
  borderRadius: 20,
  padding: 20,
  width: '85%',
  alignItems: 'center',
},
closeButton: {
  alignSelf: 'flex-end',
},
modalImage: {
  width: 220,
  height: 220,
  borderRadius: 12,
  marginBottom: 15,
  backgroundColor: '#C7E1F3',
},
modalTitle: {
  fontSize: 22,
  fontWeight: 'bold',
  color: '#000',
  marginBottom: 10,
},
modalText: {
  fontSize: 14,
  color: '#333',
  marginBottom: 5,
},
modalFooter: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  marginTop: 15,
},
modalPrice: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#000',
},
addToCartButton: {
  backgroundColor: '#E6E4E1',
  borderRadius: 15,
  paddingVertical: 8,
  paddingHorizontal: 18,
},
addToCartText: {
  color: '#2E6E3E',
  fontWeight: 'bold',
  letterSpacing: 1,
},

  });