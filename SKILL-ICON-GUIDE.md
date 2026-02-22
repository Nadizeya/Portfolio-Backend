# 🎨 Skill Icon Upload & Session Management Guide

## 🔐 Preventing Session Expiry During Uploads

### Problem

When creating skills with icon uploads, the process might take time, causing your JWT token to expire and resulting in auto-logout.

### Solution: Token Refresh

Before starting a long operation (like uploading icons), refresh your token:

```javascript
// Check token expiry and refresh if needed
const refreshToken = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/auth/refresh", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${currentToken}`,
      },
    });

    const data = await response.json();

    if (data.status === "success") {
      // Update your stored token
      localStorage.setItem("token", data.data.token);
      return data.data.token;
    }
  } catch (error) {
    console.error("Token refresh failed:", error);
    // Redirect to login
  }
};

// Use before uploads
const createSkillWithIcon = async (skillData, iconFile) => {
  // Refresh token first
  const freshToken = await refreshToken();

  // Now proceed with upload
  const formData = new FormData();
  formData.append("name", skillData.name);
  formData.append("level", skillData.level);
  formData.append("category", skillData.category);
  formData.append("icon", iconFile);

  const response = await fetch("http://localhost:3000/api/skills/with-icon", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${freshToken}`,
    },
    body: formData,
  });

  return await response.json();
};
```

### Auto-refresh Implementation

For a seamless experience, implement automatic token refresh:

```javascript
// Check token expiry every 5 minutes
setInterval(
  async () => {
    const token = localStorage.getItem("token");
    if (token) {
      await refreshToken();
    }
  },
  5 * 60 * 1000,
); // 5 minutes

// Or refresh before each authenticated request
const authenticatedFetch = async (url, options = {}) => {
  const freshToken = await refreshToken();

  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${freshToken}`,
    },
  });
};
```

## 📤 Three Ways to Upload Skill Icons

### Method 1: Create Skill with Icon in One Request (Recommended)

```bash
curl -X POST http://localhost:3000/api/skills/with-icon \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "name=React" \
  -F "level=95" \
  -F "category=Frontend" \
  -F "icon=@/path/to/react-icon.png" \
  -F "is_published=true"
```

**JavaScript Example:**

```javascript
const createSkill = async (skillData, iconFile) => {
  const formData = new FormData();
  formData.append("name", skillData.name);
  formData.append("level", skillData.level.toString());
  formData.append("category", skillData.category);
  formData.append("order_index", skillData.order_index?.toString() || "0");
  formData.append("is_published", skillData.is_published?.toString() || "true");

  if (iconFile) {
    formData.append("icon", iconFile);
  }

  const response = await fetch("http://localhost:3000/api/skills/with-icon", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  return await response.json();
};

// Usage
const iconFile = document.querySelector("#iconInput").files[0];
const skill = await createSkill(
  {
    name: "React",
    level: 95,
    category: "Frontend",
  },
  iconFile,
);
```

### Method 2: Upload Icon First, Then Create Skill

```bash
# Step 1: Upload icon
curl -X POST http://localhost:3000/api/upload/skill-icon \
  -F "icon=@/path/to/icon.png"

# Response: { "data": { "url": "https://cloudinary.../icon.png" } }

# Step 2: Create skill with icon URL
curl -X POST http://localhost:3000/api/skills \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "React",
    "level": 95,
    "category": "Frontend",
    "icon": "https://cloudinary.../icon.png"
  }'
```

**JavaScript Example:**

```javascript
// Step 1: Upload icon
const uploadIcon = async (iconFile) => {
  const formData = new FormData();
  formData.append("icon", iconFile);

  const response = await fetch("http://localhost:3000/api/upload/skill-icon", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  return data.data.url;
};

// Step 2: Create skill
const createSkill = async (skillData) => {
  const response = await fetch("http://localhost:3000/api/skills", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(skillData),
  });

  return await response.json();
};

// Usage
const iconUrl = await uploadIcon(iconFile);
const skill = await createSkill({
  name: "React",
  level: 95,
  category: "Frontend",
  icon: iconUrl,
});
```

### Method 3: Create Skill Without Icon, Update Later

```javascript
// Step 1: Create skill without icon
const skill = await fetch("http://localhost:3000/api/skills", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: "React",
    level: 95,
    category: "Frontend",
  }),
}).then((r) => r.json());

// Step 2: Update with icon
const formData = new FormData();
formData.append("icon", iconFile);

const updated = await fetch(
  `http://localhost:3000/api/skills/${skill.data.id}/with-icon`,
  {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  },
).then((r) => r.json());
```

## 🎨 Icon Specifications

- **Size**: Automatically resized to 128x128 pixels
- **Formats**: JPEG, JPG, PNG, GIF, WebP
- **Max File Size**: 5MB
- **Storage**: Cloudinary in `portfolio/skill-icons` folder
- **Optimization**: Automatic quality and format optimization

## 📱 React Component Example

```jsx
import { useState } from "react";

const CreateSkillForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    level: 50,
    category: "Frontend",
  });
  const [iconFile, setIconFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Refresh token before upload
      const tokenResponse = await fetch("/api/auth/refresh", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const { data: tokenData } = await tokenResponse.json();
      localStorage.setItem("token", tokenData.token);

      // Create skill with icon
      const formDataObj = new FormData();
      formDataObj.append("name", formData.name);
      formDataObj.append("level", formData.level.toString());
      formDataObj.append("category", formData.category);
      if (iconFile) {
        formDataObj.append("icon", iconFile);
      }

      const response = await fetch("/api/skills/with-icon", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenData.token}`,
        },
        body: formDataObj,
      });

      const result = await response.json();

      if (result.status === "success") {
        alert("Skill created successfully!");
        // Reset form
        setFormData({ name: "", level: 50, category: "Frontend" });
        setIconFile(null);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to create skill");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Skill name"
        required
      />

      <input
        type="number"
        value={formData.level}
        onChange={(e) =>
          setFormData({ ...formData, level: parseInt(e.target.value) })
        }
        min="0"
        max="100"
        required
      />

      <select
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
      >
        <option value="Frontend">Frontend</option>
        <option value="Backend">Backend</option>
        <option value="Tools">Tools</option>
        <option value="AI">AI</option>
      </select>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setIconFile(e.target.files[0])}
      />

      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Skill"}
      </button>
    </form>
  );
};

export default CreateSkillForm;
```

## 🔍 Troubleshooting

### Token Expired Error

**Solution:** Call `/api/auth/refresh` before the operation or implement auto-refresh.

### 401 Unauthorized

**Solution:** Your token may be expired beyond the 7-day grace period. Login again.

### File Upload Failed

**Solution:**

- Check file size (max 5MB)
- Verify file format (jpeg, jpg, png, gif, webp)
- Ensure `Content-Type` is `multipart/form-data`

### Icon Not Showing

**Solution:**

- Verify the icon URL was saved correctly
- Check Cloudinary credentials in `.env`
- Test Cloudinary connection: `GET /api/test/cloudinary`

## 📚 Related Documentation

- [API Documentation](./API-DOCUMENTATION.md) - Full API reference
- [Auth Quick Reference](./AUTH-QUICK-REF.md) - Authentication details
- [Testing Guide](./TESTING-GUIDE.md) - API testing examples
