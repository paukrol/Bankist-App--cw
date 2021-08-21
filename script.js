'use strict';

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
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

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movement__row">
        <div class="movement__type movement__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movement__value">${mov}€</div>
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

  labelBalance.textContent = `${acc.balance}€`;
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
  labelSumIn.textContent = `${incomes}€`;
  labelSumOut.textContent = `${Math.abs(out)}€`;
  labelSumInterest.textContent = `${interest}€`;
};

const updateUI = function (acc) {
  displayMovements(acc.movements);

  // Display balance
  calcPrintBalance(acc);

  // Display summary
  calcPrintSummary(acc);
};

// Event handler
let currentAccount;

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

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

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

    // Update UI
    updateUI(currentAccount);

    inputTransferAmount.value = inputTransferTo.value = '';
    inputTransferTo.blur();
  }
});

btnLoan.addEventListener('click', e => {
  e.preventDefault();
  const loanValue = Number(inputLoanAmount.value);

  if (
    loanValue > 0 &&
    currentAccount.movements.some(mov => mov >= (10 / 100) * loanValue)
  ) {
    // Add movement
    currentAccount.movements.push(loanValue);

    //Update UI
    updateUI(currentAccount);

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
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
