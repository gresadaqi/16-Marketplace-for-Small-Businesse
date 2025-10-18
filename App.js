import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Text } from 'react-native';

// Import screens
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
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: '#406A2A',
            height: 90,
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
            borderTopWidth: 0,
            position: 'absolute',
            bottom: 0,
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.2,
            shadowRadius: 5,
            paddingBottom: 8, 
            paddingTop: 8,
          },
          tabBarItemStyle: {
            marginHorizontal: 66, 
            marginTop:15
          },
        }}
      >

        {/*  HOME */}
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ focused, size }) => (
              <View
                style={{
                  backgroundColor: focused ? '#E7E2DD' : '#406A2A', // ✅ pjesë e bar-it
                  borderRadius: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: 8,
                  paddingHorizontal: 22,
                }}
              >
                <Ionicons
                  name={focused ? 'home' : 'home-outline'}
                  size={size + 6}
                  color={focused ? '#6EBF68' : '#FFFFFF'}
                />
                <Text
                  style={{
                    color: '#FFF',
                    fontSize: 13,
                    marginTop: 5,
                    fontWeight: '500',
                  }}
                >
                  Home
                </Text>
              </View>
            ),
          }}
        />

        {/*  BASKET */}
        <Tab.Screen
          name="Basket"
          component={YourBasket}
          options={{
            tabBarIcon: ({ focused, size }) => (
              <View
                style={{
                  backgroundColor: focused ? '#E7E2DD' : '#406A2A',
                  borderRadius: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: 8,
                  paddingHorizontal: 22,
                }}
              >
                <Ionicons
                  name={focused ? 'cart' : 'cart-outline'}
                  size={size + 6}
                  color={focused ? '#6EBF68' : '#FFFFFF'}
                />
                <Text
                  style={{
                    color: '#FFF',
                    fontSize: 13,
                    marginTop: 5,
                    fontWeight: '500',
                  }}
                >
                  Basket
                </Text>
              </View>
            ),
          }}
        />

        {/*  PROFILE */}
        <Tab.Screen
          name="Profile"
          component={LoginScreen}
          options={{
            tabBarIcon: ({ focused, size }) => (
              <View
                style={{
                  backgroundColor: focused ? '#E7E2DD' : '#406A2A',
                  borderRadius: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: 8,
                  paddingHorizontal: 22,
                }}
              >
                <Ionicons
                  name={focused ? 'person' : 'person-outline'}
                  size={size + 6}
                  color={focused ? '#6EBF68' : '#FFFFFF'}
                />
                <Text
                  style={{
                    color: '#FFF',
                    fontSize: 13,
                    marginTop: 5,
                    fontWeight: '500',
                  }}
                >
                  Profile
                </Text>
              </View>
            ),
          }}
        />

        {/*  SIGNUP – HIDDEN */}
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