# NWEN304 Group Project

## Application URL

- **Live Demo:** https://nwen304-groupproject-9db15.web.app/
- **GitHub Repository:** https://github.com/AdamRoddick/nwen304-group-project

## Exposed APIs

Our application provides the following APIs:

1. **Registration**
   - Endpoint: `/api/register`
   - Description: Allows users to create an account for the application.

2. **Login**
   - Endpoint: `/api/login`
   - Description: Allows users to login with an account to the application.

## Database Design

Our application uses firestore, a nosql database to store and manage data. Below is a summary of our database design:

### Collections

1. **Users Collection**
   - Purpose: Stores user data, including user profiles.
   - Document Structure:
     - `id` (Auto-generated unique ID)
     - `username` (String)
     - `email` (String)
     - `password` (String)
     - `following` (List of Users)

2. **Posts Collection**
   - Purpose: Stores posts created by users.
   - Document Structure:
     - `id` (Auto-generated unique ID)
     - `title` (String)
     - `content` (String)
     - `author` (Reference to a User)
     - `timestamp` (Time posted)
