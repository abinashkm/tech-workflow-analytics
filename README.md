# 🚀 Tech Workforce Analytics

A modern SaaS-style analytics dashboard built with **Angular 19** to visualize workforce layoffs, company impact, and employee burnout insights using real-world CSV datasets — fully frontend-driven, no backend required.

---

## 🌐 Live Demo

🔗 https://tech-workflow-analytics.netlify.app/

---

## 📌 Project Overview

Tech Workforce Analytics is a multi-dashboard analytics application designed to explore:

- Workforce layoffs trends (2000–2025)
- Year-over-year growth analysis
- Company-level impact
- Employee burnout behavior insights

All data processing, aggregation, and KPI computation are performed client-side using TypeScript.

---

## 🧠 Key Features

- 📊 Dynamic KPI computation (no hardcoded metrics)
- 📈 Interactive Line, Bar, Horizontal Bar & Pie charts
- 📂 CSV parsing using PapaParse
- 🎯 Reactive year-based filtering via centralized FilterService
- 🌙 Dark / Light theme toggle
- 📱 Fully responsive SaaS-style layout
- 🧩 Standalone Angular 19 architecture
- ⚡ Chart auto-resizing when sidebar toggles
- 🚀 Deployed as a production-ready SPA on Netlify

---

## 🏗️ Architecture

```
Header (Theme + Year Filter)
Sidebar (Navigation)
Main Layout
  ├── Workforce Dashboard
  ├── Burnout Dashboard
  └── Companies Dashboard
```

---

## 🛠 Tech Stack

| Technology | Usage |
|---|---|
| Angular 19 (Standalone) | Frontend Framework |
| TypeScript | Language |
| RxJS | Reactive State Management |
| Chart.js + ng2-charts | Data Visualization |
| PapaParse | CSV Parsing |
| SCSS | Styling |
| Netlify | Deployment |

---

## 📊 Dashboards

---

### 🧑‍💼 Workforce Dashboard

**Features:**
- Total layoffs KPI
- Total companies
- Average layoffs per company
- Highest layoff year
- Layoff trend (Line chart)
- YoY growth (Bar chart)
- Top impacted companies (Horizontal bar)

#### 📸 Screenshots

**Workforce Overview**
<img width="1909" height="953" alt="Screenshot 2026-02-28 at 1 30 45 PM" src="https://github.com/user-attachments/assets/b3f41202-e86b-49c0-b5f3-93bfb1f61284" />



---

### 🔥 Burnout Dashboard

**Features:**
- Average burnout score
- High risk %
- Average work hours
- Average sleep hours
- Burnout distribution
- Work vs Burnout analysis
- Sleep vs Burnout analysis
- Fatigue vs Isolation comparison
- Burnout Risk Distribution (Pie)

#### 📸 Screenshots

**Burnout Overview**

<img width="1915" height="956" alt="Screenshot 2026-02-28 at 1 31 01 PM" src="https://github.com/user-attachments/assets/dea32247-e742-4e29-88e1-09bfd16b67d0" />



---

### 🏢 Companies Dashboard

**Features:**
- Company-wise layoffs aggregation
- Top companies ranking
- Comparative bar visualization

#### 📸 Screenshots

<img width="1900" height="951" alt="Screenshot 2026-02-28 at 1 31 45 PM" src="https://github.com/user-attachments/assets/ec5bab8c-6aee-4ba3-a6cb-05d971f2c7cf" />


---

## 📂 Data Handling

- CSV files stored inside `/public`
- Parsed using PapaParse
- Transformed into strongly typed interfaces
- Aggregations performed using:
  - Map-based grouping
  - Set-based distinct counts
  - Client-side YoY calculations
  - Real-time chart dataset rebuilding

> No REST APIs or backend required.

---

## 🎨 UI & UX Highlights

- Clean SaaS layout with collapsible sidebar
- Smooth transitions
- Custom dark theme
- Consistent card design
- Proper z-index handling
- Chart auto-resize using ResizeObserver
- Mobile responsive layout

---


## 📈 What This Project Demonstrates

- Advanced frontend data engineering
- Client-side analytics processing
- Reactive state management
- Standalone Angular architecture
- Production deployment skills
- Dashboard UX design thinking

---

## 🧑‍💻 Author

**Abinash Mohanty**  
Software Engineer | Angular Developer  
