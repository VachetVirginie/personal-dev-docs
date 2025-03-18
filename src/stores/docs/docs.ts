import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { v4 as uuidv4 } from 'uuid';

/**
 * Interface representing a document in the application
 */
interface Document {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Sample documents for demonstration
const sampleDocuments: Document[] = [
  {
    id: uuidv4(),
    title: 'Introduction à Vue.js 3',
    content: `# Vue.js 3 - Guide de démarrage

## Introduction

Vue.js est un framework JavaScript progressif pour construire des interfaces utilisateur. Contrairement à d'autres frameworks monolithiques, Vue est conçu pour être adopté de manière incrémentielle.

## Composition API

\`\`\`js
import { ref, computed, onMounted } from 'vue'

export default {
  setup() {
    // état réactif
    const count = ref(0)
    
    // fonctions qui modifient l'état
    function increment() {
      count.value++
    }
    
    // valeurs calculées
    const doubleCount = computed(() => count.value * 2)
    
    // hooks de cycle de vie
    onMounted(() => {
      console.log('Composant monté!')
    })
    
    // exposer au template
    return {
      count,
      increment,
      doubleCount
    }
  }
}
\`\`\`

## Avantages de Vue.js

- **Facile à apprendre**: Courbe d'apprentissage douce
- **Flexible**: Intégration progressive
- **Performant**: DOM virtuel optimisé
- **Maintenable**: Architecture basée sur des composants`,
    tags: ['Vue.js', 'JavaScript', 'Frontend'],
    createdAt: new Date(2025, 2, 10),
    updatedAt: new Date(2025, 2, 15)
  },
  {
    id: uuidv4(),
    title: 'Utilisation de Tailwind CSS',
    content: `# Guide Tailwind CSS

## Introduction

Tailwind CSS est un framework CSS utilitaire qui permet de construire rapidement des designs personnalisés sans quitter votre HTML.

## Installation

\`\`\`bash
npm install -D tailwindcss
npx tailwindcss init
\`\`\`

## Configuration

\`\`\`js
// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
      }
    },
  },
  plugins: [],
}
\`\`\`

## Exemple d'utilisation

\`\`\`html
<div class="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4">
  <div>
    <div class="text-xl font-medium text-black">Tailwind CSS</div>
    <p class="text-gray-500">Framework CSS utilitaire</p>
  </div>
</div>
\`\`\`

## Avantages

- Développement plus rapide
- Moins de CSS à écrire
- Designs cohérents
- Personnalisation facile`,
    tags: ['CSS', 'Tailwind', 'Frontend'],
    createdAt: new Date(2025, 2, 12),
    updatedAt: new Date(2025, 2, 12)
  },
  {
    id: uuidv4(),
    title: 'TypeScript pour les développeurs JavaScript',
    content: `# TypeScript - Guide pratique

## Introduction

TypeScript est un sur-ensemble typé de JavaScript qui se compile en JavaScript pur. Il ajoute des types statiques optionnels, des classes et des modules à JavaScript.

## Types de base

\`\`\`typescript
// Types primitifs
let isDone: boolean = false;
let decimal: number = 6;
let color: string = "blue";

// Tableaux
let list: number[] = [1, 2, 3];
let names: Array<string> = ["John", "Jane"];

// Tuples
let x: [string, number] = ["hello", 10];

// Enum
enum Color {Red, Green, Blue}
let c: Color = Color.Green;

// Any
let notSure: any = 4;
notSure = "maybe a string";

// Void
function warnUser(): void {
  console.log("This is a warning message");
}
\`\`\`

## Interfaces

\`\`\`typescript
interface User {
  id: number;
  name: string;
  email?: string; // Propriété optionnelle
  readonly createdAt: Date; // Propriété en lecture seule
}

function createUser(user: User): User {
  return user;
}
\`\`\`

## Avantages de TypeScript

- Détection d'erreurs lors de la compilation
- Meilleure documentation du code
- Intellisense amélioré dans les IDE
- Refactoring plus sûr`,
    tags: ['TypeScript', 'JavaScript', 'Programmation'],
    createdAt: new Date(2025, 2, 14),
    updatedAt: new Date(2025, 2, 18)
  }
];

/**
 * Store for managing documents
 */
export const useDocsStore = defineStore('docs', () => {
  // State
  const documents = ref<Document[]>([]);
  const selectedDocumentId = ref<string | null>(null);

  // Getters
  const allDocuments = computed(() => documents.value);
  
  const selectedDocument = computed(() => {
    if (!selectedDocumentId.value) return null;
    return documents.value.find(doc => doc.id === selectedDocumentId.value) || null;
  });

  // Actions
  /**
   * Load documents from local storage
   */
  function loadDocuments() {
    try {
      const storedDocs = localStorage.getItem('documents');
      if (storedDocs) {
        const parsedDocs = JSON.parse(storedDocs);
        // Convert string dates back to Date objects
        documents.value = parsedDocs.map((doc: any) => ({
          ...doc,
          createdAt: new Date(doc.createdAt),
          updatedAt: new Date(doc.updatedAt)
        }));
      } else {
        // If no documents in localStorage, use sample documents
        documents.value = sampleDocuments;
        saveToLocalStorage();
      }
    } catch (error) {
      console.error('Failed to load documents from localStorage:', error);
      // Use sample documents if there's an error
      documents.value = sampleDocuments;
      saveToLocalStorage();
    }
  }

  /**
   * Save documents to local storage
   */
  function saveToLocalStorage() {
    try {
      localStorage.setItem('documents', JSON.stringify(documents.value));
    } catch (error) {
      console.error('Failed to save documents to localStorage:', error);
    }
  }

  /**
   * Create a new document
   * @param doc - Document data to create
   * @returns The ID of the created document
   */
  function createDocument(doc: Partial<Document>): string {
    const newDoc: Document = {
      id: uuidv4(),
      title: doc.title || 'Document sans titre',
      content: doc.content || '',
      tags: doc.tags || [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    documents.value.push(newDoc);
    saveToLocalStorage();
    return newDoc.id;
  }

  /**
   * Update an existing document
   * @param id - ID of the document to update
   * @param updates - Document data to update
   * @returns Boolean indicating success
   */
  function updateDocument(id: string, updates: Partial<Document>): boolean {
    const index = documents.value.findIndex(doc => doc.id === id);
    if (index === -1) return false;

    // Merge updates with existing document
    documents.value[index] = {
      ...documents.value[index],
      ...updates,
      updatedAt: new Date()
    };

    saveToLocalStorage();
    return true;
  }

  /**
   * Delete a document
   * @param id - ID of the document to delete
   * @returns Boolean indicating success
   */
  function deleteDocument(id: string): boolean {
    const index = documents.value.findIndex(doc => doc.id === id);
    if (index === -1) return false;

    documents.value.splice(index, 1);
    
    // If the deleted document was selected, clear selection
    if (selectedDocumentId.value === id) {
      selectedDocumentId.value = null;
    }

    saveToLocalStorage();
    return true;
  }

  /**
   * Select a document
   * @param id - ID of the document to select
   */
  function selectDocument(id: string | null) {
    selectedDocumentId.value = id;
  }

  return {
    documents,
    selectedDocumentId,
    allDocuments,
    selectedDocument,
    loadDocuments,
    createDocument,
    updateDocument,
    deleteDocument,
    selectDocument
  };
});
