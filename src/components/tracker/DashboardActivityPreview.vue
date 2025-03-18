<template>
  <div class="dashboard-activity-preview">
    <div class="activity-header">
      <h3 class="activity-title">Activités récentes</h3>
      <router-link to="/tracker" class="view-all-link">
        Voir tout
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
          <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
        </svg>
      </router-link>
    </div>
    
    <div class="current-streak">
      <div class="streak-info">
        <div class="streak-label">Série actuelle</div>
        <div class="streak-value">{{ currentStreak }} jours</div>
      </div>
      <div class="streak-progress">
        <div class="streak-bar" :style="{ width: `${streakPercentage}%` }"></div>
      </div>
    </div>
    
    <div class="today-activities">
      <h4 class="today-title">Aujourd'hui</h4>
      <div class="activities-list">
        <div v-for="activity in activityTypes" :key="activity.id" class="activity-item">
          <div class="activity-info">
            <div class="activity-color" :style="{ backgroundColor: activity.color }"></div>
            <div class="activity-name">{{ activity.name }}</div>
          </div>
          <div class="activity-value">
            {{ getTodayActivityValue(activity.id) }} {{ activity.unit }}
          </div>
        </div>
      </div>
      
      <router-link to="/tracker" class="add-activity-btn">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 mr-1">
          <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        Ajouter une activité
      </router-link>
    </div>
    
    <div class="weekly-preview">
      <h4 class="week-title">Cette semaine</h4>
      <div class="days-grid">
        <div v-for="(day, index) in weekDays" :key="index" class="day-item">
          <div class="day-label">{{ day.label }}</div>
          <div 
            :class="[
              'day-indicator', 
              { 'has-activity': day.hasActivity },
              { 'is-today': day.isToday }
            ]"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { format, startOfWeek, addDays, isToday } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useTrackerStore } from '@/stores/tracker/tracker';

const trackerStore = useTrackerStore();

// Activity types
const activityTypes = [
  { id: 'coding', name: 'Programmation', color: '#2563eb', unit: 'heures', maxValue: 12 },
  { id: 'reading', name: 'Lecture', color: '#10b981', unit: 'pages', maxValue: 100 }
];

// Current streak
const currentStreak = computed(() => {
  return trackerStore.getCurrentStreak();
});

// Streak percentage (max 30 days)
const streakPercentage = computed(() => {
  return Math.min(100, (currentStreak.value / 30) * 100);
});

// Get today's activity value
const getTodayActivityValue = (activityId: string) => {
  const today = format(new Date(), 'yyyy-MM-dd');
  const activities = trackerStore.getActivitiesForDate(today);
  return activities ? (activities[activityId] || 0) : 0;
};

// Generate week days
const weekDays = computed(() => {
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const days = [];
  
  for (let i = 0; i < 7; i++) {
    const date = addDays(weekStart, i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const activities = trackerStore.getActivitiesForDate(dateStr);
    const hasActivity = !!activities && Object.values(activities).some(v => v > 0);
    
    days.push({
      date,
      label: format(date, 'EEE', { locale: fr }).charAt(0),
      hasActivity,
      isToday: isToday(date)
    });
  }
  
  return days;
});

// Load activities on mount
onMounted(() => {
  trackerStore.loadActivities();
});
</script>

<style scoped>
.dashboard-activity-preview {
  padding: 1.25rem;
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}

.activity-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
}

.view-all-link {
  display: flex;
  align-items: center;
  color: #3b82f6;
  font-size: 0.875rem;
  font-weight: 500;
  transition: color 0.2s;
}

.view-all-link:hover {
  color: #2563eb;
}

.current-streak {
  margin-bottom: 1.5rem;
}

.streak-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.streak-label {
  font-size: 0.875rem;
  color: #64748b;
}

.streak-value {
  font-weight: 600;
  color: #3b82f6;
}

.streak-progress {
  height: 0.5rem;
  background-color: #e5e7eb;
  border-radius: 9999px;
  overflow: hidden;
}

.streak-bar {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
  border-radius: 9999px;
  transition: width 0.3s ease;
}

.today-activities {
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.today-title, .week-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 0.75rem;
}

.activities-list {
  margin-bottom: 1rem;
}

.activity-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
}

.activity-info {
  display: flex;
  align-items: center;
}

.activity-color {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 9999px;
  margin-right: 0.5rem;
}

.activity-name {
  font-size: 0.875rem;
  color: #1e293b;
}

.activity-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
}

.add-activity-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.5rem;
  background-color: #f1f5f9;
  color: #64748b;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
}

.add-activity-btn:hover {
  background-color: #e2e8f0;
  color: #334155;
}

.days-grid {
  display: flex;
  justify-content: space-between;
}

.day-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.day-label {
  font-size: 0.75rem;
  color: #64748b;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
}

.day-indicator {
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 9999px;
  background-color: #f1f5f9;
}

.day-indicator.has-activity {
  background-color: #bfdbfe;
}

.day-indicator.is-today {
  border: 2px solid #3b82f6;
}

.day-indicator.is-today.has-activity {
  background-color: #93c5fd;
}
</style>
