import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { GitHubService } from '@/services/github';

/**
 * Store pour gérer les paramètres de connexion à GitHub
 */
export const useGitHubStore = defineStore('github', () => {
  // État
  const owner = ref<string>('');
  const repo = ref<string>('');
  const token = ref<string>('');
  const branch = ref<string>('main');
  const isConfigured = ref<boolean>(false);
  const docsFolder = ref<string>('docs');
  
  // Service GitHub
  let githubService: GitHubService | null = null;
  
  // Getters
  const getGitHubService = computed(() => {
    if (!isConfigured.value) return null;
    
    if (!githubService) {
      githubService = new GitHubService({
        owner: owner.value,
        repo: repo.value,
        token: token.value,
        branch: branch.value
      });
    }
    
    return githubService;
  });
  
  // Actions
  /**
   * Charge les paramètres GitHub depuis le localStorage
   */
  function loadSettings() {
    try {
      const settings = localStorage.getItem('github_settings');
      if (settings) {
        const parsedSettings = JSON.parse(settings);
        owner.value = parsedSettings.owner || '';
        repo.value = parsedSettings.repo || '';
        token.value = parsedSettings.token || '';
        branch.value = parsedSettings.branch || 'main';
        docsFolder.value = parsedSettings.docsFolder || 'docs';
        isConfigured.value = !!(owner.value && repo.value && token.value);
        
        // Réinitialiser le service pour qu'il soit recréé avec les nouveaux paramètres
        githubService = null;
      }
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres GitHub:', error);
    }
  }
  
  /**
   * Sauvegarde les paramètres GitHub dans le localStorage
   */
  function saveSettings(settings: { owner: string; repo: string; token: string; branch: string; docsFolder: string }) {
    try {
      owner.value = settings.owner;
      repo.value = settings.repo;
      token.value = settings.token;
      branch.value = settings.branch || 'main';
      docsFolder.value = settings.docsFolder || 'docs';
      isConfigured.value = !!(owner.value && repo.value && token.value);
      
      localStorage.setItem('github_settings', JSON.stringify({
        owner: owner.value,
        repo: repo.value,
        token: token.value,
        branch: branch.value,
        docsFolder: docsFolder.value
      }));
      
      // Réinitialiser le service pour qu'il soit recréé avec les nouveaux paramètres
      githubService = null;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des paramètres GitHub:', error);
    }
  }
  
  /**
   * Efface les paramètres GitHub
   */
  function clearSettings() {
    owner.value = '';
    repo.value = '';
    token.value = '';
    branch.value = 'main';
    docsFolder.value = 'docs';
    isConfigured.value = false;
    
    localStorage.removeItem('github_settings');
    githubService = null;
  }
  
  /**
   * Teste la connexion à GitHub avec les paramètres actuels
   */
  async function testConnection(): Promise<{ success: boolean; message: string }> {
    if (!owner.value || !repo.value || !token.value) {
      return { success: false, message: 'Veuillez remplir tous les champs obligatoires.' };
    }
    
    try {
      const service = new GitHubService({
        owner: owner.value,
        repo: repo.value,
        token: token.value,
        branch: branch.value
      });
      
      // Tenter de lister les fichiers à la racine du dépôt
      await service.listFiles();
      
      return { success: true, message: 'Connexion réussie à GitHub!' };
    } catch (error) {
      console.error('Erreur lors du test de connexion:', error);
      return { 
        success: false, 
        message: `Erreur de connexion: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
      };
    }
  }
  
  return {
    owner,
    repo,
    token,
    branch,
    docsFolder,
    isConfigured,
    getGitHubService,
    loadSettings,
    saveSettings,
    clearSettings,
    testConnection
  };
});
