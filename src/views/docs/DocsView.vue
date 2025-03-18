<template>
  <div class="docs-container">
    <div class="page-header">
      <h1 class="page-title">Documentation</h1>
      <p class="page-subtitle">Gérez et consultez vos documents</p>
    </div>

    <div class="docs-content">
      <AllDocsList 
        :docs="docsStore.allDocuments"
        @select="selectDocument"
        @new="createNewDocument"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useDocsStore } from '@/stores/docs/docs';
import AllDocsList from '@/components/docs/AllDocsList.vue';
import { useRouter } from 'vue-router';

const docsStore = useDocsStore();
const router = useRouter();

/**
 * Load documents when component is mounted
 */
onMounted(() => {
  docsStore.loadDocuments();
});

/**
 * Select a document to view and navigate to its page
 * @param id - ID of the document to select
 */
function selectDocument(id: string) {
  router.push(`/docs/${id}`);
}

/**
 * Create a new document and navigate to the editor
 */
function createNewDocument() {
  const newDocId = docsStore.createDocument({
    title: 'New Document',
    content: '',
    tags: []
  });
  
  router.push(`/docs/${newDocId}`);
}
</script>

<style>
.docs-container {
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
  color: #64748b;
  font-size: 1.125rem;
}

.docs-content {
  width: 100%;
}

@media (max-width: 768px) {
  .docs-container {
    padding: 1rem;
  }
  
  .page-title {
    font-size: 1.75rem;
  }
}
</style>
