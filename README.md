# Techstack

Current technologies used: Reactjs, CSS, Nodejs, Expressjs, Axios
Planned technologies: bcryptjs to safetly store user passwords.

## Purpose
The purpose of this project, as stated in the about section is to simply introduce myself to programming with react. I am already familiar with producing websites in the node environment, particularly with handling simple REST APIs made with express. I decided it would be a fun, fulfilling, and educational project to build a fullstack website from scratch. React will be used for the frontend client side, and an expressjs server will be used to handle the database storage of user inputted information such as their username and password.

## Overview
This goal of this project is to be a webpage where users can register their accounts, sign in to their accounts, and then access a homepage where they can create a custom voting form. This voting form will have a header of what the vote is about, as well as a list of possible items to vote for, maximum of 5. The user will only be allowed to vote once per poll, and the percentage of votes for each item.

## Updates
As of moment, the website only has a functional login and registry page with no added polling feature. I intend to start production on the polling features as soon as possible, however for the time being any user can sign up and sign through the availible pages. The backend data handling of this websites stores information in a .json format in a folder called Users that is held within the Backend folder. The userServer.js file is the Express server I used, it has two separate post functions each for the login and register page that validate the credentials based on whether the account exists already or not, or if one field is missing. A key feature it is missing is the ability to display the type of error caused when an exception occurs, as it only informs the user of the error code and not what failed on their part. I plan to add this feature after the core functionality of the site is fully up and running.
