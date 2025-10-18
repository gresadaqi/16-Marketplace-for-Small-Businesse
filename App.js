import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import LoginScreen from './app/Screens/login';
import SignUpScreen from './app/Screens/SignUp';
import HomeScreen from './app/Screens/HomeScreen';
import YourBasket from './app/Screens/YourBasket';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#79AC78',
          tabBarInactiveTintColor: '#fff',
          tabBarStyle: {
            backgroundColor: '#2E5E2D',
            height: 80,
            paddingBottom: 12,
            paddingTop: 12,
            borderTopWidth: 3,
            borderTopColor: '#79AC78',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -3 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 10,
          },
          tabBarLabelStyle: {
            fontSize: 13,
            marginTop: 4,
            fontWeight: '600',
            letterSpacing: 0.3,
          },
          tabBarIconStyle: {
            marginTop: 2,
          },
          headerShown: false,
        }}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeScreen}
          options={{
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons 
                name={focused ? 'home' : 'home-outline'} 
                size={size + 2} 
                color={color}
                style={{
                  shadowColor: focused ? '#79AC78' : 'transparent',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                }}
              />
            ),
          }}
        />
        <Tab.Screen 
          name="Basket" 
          component={YourBasket}
          options={{
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons 
                name={focused ? 'cart' : 'cart-outline'} 
                size={size + 2} 
                color={color}
                style={{
                  shadowColor: focused ? '#79AC78' : 'transparent',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                }}
              />
            ),
          }}
        />
        <Tab.Screen 
          name="Profile" 
          component={LoginScreen}
          options={{
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons 
                name={focused ? 'person' : 'person-outline'} 
                size={size + 2} 
                color={color}
                style={{
                  shadowColor: focused ? '#79AC78' : 'transparent',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                }}
              />
            ),
          }}
        />
        <Tab.Screen 
          name="SignUp" 
          component={SignUpScreen}
          options={{
            tabBarButton: () => null, 
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}