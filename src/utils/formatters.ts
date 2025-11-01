/**
 * Territory Runner - Formatting Utilities
 * 格式化显示函数：距离、时间、配速
 */

/**
 * 格式化距离
 * @param meters 距离（米）
 * @param decimals 小数位数，默认 2
 * @returns 格式化的距离字符串，如 "3.50 km" 或 "520 m"
 */
export function formatDistance(meters: number, decimals: number = 2): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  const km = meters / 1000;
  return `${km.toFixed(decimals)} km`;
}

/**
 * 格式化时长
 * @param seconds 秒数
 * @returns 格式化的时长字符串，如 "1:23:45" 或 "12:30"
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * 格式化配速（秒/公里 → mm:ss/km）
 * @param secPerKm 配速（秒/公里）
 * @returns 格式化的配速字符串，如 "5:30/km" 或 "--"
 */
export function formatPace(secPerKm: number): string {
  if (!secPerKm || secPerKm <= 0 || !isFinite(secPerKm)) {
    return '--';
  }
  
  // 过滤异常慢的配速（超过 20 分钟/公里）
  if (secPerKm > 1200) {
    return '--';
  }

  const minutes = Math.floor(secPerKm / 60);
  const seconds = Math.floor(secPerKm % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}/km`;
}

/**
 * 格式化日期时间
 * @param timestamp Unix timestamp (ms)
 * @returns 格式化的日期字符串，如 "2024-11-01 14:30"
 */
export function formatDateTime(timestamp: number): string {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

/**
 * 格式化日期（仅日期部分）
 * @param timestamp Unix timestamp (ms)
 * @returns 格式化的日期字符串，如 "2024-11-01"
 */
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 格式化相对时间
 * @param timestamp Unix timestamp (ms)
 * @returns 相对时间字符串，如 "2 小时前"、"昨天"、"3 天前"
 */
export function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 7) {
    return formatDate(timestamp);
  } else if (days > 1) {
    return `${days} 天前`;
  } else if (days === 1) {
    return '昨天';
  } else if (hours > 0) {
    return `${hours} 小时前`;
  } else if (minutes > 0) {
    return `${minutes} 分钟前`;
  } else {
    return '刚刚';
  }
}

