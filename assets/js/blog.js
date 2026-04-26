// ===================================
// BLOG.JS - Blog Page Logic
// ===================================

'use strict';

let blogsData = [];
let filteredBlogs = [];

// Initialize blog page
document.addEventListener('DOMContentLoaded', async () => {
  await loadBlogs();
  initBlogFilters();
  displayBlogPosts(blogsData);
  initBlogSearch();
});

// Load blogs from JSON
async function loadBlogs() {
  try {
    const response = await fetch('/data/blogs.json');
    blogsData = await response.json();
    filteredBlogs = blogsData;
  } catch (error) {
    console.error('Error loading blogs:', error);
  }
}

// Display blog posts
function displayBlogPosts(blogs) {
  const blogsGrid = document.getElementById('blogsGrid');
  if (!blogsGrid) return;

  blogsGrid.innerHTML = '';

  if (blogs.length === 0) {
    blogsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No blog posts found.</p>';
    return;
  }

  blogs.forEach((blog, index) => {
    const blogCard = createBlogCard(blog, index);
    blogsGrid.appendChild(blogCard);
  });

  // Trigger animations
  const cards = blogsGrid.querySelectorAll('.blog-card');
  cards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
    card.classList.add('animate-fade');
  });
}

// Create blog card element
function createBlogCard(blog, index) {
  const card = document.createElement('article');
  card.className = 'card blog-card';
  card.setAttribute('data-category', blog.category);
  card.setAttribute('data-featured', blog.featured);
  card.innerHTML = `
    <div class="card-image">
      <img src="${blog.thumbnail}" alt="${blog.title}" loading="lazy" />
      ${blog.featured ? '<div class="featured-badge">Featured</div>' : ''}
    </div>
    <div class="card-content">
      <div class="card-meta">
        <span class="badge badge-secondary">${blog.category}</span>
        <span class="read-time">${blog.readTime}</span>
      </div>
      <h3 class="card-title">${blog.title}</h3>
      <p class="card-text">${blog.excerpt}</p>
      <div class="card-footer">
        <div class="blog-author">
          <span>By ${blog.author}</span>
          <span class="card-date">${formatDate(blog.date)}</span>
        </div>
        <a href="${blog.link}" class="btn btn-ghost btn-sm">Read More</a>
      </div>
    </div>
  `;
  return card;
}

// Initialize blog filters
function initBlogFilters() {
  const filterButtons = document.querySelectorAll('[data-filter-blog]');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.getAttribute('data-filter-blog');

      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      // Filter blogs
      if (filter === 'all') {
        filteredBlogs = blogsData;
      } else {
        filteredBlogs = blogsData.filter(blog => blog.category === filter);
      }

      displayBlogPosts(filteredBlogs);
    });
  });
}

// Initialize blog search
function initBlogSearch() {
  const searchInput = document.getElementById('blogSearch');
  if (!searchInput) return;

  searchInput.addEventListener('input', debounce((e) => {
    searchBlogs(e.target.value);
  }, 300));
}

// Search blogs
function searchBlogs(query) {
  const searchTerm = query.toLowerCase();
  filteredBlogs = blogsData.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm) ||
    blog.excerpt.toLowerCase().includes(searchTerm) ||
    blog.content.toLowerCase().includes(searchTerm) ||
    blog.category.toLowerCase().includes(searchTerm)
  );
  displayBlogPosts(filteredBlogs);
}

// Sort blogs
function sortBlogs(sortBy) {
  switch (sortBy) {
    case 'newest':
      filteredBlogs.sort((a, b) => new Date(b.date) - new Date(a.date));
      break;
    case 'oldest':
      filteredBlogs.sort((a, b) => new Date(a.date) - new Date(b.date));
      break;
    case 'featured':
      filteredBlogs.sort((a, b) => b.featured - a.featured);
      break;
    case 'title':
      filteredBlogs.sort((a, b) => a.title.localeCompare(b.title));
      break;
  }
  displayBlogPosts(filteredBlogs);
}

// Get related posts
function getRelatedPosts(postId, limit = 3) {
  const currentPost = blogsData.find(blog => blog.id === postId);
  if (!currentPost) return [];

  return blogsData
    .filter(blog => blog.id !== postId && blog.category === currentPost.category)
    .slice(0, limit);
}

// Get featured posts
function getFeaturedPosts(limit = 3) {
  return blogsData
    .filter(blog => blog.featured)
    .slice(0, limit);
}

// Get posts by category
function getPostsByCategory(category, limit = null) {
  const posts = blogsData.filter(blog => blog.category === category);
  return limit ? posts.slice(0, limit) : posts;
}

// Format date
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

// Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Export functions for inline use
window.blogModule = {
  searchBlogs,
  sortBlogs,
  displayBlogPosts,
  loadBlogs,
  getRelatedPosts,
  getFeaturedPosts,
  getPostsByCategory
};
