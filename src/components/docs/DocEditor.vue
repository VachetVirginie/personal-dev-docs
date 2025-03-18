<template>
  <div class="editor-container">
    <div class="editor-form">
      <div class="form-group">
        <label for="title" class="form-label">Titre</label>
        <input
          id="title"
          v-model="formData.title"
          type="text"
          class="form-input"
          placeholder="Titre du document"
        />
      </div>
      
      <div class="form-group">
        <label for="tags" class="form-label">Tags (séparés par des virgules)</label>
        <input
          id="tags"
          v-model="tagsInput"
          type="text"
          class="form-input"
          placeholder="tag1, tag2, tag3"
        />
        <div class="tags-container">
          <span 
            v-for="tag in formData.tags" 
            :key="tag"
            class="editor-tag"
          >
            {{ tag }}
            <button @click="removeTag(tag)" class="tag-remove-btn">
              &times;
            </button>
          </span>
        </div>
      </div>
      
      <div class="form-group">
        <label for="content" class="form-label">Contenu (Markdown)</label>
        <div class="content-editor">
          <div class="editor-tabs">
            <button 
              @click="previewMode = false" 
              :class="['tab-btn', !previewMode ? 'active' : '']"
            >
              Éditer
            </button>
            <button 
              @click="previewMode = true" 
              :class="['tab-btn', previewMode ? 'active' : '']"
            >
              Aperçu
            </button>
          </div>
          
          <textarea
            v-if="!previewMode"
            id="content"
            v-model="formData.content"
            rows="15"
            class="content-textarea"
            placeholder="Rédigez votre contenu en Markdown..."
          ></textarea>
          
          <div v-else class="content-preview prose-content" v-html="renderedContent"></div>
        </div>
        <div class="helper-text">
          Supporte le formatage Markdown incluant les blocs de code, listes, titres, etc.
        </div>
      </div>
      
      <div class="form-actions">
        <button 
          @click="$emit('cancel')" 
          class="btn-cancel"
        >
          Annuler
        </button>
        <button 
          @click="saveDoc" 
          class="btn-save"
        >
          Enregistrer
        </button>
      </div>
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

.editor-container {
  perspective: 1000px;
  width: 100%;
}

.editor-form {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  border-radius: 1.25rem;
  padding: 2rem;
  box-shadow: 
    0 10px 30px -5px rgba(0, 0, 0, 0.1),
    0 0 5px rgba(0, 0, 0, 0.05),
    0 0 80px -10px rgba(59, 130, 246, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transform-style: preserve-3d;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  animation: fadeIn 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.form-group {
  margin-bottom: 1.75rem;
  animation: slideIn 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
}

.form-group:nth-child(2) {
  animation-delay: 0.1s;
}

.form-group:nth-child(3) {
  animation-delay: 0.2s;
}

.form-actions {
  animation: slideIn 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
  animation-delay: 0.3s;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
}

.form-label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #334155;
  letter-spacing: 0.01em;
  background: linear-gradient(90deg, #334155, #475569);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid rgba(226, 232, 240, 0.7);
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.7);
  transition: all 0.3s ease;
  font-size: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 
    0 0 0 3px rgba(59, 130, 246, 0.15),
    0 2px 4px rgba(0, 0, 0, 0.02);
  background: rgba(255, 255, 255, 0.9);
}

.form-input::placeholder {
  color: #94a3b8;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.editor-tag {
  display: inline-flex;
  align-items: center;
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

.editor-tag:hover {
  background: linear-gradient(135deg, #e2e8f0, #cbd5e1);
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.tag-remove-btn {
  margin-left: 0.4rem;
  font-size: 1rem;
  line-height: 1;
  color: #64748b;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  transition: color 0.2s;
}

.tag-remove-btn:hover {
  color: #ef4444;
}

.content-editor {
  border: 1px solid rgba(226, 232, 240, 0.7);
  border-radius: 0.75rem;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.7);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
}

.editor-tabs {
  display: flex;
  border-bottom: 1px solid rgba(226, 232, 240, 0.7);
  background: linear-gradient(to right, rgba(249, 250, 251, 0.7), rgba(248, 250, 252, 0.5));
}

.tab-btn {
  padding: 0.75rem 1.25rem;
  font-size: 0.9rem;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #64748b;
  font-weight: 500;
  position: relative;
  overflow: hidden;
}

.tab-btn::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

.tab-btn:hover {
  color: #334155;
}

.tab-btn.active {
  color: #3b82f6;
  font-weight: 600;
  background: rgba(241, 245, 249, 0.5);
}

.tab-btn.active::before {
  transform: scaleX(1);
}

.content-textarea {
  width: 100%;
  padding: 1rem;
  min-height: 300px;
  border: none;
  resize: vertical;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 0.95rem;
  line-height: 1.7;
  color: #334155;
  background: transparent;
}

.content-textarea:focus {
  outline: none;
}

.content-preview {
  padding: 1.5rem;
  min-height: 300px;
  max-height: 600px;
  overflow-y: auto;
}

.helper-text {
  font-size: 0.8rem;
  color: #64748b;
  margin-top: 0.5rem;
  font-style: italic;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-cancel, .btn-save {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
  border: none;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  z-index: 1;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.btn-cancel::before, .btn-save::before {
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

.btn-cancel:hover::before, .btn-save:hover::before {
  left: 100%;
}

.btn-cancel {
  background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
  color: #475569;
  border: 1px solid rgba(226, 232, 240, 0.7);
}

.btn-cancel:hover {
  background: linear-gradient(135deg, #e2e8f0, #cbd5e1);
  transform: translateY(-2px);
}

.btn-save {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
}

.btn-save:hover {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  transform: translateY(-2px);
}

/* Responsive styles */
@media (max-width: 768px) {
  .editor-form {
    padding: 1.5rem;
  }
  
  .form-actions {
    flex-direction: column-reverse;
    gap: 0.75rem;
  }
  
  .btn-cancel, .btn-save {
    width: 100%;
  }
}
</style>
