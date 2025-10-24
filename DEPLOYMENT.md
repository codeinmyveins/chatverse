# ChatVerse Deployment Guide for Render

## Prerequisites

- GitHub repository with your ChatVerse code
- Render account (signed up ✅)

## Step 1: Push Code to GitHub

```bash
# If not already done
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

## Step 2: Create PostgreSQL Database on Render

1. Go to [render.com](https://render.com) dashboard
2. Click **"New +"** → **"PostgreSQL"**
3. Configure:
   - **Name:** `chatverse-db`
   - **Database:** `chatverse`
   - **User:** `chatverse_user`
   - **Region:** Choose closest to you
4. Click **"Create Database"**
5. **Save the connection details** (you'll need them for the backend)

## Step 3: Deploy Backend Service

1. Click **"New +"** → **"Web Service"**
2. **Connect GitHub repository**
3. Configure:
   - **Name:** `chatverse-backend`
   - **Root Directory:** `server`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. **Environment Variables:**
   ```
   NODE_ENV=production
   PORT=10000
   DB_HOST=<your_postgres_host>
   DB_USER=<your_postgres_user>
   DB_PASSWORD=<your_postgres_password>
   DB_NAME=chatverse
   DB_PORT=5432
   JWT_SECRET=your_super_secret_jwt_key_here
   CLIENT_URL=https://your-frontend-url.onrender.com
   ```
5. Click **"Create Web Service"**

## Step 4: Deploy Frontend Service

1. Click **"New +"** → **"Web Service"**
2. **Connect the same GitHub repository**
3. Configure:
   - **Name:** `chatverse-frontend`
   - **Root Directory:** `client`
   - **Environment:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
4. **Environment Variables:**
   ```
   NODE_ENV=production
   VITE_API_URL=https://your-backend-url.onrender.com
   VITE_SOCKET_URL=https://your-backend-url.onrender.com
   ```
5. Click **"Create Web Service"**

## Step 5: Update Backend Environment Variables

After both services are deployed:

1. Go to your **Backend Service** settings
2. Update the **CLIENT_URL** environment variable:
   ```
   CLIENT_URL=https://your-frontend-url.onrender.com
   ```
3. **Redeploy** the backend service

## Step 6: Test Your Application

1. Visit your frontend URL: `https://your-frontend-url.onrender.com`
2. Register a new account
3. Test the chat functionality
4. Check if real-time features work

## Troubleshooting

### Common Issues:

1. **Database Connection Failed:**

   - Check your PostgreSQL credentials
   - Ensure the database exists
   - Verify the connection string

2. **Frontend Can't Connect to Backend:**

   - Check CORS settings in backend
   - Verify CLIENT_URL environment variable
   - Ensure both services are deployed

3. **Socket.io Connection Issues:**
   - Check if both services are running
   - Verify the SOCKET_URL environment variable
   - Check browser console for errors

### Useful Commands:

```bash
# Check backend logs
# Go to your backend service → Logs tab

# Check frontend logs
# Go to your frontend service → Logs tab

# Test database connection locally
cd server
npm run setup-db
```

## URLs After Deployment

- **Frontend:** `https://your-frontend-name.onrender.com`
- **Backend API:** `https://your-backend-name.onrender.com`
- **Database:** Managed by Render (internal connection)

## Next Steps

1. Set up custom domain (optional)
2. Configure SSL certificates (automatic on Render)
3. Set up monitoring and alerts
4. Configure backup strategies for your database

---

**Need Help?** Check the Render documentation or contact support.
