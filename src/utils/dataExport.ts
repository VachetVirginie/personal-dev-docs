import { useDocsStore } from '@/stores/docs/docs';
import { useTrackerStore } from '@/stores/tracker/tracker';

/**
 * Exporte toutes les données de l'application dans un fichier JSON
 */
export function exportAllData(): void {
  const docsStore = useDocsStore();
  const trackerStore = useTrackerStore();
  
  const data = {
    documents: docsStore.allDocuments,
    activities: trackerStore.allActivities,
    exportDate: new Date().toISOString()
  };
  
  const dataStr = JSON.stringify(data, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  
  const exportFileDefaultName = `devdocs-backup-${new Date().toISOString().slice(0, 10)}.json`;
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
}

/**
 * Importe des données depuis un fichier JSON
 * @param jsonData - Données JSON à importer
 * @returns Un objet indiquant le succès et un message
 */
export function importData(jsonData: string): { success: boolean; message: string } {
  try {
    const data = JSON.parse(jsonData);
    
    if (!data.documents || !data.activities) {
      return { 
        success: false, 
        message: 'Format de données invalide. Le fichier doit contenir des documents et des activités.' 
      };
    }
    
    const docsStore = useDocsStore();
    const trackerStore = useTrackerStore();
    
    // Importer les documents
    localStorage.setItem('documents', JSON.stringify(data.documents));
    docsStore.loadDocuments();
    
    // Importer les activités
    localStorage.setItem('activities', JSON.stringify(data.activities));
    trackerStore.loadActivities();
    
    return { 
      success: true, 
      message: `Importation réussie ! ${data.documents.length} documents et des données d'activité ont été importés.` 
    };
  } catch (error) {
    console.error('Erreur lors de l\'importation des données:', error);
    return { 
      success: false, 
      message: 'Erreur lors de l\'importation des données. Vérifiez que le fichier est au bon format.' 
    };
  }
}
