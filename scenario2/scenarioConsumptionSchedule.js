
var request = require('request');

function doRequest({url,qs,body}) {
    return new Promise(function (resolve, reject) {
        request({url,qs,body}, function (error, res, body) {
            resolve({error, res, body});
        });
    });
}

function doRequestPost({url,qs,form, method}) {
    return new Promise(function (resolve, reject) {
        request({url,qs,form, method}, function (error, res, body) {
            resolve({error, res, body});
        });
    });
}

async function main(){
	var response;

	//------ BEFORE STEPS ------
    var IPclient = "";//TODO

    //On ajout des objects pour une conso
    var mixeur = {
		name:'Mixeur', 
		consumptionTime:{
			timeSlots:[
			{start:"2021-10-02T01:00",end:"2021-10-02T05:00",consumption:200}]
		}
      };
	response = await doRequestPost({url:"http://"+IPclient+"/object-editor/add-basic", form:{houseObject:mixeur},  method:"POST"})

	//------------ STEP 1 --------------
    var date1 = '2021-10-02T02:00';
    var houseID = 0;

	console.log("\nOn regarde la consommation actuelle de la maison en interne :");
	response = await doRequest({url:"http://"+IPclient+"/consumption/global	", qs:{date:date1}})
	console.log("La consommation de la maison d'ID "+houseID+" le "+date1+" est : " + response.body);

    console.log("\nOn regarde les équipements de la maison:");
	response = await doRequest({url:"http://"+IPclient+"/consumption/detailed", qs:{date:date1}})
    console.log("Les équipement de la maison d'ID "+houseID+" le "+date1+" : "+response.body);  

	//------------ STEP 2 --------------
    var date2 = '2021-10-02T03:00';

	console.log("\nOn branche une voiture à la maison :");
    var voiture = {
		name:'voiture', 
		consumption:500
      };

	response = await doRequestPost({url:"http://"+IPclient+"/object-editor/add-scheduled", form:voiture,  method:"POST"})

    console.log("\nOn regarde si la voiture est ajoutée:");
	response = await doRequest({url:"http://"+IPclient+"/consumption/detailed", qs:{date:date2}})
    console.log("Les équipement de la maison d'ID "+houseID+" le "+date2+" : "+response.body);  


	//------------ STEP 3 --------------
	console.log("\nUne demande de planning est faite et reçue :");
    //TODO

	//------------ STEP 4 --------------
    var req1 = {date:date2, ID:houseID};

    console.log("\nOn regarde la nouvelle consommation de la maison depuis SmartGrid:");
	response = await doRequest({url:"http://consumption-manager:3008/house-consumption", qs:req1})
	console.log("La consommation de la maison d'ID "+houseID+" le "+date2+" est : " + response.body);
	
    console.log("\nOn voit donc que la voiture est branchée :");
}

main();