<template>
  <div>
    <Line
      v-if="chartData"
      :data="chartData"
      :options="chartOptions"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { useTrackerStore } from '@/stores/tracker/tracker';
import { format, parse, eachMonthOfInterval, startOfYear, endOfYear, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const trackerStore = useTrackerStore();

// Activity types with colors
const activityTypes = [
  { id: 'coding', name: 'Coding', color: 'rgba(37, 99, 235, 0.7)' },
  { id: 'reading', name: 'Reading', color: 'rgba(16, 185, 129, 0.7)' }
];

/**
 * Generate chart data for the current year by month
 */
const chartData = computed(() => {
  const currentYear = new Date().getFullYear();
  const yearStart = startOfYear(new Date(currentYear, 0, 1));
  const yearEnd = endOfYear(new Date(currentYear, 0, 1));
  
  // Get all months in the current year
  const months = eachMonthOfInterval({ start: yearStart, end: yearEnd });
  const labels = months.map(month => format(month, 'MMM'));
  
  const datasets = [];
  
  // Create dataset for each activity type
  activityTypes.forEach(type => {
    const data = [];
    
    // Calculate monthly totals for each activity type
    months.forEach(month => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      
      // Get all days in the month
      const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
      
      // Sum up activity values for all days in the month
      let monthlyTotal = 0;
      daysInMonth.forEach(day => {
        const dateStr = format(day, 'yyyy-MM-dd');
        const activities = trackerStore.getActivitiesForDate(dateStr);
        if (activities && activities[type.id]) {
          monthlyTotal += activities[type.id];
        }
      });
      
      data.push(monthlyTotal);
    });
    
    datasets.push({
      label: type.name,
      borderColor: type.color,
      backgroundColor: type.color.replace('0.7', '0.1'),
      borderWidth: 2,
      pointBackgroundColor: type.color,
      pointRadius: 3,
      tension: 0.3,
      fill: true,
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
      grid: {
        display: false
      }
    },
    y: {
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
