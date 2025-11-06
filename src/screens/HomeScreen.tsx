/**
 * Territory Runner - Home Screen
 * 首页：显示"开始跑步"按钮和最近一次记录摘要
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useRunHistory } from '../hooks/useRunHistory';
import { formatDistance, formatDuration, formatPace, formatRelativeTime } from '../utils/formatters';

type RootStackParamList = {
  Home: undefined;
  LiveRun: undefined;
  History: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { runs, isLoading, getLastRun } = useRunHistory();

  const lastRun = getLastRun();

  const handleStartRun = () => {
    navigation.navigate('LiveRun');
  };

  const handleViewHistory = () => {
    navigation.navigate('History');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Territory Runner</Text>
        <Text style={styles.subtitle}>准备好开始跑步了吗？</Text>
      </View>

      {/* 开始跑步按钮 */}
      <TouchableOpacity style={styles.startButton} onPress={handleStartRun}>
        <Text style={styles.startButtonText}>开始跑步</Text>
      </TouchableOpacity>

      {/* 最近一次记录摘要 */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>最近一次跑步</Text>
          <TouchableOpacity onPress={handleViewHistory}>
            <Text style={styles.linkText}>查看全部 →</Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <ActivityIndicator size="small" color="#007AFF" />
        ) : lastRun ? (
          <View style={styles.lastRunCard}>
            <Text style={styles.lastRunDate}>
              {formatRelativeTime(lastRun.startedAt)}
            </Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{formatDistance(lastRun.distance)}</Text>
                <Text style={styles.statLabel}>距离</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{formatDuration(lastRun.elapsedSec)}</Text>
                <Text style={styles.statLabel}>时长</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{formatPace(lastRun.pace)}</Text>
                <Text style={styles.statLabel}>配速</Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>还没有跑步记录</Text>
            <Text style={styles.emptySubtext}>点击上方按钮开始你的第一次跑步吧！</Text>
          </View>
        )}
      </View>

      {/* 统计概览 */}
      {runs.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>统计概览</Text>
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{runs.length}</Text>
              <Text style={styles.statLabel}>总次数</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {formatDistance(runs.reduce((sum, r) => sum + r.distance, 0))}
              </Text>
              <Text style={styles.statLabel}>总距离</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {formatDuration(runs.reduce((sum, r) => sum + r.elapsedSec, 0))}
              </Text>
              <Text style={styles.statLabel}>总时长</Text>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  startButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  startButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  linkText: {
    fontSize: 14,
    color: '#007AFF',
  },
  lastRunCard: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lastRunDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
  },
  statsCard: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyState: {
    backgroundColor: '#FFF',
    padding: 30,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});
