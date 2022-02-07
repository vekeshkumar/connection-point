# CONNECTION POINT - FUND RAZR - Campaign Listing
Also this code is deployed in heroku : 
https://connection-point.herokuapp.com/
Since its a free hosting, it might take while to load the page.

This project is bootstrapped with React Framework and included Bootstrap for style

## Prerequisite for the  running this code in the local:
-> UnZip the file
-> Install latest Node version and install npm
-> Go to the directory where the files are unzipped and execute npm install to install the dependencies required to run the project.

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### Listing.js
This file is inside src/components.
Listing is the react component created and it contains functions which has the logic for all the given objectives.
Class listing is created and inside that,a constructor  is created in which state and some objects are initalized.
ComponentDidMount() is the  react function  where the fetch javascript function is called to get the json object

### formatDate() :
javascript function returns the formatted date for the given input
### formatCurrency():
javascript function returns the formatted currency for the given input

### sortByTitle():
javascript function performs sort based on the title
### sortByFund():
javascript function performs sort based on the total raised amount
### handleSortChange():
this function  contains all logic and operations related to sort functionality.
### handleSearchChange():
this function contains all logic and operations related to search functionality.
### render():
it contains all the html and the js binding to show in the view.


