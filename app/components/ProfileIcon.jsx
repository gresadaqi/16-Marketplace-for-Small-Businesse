import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';

const ProfileIcon = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Image
        source={require('../../assets/profile.png')} 
        style={styles.icon}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: 10, 
  },
  icon: {
    width: 35,
    height: 35,
    borderRadius: 20, 
  },
});

export default ProfileIcon;
