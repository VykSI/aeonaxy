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

    Test JSON Data:
```json
{
  "user": "userId",
  "description": "User description",
  "image": "<image_file>"
}
```

2. Update User

    Endpoint: POST /api/updateuser
   
    Description: Allows users to update their profile information.
   
    Test JSON Data:
```json
{
  "user": "userId",
  "description": "Updated user description",
  "image": "<updated_image_file>"
}
```

3. Get User Details

    Endpoint: GET /api/userdetails
   
    Description: Retrieves details of a specific user.
   
    Test JSON Data: No request body required.


### Course Routes

1. Create Course

    Endpoint: POST /api/createcourse
   
    Description: Allows admin users to create new courses.
   
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
   
    Test JSON Data: No request body required.

5. Register Course

    Endpoint: POST /api/registercourse/:courseId

    For courseid use GET /api/coursefilter you will get list of all courses with it's id.  

    Description: Allows users to register for a course.
   
    Test JSON Data:
```json
{
  "user": "userId"
}
```

5. Unenroll Course

    Endpoint: DELETE /api/unenrollcourse/:courseId

    Description: Allows users to unenroll from a course.

    Test JSON Data:
```json
{
  "user": "userId"
}
```
6. Get Course Users

    Endpoint: GET /api/courseusers/:courseId

    Description: Retrieves users enrolled in a specific course.

    Test JSON Data: No request body required.

8. Get Course Filter

    Endpoint: GET /api/coursefilter , /api/coursefilter?rating=4 , /api/coursefilter?difficulty=beginner , /api/coursefilter?rating=4&&difficulty=beginner

    difficulty can be ['beginner','advanced','intermediate']
   
    rating can be [1,2,3,4,5]

    Description: Retrieves courses based on filtering criteria.

    Test JSON Data: No request body required.
