/*
User Story:
Title: Add Item to Shopping Cart
As a customer
I want to add items to my shopping cart
So that I can purchase multiple products in a single transaction

Acceptance Criteria:
Given I am on a product page
When I click the "Add to Cart" button
Then the item should be added to my shopping cart
And I should see a confirmation message that the item has been added.

Given I have added an item to my shopping cart
When I navigate to the shopping cart
Then I should see the item listed in my shopping cart
And the quantity should default to 1.

Given I am on the shopping cart page
When I change the quantity of an item
Then the total price for that item should update accordingly
And the cart's subtotal should reflect the updated total price.

Given I have multiple items in my shopping cart
When I remove an item from the cart
Then the item should no longer appear in my shopping cart
And the cart's subtotal should update accordingly.

Given I am on the shopping cart page
When I click on the "Proceed to Checkout" button
Then I should be taken to the checkout page
And the items in my cart should be carried over to the checkout process.

Additional Considerations:
Edge Cases: Consider what happens if the user tries to add more items than are in stock, or if they add and then remove all items, leaving the cart empty.
Usability: Ensure that the "Add to Cart" button is accessible and provides feedback (e.g., a loading spinner) if the action takes time to process.
Performance: Ensure that adding items to the cart and updating the cart is performed quickly and does not hinder the user experience.
Notes for QA Automation:
Test Adding Items: Write test scripts to verify that items can be added to the cart correctly and that the confirmation message appears.
Test Viewing Cart: Verify that items appear in the cart with the correct default quantities and prices.
Test Quantity Changes: Check that changing quantities updates prices accurately.
Test Removing Items: Ensure that items can be removed and that the cart updates as expected.
Test Checkout Process: Validate that items carry over to the checkout page and that no items are lost in transition.
Example Test Scenarios:
Add Single Item to Cart: Add a single item to the cart and verify the confirmation message and cart update.
Add Multiple Items: Add multiple items to the cart and verify the cart's accuracy.
Change Item Quantity: Change the quantity of an item in the cart and check the total price.
Remove Item from Cart: Remove an item from the cart and ensure the cart updates correctly.
Empty Cart: Add and then remove all items to ensure the cart displays as empty.
*/

/*
Notes:
API Endpoint URLs: Ensure the API endpoint URLs match your application's actual endpoints.
Selectors: Adjust the CSS selectors (button.add-to-cart, .notification, .cart-count, etc.) 
to match your application's HTML structure.
Assertions: Tailor the assertions to your application's specific behavior and responses.

By combining these API and UI tests, you can comprehensively test the functionality of adding items
to the shopping cart in an online shop.
*/

/*
Cypress API Tests
For the API tests, we assume there are endpoints like /api/cart for 
adding, viewing, updating, and deleting
items in the cart.
*/

describe('API - Add Item to Cart', () => {
    it('should add an item to the cart', () => {
      cy.request('POST', '/api/cart', { productId: 1, quantity: 1 })
        .then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.have.property('message', 'Item added to cart');
          expect(response.body.cart).to.include({ productId: 1, quantity: 1 });
        });
    });
});

describe('API - View Items in Cart', () => {
    it('should display items in the cart', () => {
      cy.request('/api/cart')
        .then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body.cart).to.be.an('array');
        });
    });
});
  
describe('API - Change Item Quantity', () => {
    it('should update the quantity of an item in the cart', () => {
      cy.request('PUT', '/api/cart', { productId: 1, quantity: 3 })
        .then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body.cart).to.include({ productId: 1, quantity: 3 });
        });
    });
});

describe('API - Remove Item from Cart', () => {
    it('should remove an item from the cart', () => {
      cy.request('DELETE', '/api/cart', { productId: 1 })
        .then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body.cart).not.to.include({ productId: 1 });
        });
    });
  });
  
  
  