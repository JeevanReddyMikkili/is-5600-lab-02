document.addEventListener('DOMContentLoaded', () => {
    const stocksData = JSON.parse(stockContent);
    const userData = JSON.parse(userContent);

    generateUserList(userData);
    
    document.querySelector('#save').addEventListener('click', (event) => handleSave(event, userData));
    document.querySelector('#delete').addEventListener('click', (event) => handleDelete(event, userData));
});

/**
 * Generates the user list dynamically
 */
function generateUserList(users) {
    const userList = document.querySelector('.user-list');
    userList.innerHTML = ''; 

    users.forEach(({ user, id }) => {
        const listItem = document.createElement('li');
        listItem.textContent = ${user.lastname}, ${user.firstname};
        listItem.dataset.id = id;
        userList.appendChild(listItem);
    });

    userList.addEventListener('click', (event) => handleUserClick(event, users));
}

/**
 * Handles user selection from the list
 */
function handleUserClick(event, users) {
    const userId = event.target.dataset.id;
    const selectedUser = users.find(user => user.id == userId);
    
    if (selectedUser) {
        populateForm(selectedUser);
        renderPortfolio(selectedUser.portfolio);
    }
}

/**
 * Populates the form with user data
 */
function populateForm({ user, id }) {
    document.querySelector('#userID').value = id;
    document.querySelector('#firstname').value = user.firstname;
    document.querySelector('#lastname').value = user.lastname;
    document.querySelector('#address').value = user.address;
    document.querySelector('#city').value = user.city;
    document.querySelector('#email').value = user.email;
}

/**
 * Renders the user's portfolio and ensures "View" buttons work
 */
function renderPortfolio(portfolio) {
    const portfolioContainer = document.querySelector('.portfolio-list');
    portfolioContainer.innerHTML = ''; 

    portfolio.forEach(({ symbol, owned }) => {
        const entry = document.createElement('div');
        entry.classList.add('portfolio-entry');
        entry.innerHTML = `
            <p>${symbol} - ${owned} shares</p> 
            <button class="view-stock" data-symbol="${symbol}">View</button>
        `;

        // Attach event listener directly to each button
        const viewButton = entry.querySelector('.view-stock');
        viewButton.addEventListener('click', () => viewStock(symbol));

        portfolioContainer.appendChild(entry);
    });
}

/**
 * Displays stock details when "View" button is clicked
 */
function viewStock(symbol) {
    console.log(Viewing stock: ${symbol}); // Debugging to check if function triggers

    const stock = stocksData.find(stock => stock.symbol == symbol);

    if (stock) {
        document.querySelector('#stockName').textContent = stock.name;
        document.querySelector('#stockSector').textContent = stock.sector;
        document.querySelector('#stockIndustry').textContent = stock.subIndustry;
        document.querySelector('#stockAddress').textContent = stock.address;
        document.querySelector('#logo').src = logos/${symbol}.svg;
    } else {
        console.log("Stock not found");
    }
}

/**
 * Handles user deletion
 */
function handleDelete(event, users) {
    event.preventDefault();
    const userId = document.querySelector('#userID').value;
    const index = users.findIndex(user => user.id == userId);
    
    if (index !== -1) {
        users.splice(index, 1);
        generateUserList(users);
        clearForm();
    }
}

/**
 * Handles saving user updates
 */
function handleSave(event, users) {
    event.preventDefault();
    const id = document.querySelector('#userID').value;
    const user = users.find(user => user.id == id);

    if (user) {
        user.user.firstname = document.querySelector('#firstname').value;
        user.user.lastname = document.querySelector('#lastname').value;
        user.user.address = document.querySelector('#address').value;
        user.user.city = document.querySelector('#city').value;
        user.user.email = document.querySelector('#email').value;

        generateUserList(users);
    }
}

/**
 * Clears form fields
 */
function clearForm() {
    document.querySelector('#userID').value = '';
    document.querySelector('#firstname').value = '';
    document.querySelector('#lastname').value = '';
    document.querySelector('#address').value = '';
    document.querySelector('#city').value = '';
    document.querySelector('#email').value = '';
}

