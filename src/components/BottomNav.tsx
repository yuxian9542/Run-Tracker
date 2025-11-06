/**
 * Territory Runner - Bottom Navigation
 * 4-tab navigation: Territory, Social, History, Transformation
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type TabType = 'territory' | 'social' | 'history' | 'transformation';
export type SocialSubView = 'feed' | 'leaderboard' | 'friends';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onSocialSubViewChange?: (view: SocialSubView) => void;
}

const tabs = [
  { id: 'territory' as TabType, label: 'Territory', icon: '📍' },
  { id: 'social' as TabType, label: 'Social', icon: '👥' },
  { id: 'history' as TabType, label: 'History', icon: '📜' },
  { id: 'transformation' as TabType, label: 'Transformation', icon: '✨' },
];

const socialMenuItems = [
  { id: 'feed' as SocialSubView, label: 'Feed', icon: '💬' },
  { id: 'leaderboard' as SocialSubView, label: 'Leaderboard', icon: '🏆' },
  { id: 'friends' as SocialSubView, label: 'Friends', icon: '👤' },
];

export default function BottomNav({
  activeTab,
  onTabChange,
  onSocialSubViewChange,
}: BottomNavProps) {
  const [showSocialMenu, setShowSocialMenu] = useState(false);
  const insets = useSafeAreaInsets();

  const handleSocialClick = () => {
    if (activeTab === 'social') {
      setShowSocialMenu(!showSocialMenu);
    } else {
      onTabChange('social');
      setShowSocialMenu(true);
    }
  };

  const handleSocialSubViewClick = (view: SocialSubView) => {
    onSocialSubViewChange?.(view);
    setShowSocialMenu(false);
  };

  return (
    <>
      {/* Floating Social Menu */}
      {showSocialMenu && activeTab === 'social' && (
        <View style={styles.socialMenu}>
          {socialMenuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => handleSocialSubViewClick(item.id)}
              style={styles.socialMenuItem}
            >
              <Text style={styles.socialMenuIcon}>{item.icon}</Text>
              <Text style={styles.socialMenuLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Bottom Navigation */}
      <View style={[styles.bottomNav, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const isSocial = tab.id === 'social';

          return (
            <TouchableOpacity
              key={tab.id}
              onPress={() => (isSocial ? handleSocialClick() : onTabChange(tab.id))}
              style={styles.tabButton}
            >
              <Text
                style={[
                  styles.tabIcon,
                  isActive && styles.tabIconActive,
                ]}
              >
                {tab.icon}
              </Text>
              <Text
                style={[
                  styles.tabLabel,
                  isActive && styles.tabLabelActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 8,
    paddingBottom: 20,
    paddingHorizontal: 16,
    zIndex: 9999,
    elevation: 9999,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 2,
    color: '#9CA3AF',
  },
  tabIconActive: {
    color: '#3b82f6',
    transform: [{ scale: 1.1 }],
  },
  tabLabel: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  tabLabelActive: {
    color: '#3b82f6',
    fontWeight: '600',
  },
  socialMenu: {
    position: 'absolute',
    bottom: 80,
    left: '50%',
    marginLeft: -75,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 1000,
  },
  socialMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    marginBottom: 4,
  },
  socialMenuIcon: {
    fontSize: 14,
  },
  socialMenuLabel: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
});

