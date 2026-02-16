# Technology Stack

**Project:** Chess-Poker Task Manager
**Researched:** 2026-02-16
**Confidence:** HIGH

## Recommended Stack

### Core Framework
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| React | 19.2.4 | UI framework | Current stable release with Actions, improved ref handling, and stable RSC features. React 19 shipped in Dec 2024, with 19.2.x being the latest patch series. |
| Vite | 6.x | Build tool & dev server | CRA officially deprecated by React team in Feb 2025. Vite starts dev server in 1-2 seconds vs CRA's slow startup. 40-80% faster local feedback loops. Plugin-first architecture allows customization without ejecting. Industry standard for new React projects in 2026. |
| TailwindCSS | 4.1.18 | Styling | Latest v4.x with CSS-first configuration using @theme directive (replacing tailwind.config.js). Up to 5x faster full builds, 100x faster incremental builds. Built-in container queries. Mobile-first breakpoint system (sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px). |

### Drag-and-Drop
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| @dnd-kit/core | 6.3.1 | Drag-and-drop foundation | Modern, lightweight (10kb), actively maintained. Built-in support for pointer, mouse, touch, and keyboard sensors. **Critical:** react-beautiful-dnd is archived/unmaintained. @dnd-kit is the community-recommended replacement with superior mobile touch support. |
| @dnd-kit/sortable | 6.x | Sortable lists/columns | Prebuilt sortable primitives for kanban columns and task lists. Works seamlessly with @dnd-kit/core. Handles animations, placeholders, and drag overlays. |
| @dnd-kit/utilities | 3.x | Helper utilities | CSS transform utilities for drag animations using translate3d (avoids expensive repaints). |

### State Management
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Zustand | 5.x | Client state management | Lightweight (<1KB gzipped), no providers needed, superior performance vs Context API. Components only re-render when their specific state slice changes (vs Context re-rendering all consumers). 30%+ YoY growth, ~40% adoption with high "would use again" scores in 2026 surveys. Perfect for kanban board state (tasks, columns, drag state). |

### Data Persistence
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| use-local-storage-state | Latest | localStorage sync | Handles React 18/19 concurrent rendering, syncs changes across tabs via Window storage event. Better than raw localStorage for React apps. Custom hook pattern for type-safe storage. |

### Supporting Libraries
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| recharts | 3.7.0 | Charts & visualization | Radar charts for task scores. Declarative React components, built on D3, native SVG, lightweight. 3,490 npm dependents. Alternative to custom SVG (you already have RadarChart component, but Recharts may simplify if adding more chart types). |
| clsx | Latest | Conditional classNames | Cleaner conditional Tailwind classes. Tiny utility (228 bytes). |
| nanoid | Latest | ID generation | Fast, secure unique IDs for tasks/cards. Smaller than uuid. |

### Development Tools
| Tool | Purpose | Notes |
|------|---------|-------|
| ESLint | Code quality | Flat config (eslint.config.js) is 2026 standard. Use eslint-plugin-react, eslint-plugin-react-hooks, eslint-plugin-jsx-a11y. |
| Prettier | Code formatting | Use eslint-config-prettier to disable conflicting ESLint rules. Single .prettierrc file at root. |
| TypeScript (optional) | Type safety | Consider if project grows beyond MVP. Not required for single-user local-first app, but helps prevent bugs as feature count increases. |

## Installation

```bash
# Create project with Vite
npm create vite@latest strategic-planner -- --template react
cd strategic-planner

# Core dependencies
npm install zustand @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities use-local-storage-state clsx nanoid

# Tailwind CSS v4 setup
npm install -D tailwindcss@next @tailwindcss/vite@next
# Add to vite.config.js plugins: [react(), tailwindcss()]

# Charts (if using Recharts instead of custom SVG)
npm install recharts

# Dev dependencies
npm install -D eslint eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-jsx-a11y eslint-config-prettier prettier
```

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Drag-and-Drop | @dnd-kit | react-beautiful-dnd | Archived/unmaintained. Atlassian stopped development. @hello-pangea/dnd is community fork but just a stopgap. |
| Drag-and-Drop | @dnd-kit | pragmatic-drag-and-drop | Atlassian's official next-gen library. Headless, framework-agnostic. More flexible but requires more setup. Overkill for kanban board. |
| Drag-and-Drop | @dnd-kit | react-dnd | HTML5 Drag & Drop API has poor mobile support. More complex API. @dnd-kit is simpler and better for touch. |
| State Management | Zustand | Context API | Context API re-renders all consumers on any state change. Poor performance for frequently-updating kanban state. Zustand is same simplicity with better perf. |
| State Management | Zustand | Redux Toolkit | Overkill for local-first single-user app. More boilerplate. Zustand is sufficient and simpler. |
| Build Tool | Vite | Create React App | CRA deprecated Feb 2025. Slow dev server. Limited customization without ejecting. Vite is faster, more flexible, modern standard. |
| Charts | Recharts | Custom SVG | You already have RadarChart component. Keep it if it works. Recharts useful if adding more chart types later (bar, line, area). |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| react-beautiful-dnd | Archived, no maintenance, no React 19 support | @dnd-kit/core + @dnd-kit/sortable |
| Create React App | Deprecated by React team, slow, limited config | Vite 6 |
| HTML5 Drag & Drop API | Unreliable on mobile (especially iOS), pointer events work better | @dnd-kit (uses pointer events) |
| Context API for kanban state | Re-renders all consumers, performance issues with frequent updates | Zustand |
| localStorage directly | Race conditions, no SSR handling, no tab sync | use-local-storage-state |
| TailwindCSS v3 | v4 is 5x faster with better DX | TailwindCSS v4.1.18+ |

