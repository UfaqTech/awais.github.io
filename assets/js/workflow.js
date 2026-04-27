// ===================================
// WORKFLOW.JS - Workflow Page Logic
// ===================================

'use strict';

let workflowData = [];

// Initialize workflow page
document.addEventListener('DOMContentLoaded', async () => {
  await loadWorkflow();
  displayWorkflowSteps(workflowData);
  initWorkflowInteractions();
});

// Load workflow from JSON
async function loadWorkflow() {
  try {
    const response = await fetch('../data/workflow.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    workflowData = await response.json();
  } catch (error) {
    console.error('Error loading workflow:', error);
    displayWorkflowError(error);
  }
}

// Display error message when workflow fails to load
function displayWorkflowError(error) {
  const workflowContainer = document.getElementById('workflowSteps');
  if (!workflowContainer) return;
  
  workflowContainer.innerHTML = `
    <div style="grid-column: 1/-1; text-align: center; padding: 2rem;">
      <p style="color: #ff6b6b; font-size: 1.1rem; margin-bottom: 1rem;">
        ⚠️ Unable to load workflow steps
      </p>
      <p style="color: #999; font-size: 0.95rem;">
        There was an error loading the workflow content. Please try refreshing the page or contact support if the problem persists.
      </p>
      <p style="color: #666; font-size: 0.85rem; margin-top: 1rem;">
        Error details: ${error.message}
      </p>
    </div>
  `;
}

// Display workflow steps
function displayWorkflowSteps(steps) {
  const workflowContainer = document.getElementById('workflowSteps');
  if (!workflowContainer) return;

  workflowContainer.innerHTML = '';

  steps.forEach((step, index) => {
    const stepElement = createWorkflowStep(step, index);
    workflowContainer.appendChild(stepElement);
  });

  // Trigger animations
  const stepElements = workflowContainer.querySelectorAll('.workflow-step');
  stepElements.forEach((element, index) => {
    element.style.animationDelay = `${index * 0.15}s`;
    element.classList.add('animate-fade');
  });
}

// Create workflow step element
function createWorkflowStep(step, index) {
  const stepDiv = document.createElement('div');
  stepDiv.className = 'workflow-step';
  stepDiv.setAttribute('data-step', index + 1);
  stepDiv.innerHTML = `
    <div class="step-icon">
      <span>${step.icon}</span>
      <div class="step-number">${index + 1}</div>
    </div>
    <div class="step-content">
      <h3 class="step-title">${step.title}</h3>
      <p class="step-description">${step.description}</p>
      <ul class="step-details">
        ${step.details.map(detail => `<li>${detail}</li>`).join('')}
      </ul>
    </div>
    <div class="step-connector"></div>
  `;
  return stepDiv;
}

// Initialize workflow interactions
function initWorkflowInteractions() {
  const workflowSteps = document.querySelectorAll('.workflow-step');

  workflowSteps.forEach((step, index) => {
    step.addEventListener('mouseenter', () => {
      step.classList.add('active');
      highlightConnectedSteps(index);
    });

    step.addEventListener('mouseleave', () => {
      step.classList.remove('active');
      removeHighlight();
    });

    // Click to expand details
    step.addEventListener('click', () => {
      step.classList.toggle('expanded');
    });
  });
}

// Highlight connected workflow steps
function highlightConnectedSteps(stepIndex) {
  const allSteps = document.querySelectorAll('.workflow-step');
  allSteps.forEach((step, index) => {
    if (index <= stepIndex) {
      step.classList.add('highlight');
    }
  });
}

// Remove highlight from workflow steps
function removeHighlight() {
  document.querySelectorAll('.workflow-step').forEach(step => {
    step.classList.remove('highlight');
  });
}

// Get step by ID
function getWorkflowStep(stepId) {
  return workflowData.find(step => step.id === stepId);
}

// Get all steps
function getAllWorkflowSteps() {
  return workflowData;
}

// Export functions for inline use
window.workflowModule = {
  displayWorkflowSteps,
  loadWorkflow,
  getWorkflowStep,
  getAllWorkflowSteps
};
