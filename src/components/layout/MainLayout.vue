<template>
  <div class="app-container">
    <div class="glass-morphism-effect"></div>
    <div class="animated-gradient-bg"></div>
    <div class="noise-overlay"></div>
    <Header />
    <main class="main-content">
      <div class="content-wrapper">
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
:root {
  --primary-color: #6366f1;
  --primary-gradient: linear-gradient(135deg, #6366f1, #8b5cf6, #d946ef);
  --secondary-color: #10b981;
  --accent-color: #f59e0b;
  --dark-bg: #0f172a;
  --card-bg: rgba(30, 41, 59, 0.7);
  --text-primary: #f8fafc;
  --text-secondary: #cbd5e1;
  --border-radius: 1rem;
  --transition-slow: 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-normal: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-fast: 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  --shadow-glow: 0 0 20px rgba(99, 102, 241, 0.3);
  --shadow-subtle: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: var(--dark-bg);
  color: var(--text-primary);
  overflow-x: hidden;
}

.app-container {
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.glass-morphism-effect {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
    circle at 50% 50%,
    rgba(15, 23, 42, 0.3),
    rgba(15, 23, 42, 0.6)
  );
  backdrop-filter: blur(10px);
  z-index: -2;
}

.animated-gradient-bg {
  position: fixed;
  top: -50%;
  left: -50%;
  right: -50%;
  bottom: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(-45deg, #6366f1, #3b82f6, #8b5cf6, #d946ef);
  background-size: 400% 400%;
  animation: gradient-shift 15s ease infinite;
  transform: translateZ(0);
  z-index: -3;
}

.noise-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  opacity: 0.05;
  z-index: -1;
  pointer-events: none;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1440px;
  margin: 2rem auto;
  padding: 0 1.5rem;
  position: relative;
}

.content-wrapper {
  background: var(--card-bg);
  backdrop-filter: blur(12px);
  border-radius: var(--border-radius);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: var(--shadow-subtle);
  padding: 2rem;
  transition: transform var(--transition-normal), box-shadow var(--transition-normal);
  position: relative;
  overflow: hidden;
}

.content-wrapper::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--primary-gradient);
  z-index: 1;
}

@keyframes gradient-shift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .main-content {
    margin: 1rem auto;
    padding: 0 1rem;
  }
  
  .content-wrapper {
    padding: 1.5rem;
  }
}

/* Global styles for buttons, inputs, and other elements */
button, .btn {
  background: rgba(99, 102, 241, 0.1);
  color: var(--text-primary);
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: 0.5rem;
  padding: 0.625rem 1.25rem;
  font-weight: 500;
  transition: all var(--transition-fast);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  position: relative;
  overflow: hidden;
}

button:hover, .btn:hover {
  background: rgba(99, 102, 241, 0.2);
  border-color: rgba(99, 102, 241, 0.5);
  transform: translateY(-2px);
  box-shadow: var(--shadow-glow);
}

button:active, .btn:active {
  transform: translateY(0);
}

input, textarea, select {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  color: var(--text-primary);
  transition: all var(--transition-fast);
}

input:focus, textarea:focus, select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
}

/* Typography */
h1, h2, h3, h4, h5, h6 {
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 1rem;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
}

h1 {
  font-size: 2.5rem;
}

h2 {
  font-size: 2rem;
}

h3 {
  font-size: 1.5rem;
}

a {
  color: var(--primary-color);
  text-decoration: none;
  transition: color var(--transition-fast);
}

a:hover {
  color: var(--accent-color);
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.6);
}

::-webkit-scrollbar-thumb {
  background: var(--primary-color);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--accent-color);
}
</style>
