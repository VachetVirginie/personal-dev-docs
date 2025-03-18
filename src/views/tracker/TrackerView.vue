<template>
  <div class="grid grid-cols-1 gap-6">
    <!-- Daily Tracker -->
    <div>
      <DailyTracker />
    </div>
    
    <!-- Activity Grid and Monthly Calendar -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Activity Grid -->
      <div>
        <ActivityGrid />
      </div>
      
      <!-- Monthly Calendar -->
      <div>
        <MonthlyCalendar />
      </div>
    </div>
    
    <!-- Activity Stats -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-lg font-medium text-dark mb-4">Statistiques d'activité</h2>
      
      <div class="mb-6">
        <div class="flex justify-between items-center mb-2">
          <h3 class="font-medium">Résumé hebdomadaire</h3>
          <div class="text-sm text-gray-500">{{ currentWeekRange }}</div>
        </div>
        <div class="h-64">
          <WeeklyActivityChart />
        </div>
      </div>
      
      <div>
        <div class="flex justify-between items-center mb-2">
          <h3 class="font-medium">Tendances mensuelles</h3>
          <div class="text-sm text-gray-500">{{ currentYear }}</div>
        </div>
        <div class="h-64">
          <MonthlyActivityChart />
        </div>
      </div>
    </div>
    
    <!-- Activity Summary -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-lg font-medium text-dark mb-4">Résumé des activités</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="activity-summary-card">
          <div class="activity-summary-header">
            <div class="activity-icon coding-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-6 h-6">
                <path fill-rule="evenodd" d="M6.28 5.22a.75.75 0 010 1.06L2.56 10l3.72 3.72a.75.75 0 01-1.06 1.06L.97 10.53a.75.75 0 010-1.06l4.25-4.25a.75.75 0 011.06 0zm7.44 0a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-1.06L17.44 10l-3.72-3.72a.75.75 0 010-1.06z" clip-rule="evenodd" />
              </svg>
            </div>
            <h3 class="activity-title">Programmation</h3>
          </div>
          
          <div class="activity-stats">
            <div class="stat-item">
              <span class="stat-label">Total</span>
              <span class="stat-value">{{ totalCoding }} heures</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Moyenne / jour actif</span>
              <span class="stat-value">{{ avgCoding }} heures</span>
            </div>
          </div>
        </div>
        
        <div class="activity-summary-card">
          <div class="activity-summary-header">
            <div class="activity-icon reading-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-6 h-6">
                <path d="M10.75 16.82A7.462 7.462 0 0115 15.5c.71 0 1.396.098 2.046.282A.75.75 0 0018 15.06v-11a.75.75 0 00-.546-.721A9.006 9.006 0 0015 3a8.963 8.963 0 00-4.25 1.065V16.82zM9.25 4.065A8.963 8.963 0 005 3c-.85 0-1.673.118-2.454.339A.75.75 0 002 4.06v11a.75.75 0 00.954.721A7.506 7.506 0 015 15.5c1.579 0 3.042.487 4.25 1.32V4.065z" />
              </svg>
            </div>
            <h3 class="activity-title">Lecture</h3>
          </div>
          
          <div class="activity-stats">
            <div class="stat-item">
              <span class="stat-label">Total</span>
              <span class="stat-value">{{ totalReading }} pages</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Moyenne / jour actif</span>
              <span class="stat-value">{{ avgReading }} pages</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useTrackerStore } from '@/stores/tracker/tracker';
import ActivityGrid from '@/components/tracker/ActivityGrid.vue';
import WeeklyActivityChart from '@/components/tracker/WeeklyActivityChart.vue';
import MonthlyActivityChart from '@/components/tracker/MonthlyActivityChart.vue';
import DailyTracker from '@/components/tracker/DailyTracker.vue';
import MonthlyCalendar from '@/components/tracker/MonthlyCalendar.vue';

const trackerStore = useTrackerStore();

/**
 * Load activities when component is mounted
 */
onMounted(() => {
  trackerStore.loadActivities();
});

/**
 * Get the current week range formatted as a string
 */
const currentWeekRange = computed(() => {
  const now = new Date();
  const start = startOfWeek(now, { weekStartsOn: 1 });
  const end = endOfWeek(now, { weekStartsOn: 1 });
  return `${format(start, 'd MMM', { locale: fr })} - ${format(end, 'd MMM yyyy', { locale: fr })}`;
});

/**
 * Get the current year
 */
const currentYear = computed(() => {
  return new Date().getFullYear();
});

/**
 * Get total coding hours
 */
const totalCoding = computed(() => {
  const totals = trackerStore.getTotalActivityCounts();
  return totals.coding || 0;
});

/**
 * Get average coding hours per active day
 */
const avgCoding = computed(() => {
  const codingActivities = trackerStore.getActivitiesByType('coding');
  const totalDays = Object.keys(codingActivities).length;
  
  if (totalDays === 0) return 0;
  
  const totalHours = Object.values(codingActivities).reduce((sum, value) => sum + value, 0);
  return (totalHours / totalDays).toFixed(1);
});

/**
 * Get total reading pages
 */
const totalReading = computed(() => {
  const totals = trackerStore.getTotalActivityCounts();
  return totals.reading || 0;
});

/**
 * Get average reading pages per active day
 */
const avgReading = computed(() => {
  const readingActivities = trackerStore.getActivitiesByType('reading');
  const totalDays = Object.keys(readingActivities).length;
  
  if (totalDays === 0) return 0;
  
  const totalPages = Object.values(readingActivities).reduce((sum, value) => sum + value, 0);
  return (totalPages / totalDays).toFixed(1);
});
</script>

<style scoped>
.activity-summary-card {
  background-color: #f9fafb;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

.activity-summary-header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.activity-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 9999px;
  margin-right: 1rem;
  color: white;
}

.coding-icon {
  background-color: #2563eb;
}

.reading-icon {
  background-color: #10b981;
}

.activity-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
}

.activity-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
}
</style>
