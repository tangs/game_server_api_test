// 350 使用的test模版(lhp)

const api = require('./api');
const assert = require('assert');

const freeSpinType = async (context, freeType) => {
    const funcContext = {
        type: freeType,
    };
    return await api.postFunc(context, 'RoyalMonkeyFreeType', funcContext);
}

const normalSpin = async (context, betMoney, gameLevelId, moneyType) => {
    const funcContext = {
        betMoney: betMoney,
        lvID: gameLevelId,
        moneyType: moneyType,
    };
    return await api.postFunc(context, 'RoyalMonkeyNormalSpin', funcContext);
}

const freeSpin = async (context) => {
    const funcContext = {};
    return await api.postFunc(context, 'RoyalMonkeyFreeSpin', funcContext);
}

const test = async (gameId, betMoney, gameLevelId, moneyType, loopTimes) => {
    console.log(`run test: gameId: ${gameId}, betMoney: ${betMoney}, gameLevelId: ${gameLevelId}, moneyType: ${moneyType}`);
    const context = api.createContext('https://', 'api.h5navi.com:4433', gameId, 'a123123', '123123');
    // const context = api.createContext('http://', '127.0.0.1:7445', gameId, 'a123123', '123123');
    const loginRet = await api.login(context);
    assert(loginRet, "login fail.");
    
    const token = await api.createGameToken(context);
    console.log(`token: ${token}`);
    assert(token != null, `create token fail.`);
    
    const sitRet = await api.randomPlayerSit(context);
    assert(sitRet == true, 'sit fail.');

    for (let i = 0; i < loopTimes; i++) {
        console.log(`normalSpin: ${i}`);
        const ret = await normalSpin(context, betMoney, gameLevelId, moneyType);
        const isFreeGame = ret.context.normalSpin.intoFree == 1;
        console.log(`is free game: ${isFreeGame}, betMoney: ${betMoney}, gameLevelId: ${gameLevelId}.`);
        assert(typeof isFreeGame == 'boolean', "");
        
        if (!isFreeGame) continue;

        const freeType = Math.floor(Math.random() * 3) + 1;
        console.log(`free type: ${freeType}`);
        await freeSpinType(context, freeType)
        
        while (true) {
            console.log("start free spin.")
            const ret = await freeSpin(context);
            const current = ret.context.freeSpin.totalCount;
            const total = ret.context.freeSpin.allCount;
            
            console.log(`c: ${current}, t: ${total}`);
            assert(current != null, '');

            if (current >= total) break;
        }
    }
}

exports.test = test
