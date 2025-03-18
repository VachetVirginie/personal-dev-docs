<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden">
    <div class="p-4 border-b border-gray-200 flex justify-between items-center">
      <h2 class="text-lg font-medium text-dark">Documents</h2>
      <button 
        @click="$emit('new')" 
        class="px-3 py-1 bg-primary text-white rounded-md hover:bg-blue-600 transition-colors flex items-center"
      >
        <span class="mr-1">+</span> New Doc
      </button>
    </div>
    
    <div class="p-4 border-b border-gray-200">
      <div class="relative">
        <input
          v-model="searchQuery"
          type="text"
          class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Search documents..."
        />
        <svg class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
        </svg>
      </div>
      
      <div class="mt-3">
        <div class="text-sm font-medium text-gray-700">Filter by tags:</div>
        <div class="flex flex-wrap gap-2 mt-1">
          <button
            v-for="tag in availableTags"
            :key="tag"
            @click="toggleTagFilter(tag)"
            :class="[
              'px-2 py-1 text-xs rounded-full transition-colors',
              selectedTags.includes(tag)
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            ]"
          >
            {{ tag }}
          </button>
        </div>
      </div>
    </div>
    
    <div class="max-h-96 overflow-y-auto">
      <div v-if="filteredDocs.length === 0" class="p-6 text-center text-gray-500">
        No documents found
      </div>
      
      <div v-else>
        <div
          v-for="doc in filteredDocs"
          :key="doc.id"
          @click="$emit('select', doc.id)"
          :class="[
            'p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors',
            selectedDocId === doc.id ? 'bg-blue-50' : ''
          ]"
        >
          <div class="font-medium text-dark">{{ doc.title }}</div>
          <div class="text-sm text-gray-500 mt-1">{{ formatDate(doc.updatedAt) }}</div>
          <div class="flex flex-wrap gap-1 mt-2">
            <span 
              v-for="tag in doc.tags" 
              :key="tag"
              class="px-1.5 py-0.5 bg-gray-200 text-gray-700 text-xs rounded-full"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { format } from 'date-fns';

const props = defineProps({
  docs: {
    type: Array,
    required: true
  },
  selectedDocId: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['select', 'new']);

const searchQuery = ref('');
const selectedTags = ref<string[]>([]);

const availableTags = computed(() => {
  const tags = new Set<string>();
  props.docs.forEach((doc: any) => {
    doc.tags.forEach((tag: string) => tags.add(tag));
  });
  return Array.from(tags);
});

const filteredDocs = computed(() => {
  return props.docs.filter((doc: any) => {
    // Filter by search query
    const matchesQuery = 
      doc.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      doc.content.toLowerCase().includes(searchQuery.value.toLowerCase());
    
    // Filter by selected tags
    const matchesTags = 
      selectedTags.value.length === 0 || 
      selectedTags.value.every(tag => doc.tags.includes(tag));
    
    return matchesQuery && matchesTags;
  });
});

const toggleTagFilter = (tag: string) => {
  if (selectedTags.value.includes(tag)) {
    selectedTags.value = selectedTags.value.filter(t => t !== tag);
  } else {
    selectedTags.value.push(tag);
  }
};

const formatDate = (date: Date | string | number) => {
  return format(new Date(date), 'MMM d, yyyy');
};
</script>
