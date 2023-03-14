# Techstack

Current technologies used: Reactjs, CSS, Nodejs, Expressjs, Axios, Bcryptjs, Bootstrap

## Purpose
The purpose of this project, as stated in the about section is to simply introduce myself to programming with react. I am already familiar with producing websites in the node environment, particularly with handling simple REST APIs made with express. I decided it would be a fun, fulfilling, and educational project to build a fullstack website from scratch. React will be used for the frontend client side, and an expressjs server will be used to handle the database storage of user inputted information such as their username and password.

## Overview
This goal of this project is to be a webpage where users can register their accounts, sign in to their accounts, and then access a homepage where they can create a custom voting form. This voting form will have a header of what the vote is about, as well as a list of possible items to vote for, maximum of 3. The user will only be allowed to vote once per poll, and the percentage of votes for each item.

## Updates
The project is now completely done, all functionaities that I intended to add have now been added and are fully functional. I am currently aware of one minor bug, where if the user deletes all the polls, it will still show one poll being availible until the page is reloaded. Users can create and login to their accounts with the promise of safety and security with hashed passwords by Bcryptjs. Users can create custom polls that will display their name next to the poll, and users can delete polls on the condtion that they were the ones that created the poll. Users can also choose to signout of their account using a sidebar dropdown menu. 
