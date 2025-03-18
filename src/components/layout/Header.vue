<template>
  <header class="header">
    <div class="header-container">
      <div class="logo-container">
        <div class="logo-text">DevDocs</div>
        <div class="logo-subtitle">Documentation Personnelle</div>
      </div>
      <nav class="main-nav">
        <ul class="nav-list">
          <li class="nav-item">
            <router-link 
              to="/" 
              class="nav-link"
              active-class="nav-link-active"
            >
              Tableau de bord
            </router-link>
          </li>
          <li class="nav-item">
            <router-link 
              to="/docs" 
              class="nav-link"
              active-class="nav-link-active"
            >
              Documentation
            </router-link>
          </li>
          <li class="nav-item">
            <router-link 
              to="/tracker" 
              class="nav-link"
              active-class="nav-link-active"
            >
              Activités
            </router-link>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
// Header component
</script>

<style>
.header {
  background-color: #1e293b;
  color: #f8fafc;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-container {
  max-width: 80rem;
  margin-left: auto;
  margin-right: auto;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: #3b82f6;
  letter-spacing: -0.025em;
}

.logo-subtitle {
  font-size: 0.875rem;
  color: #10b981;
  font-weight: 500;
}

.main-nav {
  margin-left: 2rem;
}

.nav-list {
  display: flex;
  gap: 1.5rem;
  list-style-type: none;
  margin: 0;
  padding: 0;
}

.nav-item {
  position: relative;
}

.nav-link {
  color: #e2e8f0;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 0;
  transition: color 0.2s ease;
}

.nav-link:hover {
  color: #3b82f6;
}

.nav-link-active {
  color: #3b82f6;
  position: relative;
}

.nav-link-active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #3b82f6;
}

@media (max-width: 640px) {
  .header-container {
    flex-direction: column;
    padding: 1rem 0.5rem;
    gap: 0.5rem;
  }
  
  .nav-list {
    gap: 1rem;
  }
}
</style>
