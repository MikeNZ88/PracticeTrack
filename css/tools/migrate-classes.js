/**
 * CSS Class Migration Utility
 * This script helps migrate old class names to the new BEM convention
 * 
 * Usage: 
 * 1. Include this script in your HTML page
 * 2. Call migrateClassNames() in the console or in a script
 * 3. Optional: Pass in a specific element to migrate only that element's children
 */

function migrateClassNames(rootElement = document.body) {
  const classMap = {
    // Button classes
    'btn-primary': 'btn btn--primary',
    'btn-secondary': 'btn btn--secondary',
    'btn-success': 'btn btn--success',
    'btn-danger': 'btn btn--danger',
    'btn-warning': 'btn btn--warning',
    'btn-light': 'btn btn--light',
    'btn-outline': 'btn btn--outline',
    'btn-link': 'btn btn--link',
    'btn-sm': 'btn btn--sm',
    'btn-lg': 'btn btn--lg',
    'btn-xl': 'btn btn--xl',
    'edit-button': 'btn btn--action btn--edit',
    'delete-button': 'btn btn--action btn--delete',
    
    // Card classes
    'goal-card': 'card card--goal',
    'session-card': 'card card--session',
    'media-card': 'card card--media',
    'card-header': 'card__header',
    'card-title': 'card__title',
    'card-content': 'card__content',
    'card-actions': 'card__actions',
    'card-footer': 'card__footer',
    
    // Form classes
    'form-group': 'form__group',
    'form-control': 'form__control',
    'form-label': 'form__label',
    'form-hint': 'form__hint',
    'form-error': 'form__error',
    'form-check': 'form__check',
    'form-check-input': 'form__check-input',
    'form-check-label': 'form__check-label',
    'form-actions': 'form__actions',
    
    // Status modifiers
    'completed': 'status--completed',
    'in-progress': 'status--in-progress',
    'not-started': 'status--not-started',
    'overdue': 'status--overdue',
    
    // Element specifics
    'record-title': 'record__title',
    'record-description': 'record__description',
    'goal-progress': 'goal__progress',
    'goal-toggle': 'goal__toggle'
  };
  
  // Find all elements with classes to migrate
  const elements = rootElement.querySelectorAll('*');
  let migratedCount = 0;
  
  elements.forEach(element => {
    if (element.classList.length > 0) {
      let classesChanged = false;
      
      // Clone the classList for iteration since we'll be modifying the original
      const classList = Array.from(element.classList);
      
      classList.forEach(className => {
        if (classMap[className]) {
          // Remove the old class
          element.classList.remove(className);
          
          // Add the new class(es)
          classMap[className].split(' ').forEach(newClass => {
            element.classList.add(newClass);
          });
          
          classesChanged = true;
        }
      });
      
      if (classesChanged) {
        migratedCount++;
      }
    }
  });
  
  console.log(`Migration complete: Updated ${migratedCount} elements.`);
  return migratedCount;
}

// Additional helper for marking specific card types
function markGoalStatus() {
  document.querySelectorAll('.card--goal').forEach(card => {
    if (card.classList.contains('completed')) {
      card.classList.remove('completed');
      card.classList.add('status--completed');
    } else if (card.classList.contains('in-progress')) {
      card.classList.remove('in-progress');
      card.classList.add('status--in-progress');
    } else if (card.classList.contains('not-started')) {
      card.classList.remove('not-started');
      card.classList.add('status--not-started');
    }
  });
  
  console.log('Goal statuses have been updated to BEM conventions.');
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { migrateClassNames, markGoalStatus };
} 