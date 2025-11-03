# 🏗️ Final Folder Structure — Feature-Based Architecture (Standalone)

This document describes the **final folder structure** and **responsibilities** for the Angular project using **feature-based architecture**, **standalone components**, and **domain-based routing**.

---

## 📁 Folder Structure On Our App 

#### src/
#### ├── app/
#### │ ├── core/ # Core application logic (global)
#### │ │ ├── guards/ # Route guards (AuthGuard, RoleGuard)
#### │ │ ├── interceptors/ # HTTP interceptors (auth token, error handling)
#### │ │ ├── services/ # Global singletons (AuthService, ApiService)
#### │ │ ├── models/ # Global data models (User, Doctor, Department)
#### │ │ ├── core.config.ts # API endpoints and constants
#### │ │ 
#### │ │
#### │ ├── shared/ # Reusable UI and utilities
#### │ │ ├── components/ # Shared UI elements (modal, loader, navbar)
#### │ │ ├── directives/ # Shared directives (e.g., auto-focus, permissions)
#### │ │ ├── pipes/ # Shared pipes (formatDate, capitalize, etc.)
#### │ │ ├── shared-imports.ts # Common Angular + Material modules
#### │ │ 
#### │ │
#### │ ├── features/ # Main business domains
#### │ │ ├── registration/ # Handles patient registration and ticket management
#### │ │ │ ├── patients/ # Patients feature
#### │ │ │ │ ├── pages/
#### │ │ │ │ │ ├── patient-list/ # Lists all patients
#### │ │ │ │ │ ├── patient-details/ # Shows patient profile info
#### │ │ │ │ │ └── patient-form/ # Add/Edit patient form
#### │ │ │ │ ├── components/ # Patient-specific UI parts (patient-card, search-bar)
#### │ │ │ │ ├── services/ # PatientService (CRUD operations)
#### │ │ │ │ ├── models/ # Patient model/interface
#### │ │ │ │ └── patients.routes.ts
#### │ │ │ │
#### │ │ │ ├── tickets/ # Tickets feature
#### │ │ │ │ ├── pages/
#### │ │ │ │ │ ├── ticket-list/ # View all registration tickets
#### │ │ │ │ │ ├── ticket-details/ # Ticket info, patient link
#### │ │ │ │ │ └── ticket-form/ # Create/Edit ticket
#### │ │ │ │ ├── components/ # Ticket-specific UI (ticket-card, filter-panel)
#### │ │ │ │ ├── services/ # TicketService (manage ticket records)
#### │ │ │ │ ├── models/ # Ticket model/interface
#### │ │ │ │ └── tickets.routes.ts
#### │ │ │ │
#### │ │ │ └── registration.routes.ts # Combines patients + tickets routes
#### | | |
#### │ │ └── dashboard/ # Dashboard domain (stats, analytics, charts)
#### │ │ ├── pages/
#### │ │ ├── components/
#### │ │ ├── services/
#### │ │ └── dashboard.routes.ts
#### │ │
#### │ ├── app.routes.ts # Root routing (lazy-loads domains)
#### │ ├── app.component.ts / .html / .css
#### │ └── main.ts # App bootstrap file
#### │
#### ├── assets/ # Static assets (images, icons, styles)
#### │ ├── images/
#### │ ├── icons/
#### │ └── styles/
#### │
#### ├── environments/ # Environment configuration files
#### │ ├── environment.ts
#### │ └── environment.prod.ts
#### │
#### └── index.html # Main entry HTML file



---

## ⚙️ Notes

- Each **domain folder** (like `registration` or `admin`) is a self-contained module of the app.  
- Every **feature** (patients, tickets, users, doctors, departments) has:
  - Its own **pages**, **components**, **services**, and **routes**.
- Routing files (`*.routes.ts`) define **lazy-loaded** standalone routes — no modules are used.
- Common UI or utilities are stored in **`shared/`**.
- Global, app-level services (like authentication, API interceptors, or guards) are under **`core/`**.

---


