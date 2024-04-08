# Aeonaxy Assignment

Livehosted website url: https://aeonaxy-1.onrender.com

apis are listed below.

### NOTE:
Create .env file and fill all the required fields to run it in localhost:3000 
```env
PGHOST='<neonhost>'
PGDATABASE='<neondb>'
PGUSER='<neonpguser>'
PGPASSWORD='<neonpgpassword>'
ENDPOINT_ID='<neondbendpoint>'
API_KEY='<resend_api_key>'
CLOUD_NAME='<cloudinary_name>'
CLOUD_KEY='<cloudinary_api_key>'
API_SECRET='<cloudinary_api_secret>'
JWT_SECRET='<JWT_TOKEN>'
EMAIL='<GMAIL_email_address>'
PASSWORD='<Gmail_password>'
```
```bash
npm install
npm start
```

Server will start in localhost:3000


Logging has been implemented and is stored in access.log the sample log data will look like this
```
[2024-04-08T11:17:10.851Z] GET /api/ - 404 (3 ms)
[2024-04-08T11:17:20.565Z] GET /coursefilter - 200 (53 ms)
[2024-04-08T11:21:38.742Z] GET /coursefilter - 200 (97 ms)
[2024-04-08T11:21:51.119Z] GET /coursefilter?page=2 - 200 (46 ms)
[2024-04-08T11:21:56.163Z] GET /coursefilter?page=3 - 200 (46 ms)
[2024-04-08T11:22:03.569Z] GET /coursefilter?page=2 - 200 (46 ms)
[2024-04-08T11:22:08.062Z] GET /coursefilter?page=5 - 200 (45 ms)
[2024-04-08T11:22:13.700Z] GET /coursefilter?page=10 - 200 (46 ms)
[2024-04-08T11:22:20.203Z] GET /coursefilter?page=6 - 200 (47 ms)
[2024-04-08T11:22:24.797Z] GET /coursefilter?page=7 - 200 (46 ms)
[2024-04-08T11:33:13.266Z] POST /register - 201 (810 ms)
```

Pagination has been limited to 5

### Auth Routes

1. Register User
   Endpoint: POST /api/register

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

    Endpoint: POST /api/login

    Description: Allows registered users to log in.

    Test JSON Data:
```json
{
  "email": "john@example.com",
  "password": "Password123!"
}
```

3. Create Super User

    Endpoint: POST /api/createsuper

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


### User Routes

1. Create User

    Endpoint: POST /api/createuser

    Description: Allows admin users to create new users.

    Headers:
```json
Authorization: "<token_after_login_response_Data>"
```

   Test Form-Data:
     
```json
{
  "description": "User description",
  "image": "<image_file>"
}
```

2. Update User

    Endpoint: POST /api/updateuser
   
    Description: Allows users to update their profile information.
   
    Headers:
```json
Authorization: "<token_after_login_response_Data>"
```
   
   Test JSON Data:
```json
{
  "description": "Updated user description",
  "image": "<updated_image_file>"
}
```

3. Get User Details

    Endpoint: GET /api/userdetails
   
    Description: Retrieves details of a specific user.
    Headers:
```json
Authorization: "<token_after_login_response_Data>"
```
   
   Test JSON Data: No request body required.

5. Reset password

     Endpoint: POST /api/resetpassword

     Description: Send mail to reset password.

     Test JSON Data:
```json
{
"email":"john@example.com"
}
```

NOTE: There shud be a frontend implemented for this but this is for demonstartion hence is sent with both at once for postman access.


You will receive a mail from the website that url has to be pasted in postman and the JSON data for that will be:
```json
{
"otp":"<received otp>",
"password":"PPPp@12345"
}
```


### Course Routes

1. Create Course

    Endpoint: POST /api/createcourse
   
    Description: Allows admin users to create new courses.

    NOTE: You need admin access for that so login as admin with the admin details you have created and get the token.
   
    Headers:
```json
Authorization: "<token_after_login_response_Data>"
```
   
   Test JSON Data:
```json
{
  "title": "Course Title",
  "description": "Course description",
  "category": "Category",
  "difficulty": "Difficulty Level",
  "rating": "Rating"
}
```

2. Update Course

    Endpoint: PUT /api/updatecourse/:id
   
    Description: Allows admin users to update course information.

   NOTE: You need admin access for that so login as admin with the admin details you have created and get the token.
   
    Headers:
```json
Authorization: "<token_after_login_response_Data>"
```
   
   Test JSON Data:
```json
{
  "title": "Updated Course Title",
  "description": "Updated course description",
  "category": "Updated Category",
  "difficulty": "Updated Difficulty Level",
  "rating": "Updated Rating"
}
```

3. Delete Course

    Endpoint: DELETE /api/deletecourse/:id
   
    Description: Allows admin users to delete a course.

   NOTE: You need admin access for that so login as admin with the admin details you have created and get the token.
   
    Headers:
```json
Authorization: "<token_after_login_response_Data>"
```
   
   Test JSON Data: No request body required.

5. Register Course

    Endpoint: POST /api/registercourse/:courseId

    For courseid use GET /api/coursefilter you will get list of all courses with it's id.  

    Description: Allows users to register for a course.
   
    Headers:
```json
Authorization: "<token_after_login_response_Data>"
```
   
   No Test JSON Data

5. Unenroll Course

    Endpoint: DELETE /api/unenrollcourse/:courseId

    Description: Allows users to unenroll from a course.
   
    Headers:
```json
Authorization: "<token_after_login_response_Data>"
```

   No Test JSON Data


7. Get Course Users

    Endpoint: GET /api/courseusers/:courseId

    Description: Retrieves users enrolled in a specific course.

   NOTE: You need admin access for that so login as admin with the admin details you have created and get the token.
   
    Headers:
```json
Authorization: "<token_after_login_response_Data>"
```

   Test JSON Data: No request body required.

9. Get Course Filter

    Endpoint: GET /api/coursefilter , /api/coursefilter?rating=4 , /api/coursefilter?difficulty=beginner , /api/coursefilter?rating=4&&difficulty=beginner

    difficulty can be ['beginner','advanced','intermediate']
   
    rating can be [1,2,3,4,5]

    Description: Retrieves courses based on filtering criteria.

    Test JSON Data: No request body required.
