const request = require("supertest"); 
const expect = require('chai').expect; 
//Zugriff auf die "App" 
const app = require("../index.js"); 
 
describe("Login-Funktion", () => { 
 
    /*it("soll eine Anmeldung mit korrekten Daten erlauben", (done) => { 
        request("http://localhost:3000") 
            .post("/login") 
            .send("username=matthes&password=asdfghjklöä#") 
            .end((err, res) => { 
                //Prüft, ob eine Weiterleitung(302) erfolgt.  
           //Diese erfolgt nur im Erfolgsfall des Logins 
                expect(res.statusCode).to.equal(302) 
                done(); 
            }) 
    }); */
 
    it("soll eine Anmeldung mit falschen Daten verweigern", (done) => { 
        request("http://localhost:3000") 
            .post("/login") 
            .send("username=admin&password=admin") 
            .end((err, res) => { 
                expect(res.statusCode).to.equal(200) 
                done(); 
            }) 
    }); 
 
}); 
describe("Rezepte verwalten", () => { 
 
    it("soll eine Anmeldung mit korrekten Daten erlauben", (done) => { 
        request("http://localhost:3000") 
            .post("/login") 
            .send("user_id=15&rTitle=EpischerTitel&rImage=https://prod-metro-markets.imgix.net/item_image/86108492-d415-4ce1-a6f3-bd717002513e?auto=format,compress&rText=beans") 
            .end((err, res) => {
                expect(res.statusCode).to.equal(200) 
                done(); 
            }) 
    }); 
  
}); 
 
 
after(() => { 
    app.close(() => { 
      console.log('Server geschlossen, Tests beendet'); 
    }); 
}); 
