## Backend URL Configuration

To run this project with **Expo Go**, you must update the backend URL manually.

Open:

frontend/lib/api.ts


and edit the `BASE_URL` constant (line 16):

```ts
// Example:
export const BASE_URL = 'http://192.168.1.22:8080';


The main code is in frontend/app.tsx
