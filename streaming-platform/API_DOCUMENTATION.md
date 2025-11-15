# API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Auth Endpoints

### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "displayName": "John Doe"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "username": "johndoe",
      "email": "john@example.com",
      "displayName": "John Doe"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### POST /auth/login
Login to existing account.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "username": "johndoe",
      "email": "john@example.com",
      "displayName": "John Doe",
      "avatar": "/uploads/avatars/johndoe.jpg"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### POST /auth/forgot-password
Request password reset email.

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

---

### POST /auth/reset-password
Reset password using token.

**Request Body:**
```json
{
  "token": "a1b2c3d4e5f6...",
  "password": "NewSecurePass123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset successful"
}
```

---

### GET /auth/me
Get current user information. **[Protected]**

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com",
    "displayName": "John Doe",
    "avatar": "/uploads/avatars/johndoe.jpg",
    "subscribers": 1250,
    "verified": false
  }
}
```

---

## Video Endpoints

### GET /videos
Get videos with filtering and pagination.

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20)
- `sort` (options: 'recent', 'popular', 'trending')
- `category` (optional)
- `search` (optional)

**Example:**
```
GET /videos?page=1&limit=10&sort=popular&category=gaming
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "videos": [
      {
        "id": "507f1f77bcf86cd799439011",
        "title": "Amazing Gaming Montage",
        "description": "Check out this epic montage...",
        "thumbnailUrl": "/uploads/thumbnails/video1.jpg",
        "duration": 600,
        "views": 125000,
        "likes": 5200,
        "uploadedAt": "2024-01-15T10:30:00Z",
        "user": {
          "id": "507f1f77bcf86cd799439012",
          "username": "gamer123",
          "displayName": "Pro Gamer",
          "avatar": "/uploads/avatars/gamer123.jpg"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1250,
      "pages": 125
    }
  }
}
```

---

### GET /videos/trending
Get trending videos.

**Query Parameters:**
- `limit` (default: 20)
- `period` (options: 'day', 'week', 'month')

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "title": "Trending Video Title",
      "thumbnailUrl": "/uploads/thumbnails/video1.jpg",
      "views": 500000,
      "likes": 25000,
      "trendingScore": 95.5
    }
  ]
}
```

---

### GET /videos/:id
Get single video details.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "title": "Amazing Video Title",
    "description": "Full description here...",
    "videoUrl": "/uploads/videos/video1.mp4",
    "thumbnailUrl": "/uploads/thumbnails/video1.jpg",
    "duration": 600,
    "views": 125000,
    "likes": 5200,
    "dislikes": 150,
    "comments": 320,
    "category": "gaming",
    "tags": ["gaming", "montage", "fps"],
    "uploadedAt": "2024-01-15T10:30:00Z",
    "user": {
      "id": "507f1f77bcf86cd799439012",
      "username": "gamer123",
      "displayName": "Pro Gamer",
      "avatar": "/uploads/avatars/gamer123.jpg",
      "subscribers": 50000,
      "verified": true
    }
  }
}
```

---

### POST /videos
Upload a new video. **[Protected]**

**Request:**
- Content-Type: multipart/form-data
- Fields:
  - `video` (file)
  - `thumbnail` (file)
  - `title` (string)
  - `description` (string)
  - `category` (string)
  - `tags` (JSON array)

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "title": "My New Video",
    "status": "processing",
    "message": "Video uploaded successfully and is being processed"
  }
}
```

---

### PUT /videos/:id
Update video information. **[Protected]**

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "category": "entertainment",
  "tags": ["fun", "entertainment"]
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "title": "Updated Title",
    "updatedAt": "2024-01-16T15:45:00Z"
  }
}
```

---

### DELETE /videos/:id
Delete a video. **[Protected]**

**Response (200):**
```json
{
  "success": true,
  "message": "Video deleted successfully"
}
```

---

### POST /videos/:id/view
Record a video view.

**Request Body:**
```json
{
  "watchTime": 450,
  "device": "desktop",
  "referrer": "search"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "View recorded"
}
```

---

### GET /videos/:id/related
Get related/suggested videos.

**Query Parameters:**
- `limit` (default: 10)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439012",
      "title": "Similar Video",
      "thumbnailUrl": "/uploads/thumbnails/video2.jpg",
      "duration": 540,
      "views": 85000,
      "user": {
        "displayName": "Another Creator",
        "avatar": "/uploads/avatars/user2.jpg"
      }
    }
  ]
}
```

