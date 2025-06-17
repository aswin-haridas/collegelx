# Components Directory

This directory contains all reusable React components organized by functionality and purpose.

## Directory Structure

```
components/
├── layout/           # Layout and navigation components
│   ├── Sidebar.tsx   # Main navigation sidebar
│   └── FilterSidebar.tsx # Product filtering sidebar
├── products/         # Product-related components
│   ├── ItemCard.tsx  # Individual product card
│   └── ItemListings.tsx # Product grid with filtering
├── ui/              # Reusable UI components
│   ├── Button.tsx   # Button component with variants
│   ├── Card.tsx     # Card component
│   ├── Input.tsx    # Input field component
│   ├── Loading.tsx  # Loading spinner
│   └── colors.ts    # Centralized color system
├── index.ts         # Component exports
└── README.md        # This file
```

## Color System

All components use a centralized color system defined in `ui/colors.ts` to ensure consistency across the application.

### Color Categories:
- **Primary**: Amber-based brand colors (50-900)
- **Text**: Text color variants (primary, secondary, muted, light, white)
- **Border**: Border color variants (primary, secondary, focus)
- **Hover**: Hover state colors
- **Background**: Background color variants
- **Focus**: Focus state colors

### Usage:
```typescript
import { colors } from '@/components/ui/colors';

// Use color classes
className={`${colors.text.primary} ${colors.background.white}`}
```

## Component Guidelines

### Layout Components
- **Sidebar**: Main navigation with authentication-aware rendering
- **FilterSidebar**: Product filtering with search, category, condition, and price sorting

### Product Components
- **ItemCard**: Displays individual product information with image, name, description, price, and category
- **ItemListings**: Grid layout for displaying multiple products with filtering capabilities

### UI Components
- **Button**: Configurable button with primary, secondary, and outline variants
- **Card**: Reusable card component for displaying content
- **Input**: Form input field with consistent styling
- **Loading**: Loading spinner for async operations

## Importing Components

Use the index file for clean imports:
```typescript
import { Sidebar, ItemCard, Button, colors } from '@/components';
```

Or import directly from specific folders:
```typescript
import Sidebar from '@/components/layout/Sidebar';
import ItemCard from '@/components/products/ItemCard';
``` 