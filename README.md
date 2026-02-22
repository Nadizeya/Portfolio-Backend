# 🎨 Portfolio Backend API

A comprehensive RESTful API backend for a portfolio website built with Express, TypeScript, Supabase, and Cloudinary.

## 🚀 Features

- ✅ **Full CRUD Operations** for Skills, Experiences, Projects, and Contact Messages
- ✅ **Image Upload** to Cloudinary with validation
- ✅ **Type-Safe** with TypeScript
- ✅ **Schema Validation** with Zod
- ✅ **Database** powered by Supabase (PostgreSQL)
- ✅ **Row Level Security** policies
- ✅ **Error Handling** middleware
- ✅ **Request Logging** middleware
- ✅ **Hot Reload** development with ts-node-dev

## 📁 Project Structure

```
portfolio-backend/
├── src/
│   ├── config/
│   │   ├── cloudinary.ts      # Cloudinary configuration
│   │   ├── env.ts              # Environment validation with Zod
│   │   └── supabase.ts         # Supabase client
│   ├── middleware/
│   │   ├── errorHandler.ts    # Error handling & AppError class
│   │   ├── logger.ts           # Request logging
│   │   ├── upload.ts           # Multer configuration
│   │   └── index.ts            # Middleware exports
│   ├── routes/
│   │   ├── skills.routes.ts       # Skills CRUD
│   │   ├── experiences.routes.ts  # Experiences CRUD
│   │   ├── projects.routes.ts     # Projects CRUD
│   │   ├── contact.routes.ts      # Contact messages CRUD
│   │   ├── upload.routes.ts       # Image upload
│   │   ├── health.routes.ts       # Health check
│   │   ├── test.routes.ts         # Connection tests
│   │   └── index.ts               # Main router
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces
│   ├── validations/
│   │   └── index.ts            # Zod schemas
│   ├── app.ts                  # Express app setup
│   └── index.ts                # Server entry point
├── supabase-schema.sql         # Database schema with seed data
├── API-DOCUMENTATION.md        # Complete API docs
├── TEST-COMMANDS.md           # PowerShell test commands
├── test-upload.html           # Image upload testing page
├── .env                       # Environment variables
├── .gitignore
├── package.json
└── tsconfig.json
```

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js v5
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **File Upload**: Cloudinary
- **Validation**: Zod
- **File Handling**: Multer
- **Dev Tools**: ts-node-dev

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd portfolio-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env`
   - Add your Supabase credentials
   - Add your Cloudinary credentials

4. **Set up Supabase database**
   - Go to your Supabase dashboard
   - Open SQL Editor
   - Copy and paste content from `supabase-schema.sql`
   - Run the script

5. **Start development server**
   ```bash
   npm run dev
   ```

## 🔧 Environment Variables

```env
NODE_ENV=development
PORT=3000

SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 📚 API Endpoints

### Core Resources
- **Skills**: `GET|POST /api/skills`, `GET|PUT|DELETE /api/skills/:id`
- **Experiences**: `GET|POST /api/experiences`, `GET|PUT|DELETE /api/experiences/:id`
- **Projects**: `GET|POST /api/projects`, `GET|PUT|DELETE /api/projects/:id`
- **Contact**: `GET|POST /api/contact`, `GET|DELETE /api/contact/:id`

### Utilities
- **Health Check**: `GET /api/health`
- **Test Supabase**: `GET /api/test/supabase`
- **Test Cloudinary**: `GET /api/test/cloudinary`
- **Upload Image**: `POST /api/upload`
- **Upload Multiple**: `POST /api/upload/multiple`

See [API-DOCUMENTATION.md](API-DOCUMENTATION.md) for complete details.

## 🧪 Testing

### Using the Test HTML Page
Open `test-upload.html` in your browser to test image uploads with a GUI.

### Using PowerShell Commands
See [TEST-COMMANDS.md](TEST-COMMANDS.md) for ready-to-use PowerShell test commands.

### Quick Test
```powershell
# Health check
Invoke-RestMethod -Uri http://localhost:3000/api/health

# Get all skills
Invoke-RestMethod -Uri http://localhost:3000/api/skills

# Get all projects
Invoke-RestMethod -Uri http://localhost:3000/api/projects
```

## 🗄️ Database Schema

The database includes 4 main tables:
- `skills` - Technical skills with proficiency levels
- `experiences` - Work experience history
- `projects` - Portfolio projects
- `contact_messages` - Contact form submissions

All tables include:
- Auto-generated UUIDs
- Timestamps (created_at, updated_at)
- Publishing controls (is_published)
- Ordering capabilities (order_index)

## 🎯 Key Features

### Validation
All endpoints validate input using Zod schemas with detailed error messages.

### Error Handling
Custom `AppError` class with consistent error responses:
```json
{
  "status": "error",
  "message": "Description of the error"
}
```

### Image Upload
- Supports: jpeg, jpg, png, gif, webp
- Max size: 5MB per image
- Multiple upload: Up to 10 images
- Stored in Cloudinary with optimizations

### Toggle Endpoints
Quick publish/unpublish and featured/unfeatured controls:
- `PATCH /api/skills/:id/toggle-publish`
- `PATCH /api/experiences/:id/toggle-publish`
- `PATCH /api/projects/:id/toggle-publish`
- `PATCH /api/projects/:id/toggle-featured`
- `PATCH /api/contact/:id/mark-read`
- `PATCH /api/contact/:id/mark-unread`

## 🔒 Security

- Row Level Security (RLS) enabled on all tables
- Public read access for published content
- Environment variables for sensitive data
- Input validation on all endpoints
- File upload restrictions

## 📝 Scripts

```json
{
  "dev": "Start development server with hot reload",
  "build": "Compile TypeScript to JavaScript",
  "start": "Run production server"
}
```

## 🚀 Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Set environment variables on your hosting platform

3. Run production server:
   ```bash
   npm start
   ```

## 📄 License

ISC

## 👨‍💻 Developer

Built for creating a professional portfolio with admin dashboard capabilities.

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

---

**Happy Coding! 🎉**
