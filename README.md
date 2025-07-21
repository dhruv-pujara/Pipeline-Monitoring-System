# Pipeline Monitoring System

A full-stack web application for managing pipeline inspections across three user roles: Owner, Inspector, and Admin. Features real-time geospatial visualization, role-specific dashboards, and streamlined data flow for inspection management. Built using Next.js, Express.js, MySQL, and Mapbox.

## Features

- **Role-based Dashboards**
  - **Owner**: View and manage pipelines/segments, view inspection reports, interactive map.
  - **Inspector**: View assigned inspections, submit findings, report issues, track submitted reports.
  - **Admin**: Manage users, assign inspectors, review and delete inspections.

- **Tech Stack**
  - Frontend: Next.js (TypeScript), ShadCN UI
  - Backend: Express.js, Node.js
  - Database: MySQL
  - Auth: JWT-based authentication
  - Map Integration: Mapbox
  - Package Manager: pnpm

## Prerequisites

- Node.js >= 18
- MySQL Server >= 5.7
- pnpm (`npm install -g pnpm`)
- Mapbox access token
- XAMPP or any MySQL GUI (optional)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/nebilawako/PipelineSystem.git
   cd PipelineSystem
   ```

2. Install dependencies:
   ```
   pnpm install
   ```

3. Configure environment variables:
   - In `client/.env.local`, add:
     ```
     NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
     ```

4. Set up the MySQL database:
   - Run the SQL schema and seed data provided in the docs to initialize:
     - LOGIN
     - PIPELINE
     - SEGMENT
     - INSPECTION
     - INSPECTOR
     - ISSUE
     - ALERT
     - ASSIGNED_INSPECTIONS
     - REPORTS
     - OWNS
     - ASSIGNS

5. Start the backend:
   ```
   cd backend
   node index.js
   ```

6. Start the frontend:
   ```
   cd client/app
   pnpm run dev
   ```

## Usage

Go to `http://localhost:3000` and log in with role-specific credentials.

- **Owner Dashboard**: Map of pipelines (colored by status), add/edit/delete pipelines and segments, view inspection reports.
- **Inspector Dashboard**: View and submit assigned inspections, report issues with severity, review submitted reports.
- **Admin Dashboard**: Manage user accounts, assign inspectors, review and remove outdated inspections.

## Future Enhancements

- Email/SMS alerts for reported issues
- File upload support (inspection images/docs)
- PDF export of reports
- Mobile responsive design
- RBAC middleware and stricter route guards

## Author

Dhruv Pujara  
[LinkedIn](https://linkedin.com/in/dhruv-pujara) | [GitHub](https://github.com/dhruv-pujara)

Licensed under the MIT License.
