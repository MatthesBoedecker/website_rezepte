const express = require('express');
const session = require('express-session');
const app = express();
const PORT = 3000;
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const crypto = require("crypto");
var user = null;
const https = require("https"); 
const fs = require("fs"); 
 
const options = { 
    key: fs.readFileSync("key.pem"), 
    cert: fs.readFileSync("cert.pem"), 
};

var bodyParser = require('body-parser');
const { debug } = require('console');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({

    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 } // session timeout of 60 seconds 
}));

// Set EJS as the view engine
app.set('view engine', 'ejs');


// Routes
app.get('/', async (req, res) => {
    const sessionData = req.session;
    const users = await prisma.user.findMany()
    console.log(users); //Gibt alle Daten der Tabelle User aus 

    res.render('login', { errorMessage: "" })
});

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

// Start server
module.exports = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})

// HTTPS-Server starten 
https.createServer(options, app).listen(443, () => { 

      console.log("HTTPS Server läuft auf https://localhost:443"); 
    
    }); 

app.get('/login', (req, res) => {
    res.render('login', { errorMessage: "" })
})

app.get('/index', async (req, res) => {
    if (user == null) {
        res.redirect('login')
        return
    }

    var recipes = await prisma.rezepte.findMany({
        where: { user_id: user.user_id }
    })

    res.render('index', { recipes })
})

app.post('/login', async (req, res) => {
    try {
        const hashed = crypto.createHash("md5").update(req.body.password).digest("hex");

        user = await prisma.user.findFirstOrThrow({
            where: { username: req.body.username, password: hashed }
        });

        //console.log(req.body.username + "  " + req.body.password)
        //Login erfolgreich. Redirect Hauptseite.
        res.redirect('/index');
    } catch (error) {
        //Login nicht erfolgreich. Zurück zum login

        //console.error('Login fehlgeschlagen:', error.message);
        errorMessage = error.message;
        res.render('login', { errorMessage });
    }
});

app.post('/add', async (req, res) => {
    try {
        var user_id
        if (user == null) {
            if (req.body.user_id == null)
                return
            user_id = req.body.user_id
        }
        else
        {
            user_id = user.user_id
        }

        const createdRecipe = await prisma.rezepte.create({
            data: {
                user_id: user.user_id,
                title: req.body.rTitle,
                image: req.body.rImage,
                text: req.body.rText
            },
        })
        console.log('rezept erstellt')

        res.redirect('index')
    } catch (error) {
        console.error(error)
    }

});

app.post('/change', async (req, res) => {
    try {

    } catch (error) {
        console.error(error)
    }

    res.redirect('index')
});

/* 
export async function POST({ request }) {
    const data = await request.json()
    
    try {
      const recipe = await prisma.rezepte.create({
        data,
      })
      
      return new Response(JSON.stringify(recipe))
    } catch (error) {
      return new Response(
        JSON.stringify({ error: 'Benutzer konnte nicht erstellt werden' }),
        { status: 500 }
      )
    }
  } */