<template>
  <div class="doc-viewer">
    <div v-if="doc" class="doc-container">
      <div class="doc-header">
        <h1 class="doc-title">{{ doc.title }}</h1>
        <div class="doc-actions">
          <button 
            @click="$emit('edit')" 
            class="btn-edit"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="btn-icon" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Modifier
          </button>
          <button 
            @click="$emit('delete')" 
            class="btn-delete"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="btn-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            Supprimer
          </button>
        </div>
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
      
      <div class="doc-meta">
        <svg xmlns="http://www.w3.org/2000/svg" class="meta-icon" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
        </svg>
        <span>Dernière mise à jour: {{ formatDate(doc.updatedAt) }}</span>
      </div>
      
      <div class="doc-content prose-content" v-html="renderedContent"></div>
    </div>
    <div v-else class="doc-empty">
      <svg xmlns="http://www.w3.org/2000/svg" class="empty-icon" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
      </svg>
      <p>Sélectionnez un document à afficher</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { marked } from 'marked';
import hljs from 'highlight.js';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Configure marked with highlight.js
marked.setOptions({
  highlight: function(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value;
    }
    return hljs.highlightAuto(code).value;
  },
  breaks: true
});

const props = defineProps({
  doc: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['edit', 'delete']);

const renderedContent = computed(() => {
  if (!props.doc) return '';
  return marked(props.doc.content);
});

const formatDate = (date: Date | string | number) => {
  return format(new Date(date), 'PPP', { locale: fr });
};
</script>

<style>
@import 'highlight.js/styles/github-dark.css';

.doc-viewer {
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 2rem;
  height: 100%;
}

.doc-container {
  max-width: 100%;
}

.doc-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.doc-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.2;
}

.doc-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-edit, .btn-delete {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: background-color 0.2s, color 0.2s;
}

.btn-edit {
  background-color: #3b82f6;
  color: white;
}

.btn-edit:hover {
  background-color: #2563eb;
}

.btn-delete {
  background-color: #ef4444;
  color: white;
}

.btn-delete:hover {
  background-color: #dc2626;
}

.btn-icon {
  width: 1rem;
  height: 1rem;
}

.doc-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
}

.doc-tag {
  background-color: #f3f4f6;
  color: #4b5563;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
}

.doc-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 2rem;
}

.meta-icon {
  width: 1rem;
  height: 1rem;
}

.doc-content {
  padding-top: 1rem;
  border-top: 1px solid #f3f4f6;
}

.doc-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 16rem;
  color: #9ca3af;
}

.empty-icon {
  width: 3rem;
  height: 3rem;
  margin-bottom: 1rem;
}

/* Prose content styles */
.prose-content {
  color: #1e293b;
  line-height: 1.8;
  font-size: 1.0625rem;
}

.prose-content h1 {
  font-size: 1.75rem;
  font-weight: 700;
  margin-top: 2.5rem;
  margin-bottom: 1.25rem;
  color: #1e293b;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0.5rem;
}

.prose-content h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: #1e293b;
}

.prose-content h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  color: #1e293b;
}

.prose-content p {
  margin-bottom: 1.25rem;
}

.prose-content ul, .prose-content ol {
  margin-bottom: 1.25rem;
  padding-left: 1.75rem;
}

.prose-content ul {
  list-style-type: disc;
}

.prose-content ol {
  list-style-type: decimal;
}

.prose-content li {
  margin-bottom: 0.5rem;
}

.prose-content pre {
  border-radius: 0.5rem;
  padding: 1.25rem;
  margin: 1.5rem 0;
  overflow-x: auto;
  background-color: #1e293b;
}

.prose-content code {
  font-family: 'Fira Code', Consolas, Monaco, 'Andale Mono', monospace;
  font-size: 0.875rem;
}

.prose-content p code {
  background-color: #f1f5f9;
  color: #0f172a;
  padding: 0.2rem 0.4rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
}

.prose-content blockquote {
  padding: 0.75rem 1.25rem;
  border-left: 4px solid #3b82f6;
  background-color: #f1f5f9;
  margin: 1.5rem 0;
  border-radius: 0 0.25rem 0.25rem 0;
}

.prose-content blockquote p {
  margin-bottom: 0;
}

.prose-content a {
  color: #3b82f6;
  text-decoration: none;
  border-bottom: 1px dotted #3b82f6;
  transition: border-bottom 0.2s;
}

.prose-content a:hover {
  border-bottom: 1px solid #3b82f6;
}

.prose-content table {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
  overflow: hidden;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

.prose-content th, .prose-content td {
  border: 1px solid #e5e7eb;
  padding: 0.75rem 1rem;
}

.prose-content th {
  background-color: #f9fafb;
  font-weight: 600;
  text-align: left;
}

.prose-content tr:nth-child(even) {
  background-color: #f9fafb;
}

.prose-content img {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  margin: 1.5rem 0;
}

@media (max-width: 640px) {
  .doc-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .doc-viewer {
    padding: 1.25rem;
  }
  
  .prose-content {
    font-size: 1rem;
  }
}
</style>
