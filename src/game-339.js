const test = require('./test_339_temp');

const main = async () => {
    await test.test(339, 100, 1, 0, 100);
    await test.test(339, 400, 2, 0, 100);
    await test.test(339, 500, 3, 0, 100);
    await test.test(339, 1000, 4, 0, 100);
    await test.test(339, 2000, 5, 0, 100);
}

main();
