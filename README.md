### Auth Routes

1. Register User
   Endpoint: POST /register

   Description: Allows users to register with the system.

   Test JSON Data:
```json
        {
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123!"
}
```
### NOTE:
You need to complete full user details with /api/createuser else some apis won't work this is to ensure user complete the details.

2. Login User

    Endpoint: POST /login

    Description: Allows registered users to log in.

    Test JSON Data:
```json
{
  "email": "john@example.com",
  "password": "Password123!"
}
```

3. Create Super User

    Endpoint: POST /createsuper

    Description: Creates a super user with admin privileges.

    Test JSON Data:
```json
{
  "name": "Admin",
  "email": "admin@example.com",
  "password": "SuperSecret123!"
}
```
### NOTE:
You need to complete full user details with /api/createuser else some apis won't work this is to ensure user complete the details.
