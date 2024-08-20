const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const incomeText = document.getElementById('income-text');
const expenseText = document.getElementById('expense-text');
const budget = document.getElementById('budget');
const remainingBudget = document.getElementById('remaining-budget');
const budgetText = document.getElementById('budget-text');
const setBudgetBtn = document.getElementById('set-budget-btn');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let budgetLimit = localStorage.getItem('budget') ? parseFloat(localStorage.getItem('budget')) : 0;

function addTransaction(e) {
    e.preventDefault();

    if (text.value.trim() === '' || (incomeText.value.trim() === '' && expenseText.value.trim() === '')) {
        alert('Please add a text and amount');
        return;
    }

    const transaction = {
        id: generateID(),
        text: text.value,
        amount: +incomeText.value - +expenseText.value,
    };

    transactions.push(transaction);
    addTransactionToDOM(transaction);
    updateValues();
    updateLocalStorage();

    text.value = '';
    incomeText.value = '';
    expenseText.value = '';
}

function generateID() {
    return Math.floor(Math.random() * 100000000);
}

function addTransactionToDOM(transaction) {
    const sign = transaction.amount < 0 ? '-' : '+';

    const item = document.createElement('li');
    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');
    item.innerHTML = `
        ${transaction.text} <span>${sign}${Math.abs(transaction.amount).toFixed(2)}</span>
        <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
    `;
    list.appendChild(item);
}

function updateValues() {
    const amounts = transactions.map(transaction => transaction.amount);
    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
    const income = amounts.filter(item => item > 0).reduce((acc, item) => (acc += item), 0).toFixed(2);
    const expense = amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0).toFixed(2);

    balance.innerText = `$${total}`;
    money_plus.innerText = `$${income}`;
    money_minus.innerText = `$${Math.abs(expense)}`;
    updateBudget();
}

function updateBudget() {
    const total = parseFloat(balance.innerText.replace('$', '')) || 0;
    const remaining = budgetLimit - total;
    budget.innerText = `$${budgetLimit.toFixed(2)}`;
    remainingBudget.innerText = `$${remaining.toFixed(2)}`;
}

function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    updateValues();
    updateLocalStorage();
}

function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function setBudget(e) {
    e.preventDefault();
    budgetLimit = parseFloat(budgetText.value);
    localStorage.setItem('budget', budgetLimit);
    updateBudget();
    budgetText.value = "";
}

form.addEventListener('submit', addTransaction);
setBudgetBtn.addEventListener('click', setBudget);

// Initial rendering
transactions.forEach(addTransactionToDOM);
updateValues();

const themeToggle = document.querySelector('.theme-toggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});
