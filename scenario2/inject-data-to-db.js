const { randomInt } = require('crypto');
const { Pool } = require('pg')
const pool = new Pool({
    user: 'SI5-SOA',
    host: 'database',
    database: 'SI5-SOA',
    password: 'SI5-SOA',
    port: 5432,
})
const prixConsWH=0.00012
const prixVenteWH=0.0001
async function generateBill2LastYear(clientID){
  // note: we don't try/catch this because if connecting throws an exception
  // we don't need to dispose of the client (it will be undefined)
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    // for(var i = 0; i<10;i++){
    // var clientID = randomUUID()
    // const clientQueryText = 'INSERT INTO client(id,id_community,"clientName") VALUES($1,$2,$3)'
    // client.query(clientQueryText, [clientID,1,"Sardoche"])
    var endDate = new Date();

    var dateLoop = new Date();
    dateLoop.setUTCFullYear(dateLoop.getUTCFullYear()-2);
    dateLoop.setHours(0,0,0,0)
    var monthConsumption = 0
    while(dateLoop<endDate){
        const insertConsumptionText = 'INSERT INTO daily_consumption("houseID", "dailyDate","consumptionWH") VALUES ($1, $2,$3) ON CONFLICT DO NOTHING'
        const consumption = 20000+randomInt(-4000,+4000)
        monthConsumption+=consumption
        await client.query(insertConsumptionText, [clientID,dateLoop, consumption])
        if(dateLoop.getDate()==1){
            
            const insertConsumptionText = 'INSERT INTO "client_bill"("houseID", year,month,production,consumption,"productionPrice","consumptionPrice","calculedConsumptionPrice","calculedProductionPrice","finalPrice") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) ON CONFLICT DO NOTHING'
            await client.query(insertConsumptionText,[clientID,dateLoop.getFullYear(),dateLoop.getMonth()+1,0,monthConsumption,prixVenteWH,prixConsWH,prixConsWH*monthConsumption,0,prixConsWH*monthConsumption])
            monthConsumption=0
        }
        dateLoop.setUTCDate(dateLoop.getUTCDate()+1)

    }
    // }
    
    await client.query('COMMIT')
  } catch (e) {
    await client.query('ROLLBACK')
    throw e
  } finally {
    client.release()
  }
}

exports.generateBill2LastYear = generateBill2LastYear