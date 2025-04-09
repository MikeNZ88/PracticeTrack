# CSS Structure

This directory contains the partitioned CSS files for the PracticeTrack application.

## Directory Structure

- `base.css` - Reset styles, CSS variables, and base element styling
- `layout.css` - Layout containers, grid systems, and overall page structure
- `navigation.css` - Navigation elements (main nav, mobile nav, header buttons)
- `components.css` - Reusable UI components (cards, buttons, etc.)
- `forms.css` - Form elements, inputs, and dialog styling
- `utilities.css` - Helper classes for common styling needs
- `/pages/` - Page-specific styles
  - `sessions.css` - Styles specific to the sessions page
  - `goals.css` - Styles specific to the goals page
  - (Add other page-specific stylesheets as needed)

## Usage

All these partials are imported in the `/css/main.css` file. The HTML files reference `main.css` which pulls in all the stylesheets.

## Guidelines

1. **Keep it organized**: Add new styles to the appropriate file based on their purpose.
2. **Avoid duplication**: If a style could be reused across multiple pages, put it in a component file rather than a page-specific file.
3. **Follow naming conventions**: 
   - Use kebab-case for class names (e.g., `.record-card`)
   - Use descriptive names that reflect the component's purpose
4. **Maintain variables**: Use CSS variables defined in `base.css` for colors, spacing, etc.

## Updating

When adding new major UI components or pages:
1. Determine if the styles fit into an existing partial
2. If not, create a new page-specific file in the `/pages/` directory
3. Import the new file in `main.css` 