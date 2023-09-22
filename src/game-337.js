const test = require('./test_337_temp');

const main = async () => {
    // await test.test(337, 80, 1, 0, 1, 4, 4, 100);
    await test.test(337, 300, 2, 0, 100);
    await test.test(337, 500, 3, 0, 100);
    await test.test(337, 1000, 4, 0, 100);
    await test.test(337, 2000, 5, 0, 100);
}

main();
