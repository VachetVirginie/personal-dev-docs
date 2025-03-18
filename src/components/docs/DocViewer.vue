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
  perspective: 1000px;
}

.doc-container {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  border-radius: 1.25rem;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  box-shadow: 
    0 10px 30px -5px rgba(0, 0, 0, 0.1),
    0 0 5px rgba(0, 0, 0, 0.05),
    0 0 80px -10px rgba(59, 130, 246, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transform-style: preserve-3d;
}

.doc-container:hover {
  transform: translateY(-5px);
  box-shadow: 
    0 20px 40px -5px rgba(0, 0, 0, 0.15),
    0 0 10px rgba(0, 0, 0, 0.05),
    0 0 100px -10px rgba(59, 130, 246, 0.25);
}

.doc-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.75rem 2rem;
  border-bottom: 1px solid rgba(226, 232, 240, 0.5);
  position: relative;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7));
}

.doc-header::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 120px;
  height: 3px;
  background: linear-gradient(90deg, #3b82f6, #60a5fa, #93c5fd);
  border-radius: 3px;
  animation: gradientShift 3s infinite alternate;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
}

.doc-title {
  font-size: 1.75rem;
  font-weight: 800;
  color: #1e293b;
  margin: 0;
  flex-grow: 1;
  margin-right: 1.5rem;
  background: linear-gradient(90deg, #1e293b, #334155);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 1px 1px rgba(255, 255, 255, 0.5);
  letter-spacing: -0.02em;
}

.doc-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-edit,
.btn-delete,
.btn-github {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.6rem 1.2rem;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
  border: none;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  z-index: 1;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.btn-edit::before,
.btn-delete::before,
.btn-github::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1));
  transition: all 0.5s ease;
  z-index: -1;
}

.btn-edit:hover::before,
.btn-delete:hover::before,
.btn-github:hover::before {
  left: 100%;
}

.btn-edit {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
}

.btn-edit:hover {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  transform: translateY(-2px);
}

.btn-delete {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
}

.btn-delete:hover {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  transform: translateY(-2px);
}

.btn-github {
  background: linear-gradient(135deg, #333, #1a1a1a);
  color: white;
}

.btn-github:hover {
  background: linear-gradient(135deg, #1a1a1a, #0d0d0d);
  transform: translateY(-2px);
}

.btn-github:disabled {
  background: linear-gradient(135deg, #6b7280, #4b5563);
  cursor: not-allowed;
  opacity: 0.7;
}

.btn-icon {
  width: 1.1rem;
  height: 1.1rem;
  margin-right: 0.6rem;
  filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.1));
}

.doc-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  padding: 1.25rem 2rem;
  border-bottom: 1px solid rgba(226, 232, 240, 0.5);
  background: linear-gradient(to right, rgba(249, 250, 251, 0.7), rgba(248, 250, 252, 0.5));
}

.doc-tag {
  background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
  color: #475569;
  font-size: 0.8rem;
  padding: 0.35rem 0.85rem;
  border-radius: 9999px;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.7);
  letter-spacing: 0.02em;
}

.doc-tag:hover {
  background: linear-gradient(135deg, #e2e8f0, #cbd5e1);
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.doc-meta {
  display: flex;
  align-items: center;
  padding: 0.9rem 2rem;
  font-size: 0.9rem;
  color: #64748b;
  border-bottom: 1px solid rgba(226, 232, 240, 0.5);
  background: linear-gradient(to right, rgba(248, 250, 252, 0.6), rgba(241, 245, 249, 0.4));
  font-weight: 500;
}

.meta-icon {
  width: 1.1rem;
  height: 1.1rem;
  margin-right: 0.6rem;
  color: #3b82f6;
  filter: drop-shadow(0 1px 1px rgba(59, 130, 246, 0.3));
}

.doc-content {
  padding: 2rem;
  line-height: 1.8;
  background: rgba(255, 255, 255, 0.7);
  position: relative;
}

.doc-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at top right, rgba(59, 130, 246, 0.05), transparent 70%),
    radial-gradient(circle at bottom left, rgba(99, 102, 241, 0.05), transparent 70%);
  z-index: -1;
}

.prose-content {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  color: #334155;
}

