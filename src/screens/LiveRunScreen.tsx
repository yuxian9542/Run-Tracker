/**
 * Territory Runner - Live Run Screen
 * 实时跑步界面：显示时间/距离/配速，提供开始/暂停/停止按钮
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useGPS } from '../hooks/useGPS';
import { useTimer } from '../hooks/useTimer';
import { useRunSaver } from '../hooks/useRunSaver';
import { formatDistance, formatDuration, formatPace } from '../utils/formatters';
import { calculatePace } from '../utils/calculations';

type RootStackParamList = {
  Home: undefined;
  LiveRun: undefined;
  History: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'LiveRun'>;

export function LiveRunScreen() {
  const navigation = useNavigation<NavigationProp>();
  
  const gps = useGPS();
  const timer = useTimer();
  const { saveRun, isSaving } = useRunSaver();
  
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [runStatus, setRunStatus] = useState<'idle' | 'running' | 'paused'>('idle');

  // 计算实时配速
  const currentPace = calculatePace(gps.distanceMeters, timer.elapsedSec);

  /**
   * 开始跑步
   */
  const handleStart = async () => {
    try {
      await gps.start();
      timer.start();
      setStartedAt(Date.now());
      setRunStatus('running');
    } catch (error) {
      Alert.alert('错误', 'GPS 启动失败，请检查位置权限');
    }
  };

  /**
   * 暂停跑步
   */
  const handlePause = () => {
    gps.stop();
    timer.pause();
    setRunStatus('paused');
  };

  /**
   * 恢复跑步
   */
  const handleResume = async () => {
    await gps.start();
    timer.resume();
    setRunStatus('running');
  };

  /**
   * 停止并保存
   */
  const handleStop = () => {
    Alert.alert(
      '保存跑步记录',
      `距离: ${formatDistance(gps.distanceMeters)}\n时长: ${formatDuration(timer.elapsedSec)}\n\n确定保存并结束？`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '保存',
          onPress: async () => {
            gps.stop();
            timer.pause();

            if (!startedAt) return;

            const record = await saveRun({
              startedAt,
              elapsedSec: timer.elapsedSec,
              distance: gps.distanceMeters,
              path: gps.path,
            });

            if (record) {
              // 重置状态
              gps.clear();
              timer.reset();
              setStartedAt(null);
              setRunStatus('idle');

              Alert.alert('成功', '跑步记录已保存', [
                {
                  text: '返回首页',
                  onPress: () => navigation.navigate('Home'),
                },
              ]);
            } else {
              Alert.alert('错误', '保存失败，请重试');
            }
          },
        },
      ]
    );
  };

  /**
   * 放弃本次跑步
   */
  const handleDiscard = () => {
    Alert.alert('放弃跑步', '确定要放弃本次跑步吗？数据将不会保存。', [
      { text: '取消', style: 'cancel' },
      {
        text: '放弃',
        style: 'destructive',
        onPress: () => {
          gps.stop();
          gps.clear();
          timer.reset();
          setStartedAt(null);
          setRunStatus('idle');
          navigation.navigate('Home');
        },
      },
    ]);
  };

  // 显示 GPS 错误
  useEffect(() => {
    if (gps.error) {
      Alert.alert('GPS 错误', gps.error);
    }
  }, [gps.error]);

  return (
    <View style={styles.container}>
      {/* 统计显示区 */}
      <View style={styles.statsContainer}>
        <View style={styles.mainStat}>
          <Text style={styles.mainStatValue}>{formatDistance(gps.distanceMeters)}</Text>
          <Text style={styles.mainStatLabel}>距离</Text>
        </View>

        <View style={styles.secondaryStats}>
          <View style={styles.secondaryStat}>
            <Text style={styles.secondaryStatValue}>{formatDuration(timer.elapsedSec)}</Text>
            <Text style={styles.secondaryStatLabel}>时长</Text>
          </View>
          <View style={styles.secondaryStat}>
            <Text style={styles.secondaryStatValue}>{formatPace(currentPace)}</Text>
            <Text style={styles.secondaryStatLabel}>配速</Text>
          </View>
        </View>

        <View style={styles.gpsInfo}>
          <Text style={styles.gpsInfoText}>
            {gps.isTracking ? '🟢 GPS 跟踪中' : '⚪️ GPS 未激活'}
          </Text>
          <Text style={styles.gpsInfoText}>路径点: {gps.path.length}</Text>
        </View>
      </View>

      {/* 控制按钮区 */}
      <View style={styles.controlsContainer}>
        {runStatus === 'idle' && (
          <TouchableOpacity style={styles.startButton} onPress={handleStart}>
            <Text style={styles.buttonText}>开始跑步</Text>
          </TouchableOpacity>
        )}

        {runStatus === 'running' && (
          <>
            <TouchableOpacity style={styles.pauseButton} onPress={handlePause}>
              <Text style={styles.buttonText}>暂停</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.stopButton} onPress={handleStop} disabled={isSaving}>
              {isSaving ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.buttonText}>停止并保存</Text>
              )}
            </TouchableOpacity>
          </>
        )}

        {runStatus === 'paused' && (
          <>
            <TouchableOpacity style={styles.resumeButton} onPress={handleResume}>
              <Text style={styles.buttonText}>继续</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.stopButton} onPress={handleStop} disabled={isSaving}>
              {isSaving ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.buttonText}>停止并保存</Text>
              )}
            </TouchableOpacity>
          </>
        )}

        {runStatus !== 'idle' && (
          <TouchableOpacity style={styles.discardButton} onPress={handleDiscard}>
            <Text style={styles.discardButtonText}>放弃</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  statsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  mainStat: {
    alignItems: 'center',
    marginBottom: 40,
  },
  mainStatValue: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
  },
  mainStatLabel: {
    fontSize: 18,
    color: '#AAA',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  secondaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 40,
    marginBottom: 30,
  },
  secondaryStat: {
    alignItems: 'center',
  },
  secondaryStatValue: {
    fontSize: 32,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 4,
  },
  secondaryStatLabel: {
    fontSize: 14,
    color: '#AAA',
    textTransform: 'uppercase',
  },
  gpsInfo: {
    alignItems: 'center',
    marginTop: 20,
  },
  gpsInfoText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  controlsContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  startButton: {
    backgroundColor: '#34C759',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 12,
  },
  pauseButton: {
    backgroundColor: '#FF9500',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 12,
  },
  resumeButton: {
    backgroundColor: '#34C759',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 12,
  },
  stopButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 12,
  },
  discardButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#666',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  discardButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
});

