<template>
  <div class="monthly-calendar">
    <div class="calendar-header">
      <h2 class="text-lg font-medium text-dark mb-2">Calendrier mensuel</h2>
      
      <div class="month-selector">
        <button 
          @click="changeMonth(-1)" 
          class="month-btn"
          aria-label="Mois précédent"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
            <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        </button>
        <span class="month-display">{{ currentMonthName }} {{ currentYear }}</span>
        <button 
          @click="changeMonth(1)" 
          class="month-btn"
          :disabled="isCurrentMonthAndYear"
          aria-label="Mois suivant"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
    
    <div class="calendar-grid">
      <div v-for="day in daysOfWeek" :key="day" class="day-header">{{ day }}</div>
      
      <template v-for="(day, index) in daysInMonth" :key="index">
        <div 
          :class="[
            'calendar-day',
            { 'current-month': day.currentMonth },
            { 'today': day.isToday },
            { 'has-activity': day.hasActivity }
          ]"
          @click="openActivityModal(day.date)"
        >
          <div class="day-number">{{ day.dayNumber }}</div>
          <div v-if="day.hasActivity" class="activity-indicators">
            <div 
              v-for="(activity, actIndex) in day.activities" 
              :key="actIndex"
              v-show="activity.value > 0"
              class="activity-dot"
              :style="{ backgroundColor: activity.color }"
              :title="`${activity.name}: ${activity.value} ${activity.unit}`"
            ></div>
          </div>
        </div>
      </template>
    </div>
    
    <!-- Activity Modal -->
    <div v-if="showModal" class="activity-modal-overlay">
      <div class="activity-modal">
        <div class="modal-header">
          <h3 class="modal-title">{{ formatDate(selectedDate) }}</h3>
          <button @click="showModal = false" class="modal-close" aria-label="Fermer">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div class="modal-body">
          <div v-for="(activity, index) in activityTypes" :key="index" class="activity-input">
            <div class="activity-input-header">
              <div class="activity-type">
                <span 
                  class="activity-color" 
                  :style="{ backgroundColor: activity.color }"
                ></span>
                <span class="activity-name">{{ activity.name }}</span>
              </div>
              <div class="activity-count">
                {{ getActivityCount(selectedDate, activity.id) }} {{ activity.unit }}
              </div>
            </div>
            
            <input 
              type="range" 
              v-model.number="activityValues[activity.id]" 
              :min="0" 
              :max="activity.maxValue" 
              class="activity-slider"
            />
            
            <div class="activity-value-display">
              <input 
                type="number" 
                v-model.number="activityValues[activity.id]" 
                :min="0" 
                :max="activity.maxValue"
                class="activity-value-input"
              />
              <span class="activity-unit">{{ activity.unit }}</span>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button @click="showModal = false" class="btn-cancel">Annuler</button>
          <button @click="saveActivity" class="btn-save">Enregistrer</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  addMonths,
  isSameMonth,
  isToday,
  getDay,
  parseISO,
  isValid,
  isSameDay
} from 'date-fns';
import { fr } from 'date-fns/locale';
import { useTrackerStore } from '@/stores/tracker/tracker';

const trackerStore = useTrackerStore();

// Activity types
const activityTypes = [
  { id: 'coding', name: 'Programmation', color: '#2563eb', unit: 'heures', maxValue: 12 },
  { id: 'reading', name: 'Lecture', color: '#10b981', unit: 'pages', maxValue: 100 }
];

const daysOfWeek = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
const currentDate = ref(new Date());
const showModal = ref(false);
const selectedDate = ref(new Date());
const activityValues = ref<Record<string, number>>({});

// Current month and year
const currentMonthName = computed(() => {
  return format(currentDate.value, 'MMMM', { locale: fr });
});

const currentYear = computed(() => {
  return currentDate.value.getFullYear();
});

// Check if current month and year match today's month and year
const isCurrentMonthAndYear = computed(() => {
  const today = new Date();
  return (
    today.getMonth() === currentDate.value.getMonth() &&
    today.getFullYear() === currentDate.value.getFullYear()
  );
});

// Generate days for the current month view
const daysInMonth = computed(() => {
  const monthStart = startOfMonth(currentDate.value);
  const monthEnd = endOfMonth(currentDate.value);
  const startDay = getDay(monthStart);
  
  // Get all days in the month
  const daysInterval = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Add empty days at the beginning for proper alignment
  const emptyDaysBefore = Array(startDay).fill(null).map((_, i) => {
    const date = new Date(monthStart);
    date.setDate(date.getDate() - (startDay - i));
    return {
      date,
      dayNumber: date.getDate(),
      currentMonth: false,
      isToday: isToday(date),
      hasActivity: hasActivityOnDate(date),
      activities: getActivitiesForDisplay(date)
    };
  });
  
  // Create day objects for the current month
  const monthDays = daysInterval.map(date => ({
    date,
    dayNumber: date.getDate(),
    currentMonth: true,
    isToday: isToday(date),
    hasActivity: hasActivityOnDate(date),
    activities: getActivitiesForDisplay(date)
  }));
  
  // Calculate how many days to add after the month to complete the grid
  const totalDaysShown = Math.ceil((startDay + daysInterval.length) / 7) * 7;
  const emptyDaysAfter = Array(totalDaysShown - (emptyDaysBefore.length + monthDays.length))
    .fill(null)
    .map((_, i) => {
      const date = new Date(monthEnd);
      date.setDate(date.getDate() + (i + 1));
      return {
        date,
        dayNumber: date.getDate(),
        currentMonth: false,
        isToday: isToday(date),
        hasActivity: hasActivityOnDate(date),
        activities: getActivitiesForDisplay(date)
      };
    });
  
  return [...emptyDaysBefore, ...monthDays, ...emptyDaysAfter];
});

