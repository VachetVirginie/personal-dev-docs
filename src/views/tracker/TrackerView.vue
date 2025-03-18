<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Activity Grid -->
    <div>
      <ActivityGrid />
    </div>
    
    <!-- Activity Stats -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-lg font-medium text-dark mb-4">Activity Statistics</h2>
      
      <div class="mb-6">
        <div class="flex justify-between items-center mb-2">
          <h3 class="font-medium">Weekly Summary</h3>
          <div class="text-sm text-gray-500">{{ currentWeekRange }}</div>
        </div>
        <div class="h-64">
          <WeeklyActivityChart />
        </div>
      </div>
      
      <div>
        <div class="flex justify-between items-center mb-2">
          <h3 class="font-medium">Monthly Trends</h3>
          <div class="text-sm text-gray-500">{{ currentYear }}</div>
        </div>
        <div class="h-64">
          <MonthlyActivityChart />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import { useTrackerStore } from '@/stores/tracker/tracker';
import ActivityGrid from '@/components/tracker/ActivityGrid.vue';
import WeeklyActivityChart from '@/components/tracker/WeeklyActivityChart.vue';
import MonthlyActivityChart from '@/components/tracker/MonthlyActivityChart.vue';

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
  const start = startOfWeek(now, { weekStartsOn: 0 });
  const end = endOfWeek(now, { weekStartsOn: 0 });
  return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
});

/**
 * Get the current year
 */
const currentYear = computed(() => {
  return new Date().getFullYear();
});
</script>
