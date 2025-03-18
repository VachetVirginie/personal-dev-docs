<template>
  <div class="activity-grid">
    <div class="activity-header">
      <div class="activity-legend">
        <div 
          v-for="(activity, index) in activityTypes" 
          :key="index" 
          class="legend-item"
        >
          <span 
            class="legend-color" 
            :style="{ backgroundColor: activity.color }"
          ></span>
          <span class="legend-name">{{ activity.name }}</span>
        </div>
      </div>
      
      <div class="year-selector">
        <button 
          @click="changeYear(-1)" 
          class="year-btn"
          aria-label="Année précédente"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        </button>
        <span class="year-display">{{ currentYear }}</span>
        <button 
          @click="changeYear(1)" 
          class="year-btn"
          :disabled="currentYear >= new Date().getFullYear()"
          aria-label="Année suivante"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
    
    <div class="grid-container">
      <div class="days-labels">
        <div v-for="(day, index) in daysOfWeek" :key="index" class="day-label">
          {{ day }}
        </div>
      </div>
      
      <div class="activity-cells">
        <div v-for="(week, weekIndex) in weeksInYear" :key="weekIndex" class="week-column">
          <div v-for="(day, dayIndex) in 7" :key="dayIndex">
            <div 
              :title="formatTooltip(getDateFromWeekAndDay(weekIndex, dayIndex))"
              @click="openActivityModal(getDateFromWeekAndDay(weekIndex, dayIndex))"
              :class="[
                'activity-cell',
                getActivityLevel(getDateFromWeekAndDay(weekIndex, dayIndex))
              ]"
            ></div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="activity-scale">
      <span class="scale-label">Moins</span>
      <div class="scale-cell bg-gray-100"></div>
      <div class="scale-cell bg-green-200"></div>
      <div class="scale-cell bg-green-300"></div>
      <div class="scale-cell bg-green-400"></div>
      <div class="scale-cell bg-green-500"></div>
      <span class="scale-label">Plus</span>
    </div>
    
    <!-- Activity Modal -->
    <div v-if="showModal" class="activity-modal-overlay">
      <div class="activity-modal">
        <div class="modal-header">
          <h3 class="modal-title">{{ formatDate(selectedDate) }}</h3>
          <button @click="showModal = false" class="modal-close" aria-label="Fermer">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
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
              v-model="activityValues[activity.id]"
              type="range"
              :min="0"
              :max="activity.maxValue"
              :step="1"
              class="activity-slider"
            />
            
            <div class="slider-labels">
              <span>0 {{ activity.unit }}</span>
              <span>{{ activity.maxValue }} {{ activity.unit }}</span>
            </div>
          </div>
          
          <div class="modal-actions">
            <button 
              @click="showModal = false" 
              class="btn-cancel"
            >
              Annuler
            </button>
            <button 
              @click="saveActivity" 
              class="btn-save"
            >
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { format, parseISO, startOfYear, addWeeks, addDays, isSameDay, isValid } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useTrackerStore } from '@/stores/tracker/tracker';

const trackerStore = useTrackerStore();

const daysOfWeek = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
const currentYear = ref(new Date().getFullYear());
const weeksInYear = ref(53); // Maximum number of weeks in a year

const showModal = ref(false);
const selectedDate = ref(new Date());
const activityValues = ref<Record<string, number>>({});

// Activity types
const activityTypes = [
  { id: 'coding', name: 'Programmation', color: '#2563eb', unit: 'heures', maxValue: 12 },
  { id: 'reading', name: 'Lecture', color: '#10b981', unit: 'pages', maxValue: 100 }
];

// Get date from week and day indices
const getDateFromWeekAndDay = (weekIndex: number, dayIndex: number) => {
  const startDate = startOfYear(new Date(currentYear.value, 0, 1));
  return addDays(addWeeks(startDate, weekIndex), dayIndex);
};

// Format date for tooltip
const formatTooltip = (date: Date) => {
  if (!isValid(date)) return '';
  
  const activities = trackerStore.getActivitiesForDate(format(date, 'yyyy-MM-dd'));
  let tooltip = format(date, 'PPP', { locale: fr });
  
  if (activities && Object.keys(activities).length > 0) {
    tooltip += '\n';
    activityTypes.forEach(type => {
      const value = activities[type.id] || 0;
      if (value > 0) {
        tooltip += `\n${type.name}: ${value} ${type.unit}`;
      }
    });
  } else {
    tooltip += '\nAucune activité';
  }
  
  return tooltip;
};

// Format date for modal header
const formatDate = (date: Date) => {
  return format(date, 'PPPP', { locale: fr });
};

