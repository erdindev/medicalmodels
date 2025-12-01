# Task: Enable Hot Reloading for Rapid Development

## Context
The current workflow involves rebuilding the application (`npm run build`) and restarting the server (`pm2 restart 0`) after every change. This is time-consuming and slows down the iteration process, especially for visual tweaks like the magnetic mesh animation.

## Objective
Switch the application to **Development Mode** (`npm run dev`) to enable **Hot Module Replacement (HMR)**. This will allow changes to be reflected instantly in the browser without a full rebuild.

## Steps

1.  **Stop Production Server**:
    -   Stop and delete the current PM2 process running the production build.
    -   Command: `pm2 delete 0`

2.  **Start Development Server**:
    -   Start the Next.js development server using PM2.
    -   Command: `pm2 start npm --name "medicalmodels-dev" -- run dev`

3.  **Verify HMR**:
    -   Ensure the site is accessible at `http://localhost:3000`.
    -   Make a small test change (e.g., console log or comment) to verify that the browser updates without a manual reload/rebuild.

## Benefits
-   **Instant Feedback**: Visual changes (CSS, animations) appear almost immediately.
-   **Faster Iteration**: No need to wait for `next build` to complete.
-   **Better Debugging**: Better error messages and source maps in development mode.
