# Messenger App

A full-stack real-time messaging application that enables users to communicate one-on-one and in groups. Built with a modern tech stack, Messenger App provides secure authentication, message management, and profile customization.

## Live Demo

[Add your deployed link here]

---

## Features

### Core Messaging Functionality

- **One-on-One Messaging**: Send and receive messages between two users in real-time
<!-- - **Group Messaging**: Create groups, add members, and communicate with multiple users simultaneously --> (Future Feature)
- **Message Management**: Create, read, edit, and delete messages with timestamps
- **Message History**: View all past conversations and message history
- **User Discovery**: Browse all users on the platform and start conversations

### User Features

- **User Authentication**: Secure sign-up and login with encrypted passwords
- **Profile Management**: Customize your profile with profile picture, bio, name, email, and password
- **User Lists**: View all available users (except yourself) to start conversations
<!-- - **Group Management**: Create groups, add/remove members, and manage group settings --> (Future Feature)

### Message Features

- **Real-Time Messages**: Send and receive messages instantly
- **Message Editing**: Edit your own messages after sending
- **Message Deletion**: Delete sent or received messages
- **Message Tracking**: See who sent each message and when

### Implemented Features (Completed)

✓ User signup and login with secure authentication  
✓ User profile creation and customization  
✓ User discovery (view all users except self)  
✓ Create, send, and receive one-on-one messages  
✓ Edit messages (only by sender)  
✓ Delete messages (sent and received)  
✓ Message timestamps  
✓ Group creation and management  
✓ Add members to groups  
✓ Group messaging with full CRUD operations  
✓ Profile picture upload and management  
✓ Password encryption and security

---

## Tech Stack

### Frontend

- **Framework**: React
- **Styling**: CSS3 with responsive design
- **State Management**: Context API
- **HTTP Client**: Axios

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: [bcryptjs for password hashing / JWT tokens]

---

## Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn
- Git

### Backend Setup

1. Clone the repository:

```bash
git clone https://github.com/Quitzelcoat/messanger-app
cd messenger-app/backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the backend root directory:

```
DATABASE_URL=postgresql://username:password@localhost:5432/messenger_app
JWT_SECRET=your_jwt_secret_key
PORT=5000
NODE_ENV=development
```

4. Set up the PostgreSQL database:

```bash
npx prisma migrate dev --name init
```

This command will:

- Create the PostgreSQL database
- Run all migrations
- Generate Prisma client

5. (Optional) Seed the database with sample data:

```bash
npx prisma db seed
```

6. Start the backend server:

```bash
npm start
```

The backend server will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd ../frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the frontend root directory:

```
REACT_APP_API_URL=http://localhost:3000
```

4. Start the development server:

```bash
npm start
```

The frontend will run on `http://localhost:5173`

---

---

## How to Use

### Create an Account

1. Click "Sign Up" on the welcome page
2. Enter your email, username, password, and name
3. Click "Create Account"
4. You'll be automatically logged in

### Send a Message

1. Log in to your account
2. Click on a user from the user list or conversations
3. Type your message in the message input field
4. Click send
5. The other user will receive your message in real-time

### Edit a Message

1. Hover over or long-press your sent message
2. Click the "Edit" option
3. Modify the message text
4. Click "Save" to update

### Delete a Message

1. Hover over or long-press any message (sent or received)
2. Click the "Delete" option
3. Confirm deletion
4. The message will be removed

### Create a Group

1. Click "Create Group" in the sidebar
2. Enter group name and description (optional)
3. Select members to add
4. Click "Create"
5. You can add more members at any time

### Customize Your Profile

1. Click on your profile icon or username
2. Click "Edit Profile"
3. Update your name, bio, email, or profile picture
4. Click "Save Changes"

---

## Key Pages & Components

### Login & Signup Pages

- Clean authentication interface
- Input validation
- Secure password handling
- Error message display

### Chat/Message Page

- Conversation list on the left
- Active conversation view in the center
- Message display with sender information
- Message input box
- Edit/Delete message options

### User Discovery Page

- List of all users on the platform
- User profile previews
- Quick message button
- Search functionality

### Profile Page

- User information display
- Profile picture
- Bio and email
- Edit profile button
- Change password option
- Logout button

### Group Page

- List of all user groups
- Create new group button
- Group members list
- Add/Remove members functionality
- Group chat view

---

## Security Features

- **Password Encryption**: All passwords are hashed using bcryptjs
- **Authentication**: JWT tokens for session management
- **Authorization**: Only message creators can edit/delete their messages
- **Data Validation**: Input validation on all forms
- **CORS Protection**: Backend configured with appropriate CORS settings

---

## Database Migration

To create or update your database schema:

```bash
# Create a new migration
npx prisma migrate dev --name migration_name

# View the current database state
npx prisma studio

# Reset the database (development only)
npx prisma migrate reset
```

---

## Future Enhancements

- [ ] Real-time notifications using WebSockets
- [ ] Message read receipts (seen/delivered status)
- [ ] Typing indicators
- [ ] Image and file sharing in messages
- [ ] Voice and video calling
- [ ] Message search functionality
- [ ] Message reactions (emoji)
- [ ] User status (online/offline)
- [ ] User blocking functionality
- [ ] Pin important messages
- [ ] Message forwarding
- [ ] Archive conversations

---

## Learning Outcomes

This project demonstrates proficiency in:

- Full-stack web development
- Relational database design with PostgreSQL
- ORM usage with Prisma
- User authentication and authorization
- RESTful API design
- CRUD operations
- Frontend-backend integration
- State management in React
- Real-time application features
- Database migrations and schema management
- Git version control
- Security best practices

---

## Troubleshooting

### Database Connection Issues

**PostgreSQL Connection Failed**

- Ensure PostgreSQL is running on your system
- Verify your `DATABASE_URL` in `.env` is correct
- Check that the database user has proper permissions

**Prisma Migration Errors**

- Delete `prisma/migrations` folder (if in development)
- Run `npx prisma migrate reset`
- Recreate migrations with `npx prisma migrate dev --name init`

### Authentication Issues

**Login Not Working**

- Verify the correct email/username and password
- Check that the user account exists in the database
- Ensure JWT_SECRET is set in `.env`

**Token Expired**

- Log out and log back in
- Clear browser cookies and localStorage

### Message Issues

**Messages Not Sending**

- Ensure both users exist in the database
- Check network connection
- Verify backend server is running

**Cannot Edit/Delete Message**

- Only the message sender can edit/delete their messages
- Messages may be deleted from database if record is old

### CORS Errors

- Update `REACT_APP_API_URL` to match your backend URL
- Ensure backend CORS configuration includes your frontend domain

---

## Credits

This project is built as a learning application to demonstrate full-stack development capabilities with modern technologies including React, Express.js, PostgreSQL, and Prisma ORM.

---

## License

This project is open source and available under the MIT License.

---

## Contact & Portfolio

This project is part of my portfolio and demonstrates my full-stack development capabilities.

- **GitHub**: (https://github.com/Quitzelcoat/messanger-app)
- **Portfolio**: [Your portfolio website]
- **Email**: haris76689@gmail.com

---

**Last Updated**: January 2026
