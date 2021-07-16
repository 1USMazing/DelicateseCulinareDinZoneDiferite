window.onload=function(){
	//creez un obiect de tip XMLHttpRequest cu care pot transmite cereri catre server
	var ajaxRequest = new XMLHttpRequest();


	//la schimbarea starii obiectului XMLHttpRequest (la schimbarea proprietatii readyState)
	/* stari posibile:
	0 - netrimis
	1 - conexiune deschisa
	2 - s-au transmis headerele
	3 - se downleadeaza datele (datele sunt impartite in pachete si el primeste cate un astfel de pachet)
	4 - a terminat
	*/
	ajaxRequest.onreadystatechange = function() {
			//daca am primit raspunsul (readyState==4) cu succes (codul status este 200)
			if (this.readyState == 4 && this.status == 200) {
					//in proprietatea responseText am contintul fiserului JSON
					document.getElementById("afisJson").innerHTML=this.responseText;
					var obJson = JSON.parse(this.responseText);
					afiseajaJsonTemplate(obJson);
			}
	};
	//deschid o conexiune cu o cerere de tip get catre server
	//json e pus in folderul static "resurse" deci calea e relativa la acel folder (fisierul e la calea absoluta /resurse/json/studenti.json)
	ajaxRequest.open("GET", "/json/bucatari.json", true);
	//trimit catre server cererea
	ajaxRequest.send();

	function afiseajaJsonTemplate(obJson) { 
			//in acets div voi afisa template-urile   
			let container=document.getElementById("afisTemplate");

			//in textTemplate creez continutul (ce va deveni innerHTML-ul) divului "afisTemplate"
			let textTemplate ="";
			//parcurg vetorul de studenti din obJson
			for(let i=0;i<obJson.bucatari.length;i++){
				//creez un template ejs (primul parametru al lui ejs.render)
				//acesta va primi ca parametru un student din vectorul de studenti din json {student: obJson.studenti[i]}
				//practic obJson.studenti[i] e redenumit ca "student" in template si putem sa ii accesam proprietatile: student.id etc
				textTemplate+=ejs.render("<div class='templ_bucatar'>\
                <p>Id: <%= bucatar.id %></p>\
                <p>Nume: <%= bucatar.nume %></p>\
                <p>Descriere: <%= bucatar.descriere %></p>\
                <p>Varsta: <%= bucatar.varsta %></p>\
                <p>Incepator: <%= bucatar.incepator %></p>\
                <p>Data inregistrarii: <%= bucatar.dataInreg %></p>\
				<p>Specifice culinare: <%= bucatar.specifice_culinare %></p>\
				<p>Telefon: <%=bucatar.telefon %></p>\
				</div>", 
				{bucatar: obJson.bucatari[i]});
			} 
			//adaug textul cu afisarea studentilor in container
			container.innerHTML=textTemplate;

			var divuri=container.getElementsByClassName("templ_bucatar");

			//setInterval
			
			var ind=0;
			var myVar = setInterval(setColor, 300);
 
			function setColor() 
			{
				var butoane = document.getElementById("container_butoane");
				var right="linear-gradient(to right, rgba(0,79,240,0.75), rgba(97,240,0,0.75))";
				var left="linear-gradient(to left, rgba(0,79,240,0.75), rgba(97,240,0,0.75))";
				if(ind%2) butoane.style.background = "linear-gradient(to left, rgba(0,79,240,0.75), rgba(97,240,0,0.75))";
				else butoane.style.background ="linear-gradient(to right, rgba(0,79,240,0.75), rgba(97,240,0,0.75))";
				ind++;
			}

			opreste=document.getElementById("stop");
			opreste.onclick=function()
			{
				clearInterval(myVar);
			}


			//IGNORA

			function TimpInactivitate() 
			{
				var timp;
				window.onload = reseteazaTimpul;
				document.onmousemove = reseteazaTimpul;
				document.onkeypress = reseteazaTimpul;
				document.onload = reseteazaTimpul;
				document.onmousedown = reseteazaTimpul; 
				document.ontouchstart = reseteazaTimpul;
				document.onclick = reseteazaTimpul;    
				document.onkeypress = reseteazaTimpul;
			
				var cronometru;
				var cronometruStart;

				function logout() 
				{
					if(location.href.includes("/login"))
					{
						alert("Din cauza timpului de inactivitate (15 minute) sesiunea s-a incheiat.");
						location.href="/logout";
					}
				}
				
				function reseteazaTimpul() 
				{
					clearTimeout(timp); 
					timp=setTimeout(logout, 1000 * 60 * 15);

					clearInterval(cronometru);
					var TimpRamas=1000 * 60 * 15;
					function IncepeNumaratoarea(TimpRamas)
					{
						cronometruStart = Date.now();

						cronometru = setInterval(function()
						{
							TimpRamas = TimpRamas-(Date.now()-cronometruStart);

							cronometruStart = Date.now();

							AfisareFooterCountdown(parseInt(TimpRamas/1000));
						}, 1000);
					}
					if(location.href.includes("/login"))
					{
					 IncepeNumaratoarea(TimpRamas);
					}
				}
					function AfisareFooterCountdown(sir)
					{
						var info=document.getElementById("footer");
						var paragraf=document.createElement("div");
		
						if(info.getElementsByTagName("div")[0]) info.removeChild(info.getElementsByTagName("div")[0]);
		
						var minute=Math.floor(sir/60);
						var secunde=sir%60;

						paragraf.innerHTML="Timp Ramas din sesiune: "+minute + " minute si "+secunde + " secunde";
						info.appendChild(paragraf);
					}
			};
			TimpInactivitate();

			//RESET BUTTON
			var reset=document.getElementById("RESET");
			reset.onclick=function()
			{
				container.innerHTML=textTemplate;

				for(let i=0; i<divuri.length; i++)
				{
					divuri[i].onclick=function()
					{
						this.classList.toggle("selectat");
					};
				}

				document.getElementById("myCheck").checked=false;

				var preferinte=document.getElementsByName("dishes");
				for(let i=0; i<preferinte.length; i++)
					preferinte[i].checked=false;

				localStorage.removeItem("valori");
			}

			//Sortare dupa nume
			var sortare_nume=document.getElementById("alpha_sort");
			sortare_nume.onclick=function()
			{
				var v_divuri=Array.prototype.slice.call(divuri);

				v_divuri.sort(function(a,b)
				{
					return a.children[1].innerHTML.localeCompare(b.children[1].innerHTML);
				});
				for(let div of v_divuri)
					container.appendChild(div);
			}

			//Sortare dupa varsta
			var sortare_varsta=document.getElementById("age_sort");
			sortare_varsta.onclick=function()
			{
				var v_divuri=Array.prototype.slice.call(divuri);

				v_divuri.sort(function(a,b)
				{
					return a.children[3].innerHTML.localeCompare(b.children[3].innerHTML);
				});
				for(let div of v_divuri)
					container.appendChild(div);
			}

			//Pastram doar majorii
			var filtru_majori=document.getElementById("18+");
			filtru_majori.onclick=function()
			{
				for(let i=0; i<divuri.length; i++)
				{
					var varsta=divuri[i].children[3].innerHTML.match(/\d+$/);
					if(varsta<18){divuri[i].remove(); i--;}
				}
			}

			//Selectarea unui div
			var divuri=container.getElementsByTagName("div");
			for(let i=0; i<divuri.length; i++)
			{
				divuri[i].onclick=function()
				{
					this.classList.toggle("selectat");
				};
			}

			//Pastrati incepatorii
			var divuri=container.getElementsByClassName("templ_bucatar");
			var filtru_incepatori=document.getElementById("incepatori");
			filtru_incepatori.onclick=function()
			{
				for(let i=0; i<divuri.length; i++)
				{
					var incepator=divuri[i].children[4].innerHTML.toString();
					if(incepator.search("true")==-1){divuri[i].remove(); i--;}
				}
			}

			//Pastrati avansatii
			var filtru_avansati=document.getElementById("avansati");
			filtru_avansati.onclick=function()
			{
				for(let i=0; i<divuri.length; i++)
				{
					var avansat=divuri[i].children[4].innerHTML.toString();
					if(avansat.search("false".toLowerCase())==-1){divuri[i].remove(); i--;}
				}
			}

			//Pastrati inregistrarile din 2020
			var inreg_2020=document.getElementById("myCheck");
			myCheck.onclick=function()
			{
				for(let i=0; i<divuri.length; i++)
				{
					var avansat=divuri[i].children[5].innerHTML.toString();
					if(avansat.search("2020".toLowerCase())==-1){divuri[i].remove(); i--;}
				}
			}

			//Pastram preferintele
			var divuri=container.getElementsByClassName("templ_bucatar");
			var preferinte=document.getElementsByName("dishes");
			for(let i=0; i<preferinte.length; i++)
			{
				preferinte[i].onclick=function()
				{
					for(let j=0; j<divuri.length; j++)
					{	
						if(i!=divuri[j].children[0].innerHTML.match(/\d+$/)){divuri[j].remove(); j--;}
					}
				}
			}

			//La apasarea unei taste x (0-4) ramane doar cel cu id=x
			window.onkeypress=function(k)
			{
				var selectati=container.getElementsByClassName("selectat");
				for(let i=0; i<selectati.length; i++)
				{
					if(selectati[i].children[0].innerHTML.match(/\d+$/)==k.key) {selectati[i].remove(); i--;}
				}
			}

			//Folosirea localStorage
			var pref=document.getElementById("preferinte");
			pref.onclick=function()
			{
				localStorage.setItem("valori", container.innerHTML)
			}

			var existenta=localStorage.getItem("valori");
			if(existenta)
			{
				container.innerHTML=existenta;

				for(let i=0; i<divuri.length; i++)
				{
					divuri[i].onclick=function()
					{
						this.classList.toggle("selectat");
					};
				}
			}

			//Varsta Medie
			var varsta=document.getElementById("medium_age");
			var divuri=container.getElementsByTagName("div");
			varsta.onclick=function()
			{
				var sum=0;

				for(let i=0; i<divuri.length; i++)
				{
					sum=sum+Number(divuri[i].children[3].innerHTML.match(/\d+$/));
				}

				var medie=sum/divuri.length;
				Afisare("Media varstei este " + medie + " ani.");
			}

			function Afisare(sir)
			{
				var info=document.getElementById("info");
				var paragraf=document.createElement("p");

				paragraf.innerHTML=sir;
				info.appendChild(paragraf);
			}

			//Modificare proprietati prin schimbare de title
			divuri=container.getElementsByTagName("div");
			for(let i=0; i<divuri.length; i++)
			{
				var FullData=divuri[i].children[5].innerHTML.split(" ")[2];
				var data1=FullData.split("T")[0];
				var numere=data1.split("-");

				const data=new Date();
				const dataFull=new Date(numere[0].toString(), numere[1].toString(), numere[2].toString());

				const utc1=Date.UTC(data.getFullYear(), data.getMonth(), data.getDate());
				const utc2=Date.UTC(dataFull.getFullYear(), dataFull.getMonth(), dataFull.getDate());

				var totalZile=Math.floor((utc1-utc2)/(1000*60*60*24));
				var ani=Math.floor(totalZile/365);
				var luni=Math.floor(totalZile%365/30);
				var zile=Math.floor(totalZile%365%30);

				var titlu="Utilizatorul este inregistrat de ";
				if(ani>0) titlu+=ani.toString()+" an, ";
				if(luni>0) titlu+=luni.toString()+" luni ";
				titlu+=zile +" zile.";
				
				divuri[i].title=titlu;
			}
			
			//Varsta utilizator 1P TASK Modificat 2.1
			//08#07#2000
			function AfisareVarsta(sir)
			{
				var info=document.getElementById("info");
				var paragraf=document.createElement("p");
				var Colectie=info.getElementsByTagName("p")

				for(let i=0; i<Colectie.length; i++)
				if(find("Utilizatorul are varsta de ", Colectie[i])) info.removeChild(Colectie[i]);

				paragraf.innerHTML=sir;
				info.appendChild(paragraf);
			}

			var calc_varsta=document.getElementById("calc_varsta");

			calc_varsta.onclick=function CalculVarsta()
			{
				var varsta=document.getElementById("varsta");
				var valoare=varsta.value;
				var date=valoare.split("#");

				var dataCurenta=new Date();
				var dataFull=new Date(Number(date[2]), Number(date[1]), Number(date[0]),  0, 0, 0);

				const utc1=Date.UTC(dataCurenta.getFullYear(), dataCurenta.getMonth(), 
				dataCurenta.getDate(), dataCurenta.getHours(), dataCurenta.getMinutes(), 
				dataCurenta.getSeconds());

				const utc2=Date.UTC(dataFull.getFullYear(), dataFull.getMonth(), 
				dataFull.getDate(), dataFull.getHours(), dataFull.getMinutes(), 
				dataFull.getSeconds());

				var totalSecunde=Math.floor((utc1-utc2)/(1000));
				
				var ani=Math.floor(totalSecunde/(60*60*24*365));
				var luni=Math.floor(totalSecunde%(60*60*24*365)/(60*60*24*30));
				var zile=Math.floor(totalSecunde%(60*60*24*365)%(60*60*24*30)/(60*60*24));
				var ore=Math.floor(totalSecunde%(60*60*24*365)%(60*60*24*30)%(60*60*24)/(60*60));
				var minute=Math.floor(totalSecunde%(60*60*24*365)%(60*60*24*30)%(60*60*24)%(60*60)/60);
				var secunde=Math.floor(totalSecunde%(60*60*24*365)%(60*60*24*30)%(60*60*24)%(60*60)%60);
				
				var titlu="Utilizatorul are varsta de ";
				titlu+=ani.toString()+" ani, "+luni.toString()+" luni, "+zile.toString() +" zile, ";
				titlu+=ore.toString()+" ore, "+minute.toString()+" minute, "+secunde.toString()+" secunde.";

				AfisareVarsta(titlu);
				setInterval(CalculVarsta,1000);
			}

			//IGNORA
			container.ondblclick=function()
			{
				var divuri=container.getElementsByTagName("div");
				var v_divuri=Array.prototype.slice.call(divuri);

				for(let i=v_divuri.length-1; i>=0; i--)
					container.appendChild(v_divuri[i]);
			}

		}

		//Aparitie treptata titlu TASK Modificat 2.3 1P
		var text ="Delicatese culinare din zone diferite";
		var i=0;
		var j=text.length-1;
		var text_dreapta="";
		var text_stanga="";
		function AparitieTreptata() 
		{
			if(i<j) 
			{
				text_dreapta+=text[i];
				text_stanga=text[j]+text_stanga;
				document.getElementById("titlu").innerHTML=text_dreapta+text_stanga;
				i++;
				j--;
				setTimeout(AparitieTreptata, 100);
			}
			else if(i==j)
			document.getElementById("titlu").innerHTML=text_dreapta+text[i]+text_stanga;
		}
		AparitieTreptata();

		//TASK Verificat 2.4 0.75P Timp petrecut de un utilizator pe site
		function AfisareFooter(sir)
			{
				var info=document.getElementById("footer");
				var paragraf=document.createElement("output");

				if(info.getElementsByTagName("output")[0])info.removeChild(info.getElementsByTagName("output")[0]);

				var minute=Math.floor(sir/60);
				var secunde=sir%60;

				paragraf.innerHTML="Timpul petrecut pe site (in toate sesiunile): " + minute + " minute si " + secunde + " secunde";
				info.insertBefore(paragraf, info.getElementsByTagName("div")[0]);
			}

		var cronometru;
		var cronometruStart;
		var TimpPetrecut = CalculeazaTimpPetrecut();

		function CalculeazaTimpPetrecut()
		{
			TimpPetrecut = parseInt(localStorage.getItem('TimpPetrecut'));
			if(!TimpPetrecut) TimpPetrecut = 0;
			else TimpPetrecut=TimpPetrecut;

			return TimpPetrecut;
		}

		function IncepeNumaratoarea()
		{
			cronometruStart = Date.now();

			cronometru = setInterval(function()
			{
				TimpPetrecut = CalculeazaTimpPetrecut()+(Date.now()-cronometruStart);

				localStorage.setItem('TimpPetrecut',TimpPetrecut);
				cronometruStart = Date.now();

				AfisareFooter(parseInt(TimpPetrecut/1000));
    		}, 1000);
		}

		IncepeNumaratoarea();

		//TASK Verificat 2.13 1P NUMAR CUVINTE PE PAGINA
		var cuvinteInPagina = NumaraCuvinte(document.getElementsByTagName("main"));

		function NumaraCuvinte(cuvinte) 
		{
			var nr=0;
			for (let i = 0; i < cuvinte.length; i++) 
			{
				nr+=cuvinte[i].textContent.split(' ').length;
			}
			return nr;
		}

		function AfisareNrCuvinteInFooter(sir)
			{
				var info=document.getElementById("footer");
				var paragraf=document.createElement("i");

				paragraf.innerHTML=sir+" cuvinte are aceasta pagina.";
				info.appendChild(paragraf);
				info.appendChild(document.createElement("br"));
			}
		AfisareNrCuvinteInFooter(cuvinteInPagina);

}

	

