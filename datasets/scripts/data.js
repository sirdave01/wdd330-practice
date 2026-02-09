// select all list items using document.querySelectorAll and store them in a variable.
// Loop through each list item and log the values of the data - name, data - category, and data - color
// attributes to the console using the dataset property.
// Add an event listener when a user clicks on a product, display its details below the list.

const listItems = document.querySelectorAll('#items li');
const details = document.createElement('div');
details.id = 'details';
document.body.appendChild(details);

listItems.forEach(item => {
    console.log(`Name: ${item.dataset.name}`);
    console.log(`Category: ${item.dataset.category}`);
    console.log(`Color: ${item.dataset.color}`);

    item.addEventListener('click', () => {
        details.innerHTML = `
            <h2>Product Details</h2>
            <p><strong>Name:</strong> ${item.dataset.name}</p>
            <p><strong>Category:</strong> ${item.dataset.category}</p>
            <p><strong>Color:</strong> ${item.dataset.color}</p>
        `;

        // scroll button feature
        details.scrollIntoView({ behavior: 'smooth' });
    });
});