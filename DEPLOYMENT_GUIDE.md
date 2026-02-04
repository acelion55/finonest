# Deployment Guide - Vercel & Render

## 📋 Deployment Overview

- **Frontend**: Deployed on Vercel (finonest02 folder)
- **Backend**: Deployed on Render (server folder)
- **Database**: MongoDB Atlas (already in cloud)

---

## 🔧 Step 1: Prepare Frontend for Vercel

### 1.1 Update Backend URL in Frontend

Create a `.env.production` file in the frontend root:

```bash
VITE_API_URL=https://your-render-backend-url.com
```

Then update `src/context/AuthContext.jsx` and other API calls to use this:

**Old:**
```javascript
fetch('http://localhost:5000/api/auth/signup')
```

**New:**
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
fetch(`${API_URL}/api/auth/signup`)
```

### 1.2 Vercel Configuration

Create `vercel.json` in frontend root:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "env": {
    "VITE_API_URL": "@api_url"
  }
}
```

### 1.3 Check package.json

Ensure these scripts exist in `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src"
  }
}
```

---

## 🚀 Step 2: Deploy Frontend on Vercel

### 2.1 Create Vercel Account
- Go to [vercel.com](https://vercel.com)
- Sign up with GitHub

### 2.2 Push Code to GitHub

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/finonest.git
git push -u origin main
```

### 2.3 Deploy on Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Select "Import Git Repository"
3. Choose your GitHub repo
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `./finonest02`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. Add Environment Variables:
   - Key: `VITE_API_URL`
   - Value: `https://your-render-backend-url.com` (add after backend deployment)

6. Click **Deploy**

### 2.4 Frontend URL
After deployment, you'll get a URL like: `https://finonest.vercel.app`

---

## 🔌 Step 3: Prepare Backend for Render

### 3.1 Update Server Configuration

Create `.env` file in `server/` folder:

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/finonest
JWT_SECRET=your_super_secret_jwt_key_12345
NODE_ENV=production
```

### 3.2 Update CORS Configuration

Edit `server/server.js`:

```javascript
import cors from 'cors';

// Update CORS to allow Vercel frontend
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://finonest.vercel.app',  // Your Vercel domain
    'https://*.vercel.app'
  ],
  credentials: true
}));
```

### 3.3 Check server/package.json

Ensure it has:

```json
{
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "dev": "node --watch server.js"
  },
  "engines": {
    "node": "20.x"
  }
}
```

---

## 🎯 Step 4: Deploy Backend on Render

### 4.1 Create Render Account
- Go to [render.com](https://render.com)
- Sign up with GitHub

### 4.2 Create New Web Service

1. Dashboard → New → Web Service
2. Connect GitHub repo
3. Configure:
   - **Name**: `finonest-server`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: `server`

### 4.3 Set Environment Variables

In Render dashboard, add:

```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/finonest
JWT_SECRET=your_super_secret_jwt_key_12345
NODE_ENV=production
```

### 4.4 Deploy

Click **Deploy** and wait 5-10 minutes.

### 4.5 Backend URL
After deployment, you'll get: `https://finonest-server.onrender.com`

---

## 🔄 Step 5: Connect Frontend & Backend

### 5.1 Update Vercel Environment Variable

1. Go to Vercel Dashboard
2. Select your project
3. Settings → Environment Variables
4. Update `VITE_API_URL` to your Render backend URL:
   ```
   https://finonest-server.onrender.com
   ```

### 5.2 Redeploy Frontend

```bash
git add .
git commit -m "Update backend URL"
git push
```

Vercel will auto-redeploy.

---

## ✅ Step 6: Update All API Calls

Update every API call in frontend to use environment variable:

### For AuthContext.jsx:

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const signup = useCallback(async (email, password, confirmPassword, fullName) => {
  const response = await fetch(`${API_URL}/api/auth/signup`, {
    // ... rest of code
  });
});
```

### For Component Files (productlinkfilter.jsx, etc):

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const fetchBanks = async () => {
  const endpoint = `${API_URL}/api/${endpointMap[productType]}/filter/banks`;
  // ... rest of code
};
```

---

## 🧪 Step 7: Test Deployment

### Test Frontend
1. Visit: `https://finonest.vercel.app`
2. Try signup → should work
3. Try login → should work
4. Try saving profile → should save to DB

### Test Backend
```bash
curl https://finonest-server.onrender.com/api/health
# Should return: {"status": "Server is running"}
```

### Test API
```bash
curl -X POST https://finonest-server.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

---

## 📱 Troubleshooting

### CORS Errors
- Check backend CORS configuration includes Vercel domain
- Render URL format should be: `https://project-name.onrender.com`

### Environment Variables Not Loading
- Frontend: Check `.env.production` in root
- Backend: Check Render environment variables in dashboard

### MongoDB Connection Error
- Verify `MONGODB_URI` is correct
- Add Render IP to MongoDB Atlas whitelist:
  - MongoDB Atlas → Network Access → Add IP Address
  - Add: `0.0.0.0/0` (allows all IPs)

### Build Failures
- Check `npm install` works locally
- Verify `node_modules` is in `.gitignore`
- Check for syntax errors: `npm run build`

---

## 📊 File Structure After Deployment

```
GitHub Repository (finonest)
├── finonest02/          (Frontend - deployed on Vercel)
│   ├── src/
│   ├── .env.production
│   ├── vercel.json
│   └── package.json
│
└── server/              (Backend - deployed on Render)
    ├── routes/
    ├── models/
    ├── .env             (NOT in git, added in Render)
    └── package.json
```

---

## 🔐 Security Checklist

- ✅ JWT_SECRET is strong and random
- ✅ MongoDB connection string is private (in `.env`, not in git)
- ✅ CORS is properly configured
- ✅ Node environment is set to production
- ✅ No sensitive data in `.gitignore` files

---

## 📝 Summary

| Service | URL | Purpose |
|---------|-----|---------|
| Vercel | `https://finonest.vercel.app` | Frontend |
| Render | `https://finonest-server.onrender.com` | Backend API |
| MongoDB Atlas | Cloud | Database |

---

## 🎉 After Deployment

Your app is now live! Users can:
1. Sign up at `https://finonest.vercel.app/signup`
2. Login at `https://finonest.vercel.app/login`
3. Fill profile info which saves to MongoDB
4. Use all features with real backend API

**Total Time**: ~15-20 minutes
**Cost**: Vercel & Render have free tiers!
