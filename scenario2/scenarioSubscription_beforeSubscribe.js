var request = require('request');

function doRequest({url,qs,body}) {
    return new Promise(function (resolve, reject) {
        request({url,qs,body}, function (error, res, body) {
            resolve({error, res, body});
        });
    });
}

async function main(){
    var IP = process.env.IP;
	console.log("A ce moment là ma maison avec l'ip: "+IP +" n'est pas inscrite :");
	
	var response = await doRequest({url:"http://dataservice:3006/fromregistry/getallhouseurl"})
	console.log("Maisons inscrites: " + response.body);
}

main();