// Get activity level for cell color
const getActivityLevel = (date: Date) => {
  if (!isValid(date)) return 'bg-gray-100';
  
  const dateStr = format(date, 'yyyy-MM-dd');
  const activities = trackerStore.getActivitiesForDate(dateStr);
  
  if (!activities) return 'bg-gray-100';
  
  // Calculate total activity level
  let total = 0;
  Object.keys(activities).forEach(key => {
    total += activities[key] || 0;
  });
  
  // Return appropriate color based on activity level
  if (total === 0) return 'bg-gray-100';
  if (total <= 2) return 'bg-green-200';
  if (total <= 5) return 'bg-green-300';
  if (total <= 10) return 'bg-green-400';
  return 'bg-green-500';
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

// Change year
const changeYear = (delta: number) => {
  const newYear = currentYear.value + delta;
  if (newYear > 0 && newYear <= new Date().getFullYear()) {
    currentYear.value = newYear;
  }
};

onMounted(() => {
  // Load activities from store
  trackerStore.loadActivities();
});
</script>

<style>
.activity-grid {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1.25rem;
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.activity-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.legend-item {
  display: flex;
  align-items: center;
}

.legend-color {
  display: inline-block;
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 0.125rem;
  margin-right: 0.5rem;
}

.legend-name {
  font-size: 0.875rem;
  color: #4b5563;
}

.year-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.year-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.375rem;
  color: #4b5563;
  background-color: #f3f4f6;
  transition: background-color 0.2s;
}

.year-btn:hover:not(:disabled) {
  background-color: #e5e7eb;
}

.year-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.year-btn svg {
  width: 1.25rem;
  height: 1.25rem;
}

.year-display {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
  min-width: 3rem;
  text-align: center;
}

.grid-container {
  display: flex;
  overflow-x: auto;
  margin-bottom: 1rem;
}

.days-labels {
  display: flex;
  flex-direction: column;
  margin-right: 0.5rem;
  padding-top: 0.375rem;
}

.day-label {
  height: 0.75rem;
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.125rem;
  display: flex;
  align-items: center;
}

.activity-cells {
  display: flex;
  gap: 0.125rem;
}

.week-column {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.activity-cell {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 0.125rem;
  cursor: pointer;
  transition: transform 0.2s;
}

.activity-cell:hover {
  transform: scale(1.2);
}

.activity-scale {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.25rem;
  margin-top: 0.5rem;
}

.scale-label {
  font-size: 0.75rem;
  color: #6b7280;
}

.scale-cell {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 0.125rem;
}

/* Modal Styles */
.activity-modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 1rem;
}

.activity-modal {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 28rem;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.modal-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  color: #6b7280;
  transition: background-color 0.2s;
}

.modal-close:hover {
  background-color: #f3f4f6;
}

.modal-close svg {
  width: 1.25rem;
  height: 1.25rem;
}

.modal-body {
  padding: 1.5rem;
}

.activity-input {
  margin-bottom: 1.5rem;
}

.activity-input:last-child {
  margin-bottom: 2rem;
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
  border-radius: 0.125rem;
  margin-right: 0.5rem;
}

.activity-name {
  font-weight: 500;
  color: #1e293b;
}

.activity-count {
  font-size: 0.875rem;
  color: #6b7280;
}

.activity-slider {
  width: 100%;
  margin: 0.5rem 0;
  -webkit-appearance: none;
  appearance: none;
  height: 0.375rem;
  border-radius: 9999px;
  background-color: #e5e7eb;
  outline: none;
}

.activity-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 1rem;
  height: 1rem;
  border-radius: 9999px;
  background-color: #3b82f6;
  cursor: pointer;
  transition: transform 0.2s;
}

.activity-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.activity-slider::-moz-range-thumb {
  width: 1rem;
  height: 1rem;
  border-radius: 9999px;
  background-color: #3b82f6;
  cursor: pointer;
  transition: transform 0.2s;
  border: none;
}

.activity-slider::-moz-range-thumb:hover {
  transform: scale(1.2);
}

.slider-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #6b7280;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.btn-cancel, .btn-save {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: background-color 0.2s;
}

.btn-cancel {
  color: #4b5563;
  background-color: white;
  border: 1px solid #d1d5db;
}

.btn-cancel:hover {
  background-color: #f9fafb;
}

.btn-save {
  color: white;
  background-color: #3b82f6;
}

.btn-save:hover {
  background-color: #2563eb;
}

@media (max-width: 640px) {
  .activity-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .activity-legend {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