---

## Like Endpoints

### POST /videos/:id/like
Like a video. **[Protected]**

**Response (200):**
```json
{
  "success": true,
  "data": {
    "liked": true,
    "totalLikes": 5201
  }
}
```

---

### DELETE /videos/:id/like
Remove like from video. **[Protected]**

**Response (200):**
```json
{
  "success": true,
  "data": {
    "liked": false,
    "totalLikes": 5200
  }
}
```

---

### GET /videos/:id/like-status
Check if user liked video. **[Protected]**

**Response (200):**
```json
{
  "success": true,
  "data": {
    "liked": true
  }
}
```

---

## Comment Endpoints

### GET /videos/:id/comments
Get comments for a video.

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20)
- `sort` (options: 'recent', 'popular')

**Response (200):**
```json
{
  "success": true,
  "data": {
    "comments": [
      {
        "id": "507f1f77bcf86cd799439013",
        "text": "Great video!",
        "likes": 15,
        "replies": 3,
        "createdAt": "2024-01-15T12:00:00Z",
        "user": {
          "id": "507f1f77bcf86cd799439014",
          "username": "viewer1",
          "displayName": "John Viewer",
          "avatar": "/uploads/avatars/viewer1.jpg"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "total": 320
    }
  }
}
```

---

### POST /videos/:id/comments
Add a comment to video. **[Protected]**

**Request Body:**
```json
{
  "text": "This is an amazing video!",
  "parentId": null
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439013",
    "text": "This is an amazing video!",
    "likes": 0,
    "replies": 0,
    "createdAt": "2024-01-16T16:30:00Z"
  }
}
```

---

### PUT /comments/:id
Update a comment. **[Protected]**

**Request Body:**
```json
{
  "text": "Updated comment text"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439013",
    "text": "Updated comment text",
    "edited": true
  }
}
```

---

### DELETE /comments/:id
Delete a comment. **[Protected]**

**Response (200):**
```json
{
  "success": true,
  "message": "Comment deleted successfully"
}
```

---

## User Endpoints

### GET /users/:username
Get user profile information.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439012",
    "username": "johndoe",
    "displayName": "John Doe",
    "avatar": "/uploads/avatars/johndoe.jpg",
    "banner": "/uploads/banners/johndoe.jpg",
    "bio": "Content creator and gamer",
    "subscribers": 50000,
    "totalViews": 2500000,
    "totalVideos": 150,
    "verified": true,
    "createdAt": "2023-01-01T00:00:00Z"
  }
}
```

---

### GET /users/:username/videos
Get videos uploaded by user.

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20)
- `sort` (options: 'recent', 'popular')

**Response (200):**
```json
{
  "success": true,
  "data": {
    "videos": [...],
    "pagination": {...}
  }
}
```

---

### PUT /users/profile
Update user profile. **[Protected]**

**Request Body:**
```json
{
  "displayName": "New Display Name",
  "bio": "Updated bio",
  "socialLinks": {
    "twitter": "https://twitter.com/username",
    "instagram": "https://instagram.com/username"
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "displayName": "New Display Name",
    "bio": "Updated bio"
  }
}
```

---

### POST /users/avatar
Update user avatar. **[Protected]**

**Request:**
- Content-Type: multipart/form-data
- Field: `avatar` (file)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "avatar": "/uploads/avatars/johndoe.jpg"
  }
}
```

---

## Subscription Endpoints

### POST /users/:id/subscribe
Subscribe to a channel. **[Protected]**

**Request Body:**
```json
{
  "notifications": true
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "subscribed": true,
    "subscriberCount": 50001
  }
}
```

---

### DELETE /users/:id/subscribe
Unsubscribe from a channel. **[Protected]**

**Response (200):**
```json
{
  "success": true,
  "data": {
    "subscribed": false,
    "subscriberCount": 50000
  }
}
```

---