## Stack Patterns by Variant

**Mobile-First Responsive (your case):**
- Use Tailwind mobile-first breakpoints: default styles = mobile, `md:` prefix = tablet+, `lg:` = desktop
- Configure @dnd-kit touch sensor with `activationConstraint: { distance: 10 }` to distinguish drags from scrolls
- Set `touch-action: none` on draggable elements to prevent mobile scrolling during drag
- Test DragOverlay component for smoother mobile drag feedback

**localStorage Persistence (your case):**
- Use use-local-storage-state hook with Zustand store
- Store serialized state on every task/column change (debounced 300ms to avoid excessive writes)
- Handle storage quota errors gracefully (localStorage 5-10MB limit)
- Never store sensitive data (not applicable for personal task manager)

**Zustand + @dnd-kit Integration:**
- Zustand store holds: `{ tasks: [], columns: [], activeId: null }`
- On drag start: `setActiveId(taskId)`
- On drag over: optimistically update task position in store
- On drag end: persist to localStorage, clear `activeId`
- Use Zustand selectors to prevent unnecessary re-renders: `useTaskStore(state => state.tasks)`

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| @dnd-kit/core@6.3.1 | React 18.x, 19.x | Works with concurrent rendering. No React 19 blockers reported. |
| @dnd-kit/sortable@6.x | @dnd-kit/core@6.x | Must match major version of core. |
| Zustand@5.x | React 18.x, 19.x | Fully compatible with React 19 concurrent features. |
| Recharts@3.7.0 | React 18.x, 19.x | Recent release (25 days ago). Active maintenance. |
| TailwindCSS@4.1.18 | Vite 6, PostCSS 8 | Requires @tailwindcss/vite plugin for Vite integration. |
| use-local-storage-state | React 18.x, 19.x | Explicitly supports React 18/19 concurrent rendering. |

## Mobile Touch Considerations

Critical for mobile-first:

1. **Touch Sensor Configuration:**
   ```javascript
   import { PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';

   const sensors = useSensors(
     useSensor(PointerSensor, {
       activationConstraint: { distance: 10 } // 10px threshold prevents accidental drags
     }),
     useSensor(TouchSensor, {
       activationConstraint: { delay: 250, tolerance: 5 } // Long press for mobile
     })
   );
   ```

2. **CSS Touch Action:**
   ```css
   .draggable {
     touch-action: none; /* Prevents scrolling during drag on mobile */
   }
   ```

3. **Drag Overlay for Mobile:**
   - Use `<DragOverlay>` component to render dragging item above viewport
   - Prevents janky animations on mobile
   - Provides better visual feedback

4. **Responsive Breakpoints:**
   - Mobile (<640px): Single-column stacked lanes
   - Tablet (640-1024px): 2-column grid
   - Desktop (1024px+): 3-lane horizontal kanban

## Sources

- [React v19 Release Notes](https://react.dev/blog/2024/12/05/react-19) — HIGH confidence
- [React 19.2 Release](https://react.dev/blog/2025/10/01/react-19-2) — HIGH confidence
- [Top 5 Drag-and-Drop Libraries for React in 2026](https://puckeditor.com/blog/top-5-drag-and-drop-libraries-for-react) — MEDIUM confidence, verified against npm
- [@dnd-kit/core npm](https://www.npmjs.com/package/@dnd-kit/core) — HIGH confidence
- [Build a Kanban board with dnd kit and React - LogRocket](https://blog.logrocket.com/build-kanban-board-dnd-kit-react/) — MEDIUM confidence
- [Vite vs Create React App 2026 - Expert Software](https://www.mol-tech.us/blog/vite-vs-create-react-app-2026) — MEDIUM confidence
- [Stop Using Create React App in 2026 - Medium](https://medium.com/@thedevnotebook/stop-using-create-react-app-2026-nextjs-vite-a7c5ac59c4ce) — MEDIUM confidence
- [Tailwind CSS v4 Release](https://tailwindcss.com/blog/tailwindcss-v4) — HIGH confidence
- [Redux vs Zustand vs Context API in 2026 - Medium](https://medium.com/@sparklewebhelp/redux-vs-zustand-vs-context-api-in-2026-7f90a2dc3439) — MEDIUM confidence
- [State Management in 2026 - Nucamp](https://www.nucamp.co/blog/state-management-in-2026-redux-context-api-and-modern-patterns) — MEDIUM confidence
- [Recharts npm](https://www.npmjs.com/package/recharts) — HIGH confidence
- [Prettier + ESLint Configuration 2026 - Medium](https://medium.com/@osmion/prettier-eslint-configuration-that-actually-works-without-the-headaches-a8506b710d21) — MEDIUM confidence
- [Using localStorage with React Hooks - LogRocket](https://blog.logrocket.com/using-localstorage-react-hooks/) — MEDIUM confidence
- [use-local-storage-state GitHub](https://github.com/astoilkov/use-local-storage-state) — HIGH confidence

---
*Stack research for: Mobile-first responsive task management web app with kanban board*
*Researched: 2026-02-16*
*Overall confidence: HIGH (core stack), MEDIUM (supporting libraries)*
