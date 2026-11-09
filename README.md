
# APICheck

### REST API Testing Platform

APICheck is a modern REST API testing platform built with React and TypeScript. It allows developers to send HTTP requests, inspect API responses, save reusable requests, track request history, and run automated response checks.

## Features

- **HTTP Methods:** GET, POST, PUT, PATCH and DELETE.
- **Request Configuration:** Custom headers and JSON request bodies.
- **Response Inspector:** View status codes, response times, headers and response data.
- **Saved Requests:** Save, load and delete reusable API requests.
- **Request History:** Track previous requests and their results.
- **Automated API Tests:** Validate status codes, response content, required JSON fields and response times.
- **Responsive Interface:** Dark-themed interface designed for desktop and mobile.

## Tech Stack

- React
- TypeScript
- Vite
- CSS
- Vitest
- Testing Library

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/wickedceo/APICheck.git
```

### 2. Navigate into the project

```bash
cd APICheck
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

## Testing

Run the automated unit tests:

```bash
npx vitest run
```

Run the code quality checks:

```bash
npm run lint
```

Build the production application:

```bash
npm run build
```

## Project Structure

```text
src/
├── components/
│   ├── ApiTestRunner.tsx
│   ├── RequestPanel.tsx
│   ├── ResponseViewer.tsx
│   └── SavedRequests.tsx
├── services/
│   ├── apiClient.ts
│   └── apiClient.test.ts
├── types/
│   └── api.ts
├── utils/
│   └── apiHelpers.ts
├── App.tsx
└── App.css
```

## Testing Coverage

The API client includes automated tests covering:

- Successful GET requests
- POST requests with JSON bodies
- Plain-text responses
- Empty responses
- Network failures

## Developer

**WICKED CEO**

GitHub: [@wickedceo](https://github.com/wickedceo)

---

Built with React and TypeScript.
