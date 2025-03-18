<template>
  <div class="document-view">
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p class="loading-text">Chargement du document...</p>
    </div>
    
    <div v-else-if="error" class="error-container">
      <div class="error-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
      </div>
      <h2 class="error-title">Document introuvable</h2>
      <p class="error-message">{{ error }}</p>
      <router-link to="/docs" class="back-link">
        <svg xmlns="http://www.w3.org/2000/svg" class="back-icon" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
        </svg>
        Retour à la liste des documents
      </router-link>
    </div>
    
    <div v-else class="document-container">
      <div class="document-header">
        <router-link to="/docs" class="back-link">
          <svg xmlns="http://www.w3.org/2000/svg" class="back-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
          </svg>
          Retour
        </router-link>
      </div>
      
      <DocViewer 
        :doc="document" 
        @edit="editDocument" 
        @delete="deleteDocument"
      />
      
      <DocEditor 
        v-if="isEditing" 
        :doc="document" 
        @save="saveDocument" 
        @cancel="cancelEdit"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useDocsStore } from '@/stores/docs/docs';
import DocViewer from '@/components/docs/DocViewer.vue';
import DocEditor from '@/components/docs/DocEditor.vue';

// Props
const props = defineProps<{
  id?: string;
}>();

// Router
const route = useRoute();
const router = useRouter();
const docsStore = useDocsStore();

// State
const document = ref(null);
const loading = ref(true);
const error = ref('');
const isEditing = ref(false);

// Get document ID from props or route params
const documentId = computed(() => {
  return props.id || route.params.id as string;
});

// Load document
async function loadDocument() {
  loading.value = true;
  error.value = '';
  
  try {
    // Get document from store
    const doc = docsStore.getDocumentById(documentId.value);
    
    if (!doc) {
      error.value = 'Le document demandé n\'existe pas ou a été supprimé.';
      document.value = null;
    } else {
      document.value = doc;
    }
  } catch (err) {
    console.error('Erreur lors du chargement du document:', err);
    error.value = 'Une erreur est survenue lors du chargement du document.';
    document.value = null;
  } finally {
    loading.value = false;
  }
}

// Edit document
function editDocument() {
  isEditing.value = true;
}

// Save document
function saveDocument(updatedDoc) {
  docsStore.updateDocument(documentId.value, updatedDoc);
  document.value = docsStore.getDocumentById(documentId.value);
  isEditing.value = false;
}

// Cancel edit
function cancelEdit() {
  isEditing.value = false;
}

// Delete document
function deleteDocument() {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
    docsStore.deleteDocument(documentId.value);
    router.push('/docs');
  }
}

// Watch for changes in document ID
watch(() => documentId.value, loadDocument, { immediate: true });

// Load document on mount
onMounted(loadDocument);
</script>

<style>
.document-view {
  max-width: 1280px;
  margin: 0 auto;
  padding: 1.5rem;
}

.document-header {
  margin-bottom: 1.5rem;
}

.back-link {
  display: inline-flex;
  align-items: center;
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.back-link:hover {
  color: #2563eb;
}

.back-icon {
  width: 1.25rem;
  height: 1.25rem;
  margin-right: 0.5rem;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 20rem;
}

.loading-spinner {
  width: 3rem;
  height: 3rem;
  border: 0.25rem solid #e2e8f0;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  color: #64748b;
  font-size: 1.125rem;
}

.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 20rem;
  text-align: center;
}

.error-icon {
  width: 4rem;
  height: 4rem;
  color: #ef4444;
  margin-bottom: 1rem;
}

.error-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.error-message {
  color: #64748b;
  margin-bottom: 1.5rem;
}
</style>
