/**
 * Territory Runner - Social Page
 * Social feed, leaderboard, and friends views
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { mockUsers, mockPosts, mockFriends, SocialPost } from '../data/mockSocial';
import type { SocialSubView } from './BottomNav';

interface SocialPageProps {
  socialSubView?: SocialSubView;
}

export default function SocialPage({ socialSubView }: SocialPageProps) {
  const [currentView, setCurrentView] = useState<SocialSubView>('feed');
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (socialSubView) {
      setCurrentView(socialSubView);
    }
  }, [socialSubView]);

  const renderView = () => {
    switch (currentView) {
      case 'feed':
        return <FeedView />;
      case 'leaderboard':
        return <LeaderboardView />;
      case 'friends':
        return <FriendsView />;
      default:
        return <FeedView />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ paddingTop: insets.top }} />
      {renderView()}
    </View>
  );
}

// Feed View
function FeedView() {
  const [feedSubTab, setFeedSubTab] = useState<'explore' | 'local' | 'friends'>('explore');
  const insets = useSafeAreaInsets();

  const getPosts = () => {
    if (feedSubTab === 'explore') {
      return mockPosts.slice(0, 5);
    } else if (feedSubTab === 'local') {
      return mockPosts.filter(p => p.location).slice(0, 3);
    } else {
      return mockPosts.filter(p => p.user.isFriend);
    }
  };

  return (
    <View style={styles.container}>
      {/* Sub-tabs */}
      <View style={[styles.subTabsContainer, { paddingTop: Math.max(insets.top, 12) }]}>
        <View style={styles.subTabs}>
          {(['explore', 'local', 'friends'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setFeedSubTab(tab)}
              style={[
                styles.subTab,
                feedSubTab === tab && styles.subTabActive,
              ]}
            >
              <Text
                style={[
                  styles.subTabText,
                  feedSubTab === tab && styles.subTabTextActive,
                ]}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Posts */}
      <ScrollView style={styles.scrollView}>
        {getPosts().map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </ScrollView>
    </View>
  );
}

// Post Card Component
function PostCard({ post }: { post: SocialPost }) {
  return (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <Image source={{ uri: post.user.avatar }} style={styles.postAvatar} />
        <View style={styles.postHeaderInfo}>
          <Text style={styles.postUserName}>{post.user.name}</Text>
          {post.location && (
            <Text style={styles.postLocation}>{post.location}</Text>
          )}
        </View>
      </View>
      
      {post.imageUrl && (
        <Image source={{ uri: post.imageUrl }} style={styles.postImage} />
      )}
      
      {post.achievementDetails && (
        <View style={styles.achievementCard}>
          <Text style={styles.achievementIcon}>{post.achievementDetails.icon}</Text>
          <View>
            <Text style={styles.achievementTitle}>
              {post.achievementDetails.title}
            </Text>
            <Text style={styles.achievementDescription}>
              {post.achievementDetails.description}
            </Text>
          </View>
        </View>
      )}
      
      {post.caption && (
        <Text style={styles.postCaption}>{post.caption}</Text>
      )}
      
      <View style={styles.postFooter}>
        <Text style={styles.postFooterText}>❤️ {post.likes}</Text>
        <Text style={styles.postFooterText}>💬 {post.comments}</Text>
      </View>
    </View>
  );
}

// Leaderboard View
function LeaderboardView() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.leaderboardContainer}>
        {mockUsers.slice(0, 10).map((user, index) => (
          <View key={user.id} style={styles.leaderboardItem}>
            <Text style={styles.rank}>{index + 1}</Text>
            <Image source={{ uri: user.avatar }} style={styles.leaderboardAvatar} />
            <View style={styles.leaderboardInfo}>
              <Text style={styles.leaderboardName}>{user.name}</Text>
              <Text style={styles.leaderboardTerritory}>
                {user.territory.toLocaleString()} ft²
              </Text>
            </View>
            {user.rankChange && (
              <Text style={styles.rankChange}>
                {user.rankChange > 0 ? '↑' : '↓'} {Math.abs(user.rankChange)}
              </Text>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

// Friends View
function FriendsView() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.friendsContainer}>
        {mockFriends.map((friend) => (
          <View key={friend.id} style={styles.friendCard}>
            <Image source={{ uri: friend.avatar }} style={styles.friendAvatar} />
            <View style={styles.friendInfo}>
              <Text style={styles.friendName}>{friend.name}</Text>
              <Text style={styles.friendStats}>
                {friend.territory.toLocaleString()} ft² • Rank #{friend.rank}
              </Text>
              {friend.sharedTerritory && (
                <Text style={styles.sharedTerritory}>
                  Shared: {friend.sharedTerritory.toLocaleString()} ft²
                </Text>
              )}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingBottom: 100,
  },
  subTabsContainer: {
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 12,
  },
  subTabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 4,
    marginHorizontal: 16,
  },
  subTab: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  subTabActive: {
    backgroundColor: '#FFF',
  },
  subTabText: {
    fontSize: 14,
    color: '#6B7280',
  },
  subTabTextActive: {
    color: '#111827',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  postCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    padding: 12,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  postHeaderInfo: {
    flex: 1,
  },
  postUserName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  postLocation: {
    fontSize: 12,
    color: '#6B7280',
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  achievementIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  achievementDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
  postCaption: {
    fontSize: 14,
    color: '#111827',
    marginBottom: 8,
  },
  postFooter: {
    flexDirection: 'row',
    gap: 16,
  },
  postFooterText: {
    fontSize: 14,
    color: '#6B7280',
  },
  leaderboardContainer: {
    padding: 16,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  rank: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    width: 30,
  },
  leaderboardAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  leaderboardInfo: {
    flex: 1,
  },
  leaderboardName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  leaderboardTerritory: {
    fontSize: 14,
    color: '#6B7280',
  },
  rankChange: {
    fontSize: 14,
    color: '#10B981',
  },
  friendsContainer: {
    padding: 16,
  },
  friendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  friendAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 12,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  friendStats: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  sharedTerritory: {
    fontSize: 12,
    color: '#10B981',
  },
});

