var express = require('express');/*include modulul express
memorand in variabila express obiectul asociat modulului(exportat de modul)*/
var path = require('path');
var formidable = require('formidable');
var fs=require('fs');
var crypto=require('crypto');
var app = express();
var session = require('express-session');

app.use(session({
  secret: 'abcdefg',
  resave: true,
  saveUninitialized: false
})); // din acest moment in toate requesturile o sa am campul session (apare proprietatea req.session)
//in req.session o sa am un obiect in care memorez date de sesiune
// de exemplu req.session.ceva=123 -- o sa il vad din acest moment in toate requesturile


// pentru folosirea ejs-ului
app.set('view engine', 'ejs');


console.log(__dirname);//calea (radacina) aplicatiei Node
app.use(express.static(path.join(__dirname, "resurse")));
/* caile vor fi realtive la folderul static proiect/resurse/css/stil.css in href o sa scrieti /css/stil.css*/


// cand se face o cerere get catre pagina de index 

app.get('/', function(req, res) {
	/*afiseaza(render) pagina folosind ejs (deoarece este setat ca view engine) */
		u=req.session? (req.session.utilizator? req.session.utilizator.username:null):null;
    res.render('html/index',{username:u});
});

app.get('/bla', function(req, res) {
	/*afiseaza(render) pagina folosind ejs (deoarece este setat ca view engine) */
    console.log("ceva!");
		res.setHeader("Content-Type", "text/html");
		res.write("<html><body><h1>Cucubau!</h1><p>Bine, multumesc.</p></body></html>");
		res.end();
});

app.get("/logout", function(req, res){
	req.session.destroy();
	res.render("html/index")
});

app.post("/login", function(req, res){
	var date_form= new formidable.IncomingForm();
	date_form.parse(req, function(err, fields, files){
		fisierUseri= fs.readFileSync("useri.json");
		var ob_useri=JSON.parse(fisierUseri);
		var parolaCriptata;
		var algCifrare=crypto.createCipher('aes-128-cbc', "sesiune_usoara");
		parolaCriptata=algCifrare.update(fields.parola, "utf-8", "hex")
		parolaCriptata+=algCifrare.final("hex");
		var utiliz= ob_useri.useri.find(function(el){
			return el.username == fields.username && el.parola == parolaCriptata;
		});
		if(utiliz){
      //setam datele de sesiune
			req.session.utilizator=utiliz;
			console.log("logat!!!!!")
    }
		if(req.session && req.session.utilizator)
			res.render("html/index", {username:req.session.utilizator.username});
		else{
			res.render("html/index");
		}
	});
});


app.post("/inreg", function(req, res){
	var date_form= new formidable.IncomingForm();
	date_form.parse(req, function(err, fields, files){
		//console.log(fields.username)
		fisierUseri= fs.readFileSync("useri.json");
		var ob_useri=JSON.parse(fisierUseri);
		//console.log("Inainte:")
		//console.log(ob_useri);
		var parolaCriptata;
		var algCifrare=crypto.createCipher('aes-128-cbc', "sesiune_usoara");
		parolaCriptata=algCifrare.update(fields.parola, "utf-8", "hex")
		parolaCriptata+=algCifrare.final("hex");
		var utilizatorNou={id:ob_useri.lastId, username:fields.username, nume:fields.nume, email:fields.email, parola:parolaCriptata, dataInreg: new Date(), rol:"utilizator", materii:fields.materii} 
        ob_useri.lastId+=1;
        ob_useri.useri.push(utilizatorNou);
        var sirJson= JSON.stringify(ob_useri);
		fs.writeFileSync("useri.json",sirJson);
		
		//console.log("Dupa:")
		//console.log(ob_useri);	
		res.redirect("/");
	})
  
})

app.get("/*", function(req, res){
	console.log("=======")
    console.log(req.url)
    
	u=req.session? (req.session.utilizator? req.session.utilizator.username:null):null;

  res.render("html" + req.url, {username:u}, function(err, html){
		if(err){
			if(err.message.includes("Failed to lookup view")){ // in message (string) o sa am ce se afiseaza in consola

				/*tratarea erorii 404 se pune la final (aici o sa fie un caz general, pe care intra orice cerere). Daca s-a gasit mai sus, se opreste acolo; nu mai ajunge aici.*/
				u=req.session? (req.session.utilizator? req.session.utilizator.username:null):null;
				return res.status(404).render("html/404",{username:u});
			}
			else{
				throw err;
			}
		}
		res.send(html);
	});
});


/*
app.use(function(req,res){
	res.status(404).render("html/404");//din views/html/404.ejs
});*/

//

app.listen(8080);
console.log('Aplicatia se va deschide pe portul 8080.');