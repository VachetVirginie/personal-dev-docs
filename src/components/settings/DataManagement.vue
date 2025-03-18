<template>
  <div class="data-management">
    <h2 class="section-title">Gestion des données</h2>
    
    <div class="card-container">
      <div class="data-card">
        <div class="card-header">
          <h3 class="card-title">Exporter vos données</h3>
          <p class="card-description">
            Téléchargez toutes vos données (documents et activités) dans un fichier JSON.
          </p>
        </div>
        <div class="card-actions">
          <button @click="exportData" class="primary-button">
            <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
            Exporter les données
          </button>
        </div>
      </div>
      
      <div class="data-card">
        <div class="card-header">
          <h3 class="card-title">Importer des données</h3>
          <p class="card-description">
            Importez des données depuis un fichier JSON précédemment exporté.
          </p>
        </div>
        <div class="card-actions">
          <label for="import-file" class="secondary-button">
            <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 8.586V16a1 1 0 11-2 0V8.586l-1.293 1.293a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
            Sélectionner un fichier
          </label>
          <input 
            id="import-file" 
            type="file" 
            accept=".json" 
            @change="handleFileUpload" 
            class="hidden-input"
          />
        </div>
      </div>
    </div>
    
    <div v-if="message" :class="['message', messageType === 'error' ? 'error' : 'success']">
      {{ message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { exportAllData, importData } from '@/utils/dataExport';

const message = ref('');
const messageType = ref<'success' | 'error'>('success');

/**
 * Exporte toutes les données de l'application
 */
function exportData() {
  try {
    exportAllData();
    message.value = 'Exportation réussie ! Le téléchargement devrait commencer automatiquement.';
    messageType.value = 'success';
    
    // Effacer le message après 5 secondes
    setTimeout(() => {
      message.value = '';
    }, 5000);
  } catch (error) {
    console.error('Erreur lors de l\'exportation:', error);
    message.value = 'Erreur lors de l\'exportation des données.';
    messageType.value = 'error';
  }
}

/**
 * Gère l'importation d'un fichier
 */
function handleFileUpload(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;
  
  const file = input.files[0];
  const reader = new FileReader();
  
  reader.onload = (e) => {
    if (!e.target || typeof e.target.result !== 'string') {
      message.value = 'Erreur lors de la lecture du fichier.';
      messageType.value = 'error';
      return;
    }
    
    const result = importData(e.target.result);
    message.value = result.message;
    messageType.value = result.success ? 'success' : 'error';
    
    // Réinitialiser l'input file
    input.value = '';
    
    // Effacer le message après 5 secondes si c'est un succès
    if (result.success) {
      setTimeout(() => {
        message.value = '';
      }, 5000);
    }
  };
  
  reader.onerror = () => {
    message.value = 'Erreur lors de la lecture du fichier.';
    messageType.value = 'error';
  };
  
  reader.readAsText(file);
}
</script>

<style>
.data-management {
  max-width: 800px;
  margin: 0 auto;
  padding: 1.5rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1.5rem;
}

.card-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.data-card {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-header {
  margin-bottom: 1.5rem;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.card-description {
  color: #64748b;
  line-height: 1.5;
}

.card-actions {
  display: flex;
  justify-content: flex-start;
}

.primary-button, .secondary-button {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.primary-button {
  background-color: #3b82f6;
  color: white;
  border: none;
}

.primary-button:hover {
  background-color: #2563eb;
}

.secondary-button {
  background-color: #e2e8f0;
  color: #1e293b;
  border: none;
}

.secondary-button:hover {
  background-color: #cbd5e1;
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
  margin-right: 0.5rem;
}

.hidden-input {
  display: none;
}

.message {
  padding: 1rem;
  border-radius: 0.375rem;
  margin-top: 1rem;
}

.success {
  background-color: #dcfce7;
  color: #166534;
}

.error {
  background-color: #fee2e2;
  color: #b91c1c;
}
</style>
