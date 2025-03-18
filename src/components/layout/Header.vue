<template>
  <header class="header">
    <div class="header-container">
      <div class="logo-container">
        <div class="logo-icon">
          <div class="logo-glow"></div>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="logo-svg">
            <path d="M12 16.5a4.5 4.5 0 100-9 4.5 4.5 0 000 9zM3 4.5a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 4.5zM3 10.5a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75zM3 16.5a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z" />
          </svg>
        </div>
        <div class="logo-text-container">
          <div class="logo-text">DevDocs</div>
          <div class="logo-subtitle">Documentation Personnelle</div>
        </div>
      </div>
      
      <nav class="main-nav">
        <ul class="nav-list">
          <li class="nav-item">
            <router-link 
              to="/" 
              class="nav-link"
              active-class="nav-link-active"
            >
              <span class="nav-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                  <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
                </svg>
              </span>
              <span class="nav-text">Dashboard</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link 
              to="/docs" 
              class="nav-link"
              active-class="nav-link-active"
            >
              <span class="nav-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625z" />
                  <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
                </svg>
              </span>
              <span class="nav-text">Documentation</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link 
              to="/tracker" 
              class="nav-link"
              active-class="nav-link-active"
            >
              <span class="nav-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path fill-rule="evenodd" d="M3 6a3 3 0 013-3h12a3 3 0 013 3v12a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm4.5 7.5a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0v-2.25a.75.75 0 01.75-.75zm3.75-1.5a.75.75 0 00-1.5 0v4.5a.75.75 0 001.5 0V12zm2.25-3a.75.75 0 01.75.75v6.75a.75.75 0 01-1.5 0V9.75A.75.75 0 0113.5 9zm3.75-1.5a.75.75 0 00-1.5 0v9a.75.75 0 001.5 0v-9z" clip-rule="evenodd" />
                </svg>
              </span>
              <span class="nav-text">Activités</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link 
              to="/settings" 
              class="nav-link"
              active-class="nav-link-active"
            >
              <span class="nav-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path fill-rule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 00-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 00-2.282.819l-.922 1.597a1.875 1.875 0 00.432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 000 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 00-.432 2.385l.922 1.597a1.875 1.875 0 002.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 002.28-.819l.923-1.597a1.875 1.875 0 00-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 000-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 00-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 00-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 00-1.85-1.567h-1.843zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" clip-rule="evenodd" />
                </svg>
              </span>
              <span class="nav-text">Paramètres</span>
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
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  position: sticky;
  top: 0;
  z-index: 50;
  transition: all var(--transition-normal);
}

.header-container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-icon {
  position: relative;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2));
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
}

.logo-glow {
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, var(--primary-color) 0%, transparent 70%);
  opacity: 0.5;
  filter: blur(8px);
  animation: pulse 3s infinite ease-in-out;
}

.logo-svg {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--primary-color);
  position: relative;
  z-index: 1;
}

.logo-text-container {
  display: flex;
  flex-direction: column;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 800;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  letter-spacing: -0.025em;
}

.logo-subtitle {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--secondary-color);
  letter-spacing: 0.05em;
  text-transform: uppercase;
  opacity: 0.9;
}

.main-nav {
  margin-left: 2rem;
}

.nav-list {
  display: flex;
  gap: 1rem;
  list-style-type: none;
  margin: 0;
  padding: 0;
}

.nav-item {
  position: relative;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  transition: all var(--transition-fast);
  position: relative;
  overflow: hidden;
}

.nav-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to right, transparent, rgba(99, 102, 241, 0.1), transparent);
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.nav-link:hover {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.05);
}

.nav-link:hover::before {
  transform: translateX(100%);
}

.nav-icon {
  width: 1.25rem;
  height: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform var(--transition-fast);
}

.nav-link:hover .nav-icon {
  transform: translateY(-2px);
  color: var(--primary-color);
}

.nav-text {
  position: relative;
}

.nav-link-active {
  color: var(--text-primary);
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.2);
}

.nav-link-active .nav-icon {
  color: var(--primary-color);
}

.nav-link-active::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  background-color: var(--primary-color);
  border-radius: 50%;
  box-shadow: 0 0 8px 2px var(--primary-color);
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.1);
  }
}

@media (max-width: 768px) {
  .header-container {
    flex-direction: column;
    padding: 1rem;
    gap: 1rem;
  }
  
  .nav-list {
    width: 100%;
    justify-content: space-between;
  }
  
  .nav-text {
    display: none;
  }
  
  .nav-link {
    padding: 0.5rem;
    justify-content: center;
  }
  
  .nav-icon {
    width: 1.5rem;
    height: 1.5rem;
  }
}
</style>
