// 255 使用的test模版(ljh)

const api = require('./api');
const assert = require('assert');

const test = async (gameId, betMoney, gameLevelId, moneyType, freeTypeStart, freeTypeEnd, loopTimes) => {
    console.log(`run test: gameId: ${gameId}, betMoney: ${betMoney}, gameLevelId: ${gameLevelId}, moneyType: ${moneyType}`);
    const context = api.createContext('https://', 'api.eternal.bet:4433', gameId, 'a123123', '123123');
    const loginRet = await api.login(context);
    assert(loginRet, "login fail.");
    
    const token = await api.createGameToken(context);
    console.log(`token: ${token}`);
    assert(token != null, `create token fail.`);
    
    const sitRet = await api.randomPlayerSit(context);
    assert(sitRet == true, 'sit fail.');

    const play3in12Game = async (count) => {
        console.log(`game 3 in 12 times: ${count}`);
        for (let i = 0; i < count; ++i) {            
            await api.collectClick(context, i);
        }
    }

    let freeType = freeTypeStart;

    for (let i = 0; i < loopTimes; i++) {
        console.log(`normalSpin: ${i}`);
        const ret = (await api.normalSpin(context, betMoney, gameLevelId, moneyType)).context;
        const needSelectFreeGameType = ret.is_free_game !== undefined;
        console.log(`need select free game type: ${needSelectFreeGameType}.`);
        const isFreeGame = needSelectFreeGameType ? ret.is_free_game : ret.free_game_count > 0;
        const is3in12 = ret.is_collect;
        console.log(`is free game: ${isFreeGame}, is3in12: ${is3in12}, betMoney: ${betMoney}, gameLevelId: ${gameLevelId}.`);
        assert(typeof isFreeGame == 'boolean', "");
        
        if (!isFreeGame && !is3in12) continue;

        if (is3in12) {
            const times = ret.lines[ret.lines.length - 1].line_cells.length;
            await play3in12Game(times);
            continue;
        }

        // select free type.
        if (needSelectFreeGameType) {
            console.log(`freeType: ${freeType}`);
            const setFreeSpinTypeRet = await api.freeSpinType(context, freeType);
        }

        // free game spin.
        while (true) {

            const ret = (await api.freeSpin(context)).context;
            const current = ret.current_count;
            const total = ret.total_count;
            const is3in12 = ret.is_collect;

            console.log(`c: ${current}, t: ${total}, is3in12: ${is3in12}`);

            if (is3in12) {
                const times = ret.lines[ret.lines.length - 1].line_cells.length;
                await play3in12Game(times);
            }

            assert(current != null, '');
            if (current >= total) break;
        }
    }
}

exports.test = test
