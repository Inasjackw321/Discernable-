# Database Schema

## Overview

This document defines the MongoDB schema for the StreamVibe platform. All timestamps use ISO 8601 format.

## Collections

### 1. Users

Stores user account information and authentication data.

```javascript
{
  _id: ObjectId,
  username: String,           // Unique username (3-20 chars)
  email: String,              // Unique email
  password: String,           // Bcrypt hashed password
  displayName: String,        // Display name for channel
  avatar: String,             // URL to avatar image
  banner: String,             // URL to channel banner
  bio: String,                // User biography (max 500 chars)

  // Statistics
  subscribers: Number,        // Total subscriber count
  totalViews: Number,         // Total views across all videos
  totalVideos: Number,        // Total uploaded videos

  // Settings
  verified: Boolean,          // Verified account badge
  emailVerified: Boolean,     // Email verification status

  // Social
  socialLinks: {
    twitter: String,
    instagram: String,
    website: String
  },

  // Metadata
  createdAt: Date,
  updatedAt: Date,
  lastLoginAt: Date
}
```

**Indexes:**
- `username`: unique
- `email`: unique
- `createdAt`: -1

---

### 2. Videos

Stores video metadata and statistics.

```javascript
{
  _id: ObjectId,
  userId: ObjectId,           // Reference to Users collection

  // Video Information
  title: String,              // Video title (max 100 chars)
  description: String,        // Video description (max 5000 chars)

  // File Information
  videoUrl: String,           // Path to video file
  thumbnailUrl: String,       // Path to thumbnail image
  duration: Number,           // Duration in seconds
  fileSize: Number,           // File size in bytes
  format: String,             // Video format (mp4, webm, etc.)
  resolution: String,         // Resolution (1080p, 720p, etc.)

  // Statistics
  views: Number,              // Total view count
  likes: Number,              // Total like count
  dislikes: Number,           // Total dislike count
  comments: Number,           // Total comment count

  // Analytics
  viewHistory: [{
    date: Date,
    views: Number
  }],
  averageWatchTime: Number,   // Average watch time in seconds

  // Categorization
  category: String,           // Video category
  tags: [String],             // Array of tags

  // Status
  status: String,             // 'processing', 'published', 'private', 'unlisted'
  visibility: String,         // 'public', 'private', 'unlisted'

  // Metadata
  uploadedAt: Date,
  publishedAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `userId`: 1
- `views`: -1
- `publishedAt`: -1
- `category`: 1
- `tags`: 1
- `status`: 1

---

### 3. Comments

Stores user comments on videos.

```javascript
{
  _id: ObjectId,
  videoId: ObjectId,          // Reference to Videos collection
  userId: ObjectId,           // Reference to Users collection

  // Comment Data
  text: String,               // Comment text (max 1000 chars)
  parentId: ObjectId,         // Reference to parent comment (for replies)

  // Statistics
  likes: Number,              // Like count
  dislikes: Number,           // Dislike count
  replies: Number,            // Reply count

  // Status
  edited: Boolean,            // Whether comment was edited
  deleted: Boolean,           // Soft delete flag

  // Metadata
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `videoId`: 1, `createdAt`: -1
- `userId`: 1
- `parentId`: 1

---

### 4. Likes

Stores user likes/dislikes for videos and comments.

```javascript
{
  _id: ObjectId,
  userId: ObjectId,           // Reference to Users collection
  targetId: ObjectId,         // Reference to Video or Comment
  targetType: String,         // 'video' or 'comment'
  type: String,               // 'like' or 'dislike'

  // Metadata
  createdAt: Date
}
```

**Indexes:**
- `userId`: 1, `targetId`: 1, `targetType`: 1 (unique compound)
- `targetId`: 1, `targetType`: 1

---

### 5. Subscriptions

Stores user subscription relationships.

```javascript
{
  _id: ObjectId,
  subscriberId: ObjectId,     // User who is subscribing
  channelId: ObjectId,        // Channel being subscribed to

  // Notification Settings
  notifications: Boolean,      // Whether to receive notifications

  // Metadata
  createdAt: Date
}
```

**Indexes:**
- `subscriberId`: 1, `channelId`: 1 (unique compound)
- `channelId`: 1, `createdAt`: -1

---

### 6. Views

Stores video view history for analytics and recommendations.

```javascript
{
  _id: ObjectId,
  videoId: ObjectId,          // Reference to Videos collection
  userId: ObjectId,           // Reference to Users collection (can be null)

  // View Data
  watchTime: Number,          // Time watched in seconds
  completionRate: Number,     // Percentage of video watched

  // Context
  referrer: String,           // Where the view came from
  device: String,             // Device type (desktop, mobile, tablet)

  // Metadata
  createdAt: Date
}
```

**Indexes:**
- `videoId`: 1, `createdAt`: -1
- `userId`: 1, `createdAt`: -1

---

### 7. Playlists

Stores user playlists (watch later, history, custom).

```javascript
{
  _id: ObjectId,
  userId: ObjectId,           // Reference to Users collection

  // Playlist Information
  name: String,               // Playlist name
  description: String,        // Playlist description
  type: String,               // 'history', 'watch-later', 'custom'

  // Videos
  videos: [{
    videoId: ObjectId,
    addedAt: Date,
    position: Number
  }],

  // Settings
  visibility: String,         // 'public', 'private', 'unlisted'

  // Metadata
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `userId`: 1, `type`: 1
- `userId`: 1, `visibility`: 1

---

### 8. Notifications

Stores user notifications.

```javascript
{
  _id: ObjectId,
  userId: ObjectId,           // Reference to Users collection

  // Notification Data
  type: String,               // 'upload', 'comment', 'like', 'subscription'
  title: String,              // Notification title
  message: String,            // Notification message

  // Reference
  referenceId: ObjectId,      // ID of related video/comment/user
  referenceType: String,      // 'video', 'comment', 'user'

  // Status
  read: Boolean,              // Whether notification was read

  // Metadata
  createdAt: Date
}
```

**Indexes:**
- `userId`: 1, `read`: 1, `createdAt`: -1

---

### 9. Analytics

Stores detailed analytics for videos.

```javascript
{
  _id: ObjectId,
  videoId: ObjectId,          // Reference to Videos collection
  userId: ObjectId,           // Reference to Users collection

  // Time Period
  date: Date,                 // Date for this analytics snapshot
  period: String,             // 'daily', 'weekly', 'monthly'

  // Metrics
  views: Number,
  uniqueViews: Number,
  averageWatchTime: Number,
  totalWatchTime: Number,
  likes: Number,
  comments: Number,
  shares: Number,

  // Audience
  demographics: {
    devices: {
      desktop: Number,
      mobile: Number,
      tablet: Number
    },
    sources: {
      direct: Number,
      search: Number,
      suggested: Number,
      external: Number
    }
  },

  // Metadata
  createdAt: Date
}
```

**Indexes:**
- `videoId`: 1, `date`: -1
- `userId`: 1, `date`: -1

---

### 10. PasswordResets

Stores password reset tokens.

```javascript
{
  _id: ObjectId,
  userId: ObjectId,           // Reference to Users collection
  email: String,              // User email
  token: String,              // Reset token (hashed)

  // Status
  used: Boolean,              // Whether token was used
  expiresAt: Date,            // Token expiration

  // Metadata
  createdAt: Date
}
```

**Indexes:**
- `token`: 1
- `email`: 1
- `expiresAt`: 1 (TTL index)

---

## Relationships

```
Users (1) ──── (M) Videos
Users (1) ──── (M) Comments
Users (1) ──── (M) Subscriptions (as subscriber)
Users (1) ──── (M) Subscriptions (as channel)
Users (1) ──── (M) Playlists
Users (1) ──── (M) Notifications

Videos (1) ──── (M) Comments
Videos (1) ──── (M) Likes
Videos (1) ──── (M) Views
Videos (1) ──── (M) Analytics

Comments (1) ──── (M) Comments (replies)
Comments (1) ──── (M) Likes
```

## Data Validation Rules

### Users
- `username`: 3-20 characters, alphanumeric + underscore
- `email`: Valid email format
- `password`: Minimum 8 characters (hashed)
- `bio`: Maximum 500 characters

### Videos
- `title`: 1-100 characters
- `description`: Maximum 5000 characters
- `tags`: Maximum 20 tags, each 1-30 characters
- `category`: Must be from predefined list

### Comments
- `text`: 1-1000 characters
- Cannot comment on deleted videos

### File Uploads
- Supported formats: MP4, WebM, AVI, MOV
- Maximum file size: 500MB
- Thumbnail: JPG, PNG, max 2MB

## Performance Considerations

1. **Indexing**: All foreign keys and frequently queried fields are indexed
2. **Caching**: Implement Redis caching for:
   - Trending videos
   - User sessions
   - Video view counts
3. **Aggregation**: Use MongoDB aggregation pipeline for analytics
4. **Pagination**: Implement cursor-based pagination for large datasets
5. **CDN**: Store video files and thumbnails on CDN for faster delivery
