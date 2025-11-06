/**
 * Territory Runner - Live Run Page (New Design)
 * Real-time running interface with map and GPS integration
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// Temporarily disable maps for Expo Go compatibility
// import MapView, { Polyline, Marker } from 'react-native-maps';
import { useGPS } from '../hooks/useGPS';
import { useTimer } from '../hooks/useTimer';
import { useRunSaver } from '../hooks/useRunSaver';
import { formatDistance, formatDuration } from '../utils/formatters';

interface LiveRunPageProps {
  onRunSaved: () => void;
  onBack?: () => void;
}

export default function LiveRunPage({ onRunSaved, onBack }: LiveRunPageProps) {
  const gps = useGPS();
  const timer = useTimer();
  const { saveRun, isSaving } = useRunSaver();
  const insets = useSafeAreaInsets();

  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [runStatus, setRunStatus] = useState<'idle' | 'running' | 'paused'>('idle');
  const [showCompletion, setShowCompletion] = useState(false);

  // Calculate territory (convert meters to square feet approximation)
  const territory = Math.floor(gps.distanceMeters * 100000); // Rough conversion
  const paceMph = gps.distanceMeters > 0 && timer.elapsedSec > 0
    ? ((gps.distanceMeters / 1609.34) / (timer.elapsedSec / 3600)).toFixed(1)
    : '0.0';

  // Auto-start run when component mounts
  useEffect(() => {
    const startRun = async () => {
      try {
        await gps.start();
        timer.start();
        setStartedAt(Date.now());
        setRunStatus('running');
      } catch (error) {
        Alert.alert('Error', 'GPS failed to start. Please check location permissions.');
      }
    };

    if (runStatus === 'idle') {
      startRun();
    }
  }, []); // Only run once on mount

  const handleBack = () => {
    // Immediately call onBack without delay
    if (onBack) {
      // Stop GPS and reset timer if running
      if (runStatus === 'running' || runStatus === 'paused') {
        try {
          gps.stop();
          timer.pause();
        } catch (e) {
          // Ignore errors
        }
      }
      try {
        gps.clear();
        timer.reset();
      } catch (e) {
        // Ignore errors
      }
      onBack();
    }
  };

  const handlePause = () => {
    gps.stop();
    timer.pause();
    setRunStatus('paused');
  };

  const handleResume = async () => {
    await gps.start();
    timer.resume();
    setRunStatus('running');
  };

  const handleStop = () => {
    Alert.alert(
      'Save Run',
      `Distance: ${formatDistance(gps.distanceMeters)}\nDuration: ${formatDuration(timer.elapsedSec)}\n\nSave and finish?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Save',
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
              setShowCompletion(true);
              setTimeout(() => {
                gps.clear();
                timer.reset();
                setStartedAt(null);
                setRunStatus('idle');
                onRunSaved();
              }, 3000);
            } else {
              Alert.alert('Error', 'Failed to save run. Please try again.');
            }
          },
        },
      ]
    );
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Completion screen
  if (showCompletion) {
    return (
      <View style={styles.completionContainer}>
        <View style={styles.completionContent}>
          <Text style={styles.completionTitle}>Amazing Run!</Text>
          <Text style={styles.completionSubtitle}>You crushed it! 🎉</Text>

          <View style={styles.completionStats}>
            <View style={styles.completionStat}>
              <Text style={styles.completionStatValue}>{formatTime(timer.elapsedSec)}</Text>
              <Text style={styles.completionStatLabel}>Time</Text>
            </View>
            <View style={styles.completionStat}>
              <Text style={styles.completionStatValue}>
                {(gps.distanceMeters / 1609.34).toFixed(2)}
              </Text>
              <Text style={styles.completionStatLabel}>Miles</Text>
            </View>
            <View style={styles.completionStat}>
              <Text style={styles.completionStatValue}>
                {(territory / 1000).toFixed(0)}k
              </Text>
              <Text style={styles.completionStatLabel}>sqft</Text>
            </View>
          </View>

          <View style={styles.territoryGained}>
            <Text style={styles.territoryLabel}>Territory Gained</Text>
            <Text style={styles.territoryGainedValue}>{territory.toLocaleString()} sqft</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Map Background - Placeholder for Expo Go */}
      <View style={styles.map}>
        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapPlaceholderText}>🗺️ Map View</Text>
          <Text style={styles.mapPlaceholderSubtext}>
            {gps.path.length > 0 ? `${gps.path.length} points tracked` : 'Waiting for GPS...'}
          </Text>
        </View>
      </View>

      {/* Header with Back Button - Always visible */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 50) }]}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
      </View>

      {/* Control Buttons */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          onPress={runStatus === 'paused' ? handleResume : handlePause}
          style={[
            styles.controlButton,
            runStatus === 'paused' ? styles.resumeButton : styles.pauseButton,
          ]}
        >
          <Text style={styles.controlButtonText}>
            {runStatus === 'paused' ? '▶' : '⏸'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleStop}
          style={[styles.controlButton, styles.stopButton]}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.controlButtonText}>⏹</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Time</Text>
          <Text style={styles.statValue}>{formatTime(timer.elapsedSec)}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Distance</Text>
          <Text style={styles.statValue}>
            {(gps.distanceMeters / 1609.34).toFixed(2)} mi
          </Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Pace</Text>
          <Text style={[styles.statValue, styles.paceValue]}>{paceMph} mph</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Territory</Text>
          <Text style={[styles.statValue, styles.territoryValue]}>
            {(territory / 1000).toFixed(1)}k
          </Text>
        </View>
      </View>

      {/* Paused Status */}
      {runStatus === 'paused' && (
        <View style={styles.pausedBanner}>
          <Text style={styles.pausedText}>Paused</Text>
        </View>
      )}
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
    fontSize: 24,
    color: '#FFF',
    marginBottom: 8,
  },
  mapPlaceholderSubtext: {
    fontSize: 14,
    color: '#AAA',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingBottom: 12,
    paddingHorizontal: 20,
    zIndex: 1000,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 120,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 20,
    zIndex: 1000,
  },
  controlButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  pauseButton: {
    backgroundColor: '#3b82f6',
  },
  resumeButton: {
    backgroundColor: '#22c55e',
  },
  stopButton: {
    backgroundColor: '#1f2937',
  },
  controlButtonText: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  statsGrid: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    gap: 8,
    zIndex: 1000,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  paceValue: {
    color: '#60a5fa',
  },
  territoryValue: {
    color: '#22c55e',
  },
  pausedBanner: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  pausedText: {
    backgroundColor: 'rgba(234, 179, 8, 0.9)',
    color: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    fontSize: 14,
    fontWeight: '600',
  },
  completionContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  completionContent: {
    alignItems: 'center',
  },
  completionTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
  },
  completionSubtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 32,
  },
  completionStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  completionStat: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    minWidth: 80,
  },
  completionStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  completionStatLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  territoryGained: {
    backgroundColor: 'rgba(34, 197, 94, 0.3)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: 'rgba(34, 197, 94, 0.5)',
    alignItems: 'center',
  },
  territoryLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
  },
  territoryGainedValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
  },
});

