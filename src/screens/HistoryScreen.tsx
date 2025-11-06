/**
 * Territory Runner - History Screen
 * 历史记录界面：列表展示所有跑步记录
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import { useRunHistory } from '../hooks/useRunHistory';
import { RunRecord } from '../types';
import { formatDistance, formatDuration, formatPace, formatDateTime } from '../utils/formatters';

export function HistoryScreen() {
  const { runs, isLoading, deleteRun, refresh } = useRunHistory();
  const [selectedRun, setSelectedRun] = useState<RunRecord | null>(null);

  /**
   * 点击列表项
   */
  const handleRunPress = (run: RunRecord) => {
    setSelectedRun(run);
  };

  /**
   * 关闭详情弹窗
   */
  const handleCloseModal = () => {
    setSelectedRun(null);
  };

  /**
   * 删除记录
   */
  const handleDelete = (run: RunRecord) => {
    Alert.alert('删除记录', '确定要删除这条记录吗？', [
      { text: '取消', style: 'cancel' },
      {
        text: '删除',
        style: 'destructive',
        onPress: async () => {
          await deleteRun(run.id);
          setSelectedRun(null);
          Alert.alert('成功', '记录已删除');
        },
      },
    ]);
  };

  /**
   * 渲染列表项
   */
  const renderItem = ({ item }: { item: RunRecord }) => (
    <TouchableOpacity style={styles.runCard} onPress={() => handleRunPress(item)}>
      <View style={styles.runCardHeader}>
        <Text style={styles.runDate}>{formatDateTime(item.startedAt)}</Text>
      </View>
      <View style={styles.runCardStats}>
        <View style={styles.runStat}>
          <Text style={styles.runStatValue}>{formatDistance(item.distance)}</Text>
          <Text style={styles.runStatLabel}>距离</Text>
        </View>
        <View style={styles.runStat}>
          <Text style={styles.runStatValue}>{formatDuration(item.elapsedSec)}</Text>
          <Text style={styles.runStatLabel}>时长</Text>
        </View>
        <View style={styles.runStat}>
          <Text style={styles.runStatValue}>{formatPace(item.pace)}</Text>
          <Text style={styles.runStatLabel}>配速</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  /**
   * 空状态
   */
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyText}>还没有跑步记录</Text>
      <Text style={styles.emptySubtext}>完成第一次跑步后记录会显示在这里</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {isLoading && runs.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        <FlatList
          data={runs}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmptyState}
          onRefresh={refresh}
          refreshing={isLoading}
        />
      )}

      {/* 详情弹窗 */}
      <Modal
        visible={selectedRun !== null}
        transparent
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={handleCloseModal}>
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            {selectedRun && (
              <>
                <Text style={styles.modalTitle}>跑步详情</Text>
                
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>开始时间</Text>
                  <Text style={styles.modalValue}>{formatDateTime(selectedRun.startedAt)}</Text>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>结束时间</Text>
                  <Text style={styles.modalValue}>{formatDateTime(selectedRun.endedAt)}</Text>
                </View>

                <View style={styles.modalStatsRow}>
                  <View style={styles.modalStat}>
                    <Text style={styles.modalStatLabel}>距离</Text>
                    <Text style={styles.modalStatValue}>{formatDistance(selectedRun.distance)}</Text>
                  </View>
                  <View style={styles.modalStat}>
                    <Text style={styles.modalStatLabel}>时长</Text>
                    <Text style={styles.modalStatValue}>{formatDuration(selectedRun.elapsedSec)}</Text>
                  </View>
                  <View style={styles.modalStat}>
                    <Text style={styles.modalStatLabel}>配速</Text>
                    <Text style={styles.modalStatValue}>{formatPace(selectedRun.pace)}</Text>
                  </View>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>路径点数量</Text>
                  <Text style={styles.modalValue}>{selectedRun.path.length} 个</Text>
                </View>

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDelete(selectedRun)}
                  >
                    <Text style={styles.deleteButtonText}>删除</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
                    <Text style={styles.closeButtonText}>关闭</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  runCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  runCardHeader: {
    marginBottom: 12,
  },
  runDate: {
    fontSize: 14,
    color: '#666',
  },
  runCardStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  runStat: {
    alignItems: 'center',
  },
  runStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  runStatLabel: {
    fontSize: 12,
    color: '#999',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalSection: {
    marginBottom: 16,
  },
  modalLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 4,
  },
  modalValue: {
    fontSize: 16,
    color: '#333',
  },
  modalStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#EEE',
  },
  modalStat: {
    alignItems: 'center',
  },
  modalStatLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  modalStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 20,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#FF3B30',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  deleteButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 8,
  },
  closeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