.prose-content h1 {
  font-size: 2.25rem;
  font-weight: 800;
  margin-top: 2.5rem;
  margin-bottom: 1.25rem;
  color: #1e293b;
  border-bottom: 1px solid rgba(226, 232, 240, 0.7);
  padding-bottom: 0.6rem;
  background: linear-gradient(90deg, #1e293b, #334155);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  letter-spacing: -0.02em;
}

.prose-content h2 {
  font-size: 1.75rem;
  font-weight: 700;
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: #1e293b;
  background: linear-gradient(90deg, #1e293b, #334155);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  letter-spacing: -0.01em;
}

.prose-content h3 {
  font-size: 1.4rem;
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  color: #1e293b;
  letter-spacing: -0.01em;
}

.prose-content p {
  margin-top: 1.25rem;
  margin-bottom: 1.25rem;
}

.prose-content ul, .prose-content ol {
  margin-top: 1.25rem;
  margin-bottom: 1.25rem;
  padding-left: 1.75rem;
}

.prose-content li {
  margin-top: 0.6rem;
  margin-bottom: 0.6rem;
}

.prose-content a {
  color: #3b82f6;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  font-weight: 500;
}

.prose-content a::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

.prose-content a:hover {
  color: #2563eb;
}

.prose-content a:hover::after {
  transform: scaleX(1);
}

.prose-content blockquote {
  border-left: 4px solid #3b82f6;
  padding: 0.75rem 1.25rem;
  margin-left: 0;
  margin-right: 0;
  color: #475569;
  font-style: italic;
  background: rgba(241, 245, 249, 0.5);
  border-radius: 0 0.5rem 0.5rem 0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.prose-content pre {
  background-color: #1e293b;
  padding: 1.25rem;
  border-radius: 0.75rem;
  overflow-x: auto;
  margin: 1.5rem 0;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.prose-content code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 0.9em;
  padding: 0.2em 0.4em;
  background-color: rgba(241, 245, 249, 0.7);
  border-radius: 0.25rem;
  border: 1px solid rgba(226, 232, 240, 0.7);
}

.prose-content pre code {
  background-color: transparent;
  padding: 0;
  border-radius: 0;
  color: #e2e8f0;
  border: none;
}

.prose-content img {
  max-width: 100%;
  border-radius: 0.75rem;
  margin: 1.5rem 0;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.prose-content img:hover {
  transform: scale(1.01);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.prose-content table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin: 1.5rem 0;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(226, 232, 240, 0.7);
}

.prose-content th, .prose-content td {
  padding: 0.9rem 1.2rem;
  border: 1px solid rgba(226, 232, 240, 0.7);
}

.prose-content th {
  background: linear-gradient(to bottom, #f8fafc, #f1f5f9);
  font-weight: 600;
  text-align: left;
  color: #334155;
}

.doc-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 2rem;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  border-radius: 1.25rem;
  text-align: center;
  color: #64748b;
  min-height: 350px;
  box-shadow: 
    0 10px 30px -5px rgba(0, 0, 0, 0.1),
    0 0 5px rgba(0, 0, 0, 0.05),
    0 0 80px -10px rgba(59, 130, 246, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
}

.doc-empty::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at top right, rgba(59, 130, 246, 0.05), transparent 70%),
    radial-gradient(circle at bottom left, rgba(99, 102, 241, 0.05), transparent 70%);
  z-index: -1;
}

.empty-icon {
  width: 4rem;
  height: 4rem;
  margin-bottom: 1.5rem;
  color: #94a3b8;
  filter: drop-shadow(0 2px 5px rgba(148, 163, 184, 0.3));
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.doc-empty p {
  font-size: 1.25rem;
  font-weight: 500;
  max-width: 300px;
  margin: 0 auto;
  background: linear-gradient(90deg, #64748b, #94a3b8);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideIn {
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
}

.doc-container {
  animation: fadeIn 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
}

.doc-title, .doc-actions, .doc-tags, .doc-meta, .doc-content {
  animation: slideIn 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
}

.doc-actions {
  animation-delay: 0.1s;
}

.doc-tags {
  animation-delay: 0.2s;
}

.doc-meta {
  animation-delay: 0.3s;
}

.doc-content {
  animation-delay: 0.4s;
}

@media (max-width: 768px) {
  .doc-header {
    flex-direction: column;
    align-items: flex-start;
    padding: 1.5rem;
  }
  
  .doc-title {
    margin-bottom: 1.25rem;
    margin-right: 0;
    font-size: 1.5rem;
  }
  
  .doc-actions {
    width: 100%;
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  .doc-tags, .doc-meta, .doc-content {
    padding: 1rem 1.5rem;
  }

  .prose-content h1 {
    font-size: 1.75rem;
  }

  .prose-content h2 {
    font-size: 1.5rem;
  }

  .prose-content h3 {
    font-size: 1.25rem;
  }
}
</style>
