// select all list items using document.querySelectorAll and store them in a variable.
// Loop through each list item and log the values of the data - name, data - category, and data - color
// attributes to the console using the dataset property.
// Add an event listener when a user clicks on a product, display its details below the list.

// Select all list items
const listItems = document.querySelectorAll('#items li');

// Create ONE details container
const details = document.createElement('div');
details.id = 'details';
document.body.appendChild(details);

// Log attributes and add click listeners
listItems.forEach(item => {
    console.log(`Name: ${item.dataset.name}`);
    console.log(`Category: ${item.dataset.category}`);
    console.log(`Color: ${item.dataset.color}`);

    item.addEventListener('click', () => {
        // Highlight selected item (B)
        listItems.forEach(el => el.classList.remove('selected'));
        item.classList.add('selected');

        // Get emoji icon based on category (A)
        const icon = item.dataset.category === 'fruit' ? '🍎' : '🥦';  // Or customize per item

        // Update details with prettier HTML (A), colored circle (D), and clear button (C)
        details.innerHTML = `
            <div class="details-header">
                <h2>${icon} Product Details</h2>
                <button id="clear-details">Close</button>
            </div>
            <p><strong>Name:</strong> ${item.dataset.name.charAt(0).toUpperCase() + item.dataset.name.slice(1)}</p>
            <p><strong>Category:</strong> ${item.dataset.category}</p>
            <p><strong>Color:</strong> 
                <span class="color-circle" style="background-color: ${item.dataset.color};"></span> 
                ${item.dataset.color}
            </p>
        `;

        // Add event listener for clear button (C)
        document.getElementById('clear-details').addEventListener('click', () => {
            details.innerHTML = '';  // Clear the panel
            listItems.forEach(el => el.classList.remove('selected'));  // Remove highlight
        });

        // Smooth scroll to details
        details.scrollIntoView({ behavior: 'smooth' });
    });
});