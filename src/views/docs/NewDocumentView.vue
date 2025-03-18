<template>
  <div class="new-document-view">
    <div class="document-header">
      <router-link to="/docs" class="back-link">
        <svg xmlns="http://www.w3.org/2000/svg" class="back-icon" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
        </svg>
        Retour
      </router-link>
      <h1 class="page-title">Nouveau Document</h1>
    </div>
    
    <DocEditor 
      :doc="newDocument" 
      @save="saveDocument" 
      @cancel="cancelCreation"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useDocsStore } from '@/stores/docs/docs';
import DocEditor from '@/components/docs/DocEditor.vue';

const router = useRouter();
const docsStore = useDocsStore();

// Nouveau document vide
const newDocument = ref({
  title: '',
  content: '',
  tags: []
});

/**
 * Sauvegarde le nouveau document
 * @param doc - Document à sauvegarder
 */
function saveDocument(doc) {
  const newDocId = docsStore.createDocument(doc);
  router.push(`/docs/${newDocId}`);
}

/**
 * Annule la création et retourne à la liste des documents
 */
function cancelCreation() {
  router.push('/docs');
}
</script>

<style>
.new-document-view {
  max-width: 1280px;
  margin: 0 auto;
  padding: 1.5rem;
}

.document-header {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

.back-link {
  display: inline-flex;
  align-items: center;
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
  margin-right: 1rem;
}

.back-link:hover {
  color: #2563eb;
}

.back-icon {
  width: 1.25rem;
  height: 1.25rem;
  margin-right: 0.5rem;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}
</style>
