<template>
  <div class="settings-container">
    <div class="page-header">
      <h1 class="page-title">Paramètres</h1>
      <p class="page-subtitle">Gérez vos préférences et vos données</p>
    </div>
    
    <div class="settings-content">
      <GitHubSettings />
      
      <div class="divider"></div>
      
      <DataManagement />
      
      <!-- Autres sections de paramètres peuvent être ajoutées ici -->
    </div>
  </div>
</template>

<script setup lang="ts">
import DataManagement from '@/components/settings/DataManagement.vue';
import GitHubSettings from '@/components/settings/GitHubSettings.vue';
</script>

<style>
.settings-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 1.5rem;
}

.page-header {
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  font-size: 1.125rem;
  color: #64748b;
}

.settings-content {
  background-color: #f8fafc;
  border-radius: 0.5rem;
  padding: 1.5rem;
}

.divider {
  height: 1px;
  background-color: #e2e8f0;
  margin: 2rem 0;
}
</style>
