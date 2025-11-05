/**
 * Territory Runner - Transformation Page
 * Health transformation predictions and workflow
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { progressionData, getAIInsight, PredictionData } from '../data/mockHealth';

export default function TransformationPage() {
  const [selectedWeek, setSelectedWeek] = useState(0);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Body Transformation</Text>
          <Text style={styles.subtitle}>See your predicted progress</Text>
        </View>

        {/* Week Selector */}
        <View style={styles.weekSelector}>
          {progressionData.map((data) => (
            <TouchableOpacity
              key={data.weeks}
              onPress={() => setSelectedWeek(data.weeks)}
              style={[
                styles.weekButton,
                selectedWeek === data.weeks && styles.weekButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.weekButtonText,
                  selectedWeek === data.weeks && styles.weekButtonTextActive,
                ]}
              >
                {data.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Selected Prediction */}
        {progressionData[selectedWeek] && (
          <PredictionCard data={progressionData[selectedWeek]} />
        )}

        {/* AI Insight */}
        <View style={styles.insightCard}>
          <Text style={styles.insightTitle}>AI Insight</Text>
          <Text style={styles.insightText}>
            {getAIInsight(selectedWeek)}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

function PredictionCard({ data }: { data: PredictionData }) {
  return (
    <View style={styles.predictionCard}>
      <Image source={{ uri: data.image }} style={styles.predictionImage} />
      <View style={styles.predictionStats}>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Weight</Text>
          <Text style={styles.statValue}>{data.weight}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Body Fat</Text>
          <Text style={styles.statValue}>{data.bodyFat}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingBottom: 100,
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  weekSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  weekButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  weekButtonActive: {
    backgroundColor: '#3b82f6',
  },
  weekButtonText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  weekButtonTextActive: {
    color: '#FFF',
    fontWeight: '600',
  },
  predictionCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  predictionImage: {
    width: '100%',
    height: 400,
  },
  predictionStats: {
    padding: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 16,
    color: '#6B7280',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  insightCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
  },
  insightTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  insightText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 22,
  },
});

