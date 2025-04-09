# CSS Structure Reorganization

This document outlines the restructuring of the CSS codebase to improve maintainability, reduce conflicts, and create a more cohesive styling system.

## Directory Structure

```
css/
├── main.css               # Main CSS file that imports all partials
├── legacy-compat.css      # Compatibility layer for old class names
├── iconstyles.css         # Icon-specific styles
├── partials/              # Core partials directory
│   ├── variables.css      # All CSS variables (colors, spacing, etc.)
│   ├── base.css           # Base element styles
│   ├── layout.css         # Layout containers and grid systems
│   ├── navigation.css     # Navigation elements
│   ├── utilities.css      # Utility classes
│   ├── components/        # Component-specific styles
│   │   ├── buttons.css    # Button styles
│   │   ├── cards.css      # Card and record styles
│   │   ├── forms.css      # Form elements and controls
│   │   └── ...
│   └── pages/             # Page-specific styles
│       ├── sessions.css   # Sessions page styles
│       ├── goals.css      # Goals page styles
│       ├── timer.css      # Timer page styles
│       └── ...
├── tools/                 # Migration utilities
│   └── migrate-classes.js # Helper script for class migration
└── examples/              # Example implementations
    └── goal-list.html     # Sample BEM-structured goal list
```

## Key Changes

1. **Centralized Variables**: All CSS variables are now in `variables.css`, with RGB variants for colors
2. **BEM Naming Convention**: Components use Block-Element-Modifier pattern
   - `.card` (Block)
   - `.card__header` (Element)
   - `.card--goal` (Modifier)
3. **Reduced Specificity**: Flatter CSS structure with fewer nested selectors
4. **Consolidated Duplicates**: Merged overlapping styles from multiple files
5. **Removed !important**: Only used for utility classes
6. **Consistent Icon Sizing**: SVG icon sizes defined at component level

## Phased Migration Approach

We've implemented a three-phase migration strategy to minimize disruption:

### Phase 1: Parallel Structures (Current)
- Both old and new class names work simultaneously
- Legacy compatibility layer maintains old class styling
- You can start using new classes in new components

### Phase 2: Gradual Migration
- Use the migration utility script to update HTML files
- Start with one component at a time (e.g., convert all buttons first)
- Run automated tests after each component type is migrated

### Phase 3: Full Migration
- Remove legacy compatibility layer
- Complete code audit to ensure all components use BEM pattern
- Update documentation to reflect new class naming standard

## BEM Pattern Examples

### Old Structure:
```css
.goal-card {
  /* styles */
}
.goal-card .goal-title {
  /* styles */
}
.goal-card.completed {
  /* styles */
}
```

### New Structure:
```css
.card--goal {
  /* styles */
}
.card--goal .card__title {
  /* styles */
}
.card--goal.status--completed {
  /* styles */
}
```

## Using the Migration Tool

Include our migration script in your HTML page or run it in your build process:

```html
<script src="css/tools/migrate-classes.js"></script>
<script>
  // Run once DOM is loaded
  document.addEventListener('DOMContentLoaded', function() {
    // Migrate all elements
    migrateClassNames();
    
    // Extra helper for goal status classes
    markGoalStatus();
  });
</script>
```

For specific components only:
```js
// Migrate just a specific container
const container = document.querySelector('.goals-container');
migrateClassNames(container);
```

## Manual Migration Guide

### For HTML/Templates:

1. **Card Components**:
   - Change `.goal-card` to `.card card--goal`
   - Change `.record-card` to `.card record`
   - Change `.session-card` to `.card card--session`

2. **Button Components**:
   - Change `.btn-primary` to `.btn btn--primary`
   - Change `.btn-sm` to `.btn btn--sm`
   - Change `.edit-button` to `.btn btn--action btn--edit`
   - Change `.delete-button` to `.btn btn--action btn--delete`

3. **Form Elements**:
   - Change `.form-group` to `.form__group`
   - Change `.form-control` to `.form__control`
   - Change `.form-label` to `.form__label`

### For JavaScript:

1. Update class references in JS code:
   ```js
   // Old
   document.querySelector('.goal-card');
   
   // New
   document.querySelector('.card--goal');
   ```

2. When toggling states, use BEM modifiers:
   ```js
   // Old
   element.classList.add('completed');
   
   // New
   element.classList.add('status--completed');
   ```

## Benefits

- **Reduced Conflicts**: No more competing styles for the same elements
- **Better Performance**: Lighter CSS with fewer overrides
- **Easier Maintenance**: Logical organization makes finding and changing styles simpler
- **Visual Consistency**: Components share common base styles
- **Responsive Design**: Consistent breakpoints and responsive utilities

## Troubleshooting

If you see styling issues after migration:

1. Check browser console for CSS errors
2. Ensure proper class naming (remember double-dashes for modifiers, double-underscores for elements)
3. Verify proper import order in `main.css`
4. Clear browser cache if necessary
5. View the example components in `/css/examples` for reference implementations

## Timeline

- **Phase 1 (Current)**: Setup parallel structures and compatibility layer
- **Phase 2 (Weeks 1-3)**: Migrate components using provided tools
- **Phase 3 (Week 4)**: Remove legacy compatibility and finalize

For any questions about the new structure, refer to this README or contact the development team. 