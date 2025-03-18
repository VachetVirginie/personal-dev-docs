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
          <button 
            v-if="isGitHubConfigured" 
            @click="syncToGitHub" 
            class="btn-github" 
            :disabled="isSyncing"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            {{ isSyncing ? 'Synchronisation...' : 'Envoyer vers GitHub' }}
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
import { computed, ref } from 'vue';
import { marked } from 'marked';
import hljs from 'highlight.js';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useGitHubStore } from '@/stores/settings/github';

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

const isGitHubConfigured = ref(false);
const isSyncing = ref(false);

const githubStore = useGitHubStore();

githubStore.loadSettings();
isGitHubConfigured.value = githubStore.isConfigured;

const renderedContent = computed(() => {
  if (!props.doc) return '';
  return marked(props.doc.content);
});

const formatDate = (date: Date | string | number) => {
  return format(new Date(date), 'PPP', { locale: fr });
};

async function syncToGitHub() {
  if (!props.doc || !githubStore.getGitHubService) return;
  
  isSyncing.value = true;
  
  try {
    const service = githubStore.getGitHubService;
    const doc = props.doc;
    
    // Créer un nom de fichier à partir du titre (slugify)
    const filename = doc.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Supprimer les caractères spéciaux
      .replace(/\s+/g, '-') // Remplacer les espaces par des tirets
      .replace(/--+/g, '-') // Éviter les tirets multiples
      .trim();
    
    const path = `${githubStore.docsFolder}/${filename}.md`;
    
    // Préparer le contenu du fichier Markdown
    let content = `# ${doc.title}\n\n`;
    
    // Ajouter les métadonnées
    content += `---\n`;
    content += `created: ${doc.createdAt.toISOString()}\n`;
    content += `updated: ${doc.updatedAt.toISOString()}\n`;
    content += `tags: ${doc.tags.join(', ')}\n`;
    content += `---\n\n`;
    
    // Ajouter le contenu du document
    content += doc.content;
    
    // Sauvegarder le fichier sur GitHub
    await service.saveFile(
      { path, content },
      `Mise à jour de ${doc.title}`
    );
    
    alert(`Document "${doc.title}" synchronisé avec succès vers GitHub!`);
  } catch (error) {
    console.error('Erreur lors de la synchronisation:', error);
    alert(`Erreur lors de la synchronisation: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
  } finally {
    isSyncing.value = false;
  }
}
</script>

<style>
@import 'highlight.js/styles/github-dark.css';

.doc-viewer {
  width: 100%;
}

.doc-container {
  background-color: white;
  border-radius: 0.75rem;
  overflow: hidden;
  transition: all 0.3s ease;
}

.doc-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  position: relative;
}

.doc-header::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 80px;
  height: 3px;
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
  border-radius: 3px;
}

.doc-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  flex-grow: 1;
  margin-right: 1rem;
}

.doc-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-edit,
.btn-delete,
.btn-github {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
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

.btn-github {
  background-color: #333;
  color: white;
}

.btn-github:hover {
  background-color: #1a1a1a;
}

.btn-github:disabled {
  background-color: #6b7280;
  cursor: not-allowed;
}

.btn-icon {
  width: 1rem;
  height: 1rem;
  margin-right: 0.5rem;
}

.doc-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.doc-tag {
  background-color: #f1f5f9;
  color: #475569;
  font-size: 0.75rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.doc-tag:hover {
  background-color: #e2e8f0;
  transform: translateY(-1px);
}

.doc-meta {
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  color: #64748b;
  border-bottom: 1px solid #e2e8f0;
}

.meta-icon {
  width: 1rem;
  height: 1rem;
  margin-right: 0.5rem;
}

.doc-content {
  padding: 1.5rem;
  line-height: 1.7;
}

.prose-content {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  color: #334155;
}

.prose-content h1 {
  font-size: 2rem;
  font-weight: 800;
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: #1e293b;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 0.5rem;
}

.prose-content h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  color: #1e293b;
}

.prose-content h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 1.25rem;
  margin-bottom: 0.5rem;
  color: #1e293b;
}

.prose-content p {
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.prose-content ul, .prose-content ol {
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}

.prose-content li {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.prose-content a {
  color: #3b82f6;
  text-decoration: none;
  transition: color 0.2s;
}

.prose-content a:hover {
  color: #2563eb;
  text-decoration: underline;
}

.prose-content blockquote {
  border-left: 4px solid #3b82f6;
  padding-left: 1rem;
  margin-left: 0;
  color: #475569;
  font-style: italic;
}

.prose-content pre {
  background-color: #1e293b;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 1rem 0;
}

.prose-content code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 0.9em;
  padding: 0.2em 0.4em;
  background-color: #f1f5f9;
  border-radius: 0.25rem;
}

.prose-content pre code {
  background-color: transparent;
  padding: 0;
  border-radius: 0;
  color: #e2e8f0;
}

.prose-content img {
  max-width: 100%;
  border-radius: 0.5rem;
  margin: 1rem 0;
}

.prose-content table {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
}

.prose-content th, .prose-content td {
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
}

.prose-content th {
  background-color: #f8fafc;
  font-weight: 600;
  text-align: left;
}

.doc-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background-color: white;
  border-radius: 0.75rem;
  text-align: center;
  color: #64748b;
  min-height: 300px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.empty-icon {
  width: 3rem;
  height: 3rem;
  margin-bottom: 1rem;
  color: #94a3b8;
}

.doc-empty p {
  font-size: 1.125rem;
  font-weight: 500;
  max-width: 300px;
  margin: 0 auto;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.doc-container {
  animation: fadeIn 0.3s ease-out forwards;
}

@media (max-width: 768px) {
  .doc-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .doc-title {
    margin-bottom: 1rem;
    margin-right: 0;
  }
  
  .doc-actions {
    width: 100%;
    justify-content: flex-start;
    flex-wrap: wrap;
  }
}
</style>
