# University of Arizona [2024 Fall ECE 413/513]

# Final Project - Heart Rate Monitoring Project

## Overview
This project implements the **Heart Track** application, an IoT-enabled system for monitoring heart rate and blood o***REMOVED***ygen saturation levels. It integrates hardware, backend services, and a responsive web application to provide a seamless user e***REMOVED***perience for individuals or physicians (for advanced functionality).

## Features
- Periodic heart rate and blood o***REMOVED***ygen saturation monitoring using the MAX30102 sensor.
- IoT device integration with configurable measurement schedules.
- Responsive web application for monitoring and visualization.
- Secure backend with RESTful API endpoints and token-based authentication.

---

## Team Members
- Member 1: Aaron Colin   - aaroncolin@arizona.edu
- Member 2: Ashish Khadka - khadka***REMOVED***ashish@arizona.edu
- Member 3: Taron Bashar  - taronbashar@arizona.edu 

---

## Project Structure

| Folder/File     | Description                                       |
|---------------- |------- -------------------------------------------|
| `app.js`        | Entry point for the Node.js server.               |
| `routes/`       | API route definitions.                            |
| `models/`       | Mongoose schemas for MongoDB collections.         |
| `public/`       | Static assets (CSS, JS, images) for the frontend. |
| `views/`        | EJS templates for rendering the frontend.         |
| `firmware/`     | Embedded code for the IoT device.                 |
| `node_modules/` | Node.js dependencies (e***REMOVED***cluded via `.gitignore`). |
| `package.json`  | Project metadata and dependencies.                |
| `README.md`     | Documentation for the project.                    |

---

## Hardware Requirements

- IoT Development Board: Particle Photon or Argon.
- Heart Rate Sensor: MAX30102 Pulse Detection Module.
- Breadboard, jumper wires, and micro USB cable.

---

## Installation and Setup

1. Clone the repository:
   ```bash
   git clone [repo-url]
   cd [repo-folder]
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

4. Flash firmware to the IoT device (see `firmware/README.md` for details):
   ```bash
   particle flash [device-name] [firmware-file]
   ```

---

## API Documentation

|  Endpoint           | Method | Description             |
|---------------------|--------|-------------------------|
| `/api/login`        |  POST  | User login.             |
| `/api/register`     |  POST  | User registration.      |
| `/api/device`       |  POST  | Add/remove devices.     |
| `/api/measurements` |  GET   | Fetch measurement data. |

---

## Web Application Features
- **Login/Logout:** Secure user authentication.
- **Weekly Summary:** View average, minimum, and ma***REMOVED***imum heart rate for the past 7 days.
- **Daily Details:** Visualize time-series data for heart rate and blood o***REMOVED***ygen levels.
- **Responsive Design:** Optimized for desktop, tablet, and mobile devices.

---

## Default Login Credentials

### Patient Account
- **Username:** patient@e***REMOVED***ample.com
- **Password:** patient123

### Physician Account
- **Username:** physician@e***REMOVED***ample.com
- **Password:** doctor123

---

## Missing Sections
The following sections are incomplete and require input:
- **Videos:** Links to pitch and demo videos.
- **Live Server URL:** AWS or hosting link.
- **Secure Code Mitigation:** Details of identified and mitigated vulnerabilities.

---

## Lessons Learned
1. Importance of modularizing backend and frontend code for maintainability.
2. Challenges in real-time data synchronization between the IoT device and the server.
3. Insights into the secure implementation of token-based authentication.

---

## Challenges
- **Hardware Integration:** Stabilizing measurements from the MAX30102 sensor.
- **Frontend Responsiveness:** Ensuring seamless design across devices.
- **Error Handling:** Managing offline device scenarios and delayed data uploads.

---

## References
- [Node.js Documentation](https://nodejs.org/en/docs/)
- [MAX30102 Datasheet](https://datasheet.e***REMOVED***ample.com)
- [Particle Photon Documentation](https://docs.particle.io/)

---

## Contribution
|  Team Member  | Backend (%) | Frontend (%) | Firmware (%) | Documentation (%) |
|---------------|-------------|--------------|--------------|-------------------|
| Aaron Colin   |     40      |      60      |      20      |        30         |
| Ashish Khadka |     40      |      30      |      60      |        30         |
| Taron Bashar  |     20      |      10      |      20      |        40         |