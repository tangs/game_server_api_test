const test = require('./test_318_temp');

const main = async () => {
    // await test.test(259, 80, 1, 0, 1, 2, 1, 100);
    await test.test(259, 440, 2, 0, 1, 2, 1, 100);
    await test.test(259, 880, 3, 0, 1, 2, 1, 100);
    await test.test(259, 1760, 4, 0, 1, 2, 1, 100);
    await test.test(259, 4400, 5, 0, 1, 2, 1, 100);
}

main()
