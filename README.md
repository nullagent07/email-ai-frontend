# Email AI Frontend

This application represents the frontend for Email AI - a platform that allows users to autonomously communicate with selected mailboxes on their behalf. The platform is based on an LLM (Large Language Model), which can be given a unique personality through custom instructions via an intuitive interface. Additionally, the application includes Google authorization, subscription information display, interaction table management, and correspondence history.

---

## Contents

1. [Authorization and Account Access](#authorization-and-account-access)
2. [Main Screen: Interaction Table](#main-screen-interaction-table)
3. [Correspondence History](#correspondence-history)
4. [Navigation and Routes](#navigation-and-routes)
5. [Technology Stack](#technology-stack)
6. [API Interaction](#api-interaction)
7. [Backend API Endpoints](#backend-api-endpoints)
8. [Running the Application](#running-the-application)

---

## Authorization and Account Access

### Functional Capabilities

- **SSO Authorization through Gmail**
  - The main page displays a button for Google login.
  - Authorization is implemented using the backend.
  
- **Subscription Verification**
  - After successful authorization, the user is shown their current subscription status, which is loaded from the backend.

---

## Main Screen: Interaction Table

### Table Structure

The interaction table displays the following fields:

- **User Email**
- **Name** – the user's name.
- **Description** – a brief description of the assistant.
- **Status** – a button to toggle between states (Stop/Active).
- **Delete** – a button to delete the user.

### API Interaction

- **Retrieving the user list.**
- **Managing interaction status.**
- **Deleting a user** (correspondence history is preserved).

---

## Correspondence History

### Functionality

- Viewing message chronology.
- Returning to the main interaction table.

### API Interaction

- Correspondence history is loaded when the corresponding route is opened.

---

## Navigation and Routes

The application includes routes for authorization, viewing the interaction table, and correspondence history, implemented using Remix.run routing.

---

## Technology Stack

### Core Technologies

- **Remix.run**
  - A modern framework for React applications.
  - Advantages:
    - Improved SEO.
    - Fast page loading.
    - Convenient server-side data processing using loaders and actions.

- **React**
  - A library for creating UI components.
  - The basic platform for the application built on Remix.run.

- **TypeScript**
  - A typed version of JavaScript.
  - Advantages:
    - Increased code reliability.
    - Improved maintainability.
    - Development convenience.

### Styling

- **Tailwind CSS**
  - A utility CSS framework.
  - Flexible class system and responsive design support.

---

## API Interaction

### Main API Operations

- User authorization.
- Retrieving user data.
- Managing interaction statuses.
- Working with correspondence history.

### Example Request for Authorization Check

```http
GET /api/auth/check
```

- **Purpose:** Checking authorization status and retrieving subscription information.

---

## Backend API Endpoints

### Authentication (/auth)

#### 1. **GET /auth/google/login**

- **Purpose:** Generating a URL for Google OAuth authorization.
- **Returns:**  
  ```json
  {
      "authorization_url": "string"
  }
  ```
  *(URL for redirect to Google authorization page)*  
- **Note:** Sets an `oauth_state` cookie for security.

#### 2. **GET /auth/google/callback**

- **Purpose:** Processing callback from Google after successful authorization.
- **Accepts:**  
  - `code`: string – authorization code from Google.
  - `state`: string – security token.
- **Returns:**  
  ```json
  {
      "status": "success",
      "message": "Successfully authenticated",
      "is_new_user": boolean
  }
  ```
- **Note:** Sets an `access_token` cookie with a JWT token.

#### 3. **POST /auth/set-password**

- **Purpose:** Adding a password to an account registered through OAuth.
- **Accepts:**  
  - `password`: string
- **Requires:** JWT authentication.
- **Returns:**  
  ```json
  {
      "status": "success", 
      "message": "Password successfully set"
  }
  ```

#### 4. **GET /auth/check**

- **Purpose:** Verifying the validity of the current session and Google token status.
- **Requires:** JWT authentication.
- **Returns:**  
  ```json
  {
      "authenticated": true,
      "user": {
          "id": number,
          "email": string,
          "name": string
      },
      "google_oauth": {
          "connected": boolean,
          "token_status": "valid" | "refreshed" | "invalid" | null
      }
  }
  ```

---

### Assistants (/assistants)

#### **POST /assistants/email/gmail**

- **Purpose:** Verifying the validity of a Gmail token.
- **Accepts:**  
  - `token`: string – Gmail access token in the Authorization header.
- **Returns:**  
  ```json
  {
      "status": "success",
      "message": "Gmail token is valid"
  }
  ```
- **Errors:**
  - 401 – invalid token.
  - 500 – internal server error.

---

## Running the Application

To run the project locally, use the command:
```bash
remix dev
```

This will start a development server, allowing you to test and debug the application in real-time.