// Check if a date has any activity
function hasActivityOnDate(date: Date): boolean {
  if (!isValid(date)) return false;
  
  const dateStr = format(date, 'yyyy-MM-dd');
  const activities = trackerStore.getActivitiesForDate(dateStr);
  
  return !!activities && Object.values(activities).some(value => value > 0);
}

// Get activities for display
function getActivitiesForDisplay(date: Date) {
  if (!isValid(date)) return [];
  
  const dateStr = format(date, 'yyyy-MM-dd');
  const activities = trackerStore.getActivitiesForDate(dateStr) || {};
  
  return activityTypes.map(type => ({
    id: type.id,
    name: type.name,
    color: type.color,
    unit: type.unit,
    value: activities[type.id] || 0
  }));
}

// Format date for modal header
const formatDate = (date: Date) => {
  return format(date, 'PPPP', { locale: fr });
};

// Get activity count for a specific date and activity type
const getActivityCount = (date: Date, activityId: string) => {
  const dateStr = format(date, 'yyyy-MM-dd');
  const activities = trackerStore.getActivitiesForDate(dateStr);
  return activities ? (activities[activityId] || 0) : 0;
};

// Open activity modal for a specific date
const openActivityModal = (date: Date) => {
  if (!isValid(date)) return;
  
  selectedDate.value = date;
  const dateStr = format(date, 'yyyy-MM-dd');
  const activities = trackerStore.getActivitiesForDate(dateStr) || {};
  
  // Initialize activity values
  activityTypes.forEach(type => {
    activityValues.value[type.id] = activities[type.id] || 0;
  });
  
  showModal.value = true;
};

// Save activity data
const saveActivity = () => {
  const dateStr = format(selectedDate.value, 'yyyy-MM-dd');
  trackerStore.saveActivities(dateStr, activityValues.value);
  showModal.value = false;
};

// Change month
const changeMonth = (delta: number) => {
  currentDate.value = addMonths(currentDate.value, delta);
};

// Load activities on mount
onMounted(() => {
  trackerStore.loadActivities();
});
</script>

<style scoped>
.monthly-calendar {
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 1.5rem;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.month-selector {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.month-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  background-color: #f3f4f6;
  color: #4b5563;
  transition: all 0.2s;
}

.month-btn:hover:not(:disabled) {
  background-color: #e5e7eb;
}

.month-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.month-display {
  font-weight: 500;
  text-transform: capitalize;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.25rem;
}

.day-header {
  text-align: center;
  font-weight: 500;
  color: #6b7280;
  padding: 0.5rem 0;
  font-size: 0.875rem;
}

.calendar-day {
  aspect-ratio: 1;
  padding: 0.5rem;
  border-radius: 0.375rem;
  cursor: pointer;
  position: relative;
  display: flex;
  flex-direction: column;
  transition: all 0.2s;
}

.calendar-day:hover {
  background-color: #f9fafb;
}

.calendar-day.current-month {
  background-color: #f3f4f6;
}

.calendar-day:not(.current-month) {
  background-color: #f9fafb;
  color: #9ca3af;
}

.calendar-day.today {
  background-color: #dbeafe;
  font-weight: 600;
}

.calendar-day.has-activity {
  background-color: #f0f9ff;
}

.day-number {
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.activity-indicators {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin-top: auto;
}

.activity-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
}

/* Modal styles */
.activity-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
}

.activity-modal {
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  width: 100%;
  max-width: 28rem;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-title {
  font-weight: 600;
  font-size: 1.125rem;
  color: #111827;
}

.modal-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  color: #6b7280;
  transition: all 0.2s;
}

.modal-close:hover {
  background-color: #f3f4f6;
  color: #111827;
}

.modal-body {
  padding: 1.5rem;
}

.activity-input {
  margin-bottom: 1.5rem;
}

.activity-input-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.activity-type {
  display: flex;
  align-items: center;
}

.activity-color {
  display: inline-block;
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 9999px;
  margin-right: 0.5rem;
}

.activity-name {
  font-weight: 500;
}

.activity-count {
  font-size: 0.875rem;
  color: #6b7280;
}

.activity-slider {
  width: 100%;
  margin-bottom: 0.5rem;
}

.activity-value-display {
  display: flex;
  align-items: center;
}

.activity-value-input {
  width: 4rem;
  padding: 0.25rem 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  text-align: center;
  font-weight: 500;
}

.activity-unit {
  margin-left: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.btn-cancel, .btn-save {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.btn-cancel {
  background-color: #f3f4f6;
  color: #4b5563;
}

.btn-cancel:hover {
  background-color: #e5e7eb;
}

.btn-save {
  background-color: #3b82f6;
  color: white;
}

.btn-save:hover {
  background-color: #2563eb;
}
</style>
