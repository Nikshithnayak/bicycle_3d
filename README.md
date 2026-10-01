# 🚴‍♂️ Spectra — 3D Interactive Bicycle Showcase

[![Live Demo](https://img.shields.io/badge/Demo-Live%20on%20Vercel-success?style=for-the-badge&logo=vercel)](https://surge-umber.vercel.app)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-blue?style=for-the-badge&logo=github)](https://github.com/Nikshithnayak/bicycle_3d)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-r185-white?style=for-the-badge&logo=threedotjs&logoColor=black)](https://threejs.org/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

An immersive, cinematic 3D web experience showcasing high-performance bicycles with real-time 3D rendering, scroll-driven camera choreography, model switching, and fluid GSAP animations.

---

## 🌐 Live Demo

Experience the 3D showcase live in your browser:  
👉 **[https://surge-umber.vercel.app](https://surge-umber.vercel.app)**

Alternative deployment mirror:  
👉 [https://surge-2khjcu20z-nikshithnayaks-projects.vercel.app](https://surge-2khjcu20z-nikshithnayaks-projects.vercel.app)

---

## ✨ Features

- **🚲 Real-Time 3D Rendering**: High-fidelity GLTF/GLB models rendered smoothly with Three.js and React Three Fiber.
- **🎥 Scroll-Driven Camera Choreography**: Dynamic multi-angle camera transitions mapped smoothly to page scroll progress.
- **🎨 Interactive Model & Color Switcher**: Seamlessly switch between flagship models (*Ridge*, *Vortex*, *Spectra*) with dynamic atmosphere and halo lighting.
- **⚡ Cinematic Motion**: Fluid timeline animations and micro-interactions powered by GSAP.
- **🔮 Glassmorphism & Modern UI**: Sleek dark aesthetic with backdrop blur, tailored ambient glows, and responsive typography.
- **📱 Responsive & Performant**: Fully optimized for desktop and mobile displays with asset preloading.

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **[React 19](https://react.dev/)** | Component architecture and state management |
| **[Three.js](https://threejs.org/)** | WebGL 3D rendering engine |
| **[@react-three/fiber](https://docs.pmnd.rs/react-three-fiber)** | Declarative Three.js for React |
| **[@react-three/drei](https://github.com/pmndrs/drei)** | Useful helpers and abstractions for React Three Fiber |
| **[GSAP](https://greensock.com/gsap/)** | Ultra-smooth scroll animations and timeline controls |
| **[Tailwind CSS v4](https://tailwindcss.com/)** | Utility-first modern responsive styling |
| **[Vite](https://vitejs.dev/)** | Next-generation frontend build tooling |
| **[Vercel](https://vercel.com/)** | Production cloud hosting and continuous deployment |

---

## 📂 Project Structure

```text
surge/
├── public/
│   ├── models/            # 3D GLB bicycle models (Ridge, Vortex, Spectra)
│   └── favicon.svg        # Application favicon
├── src/
│   ├── assets/            # Static image assets & textures
│   ├── App.jsx            # Main app composition, scroll layers & backdrop
│   ├── Scene.jsx          # Three.js Canvas, lighting, shadows & 3D loader
│   ├── BikeCarouselSection.jsx # Showcase carousel section
│   ├── DebugCameraPanel.jsx    # Camera angle inspection tooling
│   ├── LikeWidget.jsx     # Interactive engagement widget
│   ├── Navbar.jsx         # Header navigation bar
│   ├── Preloader.jsx      # Loading screen with asset progress
│   ├── useScrollCamera.js # Scroll-to-camera matrix choreography hook
│   ├── useSectionInView.js# IntersectionObserver tracking hook
│   ├── index.css          # Tailwind CSS styles & typography
│   └── main.jsx           # App entry point
├── package.json           # Dependencies and project scripts
├── vite.config.js         # Vite configuration
└── README.md              # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed (v18 or higher recommended).

### 1. Clone the repository

```bash
git clone https://github.com/Nikshithnayak/bicycle_3d.git
cd bicycle_3d
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.

### 4. Build for production

```bash
npm run build
```

Preview the production build locally:
```bash
npm run preview
```

---

## 🚢 Deployment

The project is configured for automated continuous deployment on **Vercel**:

1. Pushes to the `main` branch automatically trigger a new deployment.
2. Build command: `npm run build`
3. Output directory: `dist`

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
