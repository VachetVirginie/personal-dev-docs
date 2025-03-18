<template>
  <div class="monthly-chart-container">
    <div v-if="!chartLoaded" class="chart-placeholder">
      <div class="chart-loading">
        <div class="loading-spinner"></div>
        <div>Chargement du graphique...</div>
      </div>
    </div>
    <canvas ref="chartCanvas" v-show="chartLoaded"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useTrackerStore } from '@/stores/tracker/tracker';
import { format, eachMonthOfInterval, startOfYear, endOfYear, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { fr } from 'date-fns/locale';

const trackerStore = useTrackerStore();
const chartCanvas = ref(null);
const chartLoaded = ref(false);
let chart = null;

// Activity types with colors
const activityTypes = [
  { id: 'coding', name: 'Programmation', color: 'rgba(37, 99, 235, 0.7)' },
  { id: 'reading', name: 'Lecture', color: 'rgba(16, 185, 129, 0.7)' }
];

/**
 * Generate chart data for the current year by month
 */
const getChartData = () => {
  const currentYear = new Date().getFullYear();
  const yearStart = startOfYear(new Date(currentYear, 0, 1));
  const yearEnd = endOfYear(new Date(currentYear, 0, 1));
  
  // Get all months in the current year
  const months = eachMonthOfInterval({ start: yearStart, end: yearEnd });
  const labels = months.map(month => format(month, 'MMM', { locale: fr }));
  
  const datasets = [];
  
  // Create dataset for each activity type
  activityTypes.forEach(type => {
    const data = [];
    
    // Calculate monthly totals for each activity type
    months.forEach(month => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      
      // Get all days in the month
      const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
      
      // Sum up activity values for the month
      let monthlyTotal = 0;
      days.forEach(day => {
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
      data: data,
      borderColor: type.color.replace('0.7', '1'),
      backgroundColor: type.color.replace('0.7', '0.2'),
      borderWidth: 2,
      tension: 0.4,
      fill: true
    });
  });
  
  return { labels, datasets };
};

/**
 * Initialize chart
 */
const initChart = async () => {
  if (!chartCanvas.value) return;
  
  try {
    // Dynamically import Chart.js to avoid SSR issues
    const { Chart, registerables } = await import('chart.js');
    Chart.register(...registerables);
    
    // Destroy existing chart if it exists
    if (chart) {
      chart.destroy();
    }
    
    const ctx = chartCanvas.value.getContext('2d');
    const { labels, datasets } = getChartData();
    
    chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            mode: 'index',
            intersect: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
    
    chartLoaded.value = true;
  } catch (error) {
    console.error('Failed to load chart:', error);
    chartLoaded.value = false;
  }
};

// Initialize chart on mount
onMounted(async () => {
  trackerStore.loadActivities();
  await initChart();
});

// Update chart when activities change
watch(() => trackerStore.activities, async () => {
  await initChart();
}, { deep: true });
</script>

<style scoped>
.monthly-chart-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.chart-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f9fafb;
  border-radius: 0.5rem;
}

.chart-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
}

.loading-spinner {
  width: 2rem;
  height: 2rem;
  border: 3px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>
