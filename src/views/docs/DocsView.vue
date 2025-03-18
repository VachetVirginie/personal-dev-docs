<template>
  <div class="docs-container">
    <div class="page-header">
      <h1 class="page-title">Documentation</h1>
      <p class="page-subtitle">Gérez et consultez vos documents</p>
    </div>

    <div class="docs-layout">
      <div class="docs-sidebar">
        <DocsList 
          :docs="docsStore.allDocuments" 
          :selectedDocId="docsStore.selectedDocumentId"
          @select="selectDocument"
          @new="createNewDocument"
        />
      </div>
      
      <div class="docs-content">
        <div v-if="isEditing">
          <DocEditor 
            :doc="docsStore.selectedDocument"
            @save="saveDocument"
            @cancel="isEditing = false"
          />
        </div>
        <div v-else>
          <DocViewer 
            :doc="docsStore.selectedDocument"
            @edit="isEditing = true"
            @delete="deleteDocument"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useDocsStore } from '@/stores/docs/docs';
import DocsList from '@/components/docs/DocsList.vue';
import DocViewer from '@/components/docs/DocViewer.vue';
import DocEditor from '@/components/docs/DocEditor.vue';

const docsStore = useDocsStore();
const isEditing = ref(false);

/**
 * Load documents when component is mounted
 */
onMounted(() => {
  docsStore.loadDocuments();
});

/**
 * Select a document to view
 * @param id - ID of the document to select
 */
function selectDocument(id: string) {
  docsStore.selectDocument(id);
  isEditing.value = false;
}

/**
 * Create a new document and start editing it
 */
function createNewDocument() {
  const newDocId = docsStore.createDocument({
    title: 'New Document',
    content: '',
    tags: []
  });
  
  docsStore.selectDocument(newDocId);
  isEditing.value = true;
}

/**
 * Save document changes
 * @param doc - Document data to save
 */
function saveDocument(doc: any) {
  if (doc.id) {
    docsStore.updateDocument(doc.id, doc);
  } else {
    const newDocId = docsStore.createDocument(doc);
    docsStore.selectDocument(newDocId);
  }
  
  isEditing.value = false;
}

/**
 * Delete the currently selected document
 */
function deleteDocument() {
  if (!docsStore.selectedDocumentId) return;
  
  if (confirm('Are you sure you want to delete this document?')) {
    docsStore.deleteDocument(docsStore.selectedDocumentId);
  }
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
  font-size: 1.125rem;
  color: #64748b;
}

.docs-layout {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
}

.docs-sidebar {
  min-width: 0;
}

.docs-content {
  min-width: 0;
}

@media (max-width: 768px) {
  .docs-layout {
    grid-template-columns: 1fr;
  }
  
  .docs-sidebar {
    margin-bottom: 1.5rem;
  }
}
</style>
