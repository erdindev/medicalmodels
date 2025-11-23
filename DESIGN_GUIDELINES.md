# MedicalModels.co - Design Guidelines

## Core Principles

1. **Direct to Action** - No landing page. Users see the app immediately.
2. **Minimal Text** - Get to the point. No repetitive words.
3. **Clean UI** - Don't overwhelm with information.

---

## Typography

- **Headings**: `font-semibold`, not bold
- **Body text**: Default size, `text-muted-foreground`
- **Search input**: Larger than standard (`text-xl`)

---

## Components

### Search Field
- **No borders** on top, left, right
- **Only border-bottom** (`border-b-2`)
- Larger text (`text-xl`)
- Minimal placeholder text

```jsx
<input
  className="w-full border-0 border-b-2 border-border bg-transparent
             pb-3 text-xl focus:border-primary focus:outline-none"
/>
```

### Navbar
- Extremely simple
- Logo + minimal nav links
- No buttons, no CTAs
- Height: `h-14`

### Cards
- Subtle borders (`border-border`)
- Minimal padding
- Key metrics visible at glance
- No heavy shadows

---

## Colors

- **Primary**: Green (`hsl(152, 45%, 45%)`)
- **Background**: Off-white with green tint
- **Accents**: Use sparingly

---

## Content Rules

1. **Headlines**: Max 5-7 words
2. **Descriptions**: 1 sentence max
3. **Labels**: Single word when possible
4. **Metrics**: Numbers prominently, labels small

---

## Don'ts

- Don't use "comprehensive", "powerful", "innovative"
- Don't repeat the same information
- Don't add decorative elements
- Don't use large hero sections with marketing copy
- Don't add unnecessary animations
