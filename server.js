var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var users = {
    '1234': {
        name: 'Daniel Cook',
        password: 'daniel',
        token: '34234235345'
    },

    '5678': {
        name: 'Aviv Beeri',
        password: 'aviv',
        token: '45464562344'
    }
};

// Middleware
app.use(express.static('public'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: 'adgnjhu6342cdfgdf', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
    function(username, password, done) {
        var user;

        for (userId in users) {
            user = users[userId];

            if (user.name === username) {
                if (user.password === password) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            }
        }
        // If we get here we haven't matched the user
        return done(null, false);
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.token);
});

passport.deserializeUser(function(id, done) {
    var user;
    var foundUser;
    for (userId in users) {
        user = users[userId];
        if (user.token === id) {
            foundUser = user;
        }
    }
    done(null, foundUser);
});

app.post('/login',
    passport.authenticate('local', { session: true,
                                     successRedirect: '/helloWorld.html',
                                     failureRedirect: '/login.html',
                                      })
);

app.get('/users/:userId', function(req, res){
    console.log(req.user);
    if (req.user) {
        var userId = req.params.userId;
        res.send(users[userId].name);
    } else {
        res.sendStatus(401);
    }
});

app.listen(3000);

// Output a log to indicate the server has started
console.log('Server started');
