const User = require("../models/userModels");
const jwt = require('jsonwebtoken');

module.exports = (app) => {
    //GET the Signup form
    app.get("/sign-up", (req, res) => {
        var currentUser = req.user;     //gets the user requesting the page
        //if the user is automatically logged in, it logs them out and then redirects back to home login
        if(currentUser){
            res.redirect('/logout');
        } else {
            res.render("sign-up");
        }  
    });

    //POST Signup new account to db
    app.post("/sign-up", (req, res) => {
        const user = new User(req.body);    //Instantiate new user model
        user.save()      //saves new user to DB
            //user is then considered logged in, create a new JWT and set it into the cookie, then redirect home
            .then((user) => {
                var token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: "60 days" });
                res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });
                res.redirect('/');
            })
            //if any promise fails, catch and throw an error
            .catch(err => {
                console.log(err.message);
                return res.status(400).send({ err: err });
            });
    });

    //Logout
    app.get('/logout', (req, res) => {
        res.clearCookie('nToken');      //clears the JWT in the cookie
        res.redirect('/');              //redirects to home
    });

    //GET login form
    app.get('/', (req, res) => {
        var currentUser = req.user;     //gets the user requesting the page
        //if the user is automatically logged in, it logs them out and then redirects back to home login
        if(currentUser){
            res.redirect('/logout');
        } else {
            res.render("login");
        }  
    });

    //POST login attempt
    app.post("/", (req, res) => {
        const name = req.body.name;      //makes username variable
        const password = req.body.password;      //makes password variable
        User.findOne({ username }, "username password")   //finds the acct based off the provided username, 
            //and then returns the username  and password of the found account (thats what "username password" is for)
        //promise using the user found in findOne()
        .then(user => {
            //if no user is found, throw an error
            if (!user) {
                // User not found
                return res.status(401).send({ message: "Wrong Username or Password" });
            }
            //checks the password of the found user with the password from the form
            user.comparePassword(password, (err, isMatch) => {
                //if not a match throw an error
                if (!isMatch) {
                    // Password does not match
                    return res.status(401).send({ message: "Wrong Username or password" });
            }
            //If 
            const token = jwt.sign({ _id: user._id, username: user.username }, process.env.SECRET, {
                expiresIn: "60 days"
            });
            // Set a cookie and redirect to root
            res.cookie("nToken", token, { maxAge: 900000, httpOnly: true });
            res.redirect("/feed");
            });
        })
        .catch(err => {
            console.log(err);
        });
    });

};

