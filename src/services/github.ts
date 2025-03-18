/**
 * Service pour interagir avec l'API GitHub
 */

interface GitHubConfig {
  owner: string;
  repo: string;
  token: string;
  branch: string;
}

interface GitHubFile {
  path: string;
  content: string;
  sha?: string;
}

/**
 * Classe pour interagir avec l'API GitHub
 */
export class GitHubService {
  private config: GitHubConfig;
  
  constructor(config: GitHubConfig) {
    this.config = config;
  }
  
  /**
   * Obtient les en-têtes d'authentification pour les requêtes à l'API GitHub
   */
  private getHeaders() {
    return {
      'Authorization': `token ${this.config.token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    };
  }
  
  /**
   * Obtient le contenu d'un fichier depuis GitHub
   * @param path - Chemin du fichier dans le dépôt
   * @returns Le contenu du fichier et son SHA
   */
  async getFile(path: string): Promise<GitHubFile | null> {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${this.config.owner}/${this.config.repo}/contents/${path}?ref=${this.config.branch}`,
        { headers: this.getHeaders() }
      );
      
      if (!response.ok) {
        if (response.status === 404) {
          return null; // Fichier non trouvé
        }
        throw new Error(`Erreur lors de la récupération du fichier: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Le contenu est encodé en base64
      const content = atob(data.content);
      
      return {
        path,
        content,
        sha: data.sha
      };
    } catch (error) {
      console.error('Erreur lors de la récupération du fichier:', error);
      throw error;
    }
  }
  
  /**
   * Crée ou met à jour un fichier sur GitHub
   * @param file - Informations sur le fichier à créer/mettre à jour
   * @param message - Message de commit
   * @returns Le SHA du commit
   */
  async saveFile(file: GitHubFile, message: string): Promise<string> {
    try {
      // Vérifier si le fichier existe déjà pour obtenir son SHA
      let sha = file.sha;
      if (!sha) {
        const existingFile = await this.getFile(file.path);
        if (existingFile) {
          sha = existingFile.sha;
        }
      }
      
      // Préparer les données pour la requête
      const requestData: any = {
        message,
        content: btoa(file.content), // Encoder le contenu en base64
        branch: this.config.branch
      };
      
      // Si le fichier existe déjà, inclure son SHA pour le mettre à jour
      if (sha) {
        requestData.sha = sha;
      }
      
      // Envoyer la requête
      const response = await fetch(
        `https://api.github.com/repos/${this.config.owner}/${this.config.repo}/contents/${file.path}`,
        {
          method: 'PUT',
          headers: this.getHeaders(),
          body: JSON.stringify(requestData)
        }
      );
      
      if (!response.ok) {
        throw new Error(`Erreur lors de la sauvegarde du fichier: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.commit.sha;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du fichier:', error);
      throw error;
    }
  }
  
  /**
   * Supprime un fichier sur GitHub
   * @param path - Chemin du fichier à supprimer
   * @param message - Message de commit
   * @returns Le SHA du commit
   */
  async deleteFile(path: string, message: string): Promise<string> {
    try {
      // Obtenir le SHA du fichier
      const file = await this.getFile(path);
      if (!file || !file.sha) {
        throw new Error('Fichier non trouvé ou SHA manquant');
      }
      
      // Préparer les données pour la requête
      const requestData = {
        message,
        sha: file.sha,
        branch: this.config.branch
      };
      
      // Envoyer la requête
      const response = await fetch(
        `https://api.github.com/repos/${this.config.owner}/${this.config.repo}/contents/${path}`,
        {
          method: 'DELETE',
          headers: this.getHeaders(),
          body: JSON.stringify(requestData)
        }
      );
      
      if (!response.ok) {
        throw new Error(`Erreur lors de la suppression du fichier: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.commit.sha;
    } catch (error) {
      console.error('Erreur lors de la suppression du fichier:', error);
      throw error;
    }
  }
  
  /**
   * Liste les fichiers dans un répertoire
   * @param path - Chemin du répertoire
   * @returns Liste des fichiers
   */
  async listFiles(path: string = ''): Promise<{ name: string; path: string; type: string }[]> {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${this.config.owner}/${this.config.repo}/contents/${path}?ref=${this.config.branch}`,
        { headers: this.getHeaders() }
      );
      
      if (!response.ok) {
        throw new Error(`Erreur lors de la récupération des fichiers: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Filtrer pour ne retourner que les informations nécessaires
      return data.map((item: any) => ({
        name: item.name,
        path: item.path,
        type: item.type // 'file' ou 'dir'
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des fichiers:', error);
      throw error;
    }
  }
}
