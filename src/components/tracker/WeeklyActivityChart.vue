<template>
  <div>
    <Bar
      v-if="chartData"
      :data="chartData"
      :options="chartOptions"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useTrackerStore } from '@/stores/tracker/tracker';
import { format, startOfWeek, addDays } from 'date-fns';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const trackerStore = useTrackerStore();

// Activity types with colors
const activityTypes = [
  { id: 'coding', name: 'Coding', color: 'rgba(37, 99, 235, 0.7)' },
  { id: 'reading', name: 'Reading', color: 'rgba(16, 185, 129, 0.7)' }
];

/**
 * Generate chart data for the current week
 */
const chartData = computed(() => {
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 0 });
  const labels = [];
  const datasets = [];
  
  // Create dataset for each activity type
  activityTypes.forEach(type => {
    const data = [];
    
    // Get data for each day of the week
    for (let i = 0; i < 7; i++) {
      const day = addDays(weekStart, i);
      const dateStr = format(day, 'yyyy-MM-dd');
      const activities = trackerStore.getActivitiesForDate(dateStr);
      
      labels[i] = format(day, 'EEE');
      data.push(activities ? (activities[type.id] || 0) : 0);
    }
    
    datasets.push({
      label: type.name,
      backgroundColor: type.color,
      data
    });
  });
  
  return {
    labels,
    datasets
  };
});

/**
 * Chart options
 */
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      stacked: false,
      grid: {
        display: false
      }
    },
    y: {
      stacked: false,
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.05)'
      }
    }
  },
  plugins: {
    legend: {
      position: 'top',
      labels: {
        usePointStyle: true,
        boxWidth: 6
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      padding: 10,
      cornerRadius: 4,
      boxPadding: 3
    }
  }
};

// Watch for changes in activities and update chart
watch(() => trackerStore.activities, () => {
  // Chart will automatically update due to computed property
}, { deep: true });

// Load activities when component is mounted
onMounted(() => {
  trackerStore.loadActivities();
});
</script>
