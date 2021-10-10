var request = require('request');

function doRequestPost({ url, qs, form, method }) {
    return new Promise(function(resolve, reject) {
        request({ url, qs, form, method }, function(error, res, body) {
            resolve({ error, res, body });
        });
    });
}
async function main() {
    var object = {
        param: [
            { id_producer: "lolo7", productionDate: "2021-10-02T02:00", production: 700 }
        ]
    };
    var response = await doRequestPost({ url: "http://localhost:3020/push-production", form: object, method: "POST" })
}

main();