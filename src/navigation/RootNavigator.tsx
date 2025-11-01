/**
 * Territory Runner - Root Navigator
 * 主导航：使用 React Navigation Stack
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/HomeScreen';
import { LiveRunScreen } from '../screens/LiveRunScreen';
import { HistoryScreen } from '../screens/HistoryScreen';

export type RootStackParamList = {
  Home: undefined;
  LiveRun: undefined;
  History: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#FFF',
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: '首页',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="LiveRun"
        component={LiveRunScreen}
        options={{
          title: '跑步中',
          headerShown: true,
          gestureEnabled: false, // 防止意外返回
        }}
      />
      <Stack.Screen
        name="History"
        component={HistoryScreen}
        options={{
          title: '历史记录',
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
}
