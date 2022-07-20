**Chirag Kasat**

[https://chiragkasat.com](https://chiragkasat.com/)

Auth flow for single sign-on using refresh and access tokens
# **OVERVIEW**
There are two server instances and a PostgreSQL as well as a Redis database instance, all dockerized. The **auth-server** implements the authentication workflow. The other **test-server** consists of just a single route to test the authorization of a restricted route by another server other than the main auth-server. I have tried including two of the backend projects in this single project as they blended well. The authentication workflow is explained in the Auth-Flow pdf attached.
# **RUNNING THE PROJECT**
The first would be having a .env file to have some environment variables set. I have attached a sample env-local file so we can use that. Then we fire up all the services using the docker-compose up command and we should have all things set up and running.

Commands:

1. cp ./env-example .env
1. docker-compose up --build

You can run the docker command in detached mode using a ‘-d’ flag but in this way, you wouldn’t be able to see all the logs. 

\*\*It may happen that PostgreSQL service hasn’t booted up as it takes time to load for first time, so the auth-server might exit as it cannot connect to the database. In that case we can go to another terminal instance and restart the auth-server service using

docker restart <container\_id>

The docker id can be found by running the following

docker ps -a

Then find the auth-server instance and copy the id and run the command above.

Now, the auth REST API should be available on port 3000 and the test API on port 4000.
# **TESTING**
You may use any software for API testing (Postman, Insomnia, Thunder Client)

The base URL for auth-server will be - [http://localhost:3000/](http://localhost:3000/)

The base URL for test-server will be - [http://localhost:4000/](http://localhost:4000/)

The auth-server endpoints:


|**METHOD**|**ENDPOINT**|**USE**|
| :-: | :-: | :-: |
|POST|/api/signup|User signup using email and password|
|POST|/api/signin|User sign-in|
|POST|/api/signout|Remove refresh token session, logout|
|POST|/api/refresh|Endpoint for asking for a new access token using the refresh token|
There’s an additional /api/auth/user endpoint to check cookie-based access token.

- The first step will be registering the user. 
  Using POST method **http://localhost:3000/api/signup**
  Include email and password in the body as JSON.
  This is the response when nothing is specified in body.
  The input is **validated** and **sanitized**.

![](assets/1.png)

- After providing the email and password there will be a response like this:

![](assets/2.png)





- The refresh token is set as an **http-only cookie**  named xid\_refresh(mentioned in env file)

![](assets/3.png)

- Take the access token from above response and let’s try to access the restricted endpoint of the test-server.
  Using GET method **http://localhost:4000/api/restricted**
- Include the access token in **Authorization header** in the format 
  `Bearer <access\_token>`
- If the token is not included or it has expired (expires after 5 mins, uses environment variable) the response will give a **401 status code**, and this response

![](assets/4.png)

- If the token is specified correctly, there should be this response.

![](assets/5.png)

- Once the token expires (5 mins), if you try to access this route again it will give the same error message with 401 status code.

![](assets/6.png)

- This access token verification can be done by any service as required by just providing the secret key. After expiry though, we will again hit refresh endpoint of auth-server to get a new access token and use that for accessing test-server.
- Using POST method **http://localhost:3000/api/signup**
  If the refresh token hasn’t expired(5 days) and it has a session in the redis database, itwill generate a new access token and send this as response, otherwise it will prompt to signin again.

![](assets/7.png)

- Now use this access token as Authorization header (Bearer <access\_token>) in the restricted API of test-server

  Using GET method **http://localhost:4000/api/restricted**

The response again would be

![](assets/8.png)
# **CONCLUSION**
This was an exciting project to work on and I thoroughly enjoyed learning about the best practices for authentication and authorization in a microservices-based architecture.
This flow manages to decrease some load on the auth-server and still be secure enough. The next upgrade I want to do is to add Kafka to let the services interact with each other using events and be separate from each other.
