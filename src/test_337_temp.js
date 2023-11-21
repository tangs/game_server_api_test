// 337 使用的test模版(zzy)

const api = require('./api');
const assert = require('assert');

const test = async (gameId, betMoney, gameLevelId, moneyType, loopTimes) => {
    console.log(`run test: gameId: ${gameId}, betMoney: ${betMoney}, gameLevelId: ${gameLevelId}, moneyType: ${moneyType}`);
    // const context = api.createContext('https://', 'api.h5navi.com:4433', gameId, 'a123123', '123123');
    const context = api.createContext('https://', 'api.eternal.bet:4433', gameId, 'a123123', '123123');
    // const context = api.createContext('http://', '127.0.0.1:80', gameId, 'a123123', '123123');
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
        const emitSpecialType = ret.context.spinResult.emitSpecialType;
        const isFreeGame = emitSpecialType == 1;
        const isSpecialGame = emitSpecialType == 3 || emitSpecialType == 4;

        console.log(`gameLevelId: ${gameLevelId}, betMoney: ${betMoney}, emitSpecialType: ${emitSpecialType}.`);
        console.log(`is free game: ${isFreeGame}, is special game: ${isSpecialGame}`);
        assert(typeof isFreeGame == 'boolean', "");
    
        const specialSpin = async () => {
            while (true) {
                console.log('special spin.');
                const ret = await api.specialSpin(context);
                const spinResult = ret.context.spinResult;
                const current = spinResult.lottyGameCurCount;
                const total = spinResult.lottyGameTotalCount;
                
                console.log(`c: ${current}, t: ${total}, ${spinResult.emitSpecialType}`);
                assert(current != null, '');
    
                if (current >= total) break;
            }
        }

        if (isSpecialGame) {
            await specialSpin();
        }

        if (!isFreeGame) continue;

        while (true) {
            const setFreeSpinTypeRet = await api.freeSpinType(context, 0);
            let restSelectCount = 0;
            while (true) {
                console.log('free spin.');
                const ret = await api.freeSpin(context);
                const spinResult = ret.context.spinResult;
                const current = spinResult.freeGameCurCount;
                const total = spinResult.freeGameTotalCount;
                restSelectCount = spinResult.restSelectCount;

                const emitSpecialType = spinResult.emitSpecialType;
                const isSpecialGame = emitSpecialType == 3 || emitSpecialType == 4;
                
                console.log(`times: ${restSelectCount}, c: ${current}, t: ${total}, ${emitSpecialType}, ${isSpecialGame}`);
                assert(current != null, '');

                if (isSpecialGame) {
                    await specialSpin();
                }

                if (current >= total) break;
            }
            if (restSelectCount == 0) break;
            console.log('free to free.');
        }
    }
}

exports.test = test
