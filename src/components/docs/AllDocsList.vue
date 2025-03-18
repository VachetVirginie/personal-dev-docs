<template>
  <div class="all-docs-list">
    <div class="list-header">
      <h2 class="list-title">Tous les articles</h2>
      <div class="list-actions">
        <div class="search-container">
          <input
            v-model="searchQuery"
            type="text"
            class="search-input"
            placeholder="Rechercher..."
          />
          <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
          </svg>
        </div>
        <button 
          @click="$emit('new')" 
          class="new-doc-btn"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="btn-icon">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          Nouvel article
        </button>
      </div>
    </div>
    
    <div class="filter-section">
      <div class="filter-label">Filtrer par tags:</div>
      <div class="tags-container">
        <button
          v-for="tag in availableTags"
          :key="tag"
          @click="toggleTagFilter(tag)"
          :class="[
            'tag-filter',
            selectedTags.includes(tag) ? 'tag-active' : ''
          ]"
        >
          {{ tag }}
        </button>
      </div>
    </div>
    
    <div v-if="!filteredDocs.length" class="empty-state">
      <svg xmlns="http://www.w3.org/2000/svg" class="empty-icon" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
      </svg>
      <p>Aucun document trouvé</p>
    </div>
    
    <div v-else class="docs-grid">
      <div 
        v-for="doc in filteredDocs" 
        :key="doc.id"
        class="doc-card"
        @click="$emit('select', doc.id)"
      >
        <div class="doc-card-content">
          <h3 class="doc-title">{{ doc.title }}</h3>
          <p class="doc-preview">{{ getDocPreview(doc.content) }}</p>
          <div class="doc-meta">
            <div class="doc-date">
              <svg xmlns="http://www.w3.org/2000/svg" class="meta-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
              </svg>
              <span>{{ formatDate(doc.updatedAt) }}</span>
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Document {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

const props = defineProps({
  docs: {
    type: Array as () => Document[],
    required: true
  }
});

defineEmits<{
  (e: 'select', id: string): void;
  (e: 'new'): void;
}>();

const searchQuery = ref('');
const selectedTags = ref<string[]>([]);

// Get all available tags from documents
const availableTags = computed(() => {
  const tagsSet = new Set<string>();
  props.docs.forEach((doc: Document) => {
    doc.tags.forEach((tag: string) => {
      tagsSet.add(tag);
    });
  });
  return Array.from(tagsSet);
});

// Filter documents based on search query and selected tags
const filteredDocs = computed(() => {
  if (!props.docs) return [];
  
  return props.docs.filter((doc: Document) => {
    // Filter by search query
    const matchesQuery = !searchQuery.value || 
      doc.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      doc.content.toLowerCase().includes(searchQuery.value.toLowerCase());
    
    // Filter by selected tags
    const matchesTags = selectedTags.value.length === 0 || 
      selectedTags.value.every(tag => doc.tags.includes(tag));
    
    return matchesQuery && matchesTags;
  });
});

// Toggle tag filter
function toggleTagFilter(tag: string) {
  const index = selectedTags.value.indexOf(tag);
  if (index === -1) {
    selectedTags.value.push(tag);
  } else {
    selectedTags.value.splice(index, 1);
  }
}

// Format date
function formatDate(date: Date | string) {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  return format(date, 'dd MMM yyyy', { locale: fr });
}

// Get document preview (first 100 characters)
function getDocPreview(content: string) {
  if (!content) return '';
  
  // Remove markdown formatting
  const plainText = content
    .replace(/#{1,6}\s+/g, '') // Remove headings
    .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.+?)\*/g, '$1') // Remove italic
    .replace(/\[(.+?)\]\(.+?\)/g, '$1') // Remove links
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`(.+?)`/g, '$1'); // Remove inline code
  
  return plainText.substring(0, 100) + (plainText.length > 100 ? '...' : '');
}
</script>

<style scoped>
.all-docs-list {
  width: 100%;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
  position: relative;
}

.list-header::after {
  content: '';
  position: absolute;
  bottom: -0.75rem;
  left: 0;
  width: 80px;
  height: 3px;
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
  border-radius: 3px;
}

.list-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  background: linear-gradient(90deg, #1e293b, #475569);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
}

.list-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.search-container {
  position: relative;
}

.search-input {
  padding: 0.625rem 0.75rem 0.625rem 2.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  width: 250px;
  font-size: 0.875rem;
  transition: all 0.2s;
  background-color: #f8fafc;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  background-color: white;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1rem;
  height: 1rem;
  color: #9ca3af;
}

.new-doc-btn {
  display: flex;
  align-items: center;
  padding: 0.625rem 1.25rem;
  background-color: #3b82f6;
  color: white;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
  border: none;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.new-doc-btn:hover {
  background-color: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.new-doc-btn:active {
  transform: translateY(0);
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.btn-icon {
  width: 1rem;
  height: 1rem;
  margin-right: 0.5rem;
}

.filter-section {
  margin-bottom: 2rem;
  background-color: #f8fafc;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
}

.filter-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #4b5563;
  margin-bottom: 0.75rem;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag-filter {
  padding: 0.375rem 0.75rem;
  background-color: white;
  color: #4b5563;
  border-radius: 9999px;
  font-size: 0.75rem;
  transition: all 0.2s;
  border: 1px solid #e5e7eb;
  cursor: pointer;
}

.tag-filter:hover {
  background-color: #f3f4f6;
  border-color: #d1d5db;
}

.tag-active {
  background-color: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.tag-active:hover {
  background-color: #2563eb;
  border-color: #2563eb;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 0;
  color: #9ca3af;
  background-color: #f8fafc;
  border-radius: 0.5rem;
  border: 1px dashed #e5e7eb;
}

.empty-icon {
  width: 3rem;
  height: 3rem;
  margin-bottom: 1rem;
  opacity: 0.7;
}

.docs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.doc-card {
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  overflow: hidden;
  transition: all 0.3s;
  cursor: pointer;
  height: 100%;
  background-color: white;
  position: relative;
  z-index: 1;
}

.doc-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
  z-index: 2;
}

.doc-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border-color: #d1d5db;
}

.doc-card:hover::before {
  transform: scaleX(1);
}

.doc-card-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.doc-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.75rem;
  line-height: 1.3;
}

.doc-preview {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 1.25rem;
  flex-grow: 1;
  line-height: 1.5;
}

.doc-meta {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  font-size: 0.75rem;
  border-top: 1px solid #f3f4f6;
  padding-top: 1rem;
}

.doc-date {
  display: flex;
  align-items: center;
  color: #6b7280;
}

.meta-icon {
  width: 0.875rem;
  height: 0.875rem;
  margin-right: 0.375rem;
}

.doc-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.doc-tag {
  padding: 0.125rem 0.5rem;
  background-color: #f3f4f6;
  color: #4b5563;
  border-radius: 9999px;
  font-size: 0.75rem;
  transition: background-color 0.2s;
}

.doc-tag:hover {
  background-color: #e5e7eb;
}

@media (max-width: 640px) {
  .list-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .list-actions {
    width: 100%;
    justify-content: space-between;
  }
  
  .search-input {
    width: 100%;
  }
  
  .docs-grid {
    grid-template-columns: 1fr;
  }
}
</style>
