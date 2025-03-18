import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { format, subDays, parseISO } from 'date-fns';

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

  // Actions
  /**
   * Load activities from local storage
   */
  function loadActivities() {
    try {
      const storedActivities = localStorage.getItem('activities');
      if (storedActivities) {
        activities.value = JSON.parse(storedActivities);
      } else {
        // If no activities in localStorage, use sample activities
        activities.value = sampleActivitiesData;
        saveToLocalStorage();
      }
    } catch (error) {
      console.error('Failed to load activities from localStorage:', error);
      // Use sample activities if there's an error
      activities.value = sampleActivitiesData;
      saveToLocalStorage();
    }
  }

  /**
   * Save activities to local storage
   */
  function saveToLocalStorage() {
    try {
      localStorage.setItem('activities', JSON.stringify(activities.value));
    } catch (error) {
      console.error('Failed to save activities to localStorage:', error);
    }
  }

  /**
   * Save activities for a specific date
   * @param date - Date string in format 'yyyy-MM-dd'
   * @param dateActivities - Activities to save for the date
   */
  function saveActivities(date: string, dateActivities: DateActivities) {
    activities.value[date] = dateActivities;
    saveToLocalStorage();
  }

  /**
   * Clear activities for a specific date
   * @param date - Date string in format 'yyyy-MM-dd'
   * @returns Boolean indicating success
   */
  function clearActivitiesForDate(date: string): boolean {
    if (!activities.value[date]) return false;
    
    delete activities.value[date];
    saveToLocalStorage();
    return true;
  }

  return {
    activities,
    allActivities,
    getActivitiesForDate,
    getActivitiesByType,
    loadActivities,
    saveActivities,
    clearActivitiesForDate
  };
});
