const printFizzBuzz = (current: number): void => {

    if (current % 15 == 0) {
        console.log('FizzBuzz!!');
        return;
    }
    if (current % 3 == 0) {
        console.log('Fizz');
        return;
    }
    if (current % 5 == 0) {
        console.log('Buzz');
        return;
    }
    console.log(current);
};

for (let i=1; i < 100; i++) {
    printFizzBuzz(i);
}