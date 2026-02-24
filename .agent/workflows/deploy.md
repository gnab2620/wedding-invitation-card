---
description: How to deploy the wedding invitation website
---

# Deployment Guide

Since this is a static website (HTML, CSS, JS), you can deploy it for free using several popular platforms.

## Option 1: Vercel (Easiest)
1. Go to [Vercel](https://vercel.com).
2. Create a free account.
3. **Method A (Drag & Drop)**: 
   - Go to the [Vercel Dashboard](https://vercel.com/dashboard).
   - Drag your `wedding-invitation` folder directly into the deployment area.
4. **Method B (GitHub)**:
   - Push your code to a GitHub repository.
   - Connect your GitHub account to Vercel and select the repository.
   - Click **Deploy**.

## Option 2: Netlify
1. Go to [Netlify](https://www.netlify.com).
2. **Drag & Drop**:
   - Go to [Netlify Drop](https://app.netlify.com/drop).
   - Drag and drop your project folder.
3. Your site will be live instantly!

## Option 3: GitHub Pages
1. Create a repository on GitHub.
2. Push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```
3. Go to **Settings > Pages**.
4. Select the `main` branch and `/root` folder, then click **Save**.

---

> [!IMPORTANT]
> **RSVP Functionality**: 
> The current code uses a `/api/rsvp` endpoint. If you deploy as a **Static Site** (Option 1, 2, or 3), the RSVP form will not work unless you have a backend server or a serverless function handled by Vercel/Netlify.
>
> **Alternative**: Use a service like [Formspree](https://formspree.io) to handle form submissions without a backend.
