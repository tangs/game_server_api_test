// 339 使用的test模版(zzy)

const api = require('./api');
const assert = require('assert');

const test = async (gameId, betMoney, gameLevelId, moneyType, loopTimes) => {
    console.log(`run test: gameId: ${gameId}, betMoney: ${betMoney}, gameLevelId: ${gameLevelId}, moneyType: ${moneyType}`);
    // const context = api.createContext('https://', 'api.h5navi.com:4433', gameId, 'a123123', '123123');
    const context = api.createContext('https://', 'api.eternal.bet:4433', gameId, 'a123123', '123123');
    const loginRet = await api.login(context);
    assert(loginRet, "login fail.");
    
    const token = await api.createGameToken(context);
    console.log(`token: ${token}`);
    assert(token != null, `create token fail.`);
    
    const sitRet = await api.randomPlayerSit(context);
    assert(sitRet == true, 'sit fail.');

    for (let i = 0; i < loopTimes; i++) {
        console.log(`normalSpin: ${i}`);
        const ret = await api.normalSpin(context, betMoney, gameLevelId, moneyType);
        const isFreeGame = ret.context.free_game_count > 0;
        console.log(`is free game: ${isFreeGame}, betMoney: ${betMoney}, gameLevelId: ${gameLevelId}.`);
        assert(typeof isFreeGame == 'boolean', "");
        
        if (!isFreeGame) continue;

        while (true) {
            const ret = await api.freeSpin(context);
            const current = ret.context.current_count;
            const total = ret.context.total_count;
            
            console.log(`c: ${current}, t: ${total}`);
            assert(current != null, '');

            if (current >= total) break;
        }
    }
}

exports.test = test
