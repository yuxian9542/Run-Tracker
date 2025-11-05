/**
 * Territory Runner - Territory Page (Home Screen)
 * Main screen with map, leaderboard, and start run button
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { mockUsers } from '../data/mockSocial';

interface TerritoryPageProps {
  onStartRun?: () => void;
}

const updates = [
  { id: 1, message: "Elijah gained 1200 ft² 📈 moved to #1", timestamp: Date.now() - 2000 },
  { id: 2, message: "Rosie lost 340 ft²", timestamp: Date.now() - 5000 },
  { id: 3, message: "Scott gained 850 ft² 🚀", timestamp: Date.now() - 8000 },
  { id: 4, message: "Emma claimed new territory +670 ft²", timestamp: Date.now() - 12000 },
];

export default function TerritoryPage({ onStartRun }: TerritoryPageProps) {
  const [currentUpdateIndex, setCurrentUpdateIndex] = useState(0);
  const insets = useSafeAreaInsets();

  // Auto-scroll updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentUpdateIndex((prev) => (prev + 1) % updates.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const currentUpdate = updates[currentUpdateIndex];
  const currentUser = mockUsers[0]; // Top user

  return (
    <View style={styles.container}>
      {/* Map Background - Placeholder for Expo Go */}
      <View style={styles.map}>
        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapPlaceholderText}>🗺️ NYC Map</Text>
        </View>
      </View>

      {/* Top Section: Leaderboard Card */}
      <View style={[styles.topCard, { top: Math.max(insets.top, 16) }]}>
        <View style={styles.leaderboardCard}>
          <Image
            source={{ uri: currentUser.avatar }}
            style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.userName}>{currentUser.name}</Text>
              <View style={styles.rankBadge}>
                <Text style={styles.rankText}>#1</Text>
              </View>
            </View>
            <Text style={styles.territoryText}>
              {currentUser.territory.toLocaleString()} ft²
            </Text>
            <Text style={styles.changeText}>
              +{currentUser.territoryChange?.toLocaleString()} ft²
            </Text>
          </View>
        </View>
      </View>

      {/* Middle Section: Scrolling Updates */}
      <View style={[styles.updatesContainer, { top: Math.max(insets.top + 108, 116) }]}>
        <View style={styles.updateBubble}>
          <Text style={styles.updateText}>{currentUpdate.message}</Text>
        </View>
      </View>

      {/* Bottom Section: Stats Card */}
      <View style={[styles.bottomCard, { bottom: Math.max(insets.bottom + 100, 116) }]}>
        <View style={styles.statsCard}>
          {/* Weekly Streak & This Week */}
          <View style={styles.statsRow}>
            <Text style={styles.streakText}>3 Weeks 🔥</Text>
            <Text style={styles.runsText}>3/5 Runs</Text>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '60%' }]} />
            </View>
          </View>

          {/* Motivation */}
          <Text style={styles.motivationText}>
            2 more runs to keep your streak alive! 💪
          </Text>

          {/* Start Run Button */}
          <TouchableOpacity style={styles.startButton} onPress={onStartRun}>
            <Text style={styles.startButtonText}>Start Run</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#1a1a1a',
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholderText: {
    fontSize: 20,
    color: '#FFF',
    opacity: 0.5,
  },
  topCard: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 10,
  },
  leaderboardCard: {
    height: 92,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#bedbff',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(239, 246, 255, 0.95)',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  userInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#101828',
  },
  rankBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#FFF',
    borderRadius: 12,
  },
  rankText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#101828',
  },
  territoryText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  changeText: {
    fontSize: 14,
    color: '#00a63e',
  },
  updatesContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 64,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    zIndex: 10,
  },
  updateBubble: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  updateText: {
    fontSize: 12,
    color: '#FFF',
  },
  bottomCard: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 10,
  },
  statsCard: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  streakText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#101828',
  },
  runsText: {
    fontSize: 16,
    color: '#666',
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1f2937',
    borderRadius: 4,
  },
  motivationText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  startButton: {
    height: 48,
    width: 160,
    alignSelf: 'center',
    borderRadius: 12,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

