<template>
  <div class="daily-tracker">
    <div class="daily-tracker-header">
      <h2 class="text-lg font-medium text-dark mb-2">Activités du jour</h2>
      <p class="text-sm text-gray-500 mb-4">{{ todayFormatted }}</p>
    </div>
    
    <div class="daily-tracker-form">
      <div v-for="activity in activityTypes" :key="activity.id" class="activity-input-group">
        <div class="activity-label">
          <span 
            class="activity-color" 
            :style="{ backgroundColor: activity.color }"
          ></span>
          <span>{{ activity.name }}</span>
        </div>
        
        <div class="activity-controls">
          <button 
            @click="decrementActivity(activity.id)"
            class="activity-btn"
            :disabled="todayActivities[activity.id] <= 0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
              <path fill-rule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
            </svg>
          </button>
          
          <input 
            type="number" 
            v-model.number="todayActivities[activity.id]" 
            :min="0" 
            :max="activity.maxValue"
            class="activity-input"
            @change="saveActivities"
          />
          
          <button 
            @click="incrementActivity(activity.id)"
            class="activity-btn"
            :disabled="todayActivities[activity.id] >= activity.maxValue"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
              <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div class="activity-unit">{{ activity.unit }}</div>
      </div>
      
      <div class="activity-actions">
        <button @click="saveActivities" class="save-btn">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 mr-1">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
          Enregistrer
        </button>
        
        <button @click="resetActivities" class="reset-btn">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 mr-1">
            <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
          </svg>
          Réinitialiser
        </button>
      </div>
    </div>
    
    <div class="activity-streak">
      <div class="streak-header">
        <h3 class="text-md font-medium">Votre série actuelle</h3>
        <span class="streak-count">{{ currentStreak }} jours</span>
      </div>
      
      <div class="streak-progress">
        <div class="streak-bar" :style="{ width: `${streakPercentage}%` }"></div>
      </div>
      
      <p class="streak-message">
        <template v-if="currentStreak > 0">
          Continuez comme ça ! Vous êtes sur une série de {{ currentStreak }} jours.
        </template>
        <template v-else>
          Commencez votre série aujourd'hui en enregistrant vos activités !
        </template>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { format, subDays, parseISO, isYesterday } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useTrackerStore } from '@/stores/tracker/tracker';

const trackerStore = useTrackerStore();

// Activity types
const activityTypes = [
  { id: 'coding', name: 'Programmation', color: '#2563eb', unit: 'heures', maxValue: 12 },
  { id: 'reading', name: 'Lecture', color: '#10b981', unit: 'pages', maxValue: 100 }
];

// Today's date formatted
const todayFormatted = computed(() => {
  return format(new Date(), 'EEEE d MMMM yyyy', { locale: fr });
});

// Today's activities
const todayActivities = ref<Record<string, number>>({});

// Initialize today's activities
const initTodayActivities = () => {
  const today = format(new Date(), 'yyyy-MM-dd');
  const activities = trackerStore.getActivitiesForDate(today) || {};
  
  activityTypes.forEach(type => {
    todayActivities.value[type.id] = activities[type.id] || 0;
  });
};

// Increment activity value
const incrementActivity = (activityId: string) => {
  const activity = activityTypes.find(a => a.id === activityId);
  if (!activity) return;
  
  if (todayActivities.value[activityId] < activity.maxValue) {
    todayActivities.value[activityId]++;
    saveActivities();
  }
};

// Decrement activity value
const decrementActivity = (activityId: string) => {
  if (todayActivities.value[activityId] > 0) {
    todayActivities.value[activityId]--;
    saveActivities();
  }
};

// Save activities
const saveActivities = () => {
  const today = format(new Date(), 'yyyy-MM-dd');
  trackerStore.saveActivities(today, todayActivities.value);
};

// Reset activities
const resetActivities = () => {
  activityTypes.forEach(type => {
    todayActivities.value[type.id] = 0;
  });
  saveActivities();
};

// Calculate current streak
const currentStreak = computed(() => {
  let streak = 0;
  const today = new Date();
  let checkDate = today;
  let hasActivityToday = false;
  
  // Check if there's activity today
  const todayStr = format(today, 'yyyy-MM-dd');
  const todayActivities = trackerStore.getActivitiesForDate(todayStr);
  
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
    const activities = trackerStore.getActivitiesForDate(dateStr);
    
    if (activities && Object.values(activities).some(v => v > 0)) {
      streak++;
      daysBefore++;
    } else {
      continuousStreak = false;
    }
  }
  
  return streak;
});

// Calculate streak percentage (max 30 days)
const streakPercentage = computed(() => {
  return Math.min(100, (currentStreak.value / 30) * 100);
});

// Load activities on mount
onMounted(() => {
  trackerStore.loadActivities();
  initTodayActivities();
});
</script>

<style scoped>
.daily-tracker {
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.daily-tracker-header {
  margin-bottom: 1.5rem;
}

.activity-input-group {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.activity-label {
  display: flex;
  align-items: center;
  width: 40%;
  font-weight: 500;
}

.activity-color {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 0.5rem;
}

.activity-controls {
  display: flex;
  align-items: center;
  margin: 0 1rem;
}

.activity-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.375rem;
  background-color: #f3f4f6;
  color: #4b5563;
  transition: all 0.2s;
}

.activity-btn:hover:not(:disabled) {
  background-color: #e5e7eb;
}

.activity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.activity-input {
  width: 3rem;
  height: 2rem;
  text-align: center;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  margin: 0 0.5rem;
  font-weight: 600;
}

.activity-unit {
  color: #6b7280;
  font-size: 0.875rem;
}

.activity-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.save-btn, .reset-btn {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.save-btn {
  background-color: #3b82f6;
  color: white;
}

.save-btn:hover {
  background-color: #2563eb;
}

.reset-btn {
  background-color: #f3f4f6;
  color: #4b5563;
}

.reset-btn:hover {
  background-color: #e5e7eb;
}

.activity-streak {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.streak-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.streak-count {
  font-weight: 600;
  color: #3b82f6;
}

.streak-progress {
  height: 0.5rem;
  background-color: #e5e7eb;
  border-radius: 9999px;
  overflow: hidden;
  margin-bottom: 0.75rem;
}

.streak-bar {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
  border-radius: 9999px;
  transition: width 0.3s ease;
}

.streak-message {
  font-size: 0.875rem;
  color: #6b7280;
  text-align: center;
}
</style>
