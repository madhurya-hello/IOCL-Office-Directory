| Best Employee Management System on Internet |
|---------------------------------------------|
| ![Employee Management System](screenshots/11.png) |

## 📑 Table of Contents
- [🌟 Introduction](#-introduction)
- [✨ Features](#-features)
  - [🎂 Birthday Features](#-birthday-features)
  - [👥 Employee Management](#-employee-management-admin-only)
  - [🔍 Search & Analytics](#-search--analytics)
  - [🛠️ Request System](#️-request-system)
  - [🔒 Role-Based Access](#-role-based-access)
- [📸 Screenshots](#-screenshots)
- [🚀 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [🙏 Acknowledgements](#-acknowledgements)
- [🛠️ Tech Stack](#️-tech-stack)
  - [Frontend](#frontend)
  - [Backend](#backend)
- [📄 License](#-license)

## 🌟 Introduction

BirthdayConnect is a full-stack employee management system with a special focus on birthday celebrations and seamless data management. Designed for both employees and admins, it offers:

    🎉 Birthday celebrations: Send/receive wishes, view birthday calendars

    🔍 Advanced search: Filter, analyze, and bulk-manage employee data

    📲 Mobile-friendly access: QR-code scanning for instant employee profiles

    ♻️ Data safety: Recycle bin for accidental deletions (admin-only)

    🔄 Request workflow: Employees propose changes, admins approve/reject

Built with React + Redux (Frontend) and Spring Boot + MySQL (Backend), it ensures secure role-based access for all operations.

## ✨ Features

### 🎂 Birthday Features

    Team celebrations: Any user can send multiple personalized messages to the birthday person

    Wish inbox: Birthday person can click the 'Inbox' button to view all received wishes in one place

    Auto-greetings: System displays a warm birthday banner on the recipient's homepage

    Interactive calendar: Tap any date to see birthdays and plan wishes in advance

### 👥 Employee Management (Admin-only)

    CRUD operations: Add/update/delete employees via form or Excel bulk upload

    Data export: Download employee lists as Excel/PDF

    QR profiles: Scan to view/save employee details on mobile devices

    Recycle bin: Restore accidentally deleted employees

### 🔍 Search & Analytics

    Smart filters: Narrow down employees by department, role, etc.

    Data charts: Visualize employee statistics (age, department distribution)

    Dual-view: Switch between card/list layouts

### 🛠️ Request System

    Employee requests: Submit profile change proposals

    Admin dashboard: Approve/reject requests with one click

### 🔒 Role-Based Access

    Employees: Send wishes, request updates, view profiles

    Admins: Full data control + request approval powers

## 📸 Screenshots

<details>
<summary><b>🔽 View All Screenshots (23 images)</b></summary>

### 🔐 Login

| Login Page | OTP Verification |
|------------|------------------|
| ![Login Page](screenshots/02-a.png) | ![OTP Verification](screenshots/02-b.png) |

### 🏠 Home Page

| Welcome Screen | Birthday List |
|----------------|---------------|
| ![Welcome](screenshots/03.png) | ![Birthday List](screenshots/04.png) |

| Birthday Send Wish Portal | Birthday Wish Card |
|---------------------------|--------------------|
| ![Wish Portal](screenshots/05.png) | ![Wish Card](screenshots/06.png) |

| Birthday Wish Inbox | Change Password |
|---------------------|-----------------|
| ![Wish Inbox](screenshots/07.png) | ![Password Change](screenshots/08.png) |

### 🎂 Birthday Page

| Overall Look |
|------------|
| ![Birthday Calendar](screenshots/09.png) |

### 🔍 Search Page

| Overall Look |
|--------------|
| ![Search Overview](screenshots/10.png) |

| Cards View | List View |
|------------|-----------|
| ![Cards View](screenshots/11.png) | ![List View](screenshots/12.png) |

| Download Option | Add Employee Form |
|-----------------|-------------------|
| ![Download](screenshots/13.png) | ![Add Form](screenshots/14.png) |

| Bulk Upload | User Details Cards |
|-------------|--------------------|
| ![Bulk Upload](screenshots/15.png) | ![Details Cards](screenshots/16.png) |

| Expanded Cards | QR Code Mobile View |
|----------------|---------------------|
| ![Expanded View](screenshots/17.png) | ![QR Code](screenshots/18.png) |

### 📞 Intercom Page

| Overall Look |
|--------------|
| ![Intercom Overview](screenshots/19.png) |

### 📋 Request Page

| Overall Look |
|--------------|
| ![Requests](screenshots/20.png) |

| Comparison Card | Accept / Reject |
|-----------------|-----------------|
| ![Comparison](screenshots/21.png) | ![Reject Request](screenshots/22.png) |

### ♻️ Recycle Page

| Overall Look |
|--------------|
| ![Recycle](screenshots/23.png) |

</details>


## 🚀 Getting Started

### Prerequisites
- Node.js (for frontend)
- Java JDK (for backend)
- MySQL/PostgreSQL (if applicable)

### Installation
1. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm start
   ```

2. **Backend**:
   - Import as Maven project in your IDE
   - Configure database connection in `application.properties`
   - Run the main application class

## 🙏 Acknowledgements

This project was made possible thanks to:

    The React and Spring Boot communities for their incredible open-source tools

    Material UI and Framer Motion teams for helping create beautiful, interactive UI components

    Stack Overflow contributors who answered countless technical questions

    Our beta testers for their valuable feedback on the birthday messaging system

    GitHub Copilot for accelerated development (when it guessed our intentions correctly!)

    Coffee ☕ - The unsung hero that powered those late-night coding sessions

Special thanks to my colleague 'Pratyush Kumar Rabha" who helped turn this from an idea into a celebration platform!

## Tech Stack

### Frontend
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Redux](https://img.shields.io/badge/Redux-764ABC?style=for-the-badge&logo=redux&logoColor=white)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-764ABC?style=for-the-badge&logo=redux&logoColor=white)
![Material UI](https://img.shields.io/badge/Material_UI-0081CB?style=for-the-badge&logo=mui&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)
![Apex Charts](https://img.shields.io/badge/Apex_Charts-FF4560?style=for-the-badge&logo=apexcharts&logoColor=white)

### Backend
![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)

## 📄 License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.