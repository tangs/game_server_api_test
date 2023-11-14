// const target = {
//     key: 3,
// }

// const b = {}
// b[target] = true;

// for (const key of Object.keys(b)) {
    console.log(key == target);
//     console.log(b[key])
// }


class test_a {
    a() {}
}

class test_b {
    b() {}
}

const a = new test_a()
const b = new test_b()


const test_obj = {}

test_obj[a] = 1
test_obj[b] = 2

// console.log(test_obj)

for (const key of Object.keys(test_obj)) {
    console.log(typeof(key), test_obj[key]);
}
