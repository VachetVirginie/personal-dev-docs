import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { format, subDays, parseISO, addDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

/**
 * Interface representing activities for a specific date
 */
interface DateActivities {
  [activityId: string]: number;
}

/**
 * Interface representing all activities indexed by date
 */
interface ActivitiesRecord {
  [date: string]: DateActivities;
}

// Generate sample activity data for the last 90 days
function generateSampleActivities(): ActivitiesRecord {
  const sampleActivities: ActivitiesRecord = {};
  const today = new Date();
  
  // Generate activities for the last 90 days
  for (let i = 0; i < 90; i++) {
    const date = subDays(today, i);
    const dateStr = format(date, 'yyyy-MM-dd');
    
    // Skip some days randomly to create a more realistic pattern
    if (Math.random() > 0.7) continue;
    
    // Create random activities
    const dayActivities: DateActivities = {};
    
    // Coding activity (0-8 hours)
    if (Math.random() > 0.3) {
      dayActivities.coding = Math.floor(Math.random() * 8) + 1;
    }
    
    // Reading activity (0-100 pages)
    if (Math.random() > 0.4) {
      dayActivities.reading = Math.floor(Math.random() * 100) + 1;
    }
    
    // Only add if there are activities for this day
    if (Object.keys(dayActivities).length > 0) {
      sampleActivities[dateStr] = dayActivities;
    }
  }
  
  // Add more intense activity for recent days
  const recentDates = [
    format(today, 'yyyy-MM-dd'),
    format(subDays(today, 1), 'yyyy-MM-dd'),
    format(subDays(today, 2), 'yyyy-MM-dd')
  ];
  
  recentDates.forEach(dateStr => {
    sampleActivities[dateStr] = {
      coding: Math.floor(Math.random() * 5) + 3, // 3-8 hours
      reading: Math.floor(Math.random() * 50) + 30 // 30-80 pages
    };
  });
  
  return sampleActivities;
}

// Sample activities data
const sampleActivitiesData = generateSampleActivities();

/**
 * Store for managing activity tracking
 */
export const useTrackerStore = defineStore('tracker', () => {
  // State
  const activities = ref<ActivitiesRecord>({});

  // Getters
  /**
   * Get all activities
   */
  const allActivities = computed(() => activities.value);

  /**
   * Get activities for a specific date
   * @param date - Date string in format 'yyyy-MM-dd'
   * @returns Activities for the specified date or undefined if none exist
   */
  function getActivitiesForDate(date: string): DateActivities | undefined {
    return activities.value[date];
  }

  /**
   * Get activities for a specific activity type
   * @param activityId - ID of the activity type
   * @returns Object with dates as keys and activity values as values
   */
  function getActivitiesByType(activityId: string): Record<string, number> {
    const result: Record<string, number> = {};
    
    Object.entries(activities.value).forEach(([date, dateActivities]) => {
      if (dateActivities[activityId]) {
        result[date] = dateActivities[activityId];
      }
    });
    
    return result;
  }

  /**
   * Get activities for a specific month
   * @param year - Year
   * @param month - Month (0-11)
   * @returns Object with dates as keys and activities as values
   */
  function getActivitiesForMonth(year: number, month: number): Record<string, DateActivities> {
    const result: Record<string, DateActivities> = {};
    const monthStart = startOfMonth(new Date(year, month));
    const monthEnd = endOfMonth(new Date(year, month));
    
    // Get all days in the month
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    // Check each day for activities
    daysInMonth.forEach(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const dayActivities = activities.value[dateStr];
      
      if (dayActivities) {
        result[dateStr] = dayActivities;
      }
    });
    
    return result;
  }

  /**
   * Calculate current streak of consecutive days with activities
   * @returns Number of consecutive days with activities
   */
  function getCurrentStreak(): number {
    let streak = 0;
    const today = new Date();
    let checkDate = today;
    let hasActivityToday = false;
    
    // Check if there's activity today
    const todayStr = format(today, 'yyyy-MM-dd');
    const todayActivities = activities.value[todayStr];
    
    if (todayActivities && Object.values(todayActivities).some(v => v > 0)) {
      hasActivityToday = true;
      streak = 1;
    }
    
    // Check previous days
    let daysBefore = 1;
    let continuousStreak = hasActivityToday;
    
    while (continuousStreak) {
      checkDate = subDays(today, daysBefore);
      const dateStr = format(checkDate, 'yyyy-MM-dd');
      const dateActivities = activities.value[dateStr];
      
      if (dateActivities && Object.values(dateActivities).some(v => v > 0)) {
        streak++;
        daysBefore++;
      } else {
        continuousStreak = false;
      }
    }
    
    // If no activity today, check if there was activity yesterday and count backwards
    if (!hasActivityToday) {
      checkDate = subDays(today, 1);
      let daysBefore = 0;
      continuousStreak = true;
      
      while (continuousStreak) {
        const dateStr = format(checkDate, 'yyyy-MM-dd');
        const dateActivities = activities.value[dateStr];
        
        if (dateActivities && Object.values(dateActivities).some(v => v > 0)) {
          streak++;
          daysBefore++;
          checkDate = subDays(today, daysBefore + 1);
        } else {
          continuousStreak = false;
        }
      }
    }
    
    return streak;
  }

  /**
   * Get total activity counts for each activity type
   * @returns Object with activity IDs as keys and total counts as values
   */
  function getTotalActivityCounts(): Record<string, number> {
    const totals: Record<string, number> = {};
    
    Object.values(activities.value).forEach(dateActivities => {
      Object.entries(dateActivities).forEach(([activityId, value]) => {
        if (!totals[activityId]) {
          totals[activityId] = 0;
        }
        totals[activityId] += value;
      });
    });
    
    return totals;
  }

  /**
   * Load activities from local storage
   */
  function loadActivities() {
    try {
      const storedActivities = localStorage.getItem('activities');
      if (storedActivities) {
        activities.value = JSON.parse(storedActivities);
      } else {
        // Use sample data if no stored activities
        activities.value = sampleActivitiesData;
        saveToLocalStorage();
      }
    } catch (error) {
      console.error('Error loading activities:', error);
      activities.value = {};
    }
  }

  /**
   * Save activities to local storage
   */
  function saveToLocalStorage() {
    try {
      localStorage.setItem('activities', JSON.stringify(activities.value));
    } catch (error) {
      console.error('Error saving activities:', error);
    }
  }

  /**
   * Save activities for a specific date
   * @param date - Date string in format 'yyyy-MM-dd'
   * @param dateActivities - Activities to save for the date
   */
  function saveActivities(date: string, dateActivities: DateActivities) {
    activities.value[date] = { ...dateActivities };
    saveToLocalStorage();
  }

  /**
   * Clear activities for a specific date
   * @param date - Date string in format 'yyyy-MM-dd'
   * @returns Boolean indicating success
   */
  function clearActivitiesForDate(date: string): boolean {
    if (activities.value[date]) {
      delete activities.value[date];
      saveToLocalStorage();
      return true;
    }
    return false;
  }

  return {
    activities,
    allActivities,
    getActivitiesForDate,
    getActivitiesByType,
    getActivitiesForMonth,
    getCurrentStreak,
    getTotalActivityCounts,
    loadActivities,
    saveActivities,
    clearActivitiesForDate
  };
});
