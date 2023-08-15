<h1 align="center">EdTech</h1>

<p align="center">
  <img src="https://img.shields.io/github/repo-size/b-l-i-n-d/edtech?color=green" />
  <img src="https://img.shields.io/github/last-commit/b-l-i-n-d/edtech?color=green" />
  <img src="https://img.shields.io/github/languages/count/b-l-i-n-d/edtech?color=green" />
  <img src="https://img.shields.io/github/languages/top/b-l-i-n-d/edtech?color=green" />
  <img src="https://img.shields.io/github/license/b-l-i-n-d/edtech?color=green" />
</p>

<p align="center">
  <a href="#about">About</a> •
  <a href="#features">Features</a> •
  <a href="#technologies">Technologies</a> •
  <a href="#env-setup">Environment variables</a> •
  <a href="#how-to-run">How to run</a> •
  <a href="#api-endpoints">API endpoints</a> •
  <a href="#license">License</a>
</p>

## About

EdTech is a web application that aims to connect students and teachers in a simple and intuitive way. It was inspired by the [LWS](www.learnwithsumit.com) platform.

## Features

-   [x] Students can register on the platform by sending:
    -   [x] Name
    -   [x] Email
    -   [x] Password
    -   [x] Avatar (optional)
-   [x] Students can log in to the platform by sending:
    -   [x] Email
    -   [x] Password
-   [x] Students can update their:
    -   [x] Avatar
-   [x] Students can recover their password by sending:
    -   [x] Email
-   [x] Student can change their password by sending:
    -   [x] New password
    -   [x] Password confirmation
-   [x] Admin can log in to the platform by sending:
    -   [x] Email
    -   [x] Password
-   [x] Admin can course videos by sending:
    -   [x] Title
    -   [x] Description
    -   [x] Video URL
    -   [x] Thumbnail URL
-   [x] Admin can add quizzes to courses by sending:
    -   [x] Title
    -   [x] Questions with:
        -   [x] Title
        -   [x] Options
            -   [x] Title
            -   [x] Is correct
-   [x] Admin can add assignments by sending:
    -   [x] Title
    -   [x] Description
    -   [x] Due date
    -   [x] Total marks
-   [x] Admin can add update submitted assignments by sending:
    -   [x] Marks
    -   [x] Feedback

## Technologies

The following tools were used in the construction of the project:

### Client

