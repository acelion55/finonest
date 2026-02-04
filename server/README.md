# Finonest Backend Server

A Node.js Express server with MongoDB Atlas integration for the Finonest application. This server provides REST APIs for managing credit card products.

## 🚀 Quick Start

### Windows
```bash
cd server
./START.bat
```

### Mac/Linux
```bash
cd server
chmod +x start.sh
./start.sh
```

### Manual Setup
```bash
cd server
npm install
npm run dev
```

## 📋 Requirements

- Node.js v18+
- MongoDB Atlas account (free tier available)
- npm or yarn

## 🔧 Configuration

### 1. MongoDB Atlas Setup
1. Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free M0 cluster
3. Create database user
4. Whitelist your IP address
5. Get connection string (Driver: Node.js)

### 2. Environment Variables
Create a `.env` file in the server directory:

```env
MONGODB_URI=mongodb+srv://username:password@cluster-name.mongodb.net/finonest?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Seed Database
```bash
node seed.js
```

This populates the database with 4 sample credit cards.

## 📚 API Endpoints

### Credit Cards

#### Get All Cards
```
GET /api/creditcards/all
```
Returns all active credit cards from the database.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f...",
      "id": 1,
      "bank": "IDFC First Bank",
      "bankLogo": "/idfc-logo.png",
      "name": "Classic Credit Card",
      "image": "/classic-card.png",
      "features": ["Lifetime Free", "Rewards: 10x points"],
      "color": "bg-blue-600",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Get Card by ID
```
GET /api/creditcards/:id
```

**Example:** `GET /api/creditcards/1`

**Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

#### Create Credit Card
```
POST /api/creditcards/create
Content-Type: application/json
```

**Request Body:**
```json
{
  "id": 5,
  "bank": "New Bank",
  "bankLogo": "/new-logo.png",
  "name": "Premium Card",
  "image": "/premium-card.png",
  "features": ["Feature 1", "Feature 2", "Feature 3"],
  "color": "bg-purple-600",
  "description": "Optional description"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Credit card created successfully",
  "data": { ... }
}
```

#### Update Credit Card
```
PUT /api/creditcards/:id
Content-Type: application/json
```

**Example:** `PUT /api/creditcards/1`

**Request Body:** (Any fields to update)
```json
{
  "name": "Updated Card Name",
  "color": "bg-green-600"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Credit card updated successfully",
  "data": { ... }
}
```

#### Delete Credit Card
```
DELETE /api/creditcards/:id
```

**Example:** `DELETE /api/creditcards/1`

**Response:**
```json
{
  "success": true,
  "message": "Credit card deleted successfully"
}
```

### Health Check
```
GET /api/health
```

**Response:**
```json
{
  "status": "Server is running"
}
```

## 📂 Project Structure

```
server/
├── server.js                 # Main server entry point
├── package.json              # Dependencies and scripts
├── seed.js                   # Database seeding script
├── .env                      # Environment variables (create this)
├── .env.example              # Example environment variables
├── START.bat                 # Quick start for Windows
├── start.sh                  # Quick start for Unix
├── config/
│   └── database.js           # MongoDB connection configuration
├── models/
│   └── CreditCard.js         # Credit card Mongoose schema
├── routes/
│   └── creditCardRoutes.js   # API endpoint routes
└── SETUP_GUIDE.md            # Detailed setup guide
```

## 🗄️ Database Schema

### Credit Card Model
```javascript
{
  id: Number (unique, required),
  bank: String (required),
  bankLogo: String (required),
  name: String (required),
  image: String (required),
  features: [String] (required),
  color: String (required),
  description: String (optional),
  isActive: Boolean (default: true),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

## 🚀 Available Scripts

### Development
```bash
npm run dev
```
Runs the server with auto-reload (using Node's --watch flag)

### Production
```bash
npm start
```
Runs the server normally

### Seed Database
```bash
node seed.js
```
Populates database with sample data

## 🔌 Connecting Frontend

The frontend (Next.js app) expects the API at `http://localhost:5000`

**Update API URL** if hosting on different port:
1. Edit `src/app/productportfolio/creditcard/page.jsx`
2. Change `http://localhost:5000` to your server URL

## 🐛 Troubleshooting

### Server won't start
- Check Node.js is installed: `node --version`
- Ensure `.env` file exists with valid `MONGODB_URI`
- Check if port 5000 is available

### MongoDB Connection Error
- Verify `MONGODB_URI` is correct
- Check IP whitelist in MongoDB Atlas
- Confirm database user credentials
- Ensure network connection is stable

### CORS Errors
- CORS is already enabled in `server.js`
- Verify frontend URL matches Origin header
- Check browser console for exact error message

### Port Already in Use
- Change `PORT` in `.env` file
- Or kill process: `lsof -i :5000` (Mac/Linux) or `netstat -ano | findstr :5000` (Windows)

## 📦 Dependencies

- **express** (4.18.2) - Web framework
- **mongoose** (8.0.0) - MongoDB ODM
- **dotenv** (16.3.1) - Environment variables
- **cors** (2.8.5) - Cross-origin requests
- **nodemon** (dev) - Auto-reload during development

## 🛡️ Security Notes

- Never commit `.env` file to version control
- Use environment variables for sensitive data
- MongoDB Atlas has IP whitelist - add all servers that need access
- Validate and sanitize all inputs
- Consider adding authentication middleware for API endpoints

## 🚢 Deployment

### Deploy to Heroku
```bash
heroku create finonest-server
git push heroku main
heroku config:set MONGODB_URI=<your-mongodb-uri>
```

### Deploy to Railway
1. Connect your GitHub repository
2. Set environment variables in Railway dashboard
3. Deploy automatically on push

### Deploy to Render
1. Create new Web Service
2. Connect repository
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables

## 📝 Sample Data

The database is seeded with 4 credit cards:
1. **Classic Credit Card** - IDFC First Bank
2. **HPCL Credit Card** - IDFC First Bank  
3. **SWYPP Credit Card** - IDFC First Bank
4. **Uni GoldX Credit Card** - BOB Financial

## 📖 Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [REST API Best Practices](https://restfulapi.net/)

## 📄 License

This project is part of the Finonest application.

## 🤝 Support

For issues or questions:
1. Check SETUP_GUIDE.md for detailed instructions
2. Review API endpoint examples
3. Check server logs for error messages
4. Verify MongoDB Atlas configuration
