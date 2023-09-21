/*Говорю сразу код по большай части от Гугла, так как я еще не проходил корни по алгебре*/
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Введіть коефіцієнт a: ', (a) => {
  rl.question('Введіть коефіцієнт b: ', (b) => {
    rl.question('Введіть коефіцієнт c: ', (c) => {
      const coeffA = parseFloat(a);
      const coeffB = parseFloat(b);
      const coeffC = parseFloat(c);

      const discriminant = coeffB ** 2 - 4 * coeffA * coeffC;

      if (discriminant > 0) {
        const x1 = (-coeffB + Math.sqrt(discriminant)) / (2 * coeffA);
        const x2 = (-coeffB - Math.sqrt(discriminant)) / (2 * coeffA);
        console.log(`Рішення: x1 = ${x1}, x2 = ${x2}`);
      } else if (discriminant === 0) {
        const x = -coeffB / (2 * coeffA);
        console.log(`Рішення: x = ${x}`);
      } else {
        const realPart = -coeffB / (2 * coeffA);
        const imaginaryPart = Math.sqrt(Math.abs(discriminant)) / (2 * coeffA);
        console.log(`Рішення: x1 = ${realPart} + ${imaginaryPart}i, x2 = ${realPart} - ${imaginaryPart}i`);
      }

      rl.close();
    });
  });
});
