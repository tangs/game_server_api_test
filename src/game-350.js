const test = require('./test_350_temp');

const main = async () => {
    await test.test(350, 880, 2, 0, 100);
    // await test.test(350, 500, 3, 0, 100);
    // await test.test(350, 1000, 4, 0, 100);
    // await test.test(350, 2000, 5, 0, 100);
}

main();
