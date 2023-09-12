// 317 318 259 使用的test模版(ljh)

const api = require('./api');
const assert = require('assert');

const test = async (gameId, betMoney, gameLevelId, moneyType, freeTypeStart, freeTypeEnd, specialTypeIndex, loopTimes) => {
    console.log(`run test: gameId: ${gameId}, betMoney: ${betMoney}, gameLevelId: ${gameLevelId}, moneyType: ${moneyType}`);
    const context = api.createContext('https://', 'api.h5navi.com:4433', gameId, 'a123123', '123123');
    const loginRet = await api.login(context);
    assert(loginRet, "login fail.");
    
    const token = await api.createGameToken(context);
    console.log(`token: ${token}`);
    assert(token != null, `create token fail.`);
    
    const sitRet = await api.randomPlayerSit(context);
    assert(sitRet == true, 'sit fail.');
    
    let freeType = freeTypeStart

    for (let i = 0; i < loopTimes; i++) {
        console.log(`normalSpin: ${i}`);
        const ret = await api.normalSpin(context, betMoney, gameLevelId, moneyType);
        const isFreeGame = ret.context.is_free_game;
        console.log(`is free game: ${isFreeGame}, betMoney: ${betMoney}, gameLevelId: ${gameLevelId}.`);
        assert(typeof isFreeGame == 'boolean', "");
        
        if (isFreeGame) {
            console.log(`freeType: ${freeType}`);
            const setFreeSpinTypeRet = await api.freeSpinType(context, freeType);
    
            if (freeType == specialTypeIndex) {
                while (true) {
                    const ret = await api.specialSpin(context);
                    const current = ret.context.current_count;
                    const total = ret.context.total_count;
                    console.log(`c: ${current}, t: ${total}`);
                    assert(current != null, '');
                    if (current >= total) break;
                }
            } else {
                while (true) {
                    const ret = await api.freeSpin(context);
                    const current = ret.context.current_count;
                    const total = ret.context.total_count;
                    console.log(`c: ${current}, t: ${total}`);
                    assert(current != null, '');
                    if (current >= total) break;
                }
            }
            if (++freeType > freeTypeEnd) freeType = freeTypeStart;
        }
    }
}

exports.test = test
