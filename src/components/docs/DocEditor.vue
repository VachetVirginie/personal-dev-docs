<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <div class="mb-6">
      <label for="title" class="block text-sm font-medium text-gray-700 mb-1">Title</label>
      <input
        id="title"
        v-model="formData.title"
        type="text"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        placeholder="Document title"
      />
    </div>
    
    <div class="mb-6">
      <label for="tags" class="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
      <input
        id="tags"
        v-model="tagsInput"
        type="text"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        placeholder="tag1, tag2, tag3"
      />
      <div class="flex flex-wrap gap-2 mt-2">
        <span 
          v-for="tag in formData.tags" 
          :key="tag"
          class="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-full flex items-center"
        >
          {{ tag }}
          <button @click="removeTag(tag)" class="ml-1 text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </span>
      </div>
    </div>
    
    <div class="mb-6">
      <label for="content" class="block text-sm font-medium text-gray-700 mb-1">Content (Markdown)</label>
      <div class="border border-gray-300 rounded-md overflow-hidden">
        <div class="flex border-b">
          <button 
            @click="previewMode = false" 
            :class="[
              'px-4 py-2 text-sm', 
              !previewMode ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'
            ]"
          >
            Edit
          </button>
          <button 
            @click="previewMode = true" 
            :class="[
              'px-4 py-2 text-sm', 
              previewMode ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'
            ]"
          >
            Preview
          </button>
        </div>
        
        <textarea
          v-if="!previewMode"
          id="content"
          v-model="formData.content"
          rows="15"
          class="w-full px-3 py-2 focus:outline-none"
          placeholder="Write your content in Markdown..."
        ></textarea>
        
        <div v-else class="p-3 prose max-w-none" v-html="renderedContent"></div>
      </div>
      <div class="text-xs text-gray-500 mt-1">
        Supports Markdown formatting including code blocks, lists, headings, etc.
      </div>
    </div>
    
    <div class="flex justify-end space-x-3">
      <button 
        @click="$emit('cancel')" 
        class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
      >
        Cancel
      </button>
      <button 
        @click="saveDoc" 
        class="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600 transition-colors"
      >
        Save
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { marked } from 'marked';
import hljs from 'highlight.js';

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

const emit = defineEmits(['save', 'cancel']);

const formData = ref({
  id: props.doc?.id || '',
  title: props.doc?.title || '',
  content: props.doc?.content || '',
  tags: props.doc?.tags || [],
  createdAt: props.doc?.createdAt || new Date(),
  updatedAt: new Date()
});

const tagsInput = ref(formData.value.tags.join(', '));
const previewMode = ref(false);

// Update tags when input changes
watch(tagsInput, (newVal) => {
  const tags = newVal.split(',')
    .map(tag => tag.trim())
    .filter(tag => tag !== '');
  formData.value.tags = [...new Set(tags)]; // Remove duplicates
});

const renderedContent = computed(() => {
  return marked(formData.value.content);
});

const removeTag = (tagToRemove: string) => {
  formData.value.tags = formData.value.tags.filter(tag => tag !== tagToRemove);
  tagsInput.value = formData.value.tags.join(', ');
};

const saveDoc = () => {
  if (!formData.value.title.trim()) {
    alert('Please enter a title');
    return;
  }
  
  emit('save', { ...formData.value });
};
</script>

<style>
@import 'highlight.js/styles/github-dark.css';

/* Prose styles are in DocViewer component */
</style>
