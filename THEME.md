# Theme Guide - Blue-White Modern Design

## Overview
This project uses a modern blue-white theme implemented through Tailwind CSS v4 with CSS Custom Properties and shadcn/ui components. The theme is designed to provide a professional, clean, and accessible user interface for the e-learning platform.

## Theme Configuration

### Primary Colors
The theme is built on a blue color palette using `oklch` color space for better color accuracy:

```css
/* Primary Theme Colors */
--color-primary: 207 91% 40%;           /* Deep Blue (#004B7D) */
--color-primary-foreground: 0 0% 98%;   /* Near White text on primary */
--color-secondary: 210 40% 98%;         /* Very Light Blue */
--color-secondary-foreground: 222.2 84% 4.9%; /* Dark text on secondary */
--color-accent: 210 40% 96%;            /* Light Blue accent */
--color-accent-foreground: 222.2 84% 4.9%; /* Dark text on accent */
```

### Background & Surfaces
```css
--color-background: 0 0% 100%;          /* Pure White */
--color-foreground: 222.2 84% 4.9%;    /* Very Dark Blue-Gray */
--color-card: 0 0% 100%;                /* White cards */
--color-card-foreground: 222.2 84% 4.9%; /* Dark text on cards */
--color-muted: 210 40% 96%;             /* Light gray-blue */
--color-muted-foreground: 215.4 16.3% 46.9%; /* Medium gray text */
```

### Interactive Elements
```css
--color-border: 214.3 31.8% 91.4%;     /* Light border */
--color-input: 214.3 31.8% 91.4%;      /* Input borders */
--color-ring: 207 91% 40%;              /* Focus ring (same as primary) */
--color-destructive: 0 84.2% 60.2%;    /* Red for errors */
--color-destructive-foreground: 210 40% 98%; /* Light text on destructive */
```

## Implementation

### CSS Custom Properties
The theme is defined in `app/globals.css` using CSS Custom Properties with `oklch` color space:

```css
@layer base {
  :root {
    --color-background: 0 0% 100%;
    --color-foreground: 222.2 84% 4.9%;
    --color-primary: 207 91% 40%;
    /* ... other colors */
  }
}
```

### Tailwind Integration
Colors are integrated with Tailwind CSS through the configuration, allowing usage like:

```tsx
<div className="bg-primary text-primary-foreground">
  <h1 className="text-foreground">Title</h1>
  <p className="text-muted-foreground">Description</p>
</div>
```

## Usage Guidelines

### Typography Colors
- **Primary Text**: Use `text-foreground` for main content
- **Secondary Text**: Use `text-muted-foreground` for descriptions, labels
- **Interactive Text**: Use `text-primary` for links and CTAs
- **Error Text**: Use `text-destructive` for error messages

### Background Colors
- **Main Background**: Use `bg-background` for page backgrounds
- **Card Backgrounds**: Use `bg-card` for content containers
- **Muted Areas**: Use `bg-muted` for subtle backgrounds
- **Primary Actions**: Use `bg-primary` for buttons and important elements

### Border Colors
- **Default Borders**: Use `border-border` for most borders
- **Input Borders**: Use `border-input` for form elements
- **Focus States**: Use `ring-ring` for focus indicators

## Component Examples

### Button Variants
```tsx
// Primary button
<Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
  Primary Action
</Button>

// Secondary button
<Button variant="outline" className="border-border text-foreground">
  Secondary Action
</Button>
```

### Card Components
```tsx
<Card className="bg-card border-border">
  <CardHeader>
    <CardTitle className="text-foreground">Card Title</CardTitle>
  </CardHeader>
  <CardContent className="text-muted-foreground">
    Card content with muted text
  </CardContent>
</Card>
```

### Form Elements
```tsx
<div className="space-y-2">
  <label className="text-sm font-medium text-foreground">
    Label Text
  </label>
  <Input 
    className="border-input bg-background text-foreground"
    placeholder="Placeholder text"
  />
  <p className="text-xs text-muted-foreground">Helper text</p>
</div>
```

## Dark Mode Support

The theme includes dark mode variants (currently using the same values, but structure is ready for expansion):

```css
.dark {
  --color-background: 222.2 84% 4.9%;
  --color-foreground: 210 40% 98%;
  /* ... other dark mode colors */
}
```

## Best Practices

### Do's ✅
- Use semantic color tokens instead of hardcoded colors
- Maintain consistent spacing and typography scales
- Test color contrast ratios for accessibility
- Use `hover:` states with appropriate opacity changes
- Leverage CSS Custom Properties for theme consistency

### Don'ts ❌
- Avoid hardcoded hex colors like `#004B7D` or `text-gray-500`
- Don't use fixed opacity values without considering theme
- Avoid mixing color systems (stick to theme tokens)
- Don't forget focus states for accessibility

## Migration from Hardcoded Colors

When updating existing components, replace:

```tsx
// OLD: Hardcoded colors
className="text-gray-900 bg-white border-gray-200"

// NEW: Theme tokens
className="text-foreground bg-background border-border"
```

```tsx
// OLD: Specific color values
className="text-[#004B7D] bg-[#f4fbff]"

// NEW: Semantic tokens
className="text-primary bg-primary/5"
```

## File Structure

### Theme Files
- `app/globals.css` - Main theme definition and CSS Custom Properties
- `tailwind.config.js` - Tailwind configuration with theme integration
- `components.json` - shadcn/ui configuration

### Component Files
All components in the `components/` directory use theme tokens consistently across:
- Navigation components
- Form components
- Layout components
- UI components (buttons, cards, etc.)

## Customization

### Changing Colors
To modify the theme colors, update the CSS Custom Properties in `app/globals.css`:

```css
:root {
  --color-primary: 142 71% 45%;  /* Change to green theme */
  --color-accent: 142 69% 95%;   /* Light green accent */
}
```

### Adding New Colors
Add new semantic color tokens following the same pattern:

```css
:root {
  --color-warning: 48 96% 53%;           /* Yellow warning */
  --color-warning-foreground: 26 83% 14%; /* Dark text on warning */
}
```

Then add to Tailwind config:
```js
colors: {
  warning: "oklch(var(--color-warning))",
  "warning-foreground": "oklch(var(--color-warning-foreground))",
}
```

## Accessibility

The theme follows accessibility guidelines:
- **Contrast Ratios**: All text meets WCAG AA standards (4.5:1 minimum)
- **Focus Indicators**: Clear focus rings using `ring-ring` color
- **Color Blindness**: Design doesn't rely solely on color for information
- **Semantic Colors**: Error, warning, and success states are clearly defined

## Browser Support

The theme uses modern CSS features:
- **CSS Custom Properties**: Supported in all modern browsers
- **oklch() Color Space**: Supported in Chrome 111+, Firefox 113+, Safari 15.4+
- **Fallbacks**: Included for older browsers where needed

## Maintenance

### Regular Tasks
1. **Audit Color Usage**: Regularly check for hardcoded colors in new components
2. **Accessibility Testing**: Verify contrast ratios when making color changes
3. **Design System Updates**: Keep theme tokens aligned with design specifications
4. **Performance**: Monitor CSS bundle size when adding new color tokens

### Version Control
- Document color changes in commit messages
- Test theme changes across all major components
- Maintain backward compatibility when possible

---

**Last Updated**: October 26, 2025  
**Theme Version**: 1.0.0  
**Tailwind CSS**: v4.x  
**Color Space**: oklch