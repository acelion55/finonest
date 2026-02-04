# FinoNest Deployment Checklist

## ✅ Pre-Deployment Setup (COMPLETED)

### Frontend Environment Variables
- ✅ Created `.env.production` with `VITE_API_URL`
- ✅ Created `vercel.json` configuration
- ✅ Updated all API calls to use `import.meta.env.VITE_API_URL`

### Backend Configuration
- ✅ Updated `server/.env.example` with proper template
- ✅ Updated CORS configuration in `server/server.js` to accept Vercel domains
- ✅ All authentication endpoints configured and tested

### Code Updates Completed
**Frontend Components Updated (15+ files):**
- ✅ AuthContext.jsx - Uses environment variable API_URL
- ✅ productlinkfilter.jsx - Uses environment variable API_URL
- ✅ productportfolio.jsx - Uses environment variable API_URL
- ✅ profile/page.jsx - Uses environment variable API_URL
- ✅ leads/page.jsx - Uses environment variable API_URL
- ✅ payout/gotopayout.jsx - Uses environment variable API_URL
- ✅ productportfolio/creditcard/page.jsx - Uses environment variable API_URL
- ✅ productportfolio/creditcard/creditapply/[id]/page.jsx - Uses environment variable API_URL
- ✅ productportfolio/carloan/page.jsx - Uses environment variable API_URL
- ✅ productportfolio/carloan/apply/[id]/page.jsx - Uses environment variable API_URL
- ✅ productportfolio/persnolloan/page.jsx - Uses environment variable API_URL
- ✅ productportfolio/persnolloan/apply/[id]/page.jsx - Uses environment variable API_URL
- ✅ productportfolio/offline/page.jsx - Uses environment variable API_URL
- ✅ productportfolio/bussiness/page.jsx - Uses environment variable API_URL
- ✅ generatelink/page.jsx - Uses environment variable API_URL
- ✅ generatelink/mylinks/page.jsx - Uses environment variable API_URL

---

## 📋 Deployment Steps

### Step 1: Push Code to GitHub

```powershell
# Navigate to project root
cd f:\code\finonest\finonest02

# Initialize git if not already done
git init

# Add all files
git add .

# Commit changes
git commit -m "feat: prepare for production deployment on Vercel and Render"

# Add remote repository (replace with your repo URL)
git remote add origin https://github.com/yourusername/finonest.git

# Push to main branch
git branch -M main
git push -u origin main
```

### Step 2: Deploy Frontend on Vercel

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/dashboard

2. **Create New Project**
   - Click "Add New" → "Project"
   - Import GitHub repository (select `finonest`)

3. **Configure Project Settings**
   - Framework Preset: **Vite**
   - Root Directory: **finonest02** (or leave empty if at root)
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Set Environment Variables**
   - Click "Environment Variables"
   - Add: `VITE_API_URL` = `https://finonest-server.onrender.com`
   - Deploy

5. **Wait for Deployment**
   - Initial deployment takes 2-5 minutes
   - Once complete, you'll get a URL like: `https://finonest-xxxxxx.vercel.app`

### Step 3: Deploy Backend on Render

1. **Go to Render Dashboard**
   - Visit https://render.com/dashboard

2. **Create New Web Service**
   - Click "New" → "Web Service"
   - Select your GitHub repository

3. **Configure Service**
   - Name: `finonest-server`
   - Runtime: `Node`
   - Root Directory: `finonest02/server`
   - Build Command: `npm install`
   - Start Command: `npm start` (or `node server.js`)

4. **Set Environment Variables**
   - Click "Environment" section
   - Add the following variables:

   ```
   PORT=5000
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://[username]:[password]@[cluster].mongodb.net/finonest?retryWrites=true&w=majority
   JWT_SECRET=[generate-a-secure-random-string]
   FRONTEND_URL=https://[your-vercel-domain].vercel.app
   ```

   > **Note:** Replace bracketed values with your actual credentials

5. **Deploy**
   - Click "Create Web Service"
   - Render will build and deploy (takes 3-5 minutes)
   - Once complete, you'll get a URL like: `https://finonest-server.onrender.com`

### Step 4: Update MongoDB Atlas IP Whitelist

1. **Go to MongoDB Atlas**
   - Visit https://cloud.mongodb.com

2. **Access Network Access**
   - Go to your project
   - Click "Network Access" in left sidebar
   - Click "Add IP Address"

3. **Add Render Server IP**
   - Option A: Add `0.0.0.0/0` (allow all IPs - simpler for testing)
   - Option B: Find Render's IP and whitelist it specifically

4. **Save and Test**
   - Wait for changes to propagate (1-2 minutes)

---

## 🧪 Post-Deployment Testing

### Test Frontend Access
```bash
# Visit your Vercel frontend URL
https://[your-vercel-domain].vercel.app
```

