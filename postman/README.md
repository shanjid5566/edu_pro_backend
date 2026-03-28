# Postman Collections - EduPro Authentication Testing

This folder contains separate Postman collection files for testing the authentication APIs for each dashboard role.

## Collections Available

1. **Admin-Dashboard.postman_collection.json** - Admin login and dashboard endpoints
2. **Teacher-Dashboard.postman_collection.json** - Teacher login and dashboard endpoints
3. **Student-Dashboard.postman_collection.json** - Student login and dashboard endpoints
4. **Parent-Dashboard.postman_collection.json** - Parent login and dashboard endpoints

## How to Import Collections in Postman

### Method 1: Direct Import
1. Open Postman
2. Click **File** → **Import**
3. Select the collection JSON file (e.g., `Admin-Dashboard.postman_collection.json`)
4. Click **Import**

### Method 2: Using Postman Link
1. Open Postman
2. Click **Collections** on the left sidebar
3. Click **+** button
4. Select "Import from file"
5. Choose the JSON file

## Environment Setup

Each collection includes built-in variables:

- `base_url` - Default: `http://localhost:5000`
- `{role}_token` - Automatically saved after login (admin_token, teacher_token, etc.)
- `{role}_user_id` - Automatically saved after login

### To Set Up Environment Variables

1. After importing a collection, click **Variables** tab
2. Update `base_url` if your server runs on a different port/URL
3. Variables like `{role}_token` are auto-populated when you run the login endpoint

## Using the Collections

### Step 1: Login Request
Each collection has a login endpoint for the respective role:
- **Admin Dashboard** → Admin Login
- **Teacher Dashboard** → Teacher Login
- **Student Dashboard** → Student Login
- **Parent Dashboard** → Parent Login

**Test Credentials:**

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@edupro.com | admin@123 |
| Teacher | teacher@edupro.com | teacher@123 |
| Student | student@edupro.com | student@123 |
| Parent | parent@edupro.com | parent@123 |

1. Click the login request
2. Click **Send**
3. View the response - should show success with token and user data
4. ✅ Token is automatically saved to environment variable

### Step 2: Use Token in Protected Endpoints
The "Get My Profile" endpoint uses the saved token automatically:
1. Click the "Get My Profile" request
2. Click **Send**
3. Token from login is automatically included in Authorization header

## Request Details

### Admin Login
```http
POST {{base_url}}/api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@edupro.com",
  "password": "admin@123"
}
```

### Teacher Login
```http
POST {{base_url}}/api/v1/auth/login
Content-Type: application/json

{
  "email": "teacher@edupro.com",
  "password": "teacher@123"
}
```

### Student Login
```http
POST {{base_url}}/api/v1/auth/login
Content-Type: application/json

{
  "email": "student@edupro.com",
  "password": "student@123"
}
```

### Parent Login
```http
POST {{base_url}}/api/v1/auth/login
Content-Type: application/json

{
  "email": "parent@edupro.com",
  "password": "parent@123"
}
```

### Get Profile (Protected)
```http
GET {{base_url}}/api/v1/auth/profile
Authorization: Bearer {{role_token}}
Content-Type: application/json
```

### Register New User
Each collection has a register endpoint to create new users with the respective role.

```http
POST {{base_url}}/api/v1/auth/register
Content-Type: application/json

{
  "email": "newemail@edupro.com",
  "password": "securePassword@123",
  "name": "User Name",
  "role": "ADMIN/TEACHER/STUDENT/PARENT",
  "phone": "+1-800-000-0000"
}
```

## Response Examples

### Successful Login Response
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid-here",
      "email": "admin@edupro.com",
      "name": "Admin User",
      "role": "ADMIN"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Successful Profile Response
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "email": "admin@edupro.com",
    "name": "Admin User",
    "role": "ADMIN",
    "avatar": null,
    "phone": "+1-800-000-0001",
    "status": "active",
    "createdAt": "2026-03-28T10:00:00Z"
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

## Tips

1. **Auto-save Token**: The login requests have scripts that automatically save the token to the environment after successful login
2. **Run Collections**: You can run an entire collection in sequence using the Collection Runner
3. **Use Monitor**: Create a Postman Monitor to run these tests automatically
4. **Share Collections**: Export and share these collections with your team

## Troubleshooting

### "No token provided" Error
- Make sure you ran the login request first
- Check that the Authorization header is using the correct variable name
- Verify the token variable is populated in the environment

### "Invalid token" Error
- Token might have expired (default: 7 days)
- Run the login request again to get a new token
- Check if JWT_SECRET is correctly set in your .env file

### Connection Refused
- Ensure backend server is running: `npm run dev`
- Check if `base_url` is set correctly
- Verify the port number matches your server configuration

## Need More Help?

Refer to [AUTH_API.md](../AUTH_API.md) for complete API documentation.
