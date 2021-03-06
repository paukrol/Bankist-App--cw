'use strict';

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2020-11-18T21:31:17.178Z',
    '2020-12-23T07:42:02.383Z',
    '2021-01-28T09:15:04.904Z',
    '2021-04-01T10:17:24.185Z',
    '2021-05-08T14:11:59.604Z',
    '2021-05-27T17:01:17.194Z',
    '2021-07-11T23:36:17.929Z',
    '2021-08-19T10:51:36.790Z',
  ],

  locale: 'en-US',
  currency: 'USD',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2020-11-01T13:15:33.035Z',
    '2020-11-30T09:48:16.867Z',
    '2020-12-25T06:04:23.907Z',
    '2021-01-25T14:18:46.235Z',
    '2021-02-05T16:33:06.386Z',
    '2021-04-10T14:43:26.374Z',
    '2021-06-25T18:49:59.371Z',
    '2021-08-19T12:01:20.894Z',
  ],

  locale: 'pl-PL',
  currency: 'PLN',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,

  movementsDates: [
    '2020-10-11T18:22:33.035Z',
    '2020-12-06T10:51:16.867Z',
    '2020-12-28T09:25:23.907Z',
    '2021-02-05T18:29:46.235Z',
    '2021-03-12T07:35:06.386Z',
    '2021-05-05T16:45:26.374Z',
    '2021-07-01T21:09:59.371Z',
    '2021-08-14T15:05:20.894Z',
  ],

  locale: 'es-MX',
  currency: 'MXN',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,

  movementsDates: [
    '2019-09-11T07:19:33.035Z',
    '2019-10-25T12:05:16.867Z',
    '2019-11-05T16:12:23.907Z',
    '2019-12-05T07:36:46.235Z',
    '2020-01-18T18:28:06.386Z',
    '2021-05-23T21:17:26.374Z',
    '2021-08-25T12:25:59.371Z',
    '2021-08-23T10:05:20.894Z',
  ],

  locale: 'hu-HU',
  currency: 'HUF',
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelData = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// Functions

const watch = function (locale) {
  const tick = function () {
    const now = new Date();

    const options = {
      hour: 'numeric',
      minute: 'numeric',
      // second: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      // weekday: 'long',
    };

    labelData.textContent = new Intl.DateTimeFormat(locale, options).format(
      now
    );

    // console.log(locale);
  };

  tick();

  return tick;
};

const formatMovementDate = (date, locale) => {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    // const day = `${date.getDate()}`.padStart(2, 0);
    // const month = `${date.getMonth() + 1}`.padStart(2, 0);
    // const year = date.getFullYear();

    // return `${day}/${month}/${year}`;

    // const locale = navigator.language;

    return new Intl.DateTimeFormat(locale).format(date);
  }
};

const formatCur = (value, locale, currency) => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value.toFixed(2));
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);
    // console.log(acc.locale);

    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    const html = `
    <div class="movement__row">
        <div class="movement__type movement__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movement__date">${displayDate}</div>
        <div class="movement__value">${formattedMov}</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const creatUsernames = function (accs) {
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
creatUsernames(accounts);

const calcPrintBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov);

  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

const calcPrintSummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, cur) => acc + cur, 0);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, cur) => acc + cur, 0);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int);

  // console.log(interest);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

const updateUI = function (acc) {
  displayMovements(acc);

  // Display balance
  calcPrintBalance(acc);

  // Display summary
  calcPrintSummary(acc);
};

const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    // In each call, print the remaining time to UI
    labelTimer.textContent = `${min} : ${sec}`;

    // When 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }

    // Decrease 1s
    time--;
  };

  // Set time to 5 minutes
  let time = 5 * 60;

  // Call the timer every second
  tick();
  const timer = setInterval(tick, 1000);

  return timer;
};

// Event handler
let currentAccount, timerMain, timer;

btnLogin.addEventListener('click', e => {
  //
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }!`;

    containerApp.style.opacity = '1';

    // Create current date and time
    // const now = new Date();
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const min = `${now.getMinutes()}`.padStart(2, 0);

    watch(currentAccount.locale);
    if (timerMain) clearInterval(timerMain);
    timerMain = setInterval(watch, 1000, currentAccount.locale);

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Added timer
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', e => {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  if (
    amount > 0 &&
    receiverAcc &&
    amount <= currentAccount.balance &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Reset timer
    clearInterval(timer);
    timer = startLogOutTimer();

    // Update UI
    updateUI(currentAccount);

    inputTransferAmount.value = inputTransferTo.value = '';
    inputTransferTo.blur();
  }
});

btnLoan.addEventListener('click', e => {
  e.preventDefault();
  const loanValue = Math.floor(inputLoanAmount.value);

  if (
    loanValue > 0 &&
    currentAccount.movements.some(mov => mov >= (10 / 100) * loanValue)
  ) {
    setTimeout(function () {
      // Add movement
      currentAccount.movements.push(loanValue);

      // Add loan date
      currentAccount.movementsDates.push(new Date().toISOString());

      // Reset timer
      clearInterval(timer);
      timer = startLogOutTimer();

      //Update UI
      updateUI(currentAccount);
    }, 2500);

    inputLoanAmount.value = '';
    inputLoanAmount.blur();
  }
});

btnClose.addEventListener('click', e => {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.value
    );
    // Delete account
    accounts.splice(index, 1);

    // Update UI
    containerApp.style.opacity = '0';
    labelWelcome.textContent = 'Log in to get started';
  }

  inputCloseUsername.value = inputClosePin.value = '';
  inputClosePin.blur();
});

let sorted = false;

btnSort.addEventListener('click', e => {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});
