import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity } from 'react-native';


import LoginScreen from './app/Screens/login';
import SignUpScreen from './app/Screens/SignUp';
import HomeScreen from './app/Screens/HomeScreen';
import YourBasket from './app/Screens/YourBasket';

const Tab = createBottomTabNavigator();

function CustomTabBar({ state, descriptors, navigation }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-evenly', 
        alignItems: 'center',
        backgroundColor: '#406A2A',
        height: 90,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
      }}
    >
      {state.routes.map((route, index) => {
        if (route.name === 'SignUp') return null; 

        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

       
        const iconName =
          route.name === 'Home'
            ? isFocused
              ? 'home'
              : 'home-outline'
            : route.name === 'Basket'
            ? isFocused
              ? 'cart'
              : 'cart-outline'
            : isFocused
            ? 'person'
            : 'person-outline';

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1, 
            }}
          >
            <View
              style={{
                backgroundColor: isFocused ? '#E7E2DD' : 'transparent',
                borderRadius: 20,
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 8,
                paddingHorizontal: 18,
              }}
            >
              <Ionicons
                name={iconName}
                size={28}
                color={isFocused ? '#6EBF68' : '#FFFFFF'}
              />
              <Text
                style={{
                  color: '#FFF',
                  fontSize: 13,
                  marginTop: 5,
                  fontWeight: '500',
                }}
              >
                {label}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}


export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
        }}
        tabBar={(props) => <CustomTabBar {...props} />} 
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Basket" component={YourBasket} />
        <Tab.Screen name="Profile" component={LoginScreen} />
        <Tab.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{ tabBarButton: () => null }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
