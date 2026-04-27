// ===================================
// NEWS.JS - News/Updates Page Logic
// ===================================

'use strict';

let newsData = [];
let filteredNews = [];

// Initialize news page
document.addEventListener('DOMContentLoaded', async () => {
  await loadNews();
  initNewsFilters();
  displayNewsUpdates(newsData);
});

// Load news from JSON
async function loadNews() {
  try {
    const response = await fetch('../data/news.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    newsData = await response.json();
    filteredNews = newsData;
  } catch (error) {
    console.error('Error loading news:', error);
    displayNewsError(error);
  }
}

// Display error message when news fails to load
function displayNewsError(error) {
  const newsGrid = document.getElementById('newsGrid');
  if (!newsGrid) return;
  
  newsGrid.innerHTML = `
    <div style="grid-column: 1/-1; text-align: center; padding: 2rem;">
      <p style="color: #ff6b6b; font-size: 1.1rem; margin-bottom: 1rem;">
        ⚠️ Unable to load news updates
      </p>
      <p style="color: #999; font-size: 0.95rem;">
        There was an error loading the news content. Please try refreshing the page or contact support if the problem persists.
      </p>
      <p style="color: #666; font-size: 0.85rem; margin-top: 1rem;">
        Error details: ${error.message}
      </p>
    </div>
  `;
}

// Display news updates
function displayNewsUpdates(news) {
  const newsGrid = document.getElementById('newsGrid');
  if (!newsGrid) return;

  newsGrid.innerHTML = '';

  if (news.length === 0) {
    newsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No updates found.</p>';
    return;
  }

  news.forEach((item, index) => {
    const newsCard = createNewsCard(item, index);
    newsGrid.appendChild(newsCard);
  });

  // Trigger animations
  const cards = newsGrid.querySelectorAll('.news-card');
  cards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
    card.classList.add('animate-fade');
  });
}

// Create news card element
function createNewsCard(news, index) {
  const card = document.createElement('article');
  card.className = 'card news-card';
  card.setAttribute('data-category', news.category);
  card.innerHTML = `
    <div class="card-image">
      <img src="${news.thumbnail}" alt="${news.title}" loading="lazy" />
    </div>
    <div class="card-content">
      <div class="card-meta">
        <span class="badge badge-secondary">${news.category}</span>
        <span class="card-date">${formatDate(news.date)}</span>
      </div>
      <h3 class="card-title">${news.title}</h3>
      <p class="card-text">${news.excerpt}</p>
      <div class="card-footer">
        <a href="${news.link}" class="btn btn-primary btn-sm">Read More</a>
      </div>
    </div>
  `;
  return card;
}

// Initialize news filters
function initNewsFilters() {
  const filterButtons = document.querySelectorAll('[data-filter-news]');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.getAttribute('data-filter-news');

      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      // Filter news
      if (filter === 'all') {
        filteredNews = newsData;
      } else {
        filteredNews = newsData.filter(item => item.category === filter);
      }

      displayNewsUpdates(filteredNews);
    });
  });
}

// Get latest news
function getLatestNews(limit = 3) {
  return newsData.slice(0, limit);
}

// Get news by category
function getNewsByCategory(category, limit = null) {
  const items = newsData.filter(item => item.category === category);
  return limit ? items.slice(0, limit) : items;
}

// Format date
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

// Export functions for inline use
window.newsModule = {
  displayNewsUpdates,
  loadNews,
  getLatestNews,
  getNewsByCategory
};
