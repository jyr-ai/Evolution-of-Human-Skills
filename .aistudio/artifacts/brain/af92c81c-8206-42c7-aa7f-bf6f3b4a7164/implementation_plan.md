# Embed Evolution of Human Skills into HTML/CSS/JavaScript

An architectural plan and turnkey implementation guide for embedding the **Evolution of Human Skills** interactive platform into any static or dynamic HTML/CSS/JavaScript website.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The app is built with React 19, TypeScript, Tailwind CSS, and Vite, running as a single-page application (SPA). There are three primary industry-standard ways to embed this application into an external HTML/CSS/JS site, each suited for different technical hosting requirements:
>
> 1. **Zero-Friction Iframe Integration (Recommended & Turnkey)**: Embed the deployed shared URL inside an `<iframe>` with responsive styling and cross-origin communication (`postMessage`) for height adjustment and widget switching.
> 2. **URL Parameter Deep-Linking**: Support query parameters (e.g., `?widget=nations&era=era-4&theme=compact`) allowing external sites to embed just a single chart or full suite cleanly without distracting chrome.
> 3. **In-App Embed Code Generator Dialog**: Provide an interactive "Embed App / Share" modal inside the application with ready-to-copy HTML snippets, responsive CSS containers, and preview options.

---

## 1. Overview & Core Concept

### What It Does
Enables any external website (WordPress, Webflow, custom HTML5 site, static documentation, or portfolio) to embed **Evolution of Human Skills** either as:
- A full-screen interactive explorer.
- An inline interactive visual widget (e.g., embedding solely the *Wealth of Nations Scatter Chart* or *Cognitive vs. Physical Matrix* into a research article).

### Key Value
- **Zero dependency conflicts**: Because the app is rendered in an isolated sandbox frame or clean container, Tailwind classes and React runtime in this app will never collide with host website styles or conflicting libraries (like Bootstrap, jQuery, or other frameworks).
- **Live updates & persistence**: Updates made to datasets, Google Sheets sync, or visual components immediately reflect everywhere the app is embedded.

---

## 2. Embedding Architecture & Implementation Patterns

### Pattern A: Standard Responsive Iframe (The Most Common & Compatible)
Any HTML page can embed the application using standard semantic HTML and CSS:

```html
<!-- HTML Container on Host Website -->
<div class="skills-app-container">
  <iframe
    src="https://ais-pre-ishopl677qbt6o55rifhvo-585790079879.us-east1.run.app"
    title="Evolution of Human Skills - Industrial Revolution Benchmark"
    loading="lazy"
    allow="clipboard-write"
    frameborder="0"
  ></iframe>
</div>

<!-- Embedded CSS -->
<style>
  .skills-app-container {
    position: relative;
    width: 100%;
    max-width: 1280px;
    margin: 0 auto;
    height: 850px; /* Default height */
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.7);
    border: 1px solid #1e293b;
    background-color: #080c14;
  }

  .skills-app-container iframe {
    width: 100%;
    height: 100%;
    border: none;
    display: block;
  }

  /* Responsive breakpoints */
  @media (max-width: 768px) {
    .skills-app-container {
      height: 700px;
      border-radius: 8px;
    }
  }
</style>
```

---

### Pattern B: Query Parameters for Granular Embeds (Deep-Linking)
To embed only specific widgets into specialized articles without full header clutter, the app will support URL search params:

| Query Parameter | Example Value | Description |
|---|---|---|
| `embed=true` | `?embed=true` | Hides top navigation bar and footer to maximize canvas area in an iframe |
| `widget=` | `nations`, `quadrant`, `constellation`, `streamgraph`, `timeline` | Loads directly into the selected visualization tab |
| `era=` | `era-1`, `era-2`, `era-3`, `era-4` | Pre-selects the historical era |
| `year=` | `1760`, `1913`, `2024` | Initializes the interactive scrubbable timeline at a specific milestone year |

**Example Embed URL for just the Wealth of Nations Scatter Plot:**
```html
<iframe
  src="https://ais-pre-ishopl677qbt6o55rifhvo-585790079879.us-east1.run.app?embed=true&widget=nations&era=era-4"
  width="100%"
  height="750"
  style="border: 1px solid #334155; border-radius: 8px;"
></iframe>
```

---

### Pattern C: Two-Way JavaScript Communication (Host Website ↔ Applet)
Using standard HTML5 `window.postMessage`, the host page's JavaScript can listen to events or command the app:

```javascript
// On your host website:
window.addEventListener('message', (event) => {
  // Optional security check
  if (!event.origin.includes('run.app')) return;

  if (event.data?.type === 'SKILL_SELECTED') {
    console.log('User inspected skill:', event.data.skillName);
  }
  
  if (event.data?.type === 'RESIZE_FRAME') {
    document.querySelector('.skills-app-container').style.height = event.data.height + 'px';
  }
});
```

---

## 3. Technical Architecture & System Flow

```
┌────────────────────────────────────────────────────────────────────────┐
│ HOST HTML / CSS / JAVASCRIPT WEBSITE                                   │
│ (WordPress, Webflow, Hugo, Astro, or Custom index.html)                │
│                                                                        │
│   <div class="skills-embed-wrapper">                                   │
│     <iframe src="https://ais-pre-...run.app?embed=true&widget=...">    │
│   </div>                                                               │
│                                                                        │
│   <script>                                                             │
│     window.addEventListener('message', handleAppMessages);             │
│   </script>                                                            │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                         HTTPS Iframe Loading
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ EVOLUTION OF HUMAN SKILLS (REACT SPA ENGINE)                           │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ URL Search Params Inspector:                                     │  │
│  │ - embed=true -> Suppress Outer Header & Footer                   │  │
│  │ - widget=nations -> ActiveWidget 'nations'                       │  │
│  │ - year=2024 -> Timeline slider position                          │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│  ┌───────────────────────┬─────────────────────────┬────────────────┐  │
│  │ Wealth of Nations     │ Cognitive Quadrant      │ Radial Web     │  │
│  │ Scatter Chart         │ External Matrix         │ Constellation  │  │
│  └───────────────────────┴─────────────────────────┴────────────────┘  │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ In-App "Embed Code Generator" Modal:                             │  │
│  │ Allows user to configure widget, dimensions, and copy snippet    │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Planned Features to Add to the App

1. **URL Parameter Support (`useSearchParams`)**:
   - Detect `?embed=true` on load. When present, automatically hide the top `Header` and `Footer`, rendering a clean edge-to-edge visualization ideal for embedding inside existing website content.
   - Detect `?widget=...` and automatically route to that specific tab.
2. **In-App Embed Modal ("Embed / Share" Button in Header)**:
   - Add an **"Embed"** button in the header and visual lab toolbar.
   - Clicking it opens an interactive modal where the user can:
     - Choose embedding style: Full Application vs. Single Chart.
     - Select target widget (Radial Web, Task Streamgraph, Cognitive Quadrant, Wealth of Nations, Timeline).
     - Customize dimensions (width, height, border).
     - Preview the iframe live in real-time.
     - One-click **"Copy HTML Embed Code"**.
3. **Cross-Origin Resizing / Safety**:
   - Enable safe viewport sizing inside iframes so charts remain responsive on mobile and desktop devices.
