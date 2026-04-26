// ===================================
// PROJECTS.JS - Projects Page Logic
// ===================================

'use strict';

let projectsData = [];
let filteredProjects = [];

// Initialize projects page
document.addEventListener('DOMContentLoaded', async () => {
  await loadProjects();
  initProjectFilters();
  displayProjects(projectsData);
  initProjectInteractions();
});

// Load projects from JSON
async function loadProjects() {
  try {
    const response = await fetch('/data/projects.json');
    projectsData = await response.json();
    filteredProjects = projectsData;
  } catch (error) {
    console.error('Error loading projects:', error);
  }
}

// Display projects in grid
function displayProjects(projects) {
  const projectsGrid = document.getElementById('projectsGrid');
  if (!projectsGrid) return;

  projectsGrid.innerHTML = '';

  if (projects.length === 0) {
    projectsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No projects found.</p>';
    return;
  }

  projects.forEach((project, index) => {
    const projectCard = createProjectCard(project, index);
    projectsGrid.appendChild(projectCard);
  });

  // Trigger animations
  const cards = projectsGrid.querySelectorAll('.project-card');
  cards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
    card.classList.add('animate-fade');
  });
}

// Create project card element
function createProjectCard(project, index) {
  const card = document.createElement('div');
  card.className = 'card project-card';
  card.setAttribute('data-category', project.category);
  card.setAttribute('data-featured', project.featured);
  card.innerHTML = `
    <div class="card-image">
      <img src="${project.thumbnail}" alt="${project.title}" loading="lazy" />
      ${project.featured ? '<div class="featured-badge">Featured</div>' : ''}
    </div>
    <div class="card-content">
      <div class="card-meta">
        <span class="badge badge-primary">${project.category}</span>
        <span class="card-date">${formatDate(project.date)}</span>
      </div>
      <h3 class="card-title">${project.title}</h3>
      <p class="card-text">${project.description}</p>
      <div class="card-technologies">
        ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
      </div>
      <div class="card-footer">
        <a href="${project.link}" class="btn btn-primary btn-sm">View Project</a>
        <span class="status-badge status-${project.status.toLowerCase()}">${project.status}</span>
      </div>
    </div>
  `;
  return card;
}

// Initialize project filters
function initProjectFilters() {
  const filterButtons = document.querySelectorAll('[data-filter]');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.getAttribute('data-filter');

      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      // Filter projects
      if (filter === 'all') {
        filteredProjects = projectsData;
      } else {
        filteredProjects = projectsData.filter(project => project.category === filter);
      }

      displayProjects(filteredProjects);
    });
  });
}

// Initialize project interactions
function initProjectInteractions() {
  const projectCards = document.querySelectorAll('.project-card');

  projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.classList.add('hover');
    });

    card.addEventListener('mouseleave', () => {
      card.classList.remove('hover');
    });

    // Quick view functionality
    const viewBtn = card.querySelector('.btn-primary');
    if (viewBtn) {
      viewBtn.addEventListener('click', (e) => {
        const projectId = card.getAttribute('data-project-id');
        if (projectId) {
          // Navigate to project details
          window.location.href = `/projects/project-${projectId}.html`;
        }
      });
    }
  });
}

// Search projects
function searchProjects(query) {
  const searchTerm = query.toLowerCase();
  filteredProjects = projectsData.filter(project =>
    project.title.toLowerCase().includes(searchTerm) ||
    project.description.toLowerCase().includes(searchTerm) ||
    project.technologies.some(tech => tech.toLowerCase().includes(searchTerm))
  );
  displayProjects(filteredProjects);
}

// Sort projects
function sortProjects(sortBy) {
  switch (sortBy) {
    case 'newest':
      filteredProjects.sort((a, b) => new Date(b.date) - new Date(a.date));
      break;
    case 'oldest':
      filteredProjects.sort((a, b) => new Date(a.date) - new Date(b.date));
      break;
    case 'featured':
      filteredProjects.sort((a, b) => b.featured - a.featured);
      break;
    case 'title':
      filteredProjects.sort((a, b) => a.title.localeCompare(b.title));
      break;
  }
  displayProjects(filteredProjects);
}

// Format date
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

// Export functions for inline use
window.projectsModule = {
  searchProjects,
  sortProjects,
  displayProjects,
  loadProjects
};