### GET /users/subscriptions
Get user's subscriptions. **[Protected]**

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439015",
      "username": "channel1",
      "displayName": "Channel One",
      "avatar": "/uploads/avatars/channel1.jpg",
      "subscribers": 100000,
      "notifications": true
    }
  ]
}
```

---

### GET /subscriptions/feed
Get video feed from subscribed channels. **[Protected]**

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "videos": [...],
    "pagination": {...}
  }
}
```

---

## Playlist Endpoints

### GET /playlists/history
Get watch history. **[Protected]**

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "videos": [
      {
        "id": "507f1f77bcf86cd799439011",
        "title": "Video Title",
        "thumbnailUrl": "/uploads/thumbnails/video1.jpg",
        "watchedAt": "2024-01-16T10:00:00Z",
        "watchTime": 450
      }
    ]
  }
}
```

---

### GET /playlists/watch-later
Get watch later playlist. **[Protected]**

**Response (200):**
```json
{
  "success": true,
  "data": {
    "videos": [...]
  }
}
```

---

### POST /playlists/watch-later/:videoId
Add video to watch later. **[Protected]**

**Response (200):**
```json
{
  "success": true,
  "message": "Video added to watch later"
}
```

---

### DELETE /playlists/watch-later/:videoId
Remove video from watch later. **[Protected]**

**Response (200):**
```json
{
  "success": true,
  "message": "Video removed from watch later"
}
```

---

## Analytics Endpoints

### GET /analytics/dashboard
Get user dashboard analytics. **[Protected]**

**Query Parameters:**
- `period` (options: 'week', 'month', 'year')

**Response (200):**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalViews": 125000,
      "totalLikes": 5200,
      "totalComments": 850,
      "totalSubscribers": 1250,
      "totalWatchTime": 450000
    },
    "viewsOverTime": [
      {
        "date": "2024-01-10",
        "views": 5000
      }
    ],
    "topVideos": [
      {
        "id": "507f1f77bcf86cd799439011",
        "title": "Top Video",
        "views": 50000,
        "likes": 2500
      }
    ],
    "demographics": {
      "devices": {
        "desktop": 60,
        "mobile": 35,
        "tablet": 5
      }
    }
  }
}
```

---

### GET /analytics/videos/:id
Get analytics for specific video. **[Protected]**

**Query Parameters:**
- `period` (options: 'week', 'month', 'year')

**Response (200):**
```json
{
  "success": true,
  "data": {
    "views": 125000,
    "uniqueViews": 98000,
    "averageWatchTime": 450,
    "engagementRate": 4.2,
    "viewsOverTime": [...],
    "trafficSources": {
      "search": 45,
      "suggested": 35,
      "direct": 15,
      "external": 5
    }
  }
}
```

---

## Notification Endpoints

### GET /notifications
Get user notifications. **[Protected]**

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20)
- `unreadOnly` (boolean)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "507f1f77bcf86cd799439016",
        "type": "upload",
        "title": "New video from Channel One",
        "message": "Channel One uploaded: New Video Title",
        "read": false,
        "referenceId": "507f1f77bcf86cd799439011",
        "referenceType": "video",
        "createdAt": "2024-01-16T09:00:00Z"
      }
    ],
    "unreadCount": 5
  }
}
```

---

### PUT /notifications/:id/read
Mark notification as read. **[Protected]**

**Response (200):**
```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

---

### PUT /notifications/read-all
Mark all notifications as read. **[Protected]**

**Response (200):**
```json
{
  "success": true,
  "message": "All notifications marked as read"
}
```

---

## Search Endpoints

### GET /search
Search for videos, channels, or playlists.

**Query Parameters:**
- `q` (required): Search query
- `type` (options: 'video', 'channel', 'all', default: 'all')
- `page` (default: 1)
- `limit` (default: 20)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "videos": [...],
    "channels": [...],
    "pagination": {...}
  }
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {} // Optional additional details
  }
}
```

**Common Error Codes:**
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

---

## Rate Limiting

API endpoints are rate limited:
- Anonymous users: 100 requests/hour
- Authenticated users: 1000 requests/hour
- Upload endpoints: 10 uploads/day

Rate limit headers:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1642339200
```
