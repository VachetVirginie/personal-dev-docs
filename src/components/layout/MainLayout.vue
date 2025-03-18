<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <Header />
    <main class="container mx-auto px-4 py-8 flex-grow max-w-7xl">
      <div class="bg-white rounded-lg shadow-sm p-6">
        <slot></slot>
      </div>
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Header from './Header.vue';
import Footer from './Footer.vue';
</script>

<style>
.container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
}

.mx-auto {
  margin-left: auto;
  margin-right: auto;
}

.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}

.py-8 {
  padding-top: 2rem;
  padding-bottom: 2rem;
}

.flex-grow {
  flex-grow: 1;
}

.max-w-7xl {
  max-width: 80rem;
}

.min-h-screen {
  min-height: 100vh;
}

.flex {
  display: flex;
}

.flex-col {
  flex-direction: column;
}

.bg-gray-50 {
  background-color: #f9fafb;
}

.bg-white {
  background-color: white;
}

.rounded-lg {
  border-radius: 0.5rem;
}

.shadow-sm {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.p-6 {
  padding: 1.5rem;
}
</style>
