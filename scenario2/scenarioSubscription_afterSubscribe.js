
var request = require('request');

function doRequest({url,qs,body}) {
    return new Promise(function (resolve, reject) {
        request({url,qs,body}, function (error, res, body) {
            resolve({error, res, body});
        });
    });
}

async function main(){
	var IPClient = process.env.IP;//TODO

	//---------- STEP 1
	console.log("Ma maison est maintenant inscrite :");
	
	var response = await doRequest({url:"http://dataservice:3006/fromregistry/getallhouseurl"})
	console.log("Maisons inscrites: " + response.body);

	//---------- STEP 2 
	console.log("\nOn constate que SmartGrid lui a attribué un ID et un ID de communauté :");

	var houseID = 0;
	var communityID = 0;
	var date = '2021-10-02T03:00';

	var House = { ID:houseID };
	var Community = { ID:communityID };
	var Date = {date:date};

	response = await doRequest({url:"http://dataservice:3006/fromregistry/gethouseurl", qs:House})
	console.log("House ID = "+houseID+" : " + response.body);

	response = await doRequest({url:"http://dataservice:3006/fromregistry/getcommunityurl", qs:Community})
	console.log("Community ID = "+communityID+" : " + response.body);

	//---------- STEP 3 
	console.log("\nJe peux maintenant consulter sa consommation en interne :");
	response = await doRequest({url:"http://"+IPClient+"/consumption/global	", qs:Date})
	console.log("Consommation de la maison a la date "+date+" est : " + response.body);
}

main();