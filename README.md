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

| Folder/File          | Description                                                                                 |
|----------------------|---------------------------------------------------------------------------------------------|
| `app.js`             | Entry point for the Node.js server.                                                         |
| `routes/`            | API route definitions.                                                                      |
| `models/`            | Mongoose schemas for MongoDB collections.                                                   |
| `public/`            | Static assets (CSS, JS, images) for the frontend.                                           |
| `views/`             | EJS templates for rendering the frontend.                                                   |
| `firmware/`          | Embedded code for the IoT device.                                                           |
| `node_modules/`      | Node.js dependencies (e***REMOVED***cluded via `.gitignore`).                                           |
| `package.json`       | Project metadata and dependencies.                                                          |
| `README.md`          | Documentation for the project.                                                              |

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

## Tools Info and language version
   - Mongo DB         : Version 8
   - Nodejs           : Version 18
   - C++ Compileer    : Particle Compiler
   - Firmware Version :  6.1.1


---

## API Documentation

## **API Documentation**

| **Endpoint**              | **Method** | **Description**                               |
|---------------------------|------------|-----------------------------------------------|
| `/api/login`              | POST       | User login.                                   |
| `/api/register`           | POST       | User registration.                            |
| `/api/devices`            | GET        | Retrieve a list of devices for the user.      |
| `/api/devices/add`        | POST       | Add a new IoT device to the user’s account.   |
| `/api/devices/remove`     | POST       | Remove an IoT device from the user’s account. |
| `/api/measurements`       | GET        | Fetch heart rate and SpO2 measurement data.   |
| `/api/patients`           | GET        | Retrieve patient data for physicians.         |
| `/api/patients/update`    | PUT        | Update patient information or device links.   |
| `/api/physicians`         | GET        | Retrieve aggregated patient data.             |
| `/api/physicians/manage`  | POST       | Manage patient accounts and linked devices.   |  
| `/sensor/data`            | POST       | Particle Server Endpoint reach                |
| `/sensor/readAll`         | GET        | Reads all the e***REMOVED***isting data in DB             |
| `/sensor/userDayLog`      | GET        | Read user day activity from DB (in progress)  |
| `/sensor/deleteAll`       | POST       | Drops all the content of e***REMOVED***isting DB          |
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

## Submission Links
The following sections are incomplete and require input:
- **Videos:** 
   - [Pitch Video](https://drive.google.com/drive/u/1/folders/19Y4Z9uaJtyeHQ1QQ4LRNb56DIOh_jafz)
   - [Live Video]()
   - [Uncut Raw Live Demo & ScreenShots ](https://drive.google.com/drive/u/1/folders/1aLZ_jf4j2M1YmJ4V8Ho0g94beJIGht9c)
   

- **Live Server URL:**  
   - [AWS serving http](http://ec2-3-142-184-106.us-east-2.compute.amazonaws.com:3000/)
   - [NGROK serving https port forwared and reverse pro***REMOVED***y technique ]( https://45a9-3-142-184-106.ngrok-free.app/user-profile.html)

- **Project Documentation**
  - [Project submission PDF File](https://gitlab.com/ece_iot/hart_rate_monitoring/-/blob/main/Project_Report.pdf)
  - Secure Code Mitigation: See (https://gitlab.com/ece_iot/hart_rate_monitoring/-/blob/main/Project_Report.pdf))

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
- [MAX30102 Datasheet](https://www.analog.com/media/en/technical-documentation/data-sheets/MAX30102.pdf)
- [Particle Photon Documentation](https://docs.particle.io/)
- [Particle Argon Documentation](https://docs.particle.io/reference/datasheets/wi-fi/argon-datasheet/)
- [Particle CLI Tools](https://docs.particle.io/reference/developer-tools/cli/)
- [SparkFun-MAX3010***REMOVED*** (community library) Maintained by Particle](https://docs.particle.io/reference/device-os/libraries/s/SparkFun-MAX3010***REMOVED***/)
- [Firmware and Driver for the sensor by SparkFun](https://github.com/sparkfun/SparkFun_MAX3010***REMOVED***_Sensor_Library/blob/master/src/MAX30105.h)
- [Demonstartaion and how to MAX30105 Sensor by SparkFun](https://learn.sparkfun.com/tutorials/ma***REMOVED***30105-particle-and-pulse-o***REMOVED***-sensor-hookup-guide#e***REMOVED***ample-2---presence-sensing)

---

## Contribution
|  Team Member  | Backend (%) | Frontend (%) | Firmware (%) | Documentation (%) |
|---------------|-------------|--------------|--------------|-------------------|
| Aaron Colin   |     40      |      60      |      20      |        30         |
| Ashish Khadka |     40      |      30      |      60      |        30         |
| Taron Bashar  |     20      |      10      |      20      |        40         |
