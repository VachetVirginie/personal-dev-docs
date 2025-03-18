<template>
  <div class="github-settings">
    <h2 class="section-title">Configuration GitHub</h2>
    
    <div class="card">
      <div class="card-body">
        <p class="card-description">
          Configurez l'intégration avec GitHub pour stocker vos documents Markdown directement dans un dépôt.
          Vous aurez besoin d'un token d'accès personnel avec les permissions <code>repo</code>.
        </p>
        
        <form @submit.prevent="saveSettings" class="settings-form">
          <div class="form-group">
            <label for="owner" class="form-label">Propriétaire du dépôt</label>
            <input 
              id="owner" 
              v-model="form.owner" 
              type="text" 
              class="form-input" 
              placeholder="Nom d'utilisateur ou organisation"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="repo" class="form-label">Nom du dépôt</label>
            <input 
              id="repo" 
              v-model="form.repo" 
              type="text" 
              class="form-input" 
              placeholder="Nom du dépôt GitHub"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="token" class="form-label">Token d'accès personnel</label>
            <input 
              id="token" 
              v-model="form.token" 
              type="password" 
              class="form-input" 
              placeholder="ghp_..."
              required
            />
            <div class="form-help">
              <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer">
                Créer un nouveau token
              </a>
            </div>
          </div>
          
          <div class="form-group">
            <label for="branch" class="form-label">Branche</label>
            <input 
              id="branch" 
              v-model="form.branch" 
              type="text" 
              class="form-input" 
              placeholder="main"
            />
          </div>
          
          <div class="form-group">
            <label for="docsFolder" class="form-label">Dossier pour les documents</label>
            <input 
              id="docsFolder" 
              v-model="form.docsFolder" 
              type="text" 
              class="form-input" 
              placeholder="docs"
            />
          </div>
          
          <div class="form-actions">
            <button 
              type="button" 
              @click="testConnection" 
              class="secondary-button"
              :disabled="isLoading"
            >
              Tester la connexion
            </button>
            
            <button 
              type="submit" 
              class="primary-button"
              :disabled="isLoading"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
    
    <div v-if="isConfigured" class="card mt-4">
      <div class="card-body">
        <h3 class="card-subtitle">Synchronisation des documents</h3>
        <p class="card-description">
          Synchronisez vos documents entre l'application locale et GitHub.
        </p>
        
        <div class="sync-actions">
          <button 
            @click="syncToGitHub" 
            class="primary-button"
            :disabled="isLoading"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
            Envoyer les documents vers GitHub
          </button>
          
          <button 
            @click="syncFromGitHub" 
            class="secondary-button"
            :disabled="isLoading"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
            Récupérer les documents depuis GitHub
          </button>
        </div>
      </div>
    </div>
    
    <div v-if="message" :class="['message', messageType === 'error' ? 'error' : 'success']">
      {{ message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useGitHubStore } from '@/stores/settings/github';
import { useDocsStore } from '@/stores/docs/docs';

const githubStore = useGitHubStore();
const docsStore = useDocsStore();

const isLoading = ref(false);
const message = ref('');
const messageType = ref<'success' | 'error'>('success');

const form = reactive({
  owner: githubStore.owner,
  repo: githubStore.repo,
  token: githubStore.token,
  branch: githubStore.branch,
  docsFolder: githubStore.docsFolder
});

const isConfigured = ref(githubStore.isConfigured);

onMounted(() => {
  githubStore.loadSettings();
  form.owner = githubStore.owner;
  form.repo = githubStore.repo;
  form.token = githubStore.token;
  form.branch = githubStore.branch;
  form.docsFolder = githubStore.docsFolder;
  isConfigured.value = githubStore.isConfigured;
});

/**
 * Teste la connexion à GitHub
 */
async function testConnection() {
  isLoading.value = true;
  message.value = '';
  
  try {
    const result = await githubStore.testConnection();
    message.value = result.message;
    messageType.value = result.success ? 'success' : 'error';
  } catch (error) {
    message.value = `Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`;
    messageType.value = 'error';
  } finally {
    isLoading.value = false;
  }
}

/**
 * Enregistre les paramètres GitHub
 */
async function saveSettings() {
  isLoading.value = true;
  message.value = '';
  
  try {
    githubStore.saveSettings({
      owner: form.owner,
      repo: form.repo,
      token: form.token,
      branch: form.branch,
      docsFolder: form.docsFolder
    });
    
    isConfigured.value = githubStore.isConfigured;
    
    message.value = 'Paramètres GitHub enregistrés avec succès!';
    messageType.value = 'success';
  } catch (error) {
    message.value = `Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`;
    messageType.value = 'error';
  } finally {
    isLoading.value = false;
  }
}

/**
 * Synchronise les documents locaux vers GitHub
 */
async function syncToGitHub() {
  if (!githubStore.isConfigured || !githubStore.getGitHubService) {
    message.value = 'Veuillez configurer GitHub avant de synchroniser.';
    messageType.value = 'error';
    return;
  }
  
  isLoading.value = true;
  message.value = '';
  
  try {
    const service = githubStore.getGitHubService;
    const documents = docsStore.allDocuments;
    let successCount = 0;
    
    for (const doc of documents) {
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
      
      successCount++;
    }
    
    message.value = `${successCount} document(s) synchronisé(s) avec succès vers GitHub!`;
    messageType.value = 'success';
  } catch (error) {
    message.value = `Erreur lors de la synchronisation: ${error instanceof Error ? error.message : 'Erreur inconnue'}`;
    messageType.value = 'error';
  } finally {
    isLoading.value = false;
  }
}

/**
 * Récupère les documents depuis GitHub
 */
async function syncFromGitHub() {
  if (!githubStore.isConfigured || !githubStore.getGitHubService) {
    message.value = 'Veuillez configurer GitHub avant de synchroniser.';
    messageType.value = 'error';
    return;
  }
  
  isLoading.value = true;
  message.value = '';
  
  try {
    const service = githubStore.getGitHubService;
    
    // Lister les fichiers dans le dossier des documents
    const files = await service.listFiles(githubStore.docsFolder);
    const mdFiles = files.filter(file => file.type === 'file' && file.name.endsWith('.md'));
    
    let importCount = 0;
    
    for (const file of mdFiles) {
      // Récupérer le contenu du fichier
      const fileData = await service.getFile(file.path);
      if (!fileData) continue;
      
      const content = fileData.content;
      
      // Extraire le titre du contenu (première ligne commençant par #)
      const titleMatch = content.match(/^#\s+(.+)$/m);
      const title = titleMatch ? titleMatch[1] : file.name.replace('.md', '');
      
      // Extraire les métadonnées
      const metaMatch = content.match(/---\n([\s\S]*?)\n---/);
      let tags: string[] = [];
      let createdAt = new Date();
      let updatedAt = new Date();
      
      if (metaMatch) {
        const meta = metaMatch[1];
        
        // Extraire les tags
        const tagsMatch = meta.match(/tags:\s*(.*)/);
        if (tagsMatch) {
          tags = tagsMatch[1].split(',').map(tag => tag.trim());
        }
        
        // Extraire les dates
        const createdMatch = meta.match(/created:\s*(.*)/);
        if (createdMatch) {
          createdAt = new Date(createdMatch[1]);
        }
        
        const updatedMatch = meta.match(/updated:\s*(.*)/);
        if (updatedMatch) {
          updatedAt = new Date(updatedMatch[1]);
        }
      }
      
      // Extraire le contenu principal (sans les métadonnées)
      let mainContent = content;
      if (metaMatch) {
        mainContent = content.replace(metaMatch[0], '');
      }
      
      // Supprimer le titre s'il est présent
      if (titleMatch) {
        mainContent = mainContent.replace(titleMatch[0], '');
      }
      
      mainContent = mainContent.trim();
      
      // Vérifier si un document avec le même titre existe déjà
      const existingDoc = docsStore.allDocuments.find(doc => doc.title === title);
      
      if (existingDoc) {
        // Mettre à jour le document existant
        docsStore.updateDocument(existingDoc.id, {
          title,
          content: mainContent,
          tags,
          updatedAt
        });
      } else {
        // Créer un nouveau document
        docsStore.createDocument({
          title,
          content: mainContent,
          tags,
          createdAt,
          updatedAt
        });
      }
      
      importCount++;
    }
    
    message.value = `${importCount} document(s) importé(s) avec succès depuis GitHub!`;
    messageType.value = 'success';
  } catch (error) {
    message.value = `Erreur lors de l'importation: ${error instanceof Error ? error.message : 'Erreur inconnue'}`;
    messageType.value = 'error';
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
.github-settings {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1rem;
}

.card {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.card-body {
  padding: 1.5rem;
}

.card-subtitle {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.card-description {
  color: #64748b;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.settings-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-weight: 500;
  color: #1e293b;
}

.form-input {
  padding: 0.5rem 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.375rem;
  font-size: 1rem;
  line-height: 1.5;
  transition: border-color 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-help {
  font-size: 0.875rem;
  color: #64748b;
}

.form-help a {
  color: #3b82f6;
  text-decoration: none;
}

.form-help a:hover {
  text-decoration: underline;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.sync-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
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

.primary-button:hover:not(:disabled) {
  background-color: #2563eb;
}

.secondary-button {
  background-color: #e2e8f0;
  color: #1e293b;
  border: none;
}

.secondary-button:hover:not(:disabled) {
  background-color: #cbd5e1;
}

.primary-button:disabled, .secondary-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
  margin-right: 0.5rem;
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

.mt-4 {
  margin-top: 1rem;
}
</style>
