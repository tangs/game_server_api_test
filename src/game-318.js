const test = require('./test_318_temp');

const main = async () => {
    // await test.test(318, 80, 1, 0, 1, 4, 4, 100);
    await test.test(318, 440, 2, 0, 1, 4, 4, 100);
    await test.test(318, 880, 3, 0, 1, 4, 4, 100);
    await test.test(318, 1760, 4, 0, 1, 4, 4, 100);
    await test.test(318, 4400, 5, 0, 1, 4, 4, 100);
}

main();
