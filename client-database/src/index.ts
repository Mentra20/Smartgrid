import "reflect-metadata";
import {createConnection} from "typeorm";
import {Client} from "./entity/Client";

createConnection({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "SI5-SOA",
    password: "SI5-SOA",
    database: "SI5-SOA",
    entities: [
        Client
    ],
    synchronize: true,
    logging: false
}).then(async connection => {
    /*let client = new Client();
    client.clientName = "DUPONT";
    client.id_community = 1;

    let clientRepository = connection.getRepository(Client);

    await clientRepository.save(client);
    console.log("Saved a client with id: " + client.id);*/
    
    // console.log("Inserting a new user into the database...");
    // const user = new User();
    // user.firstName = "Timber";
    // user.lastName = "Saw";
    // user.age = 25;
    // await connection.manager.save(user);
    // console.log("Saved a new user with id: " + user.id);

    // console.log("Loading users from the database...");
    // const users = await connection.manager.find(User);
    // const users = await clientRepository.find(User);
    // console.log("Loaded users: ", users);

    // console.log("Here you can setup and run express/koa/any other framework.");

}).catch(error => console.log(error));
