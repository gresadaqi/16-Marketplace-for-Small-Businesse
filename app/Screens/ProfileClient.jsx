import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NavBarBussines from "../components/NavBarBussines";
import ProfileIcon from '../components/ProfileIcon';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* User Info Section */}
        <View style={styles.userInfoSection}>
          <View style={styles.profilePicContainer}>
            <View style={styles.profilePicPlaceholder} />
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>Name Surname</Text>
            <Text style={styles.userEmail}>email@example.com</Text>
            <TouchableOpacity style={styles.signOutButton}>
              <Text style={styles.signOutButtonText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Purchase History Section */}
        <ScrollView style={styles.purchaseHistoryContainer}>
          <Text style={styles.purchaseHistoryTitle}>Purchase History</Text>

          
          <View style={styles.purchaseItem}>
            <Image source={require('../../assets/maicat.png')} style={styles.productImage} />
            <View style={styles.purchaseDetails}>
              <Text style={styles.productName}>White T shirt</Text>
              <Text style={styles.purchaseText}>From: Name Surname</Text>
              <Text style={styles.purchaseText}>Address: City, Street Name</Text>
              <Text style={styles.purchaseText}>Total: 10$</Text>
            </View>
          </View>
          <View style={styles.separator} />

          
          <View style={styles.purchaseItem}>
            <Image source={require('../../assets/bag.png')} style={styles.productImage} />
            <View style={styles.purchaseDetails}>
              <Text style={styles.productName}>Bag</Text>
              <Text style={styles.purchaseText}>From: Name Surname</Text>
              <Text style={styles.purchaseText}>Address: City, Street Name</Text>
              <Text style={styles.purchaseText}>Total: 15$</Text>
            </View>
          </View>
          <View style={styles.separator} />
          
          
        </ScrollView>
      </View>
      <NavBarBussines />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ADBB86', 
  },
  container: {
    flex: 1,
  },
  userInfoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#ADBB86', 
  },
  profilePicContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#8C7456', 
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#8C7456',
  },
  profilePicPlaceholder: {
    width: 70,
    height: 70,
    backgroundColor: '#6B6B6B', 
    borderRadius: 35,
    // Add an actual icon here if you have one, e.g., using @expo/vector-icons
  },
  userDetails: {
    marginLeft: 20,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  signOutButton: {
    backgroundColor: '#8C7456',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  signOutButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  purchaseHistoryContainer: {
    flex: 1,
    backgroundColor: '#EDE4D4', 
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  purchaseHistoryTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  purchaseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 10,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
    resizeMode: 'contain',
  },
  purchaseDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  purchaseText: {
    fontSize: 14,
    color: '#555',
  },
  separator: {
    height: 1,
    backgroundColor: '#D1C4B3',
    marginVertical: 10,
  },
});