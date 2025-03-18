<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useDocsStore } from '@/stores/docs/docs';
import { useTrackerStore } from '@/stores/tracker/tracker';
import ActivityGrid from '@/components/tracker/ActivityGrid.vue';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useRouter } from 'vue-router';

const docsStore = useDocsStore();
const trackerStore = useTrackerStore();
const router = useRouter();

// Load data on component mount
onMounted(() => {
  docsStore.loadDocuments();
  trackerStore.loadActivities();
});

// Calculate statistics
const totalDocs = computed(() => docsStore.allDocuments.length);

const recentDocs = computed(() => {
  return [...docsStore.allDocuments]
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 5);
});

const formatDate = (date: Date) => {
  return format(date, 'dd MMMM yyyy', { locale: fr });
};

const navigateToDoc = (docId: string) => {
  router.push(`/docs/${docId}`);
};
</script>

<template>
  <main class="dashboard">
    <h1 class="dashboard-title">Tableau de Bord</h1>
    
    <div class="dashboard-grid">
      <!-- Summary Cards -->
      <div class="summary-card">
        <div class="card-header">
          <h2 class="section-title">Résumé</h2>
        </div>
        
        <div class="stats-grid">
          <div class="stat-card stat-card-primary">
            <div class="stat-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
              </svg>
            </div>
            <div class="stat-content">
              <div class="stat-label">Documents Total</div>
              <div class="stat-value">{{ totalDocs }}</div>
            </div>
          </div>
          
          <div class="stat-card stat-card-secondary">
            <div class="stat-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="stat-content">
              <div class="stat-label">Dernière Activité</div>
              <div class="stat-value stat-date">
                {{ recentDocs.length > 0 ? formatDate(recentDocs[0].updatedAt) : 'Aucune activité' }}
              </div>
            </div>
          </div>
        </div>
        
        <div class="recent-docs-section">
          <h3 class="subsection-title">Documents Récents</h3>
          <div v-if="recentDocs.length === 0" class="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" class="empty-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
            </svg>
            <p>Aucun document pour le moment</p>
          </div>
          <div v-else class="recent-docs-list">
            <div 
              v-for="doc in recentDocs" 
              :key="doc.id"
              class="doc-item"
              @click="navigateToDoc(doc.id)"
            >
              <div class="doc-title">{{ doc.title }}</div>
              <div class="doc-meta">
                <svg xmlns="http://www.w3.org/2000/svg" class="meta-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
                </svg>
                <span>{{ formatDate(doc.updatedAt) }}</span>
              </div>
              <div class="doc-tags">
                <span 
                  v-for="tag in doc.tags" 
                  :key="tag"
                  class="doc-tag"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Activity Tracker -->
      <div class="activity-section">
        <div class="card-header">
          <h2 class="section-title">Activités</h2>
        </div>
        <ActivityGrid />
      </div>
    </div>
  </main>
</template>

<style>
.dashboard {
  width: 100%;
}

.dashboard-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1.5rem;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.summary-card, .activity-section {
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.card-header {
  padding: 1.25rem;
  border-bottom: 1px solid #e5e7eb;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  padding: 1.25rem;
}

@media (min-width: 640px) {
  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 1.25rem;
  border-radius: 0.5rem;
  gap: 1rem;
}

.stat-card-primary {
  background-color: #eff6ff;
  border: 1px solid #dbeafe;
}

.stat-card-secondary {
  background-color: #ecfdf5;
  border: 1px solid #d1fae5;
}

.stat-icon {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
}

.stat-card-primary .stat-icon {
  color: #3b82f6;
  background-color: #dbeafe;
}

.stat-card-secondary .stat-icon {
  color: #10b981;
  background-color: #d1fae5;
}

.stat-icon svg {
  width: 1.25rem;
  height: 1.25rem;
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 0.875rem;
  color: #4b5563;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
}

.stat-date {
  font-size: 1.125rem;
}

.recent-docs-section {
  padding: 0 1.25rem 1.25rem;
}

.subsection-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 1.5rem 0 1rem;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
  color: #9ca3af;
}

.empty-icon {
  width: 3rem;
  height: 3rem;
  margin-bottom: 0.75rem;
}

.recent-docs-list {
  display: flex;
  flex-direction: column;
}

.doc-item {
  padding: 1rem 0;
  border-bottom: 1px solid #e5e7eb;
  cursor: pointer;
  transition: background-color 0.2s;
}

.doc-item:last-child {
  border-bottom: none;
}

.doc-item:hover {
  background-color: #f9fafb;
}

.doc-title {
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.doc-meta {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
}

.meta-icon {
  width: 1rem;
  height: 1rem;
}

.doc-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.doc-tag {
  background-color: #f3f4f6;
  color: #4b5563;
  font-size: 0.75rem;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
}

.activity-section {
  display: flex;
  flex-direction: column;
}
</style>