### Test Authentication Flow
1. **Sign Up**
   - Go to `/signup`
   - Create a test account
   - Should redirect to dashboard on success

2. **Login**
   - Go to `/login`
   - Sign in with test credentials
   - Should redirect to dashboard

3. **Profile**
   - Go to `/profile`
   - Add KYC information
   - Click "Save Profile"
   - Verify data persists after refresh

### Test Product Features
1. **Product Portfolio**
   - Visit `/productportfolio`
   - Verify product counts load from backend
   - Click on a product to see details

2. **Product Filtering**
   - Test bank and product filtering
   - Generate shareable links
   - Copy link to clipboard

3. **Apply for Products**
   - Click "Apply Now" on any product
   - Fill in application form
   - Submit application
   - Should see success message

### Test Backend API Directly
```bash
# Test signup endpoint
curl -X POST https://finonest-server.onrender.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123",
    "confirmPassword": "Password123",
    "fullName": "Test User"
  }'

# Test login endpoint
curl -X POST https://finonest-server.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123"
  }'

# Test protected endpoint (replace TOKEN with actual token from login response)
curl -X GET https://finonest-server.onrender.com/api/auth/me \
  -H "Authorization: Bearer TOKEN"
```

---

## 🔧 Troubleshooting

### Frontend Shows "API Connection Failed"
- **Check 1:** Verify `VITE_API_URL` environment variable is set in Vercel
- **Check 2:** Test if Render backend is running: `https://finonest-server.onrender.com`
- **Check 3:** Check browser console for CORS errors
- **Solution:** Update CORS in `server.js` with correct Vercel frontend URL

### Backend Not Running on Render
- **Check 1:** Go to Render dashboard → Service logs
- **Check 2:** Verify all environment variables are set
- **Check 3:** Check MongoDB connection string is correct
- **Solution:** Restart service from Render dashboard

### MongoDB Connection Fails
- **Check 1:** Verify IP whitelist includes `0.0.0.0/0` or Render's IP
- **Check 2:** Test MongoDB connection string: `mongodb+srv://user:pass@cluster.mongodb.net/finonest`
- **Check 3:** Ensure credentials in `.env` match MongoDB Atlas
- **Solution:** Re-test connection in MongoDB Atlas

### "Cannot GET /api/..." Error
- **Check:** Backend routes are properly configured in `server.js`
- **Solution:** Verify all route imports and middleware setup

### CORS Errors in Browser
- **Check:** Browser console shows "Access to XMLHttpRequest blocked by CORS policy"
- **Solution:** Update CORS in `server.js`:
  ```javascript
  app.use(cors({
    origin: ['https://[your-vercel-domain].vercel.app', 'http://localhost:5173'],
    credentials: true
  }));
  ```

---

## 📊 Environment Variable Reference

### Frontend (.env.production)
```
VITE_API_URL=https://finonest-server.onrender.com
```

### Backend (.env on Render)
```
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/finonest?retryWrites=true&w=majority
JWT_SECRET=your-super-secure-random-string-here
FRONTEND_URL=https://your-vercel-domain.vercel.app
```

### Local Development (.env in server/)
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://your-credentials@cluster.mongodb.net/finonest?retryWrites=true&w=majority
JWT_SECRET=dev-secret-key
FRONTEND_URL=http://localhost:5173
```

---

## 🚀 Production URLs (After Deployment)

Once deployed, your application will be available at:

**Frontend:** `https://[your-vercel-domain].vercel.app`

**Backend API:** `https://finonest-server.onrender.com`

**Database:** MongoDB Atlas (credentials in environment variables)

---

## 📝 Important Notes

1. **JWT_SECRET:** Generate a strong random string for production
   ```powershell
   # PowerShell command to generate random string
   -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
   ```

2. **Keep Secrets Safe:** Never commit `.env` files to GitHub
   - Add to `.gitignore` if not already present

3. **Monitor Logs:** 
   - Vercel: Dashboard → Project → Deployments → Logs
   - Render: Dashboard → Service → Logs

4. **Auto-Deployments:** Both Vercel and Render auto-deploy when you push to GitHub main branch

5. **Scaling:** As user load increases:
   - Vercel auto-scales (no configuration needed)
   - Render: Upgrade to paid plan for auto-scaling

---

## ✅ Deployment Completion Checklist

- [ ] Code pushed to GitHub
- [ ] Frontend deployed on Vercel
- [ ] Backend deployed on Render
- [ ] MongoDB IP whitelist updated
- [ ] All environment variables configured
- [ ] Frontend can communicate with backend
- [ ] User signup/login works
- [ ] Profile data saves and loads
- [ ] Product filtering works
- [ ] Apply for products works
- [ ] All features tested in production

---

**Last Updated:** [Current Date]
**Status:** Ready for Deployment
