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
          <span>Nouvel article</span>
          <span class="btn-glow"></span>
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
      <div class="empty-icon-container">
        <svg xmlns="http://www.w3.org/2000/svg" class="empty-icon" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
        </svg>
      </div>
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
          <div class="doc-card-glow"></div>
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
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1.5rem;
  position: relative;
}

.list-header::after {
  content: '';
  position: absolute;
  bottom: -0.75rem;
  left: 0;
  width: 100px;
  height: 3px;
  background: var(--primary-gradient);
  border-radius: 3px;
  opacity: 0.7;
}

.list-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
  position: relative;
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
  padding: 0.75rem 0.75rem 0.75rem 2.75rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--border-radius);
  width: 280px;
  font-size: 0.875rem;
  transition: all var(--transition-fast);
  background: rgba(15, 23, 42, 0.6);
  color: var(--text-primary);
  backdrop-filter: blur(4px);
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
}

.search-input::placeholder {
  color: rgba(203, 213, 225, 0.6);
}

.search-icon {
  position: absolute;
  left: 0.875rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.125rem;
  height: 1.125rem;
  color: var(--primary-color);
  opacity: 0.8;
}

.new-doc-btn {
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background: rgba(99, 102, 241, 0.1);
  color: var(--text-primary);
  border-radius: var(--border-radius);
  font-size: 0.875rem;
  font-weight: 500;
  transition: all var(--transition-fast);
  border: 1px solid rgba(99, 102, 241, 0.3);
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.new-doc-btn:hover {
  background: rgba(99, 102, 241, 0.2);
  border-color: rgba(99, 102, 241, 0.5);
  transform: translateY(-2px);
  box-shadow: var(--shadow-glow);
}

.new-doc-btn:active {
  transform: translateY(0);
}

.btn-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.new-doc-btn:hover .btn-glow {
  transform: translateX(100%);
}

.btn-icon {
  width: 1.125rem;
  height: 1.125rem;
  margin-right: 0.5rem;
  color: var(--primary-color);
}

.filter-section {
  margin-bottom: 2.5rem;
  background: rgba(30, 41, 59, 0.4);
  padding: 1.25rem;
  border-radius: var(--border-radius);
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(8px);
  box-shadow: var(--shadow-subtle);
  transition: transform var(--transition-normal), box-shadow var(--transition-normal);
}

.filter-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 1rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.625rem;
}

.tag-filter {
  padding: 0.5rem 1rem;
  background: rgba(30, 41, 59, 0.6);
  color: var(--text-secondary);
  border-radius: 9999px;
  font-size: 0.75rem;
  transition: all var(--transition-fast);
  border: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer;
}

.tag-filter:hover {
  background: rgba(30, 41, 59, 0.8);
  border-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-1px);
}

.tag-active {
  background: rgba(99, 102, 241, 0.2);
  color: var(--text-primary);
  border-color: rgba(99, 102, 241, 0.4);
  box-shadow: 0 0 8px rgba(99, 102, 241, 0.3);
}

.tag-active:hover {
  background: rgba(99, 102, 241, 0.3);
  border-color: rgba(99, 102, 241, 0.5);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 0;
  color: var(--text-secondary);
  background: rgba(30, 41, 59, 0.4);
  border-radius: var(--border-radius);
  border: 1px dashed rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
}

.empty-icon-container {
  position: relative;
  width: 4rem;
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  border-radius: 50%;
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: var(--shadow-subtle);
}

.empty-icon {
  width: 2.5rem;
  height: 2.5rem;
  opacity: 0.7;
  color: var(--primary-color);
}

.docs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
}

.doc-card {
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: var(--border-radius);
  overflow: hidden;
  transition: all var(--transition-normal);
  cursor: pointer;
  height: 100%;
  background: rgba(30, 41, 59, 0.5);
  backdrop-filter: blur(8px);
  position: relative;
  z-index: 1;
  box-shadow: var(--shadow-subtle);
}

.doc-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--primary-gradient);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s ease;
  z-index: 2;
}

.doc-card:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 15px 30px -10px rgba(0, 0, 0, 0.3);
  border-color: rgba(99, 102, 241, 0.2);
}

.doc-card:hover::before {
  transform: scaleX(1);
}

.doc-card-content {
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  overflow: hidden;
  z-index: 1;
}

.doc-card-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle at center,
    rgba(99, 102, 241, 0.1) 0%,
    transparent 70%
  );
  opacity: 0;
  transition: opacity var(--transition-normal);
  z-index: -1;
  pointer-events: none;
}

.doc-card:hover .doc-card-glow {
  opacity: 1;
}

.doc-title {
  font-size: 1.375rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1rem;
  line-height: 1.3;
  transition: color var(--transition-fast);
}

.doc-card:hover .doc-title {
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.doc-preview {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
  flex-grow: 1;
  line-height: 1.6;
}

.doc-meta {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  font-size: 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding-top: 1.25rem;
}

.doc-date {
  display: flex;
  align-items: center;
  color: var(--text-secondary);
}

.meta-icon {
  width: 0.875rem;
  height: 0.875rem;
  margin-right: 0.5rem;
  color: var(--primary-color);
  opacity: 0.8;
}

.doc-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.doc-tag {
  padding: 0.25rem 0.75rem;
  background: rgba(30, 41, 59, 0.7);
  color: var(--text-secondary);
  border-radius: 9999px;
  font-size: 0.75rem;
  transition: all var(--transition-fast);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.doc-tag:hover {
  background: rgba(99, 102, 241, 0.2);
  color: var(--text-primary);
}

@media (max-width: 768px) {
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