-   [NextJs](https://nextjs.org/)
-   [TypeScript](https://www.typescriptlang.org/)
-   [Ant Design](https://ant.design/)
-   [Redux Toolkit](https://redux-toolkit.js.org/)
-   [RTK Query](https://redux-toolkit.js.org/rtk-query/overview)
-   [Redux Persist](https://www.github.com/rt2zz/redux-persist)
-   [React Markdown](https://www.npmjs.com/package/react-markdown)
-   [React Player](https://www.npmjs.com/package/react-player)

### Server

-   [NodeJs](https://nodejs.org/en/)
-   [Express](https://expressjs.com/)
-   [Cloudinary](https://cloudinary.com/)
-   [JWT](https://jwt.io/)
-   [Passport](http://www.passportjs.org/)
-   [NodeMailer](https://nodemailer.com/about/)
-   [Handlebars](https://handlebarsjs.com/)
-   [MongoDB](https://www.mongodb.com/)
-   [Mongoose](https://mongoosejs.com/)
-   [Bcrypt](https://www.npmjs.com/package/bcrypt)
-   [Joi](https://www.npmjs.com/package/joi)
-   [Helmet](https://helmetjs.github.io/)
-   [http-status](https://www.npmjs.com/package/http-status)

## Env setup

### Client

1. Create a `.env.local` file in the root of the client folder
2. Add the following environment variables

```bash
#API
NEXT_PUBLIC_API_URL=<API Url>
NEXT_PUBLIC_PAGE_SIZE=10
```

### Server

1. Create a `.env` file in the root of the server folder
2. Add the following environment variables

```bash
# Port number
NODE_ENV=development
PORT='<Port number>'

# URL of the app
APP_URL=<Client URL>

# URL of the Mongo DB
MONGODB_URL='<MongoDB URL>'

# JWT
# JWT secret key
JWT_SECRET='<Secret key>'
# Number of minutes after which an access token expires
JWT_ACCESS_EXPIRATION_MINUTES='<Number of minutes>'
# Number of days after which a refresh token expires
JWT_REFRESH_EXPIRATION_DAYS='<Number of days>'
# Number of minutes after which a reset password token expires
JWT_RESET_PASSWORD_EXPIRATION_MINUTES='<Number of minutes>'
# Number of minutes after which a verify email token expires
JWT_VERIFY_EMAIL_EXPIRATION_MINUTES='<Number of minutes>'

# SMTP configuration options for the email service
# For testing, you can use a fake SMTP service like Ethereal: https://ethereal.email/create
SMTP_HOST='<SMTP host>'
SMTP_PORT='<SMTP port>'
SMTP_USERNAME='<SMTP username>'
SMTP_PASSWORD='<SMTP password>'
EMAIL_FROM='<Email from>'

# Cloudinary account credentials
CLOUDINARY_CLOUD_NAME='<Cloudinary cloud name>'
CLOUDINARY_API_KEY='<Cloudinary API key>'
CLOUDINARY_API_SECRET='<Cloudinary API secret>'

```

## How to run

1. Clone this repository

```bash
git clone https://github.com/b-l-i-n-d/edTech.git
```

2.  Install dependencies

    Server

    ```bash
    cd server
    yarn
    ```

    Client

    ```bash
    cd client
    yarn
    ```

3.  Run the application

    Server

    ```bash
    yarn dev
    ```

    Client

    ```bash
    yarn dev
    ```

4.  You can optionally build the application

    Server

    ```bash
    yarn start
    ```

    Client

    ```bash
    yarn build
    ```

## API endpoints

### Auth

| Route                              | Method | Description                   |
| :--------------------------------- | :----: | :---------------------------- |
| `/v1/auth/register`                |  POST  | Register a new user           |
| `/v1/auth/login`                   |  POST  | Login a user                  |
| `/v1/auth/logout`                  |  POST  | Logout a user                 |
| `/v1/auth/refresh-tokens`          |  POST  | Refresh access token          |
| `/v1/auth/forgot-password`         |  POST  | Send password reset email     |
| `/v1/auth/reset-password`          |  POST  | Reset password                |
| `/v1/auth/reset-password`          |  POST  | Reset password                |
| `/v1/auth/send-verification-email` |  POST  | Send email verification email |
| `/v1/auth/verify-email`            |  POST  | Verify email                  |

### Users

| Route               | Method | Description     |
| :------------------ | :----: | :-------------- |
| `/v1/users`         |  GET   | Get all users   |
| `/v1/users`         |  POST  | Create new user |
| `/v1/users/:userId` |  GET   | Get a user      |
| `/v1/users/:userId` | PATCH  | Update a user   |
| `/v1/users/:userId` | DELETE | Delete a user   |

### Videos

| Route                 | Method | Description      |
| :-------------------- | :----: | :--------------- |
| `/v1/videos`          |  GET   | Get all videos   |
| `/v1/videos`          |  POST  | Create new video |
| `/v1/videos/:videoId` |  GET   | Get a video      |
| `/v1/videos/:videoId` | PATCH  | Update a video   |
| `/v1/videos/:videoId` | DELETE | Delete a video   |

### Quizzes

| Route                 | Method | Description     |
| :-------------------- | :----: | :-------------- |
| `/v1/quizzes`         |  GET   | Get all quizzes |
| `/v1/quizzes`         |  POST  | Create new quiz |
| `/v1/quizzes/:quizId` |  GET   | Get a quiz      |
| `/v1/quizzes/:quizId` | PATCH  | Update a quiz   |
| `/v1/quizzes/:quizId` | DELETE | Delete a quiz   |

### Assignments

| Route                           | Method | Description           |
| :------------------------------ | :----: | :-------------------- |
| `/v1/assignments`               |  GET   | Get all assignments   |
| `/v1/assignments`               |  POST  | Create new assignment |
| `/v1/assignments/:assignmentId` |  GET   | Get a assignment      |
| `/v1/assignments/:assignmentId` | PATCH  | Update a assignment   |
| `/v1/assignments/:assignmentId` | DELETE | Delete a assignment   |

### Quizz Sets

| Route              | Method | Description          |
| :----------------- | :----: | :------------------- |
| `/v1/quizzes-sets` |  GET   | Get all quizzes sets |

### Quizz Marks

| Route               | Method | Description           |
| :------------------ | :----: | :-------------------- |
| `/v1/quizzes-marks` |  GET   | Get all quizzes marks |
| `/v1/quizzes-marks` |  POST  | Create new quiz mark  |

### Assignment Marks

| Route                                     | Method | Description                |
| :---------------------------------------- | :----: | :------------------------- |
| `/v1/assignments-marks`                   |  GET   | Get all assignments marks  |
| `/v1/assignments-marks`                   |  POST  | Create new assignment mark |
| `/v1/assignments-marks/:assignmentMarkId` |  GET   | Get a assignment mark      |
| `/v1/assignments-marks/:assignmentMarkId` | PATCH  | Update a assignment mark   |
| `/v1/assignments-marks/:assignmentMarkId` | DELETE | Delete a assignment mark   |

### Dashboard

| Route           | Method | Description                       |
| :-------------- | :----: | :-------------------------------- |
| `/v1/dashboard` |  GET   | Get all required data for a users |

### Leaderboard

| Route             | Method | Description                   |
| :---------------- | :----: | :---------------------------- |
| `/v1/leaderboard` |  GET   | Get all users with their rank |

### Docs

| Route   | Method | Description  |
| :------ | :----: | :----------- |
| `/docs` |  GET   | Get all docs |

## Screenshots

### Auth

#### Login

![Login](./screenshots/login.png)

#### Register

![Register](./screenshots/register.png)

#### Forgot password

![Forgot password](./screenshots/forgot-password.png)

### Home

![Home](./screenshots/home.png)

### User

#### Course Access

![Course Access](./screenshots/course.png)

#### Dashboard

![Dashboard](./screenshots/user-dashboard.png)

#### Leaderboard

![Leaderboard](./screenshots/user-leaderboard.png)

#### Profile

![Profile](./screenshots/user-profile.png)

#### Change password

![Change password](./screenshots/user-change-password.png)

### Admin

#### Dashboard

![Dashboard](./screenshots/admin-dashboard.png)

#### Videos

##### All videos

![Videos](./screenshots/admin-videos.png)

##### Add video

![Add video](./screenshots/admin-add-video.png)

##### Edit video

![Edit video](./screenshots/admin-edit-video.png)

#### View video

![View video](./screenshots/admin-view-video.png)

#### Quizzes

##### All quizzes

![Quizzes](./screenshots/admin-quizzes.png)

##### Add quiz

![Add quiz](./screenshots/admin-add-quizz.png)

##### Edit quiz

![Edit quiz](./screenshots/admin-edit-quizz.png)

#### View quiz

![View quiz](./screenshots/admin-view-quizz.png)

#### Assignments

##### All assignments

![Assignments](./screenshots/admin-assignments.png)

##### Add assignment

![Add assignment](./screenshots/admin-add-assignment.png)

##### Edit assignment

![Edit assignment](./screenshots/admin-edit-assignment.png)

#### View assignment

![View assignment](./screenshots/admin-view-assignment.png)

#### Assignments marks

##### All assignments marks

![Assignments marks](./screenshots/admin-assignment-marks.png)

##### Edit assignment mark

![Edit assignment mark](./screenshots/admin-edit-assingment-mark.png)

##### View assignment mark

![View assignment mark](./screenshots/admin-view-assignment-mark.png)

## License

[MIT](https://choosealicense.com/licenses/mit/)
