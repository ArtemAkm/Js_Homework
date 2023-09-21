const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Введіть ширину прямокутника: ', (width) => {
  rl.question('Введіть висоту прямокутника: ', (height) => {

    const parsedWidth = parseFloat(width);
    const parsedHeight = parseFloat(height);

    if (isNaN(parsedWidth) || isNaN(parsedHeight)) {
      console.log('Будь ласка, введіть числові значення для ширини та висоти.');
    } else {

      const perimeter = 2 * (parsedWidth + parsedHeight);
      console.log(`Периметр прямокутника дорівнює: ${perimeter}`);
    }

    rl.close();
  });
});
