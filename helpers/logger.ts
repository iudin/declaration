import readline from 'readline';

type ErrorType = 'AUTH ERROR' | 'NAVIGATION ERROR' | 'ADD INCOME ERROR' | 'EXIT ERROR';

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',

  fg: {
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
  },

  bg: {
    black: '\x1b[40m',
    red: '\x1b[41m',
    green: '\x1b[42m',
    yellow: '\x1b[43m',
    blue: '\x1b[44m',
    magenta: '\x1b[45m',
    cyan: '\x1b[46m',
    white: '\x1b[47m',
  },
};

export const logError = (error: any, type: ErrorType) => {
  const dividerStyle = `${colors.fg.red}${colors.bg.white}%s${colors.reset}`;
  const divider = '====================';
  console.log(dividerStyle, divider);
  console.log(colors.bright, colors.fg.red, type, colors.reset);
  console.error(error);
  console.log(dividerStyle, divider);
};

export const logInfo = (msg: string) => {
  const msgStyle = `${colors.bright}${colors.fg.cyan}%s${colors.reset}`;
  console.log(msgStyle, `*** ${msg} ***`);
};

export const logWarning = (msg: string) => {
  const msgStyle = `${colors.bright}${colors.fg.yellow}%s${colors.reset}`;
  console.log(msgStyle, `*** ${msg} ***`);
};

export const askQuestion = (query: string) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const dividerStyle = `${colors.fg.green}${colors.bg.white}%s${colors.reset}`;
  const divider = '====================';
  console.log(dividerStyle, divider);
  console.log(colors.bright, colors.fg.green, query, colors.reset);

  return new Promise((resolve) =>
    rl.question('', (ans) => {
      rl.close();
      resolve(ans);
    })
  );
};
