const axios = require('axios');
const assert = require('assert');

const schema = 'https://';
const addrres = 'api.h5navi.com:4433'
const gameId = 318;

const options = {
    headers: {"content-type": "application/json"}
}

const createContext = (schema, address, gameId, account, password) => {
    return {
        schema: schema,
        address: address,
        gameId: gameId,
        account: account,
        password: password,
        options: {
            headers: { "content-type": "application/json" },
        },
    }
}

const post = async (context, url, body) => {
    const response = await axios.post(url, body, context.options);

    const cookies = response.headers['set-cookie'][0];
    const autoCookie = cookies.split(';')[0];
    context.options.headers.Cookie = autoCookie;

    const isOk = response.status == 200;
    if (!isOk) console.error(`net err: ${response.status}`);
    if (response.data?.context?.error_id != null) {
        assert(false, `responce err, id: ${response.data.context.error_id}, msg: ${response.data.context.msg}`);
    }
    // console.log(`login response code: ${response.status}, isOk: ${isOk}.`);
    return response;
}

const login = async (context) => {
    const { schema, address, account, password } = context;
    const url = `${schema}${address}/login`;
    const body = {
        account: account,
        password: password,
    };

    const response = await post(context, url, body);
    return response.data.success;
}

const createGameToken = async (context) => {
    const { schema, address, gameId } = context;
    const url = `${schema}${address}/create_token/${gameId}`;
    const response = await post(context, url, {});

    const token = response.data.token;
    context.token = token;
    return token
}

const randomPlayerSit = async (context) => {
    const { schema, address, gameId, token } = context;
    const url = `${schema}${address}/func/${gameId}/${token}`;
    const body = {
        func: 'PlayerSit',
        context: {
            sit_info: "Random",
        },
    };

    const response = await post(context, url, body);
    return response.data.func == 'Success';
}

const postFunc = async (context, funcName, funcContext) => {
    const { schema, address, gameId, token } = context;
    const url = `${schema}${address}/func/${gameId}/${token}`;
    const body = {
        func: funcName,
        context: funcContext,
    };

    const response = await post(context, url, body);
    return response.data;
}

const freeSpinType = async (context, freeType) => {
    const funcContext = {
        free_type: freeType,
    };
    return await postFunc(context, 'FreeSpinType', funcContext);
}

const normalSpin = async (context, betMoney, gameLevelId, moneyType) => {
    const funcContext = {
        bet_money: betMoney,
        game_level_id: gameLevelId,
        money_type: moneyType,
    };
    return await postFunc(context, 'NormalSpin', funcContext);
}

const specialSpin = async (context) => {
    const funcContext = {};
    return await postFunc(context, 'SpecialSpin', funcContext);
}

const freeSpin = async (context) => {
    const funcContext = {};
    return await postFunc(context, 'FreeSpin', funcContext);
}

const collectClick = async (context, index) => {
    const funcContext = {
        index: index,
    };
    return await postFunc(context, 'CollectClick', funcContext);
}

const loadConfigs = (connection, gameId) => {
    return new Promise((resolve, reject) => {
        connection.connect();
        var  sql = `SELECT * FROM slots_bet_ratios WHERE game_id=${gameId}`;
        connection.query(sql, function async (err, result) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                reject(err);
                return;
            }
        
            console.log('--------------------------SELECT----------------------------');
            // console.log(result);
            for (const row of result) {
                const {level_id, bet_money} = row
                console.log(`level id: ${level_id}, bet money: ${bet_money}`);
            }
            console.log('------------------------------------------------------------\n\n');
            connection.end();
            resolve(result);
        });
        
    });
}

exports.createContext = createContext
exports.postFunc = postFunc
exports.login = login
exports.createGameToken = createGameToken
exports.randomPlayerSit = randomPlayerSit
exports.freeSpinType = freeSpinType
exports.normalSpin = normalSpin
exports.specialSpin = specialSpin
exports.freeSpin = freeSpin
exports.collectClick = collectClick
exports.loadConfigs = loadConfigs
