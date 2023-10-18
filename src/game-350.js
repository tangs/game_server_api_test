const test = require('./test_350_temp');

const mysql = require('mysql');
const api = require('./api');

const connection = mysql.createConnection({     
    host     : '192.168.1.211',       
    user     : 'root',              
    password : 'a123123',       
    port: '3306',                   
    database: 'ns_games' 
}); 

const main = async () => {
    const gameId = 350;
    const testTimesPerCell = 100;
    const configs = await api.loadConfigs(connection, gameId);
    const startTime = Date.now();
    
    for (const row of configs) {
        const {level_id, bet_money} = row;
        console.log(`test level id: ${level_id}, bet money: ${bet_money}`);
        await test.test(gameId, bet_money, level_id, 0, testTimesPerCell);
    }

    const useMilliSeconds = Date.now() - startTime;
    console.log(`finish test game ${gameId}, types: ${configs.length}, use seconds: ${useMilliSeconds / 1000}`);
}

main();
