/**
 * Territory Runner - Main App Entry
 * Updated with bottom navigation and new UI components
 */

import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, AppState } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import BottomNav, { SocialSubView } from './src/components/BottomNav';
import TerritoryPage from './src/components/TerritoryPage';
import SocialPage from './src/components/SocialPage';
import LiveRunPage from './src/components/LiveRunPage';
import TransformationPage from './src/components/TransformationPage';
import { HistoryScreen } from './src/screens/HistoryScreen';

type TabType = 'territory' | 'social' | 'history' | 'transformation';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('territory');
  const [socialSubView, setSocialSubView] = useState<SocialSubView>('feed');
  const [showRunPage, setShowRunPage] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Handle app state changes (background/foreground)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        // App came to foreground - ensure navigation is reset
        if (showRunPage) {
          // If run page was showing, keep it
          return;
        }
        // Ensure we're on a valid tab
        if (!['territory', 'social', 'history', 'transformation'].includes(activeTab)) {
          setActiveTab('territory');
        }
      }
    });

    return () => {
      subscription.remove();
    };
  }, [showRunPage, activeTab]);

  const handleRunSaved = () => {
    try {
      setShowRunPage(false);
      setActiveTab('territory');
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error('Error saving run:', error);
      setShowRunPage(false);
    }
  };

  const handleBackFromRun = () => {
    try {
      // Reset state first
      setShowRunPage(false);
      // Small delay to ensure state is fully reset before changing tab
      setTimeout(() => {
        setActiveTab('territory');
      }, 0);
    } catch (error) {
      console.error('Error going back from run:', error);
      setShowRunPage(false);
      setActiveTab('territory');
    }
  };

  const handleStartRun = () => {
    try {
      setShowRunPage(true);
    } catch (error) {
      console.error('Error starting run:', error);
    }
  };

  const handleSocialSubViewChange = (view: SocialSubView) => {
    setSocialSubView(view);
  };

  // Show run page if active
  if (showRunPage) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.container} edges={['top']}>
          <StatusBar style="light" />
          <LiveRunPage
            onRunSaved={handleRunSaved}
            onBack={handleBackFromRun}
          />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  // Render main app tabs
  const renderTab = () => {
    switch (activeTab) {
      case 'territory':
        return <TerritoryPage onStartRun={handleStartRun} />;
      case 'social':
        return <SocialPage socialSubView={socialSubView} />;
      case 'history':
        return <HistoryScreen key={refreshKey} />;
      case 'transformation':
        return <TransformationPage />;
      default:
        return <TerritoryPage onStartRun={handleStartRun} />;
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar style="dark" />
        <View style={styles.content}>
          {renderTab()}
        </View>
        <BottomNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onSocialSubViewChange={handleSocialSubViewChange}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
  },
});
