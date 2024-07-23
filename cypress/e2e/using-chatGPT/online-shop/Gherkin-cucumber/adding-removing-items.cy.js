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
Gherkin, like YAML and Python, is a line-oriented programming language. 
Each line in the terminals is referred to as a step, and it begins with keywords.
*/

// Feature File (shopping_cart.feature)
Feature: Shopping Cart

  As a customer
  I want to add items to my shopping cart
  So that I can purchase multiple products in a single transaction

  Scenario: Add single item to cart
    Given I am on a product page
    When I click the "Add to Cart" button
    Then the item should be added to my shopping cart
    And I should see a confirmation message that the item has been added

  Scenario: View items in cart
    Given I have added an item to my shopping cart
    When I navigate to the shopping cart
    Then I should see the item listed in my shopping cart
    And the quantity should default to 1

  Scenario: Change item quantity
    Given I am on the shopping cart page
    When I change the quantity of an item
    Then the total price for that item should update accordingly
    And the cart's subtotal should reflect the updated total price

  Scenario: Remove item from cart
    Given I have multiple items in my shopping cart
    When I remove an item from the cart
    Then the item should no longer appear in my shopping cart
    And the cart's subtotal should update accordingly

  Scenario: Proceed to checkout
    Given I am on the shopping cart page
    When I click on the "Proceed to Checkout" button
    Then I should be taken to the checkout page
    And the items in my cart should be carried over to the checkout process

// Step Definitions (shopping_cart_steps.js)
const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('chai');
const cy = require('cypress');

Given('I am on a product page', () => {
  cy.visit('/product/1');
});

When('I click the {string} button', (buttonText) => {
  cy.contains('button', buttonText).click();
});

Then('the item should be added to my shopping cart', () => {
  cy.get('.cart-count').should('contain', '1');
});

Then('I should see a confirmation message that the item has been added', () => {
  cy.get('.notification').should('contain', 'Item added to cart');
});

Given('I have added an item to my shopping cart', () => {
  cy.request('POST', '/api/cart', { productId: 1, quantity: 1 });
});

When('I navigate to the shopping cart', () => {
  cy.visit('/cart');
});

Then('I should see the item listed in my shopping cart', () => {
  cy.get('.cart-item').should('have.length', 1);
});

Then('the quantity should default to {int}', (quantity) => {
  cy.get('.cart-item .quantity').should('contain', quantity);
});

Given('I am on the shopping cart page', () => {
  cy.visit('/cart');
});

When('I change the quantity of an item', () => {
  cy.get('.cart-item .quantity-input').clear().type('3');
  cy.get('.cart-item .update-quantity').click();
});

Then('the total price for that item should update accordingly', () => {
  cy.get('.cart-item .total-price').should('contain', '30'); // Assuming each item costs 10
});

Then('the cart\'s subtotal should reflect the updated total price', () => {
  cy.get('.cart-subtotal').should('contain', '30'); // Assuming there's only one item
});

Given('I have multiple items in my shopping cart', () => {
  cy.request('POST', '/api/cart', { productId: 2, quantity: 1 });
});

When('I remove an item from the cart', () => {
  cy.get('.cart-item .remove-item').first().click();
});

Then('the item should no longer appear in my shopping cart', () => {
  cy.get('.cart-item').should('have.length', 1); // Assuming one item was removed
});

Then('the cart\'s subtotal should update accordingly', () => {
  cy.get('.cart-subtotal').should('contain', '10'); // Assuming one item costing 10 remains
});

When('I click on the {string} button', (buttonText) => {
  cy.contains('button', buttonText).click();
});

Then('I should be taken to the checkout page', () => {
  cy.url().should('include', '/checkout');
});

Then('the items in my cart should be carried over to the checkout process', () => {
  cy.get('.checkout-item').should('have.length', 1); // Assuming one item in the cart
});

// Negative scenario outline
// Feature File (negative_scenarios.feature)
Feature: Shopping Cart Negative Scenarios

  As a customer
  I want to see proper error handling
  So that I can understand and correct issues when adding items to my shopping cart

  Scenario Outline: Adding more items than available stock
    Given I am on a product page
    When I try to add <quantity> items to the cart
    Then I should see an error message "<errorMessage>"

    Examples:
      | quantity | errorMessage                      |
      | 100      | "Requested quantity not available"|

  Scenario Outline: Adding an item without being logged in
    Given I am not logged in
    When I try to add an item to the cart
    Then I should see an error message "<errorMessage>"
    And I should be redirected to the login page

    Examples:
      | errorMessage             |
      | "Please log in to add items to the cart" |

  Scenario Outline: Removing an item not in the cart
    Given I am on the shopping cart page
    When I try to remove an item with productId <productId> not in the cart
    Then I should see an error message "<errorMessage>"

    Examples:
      | productId | errorMessage                   |
      | 9999      | "Item not found in the cart"   |

  Scenario Outline: Updating quantity to zero
    Given I have added an item to my shopping cart
    When I update the quantity to <quantity>
    Then I should see an error message "<errorMessage>"

    Examples:
      | quantity | errorMessage                 |
      | 0        | "Quantity must be at least 1"|

// Step Definitions (negative_scenarios_steps.js)
const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('chai');
const cy = require('cypress');

Given('I am on a product page', () => {
  cy.visit('/product/1');
});

When('I try to add {int} items to the cart', (quantity) => {
  cy.get('.quantity-input').clear().type(quantity);
  cy.get('button.add-to-cart').click();
});

Then('I should see an error message {string}', (errorMessage) => {
  cy.get('.error-message').should('contain', errorMessage);
});

Given('I am not logged in', () => {
  cy.clearCookies();
  cy.visit('/product/1');
});

When('I try to add an item to the cart', () => {
  cy.get('button.add-to-cart').click();
});

Then('I should be redirected to the login page', () => {
  cy.url().should('include', '/login');
});

Given('I am on the shopping cart page', () => {
  cy.visit('/cart');
});

When('I try to remove an item with productId {int} not in the cart', (productId) => {
  cy.request({
    method: 'DELETE',
    url: `/api/cart/${productId}`,
    failOnStatusCode: false,
  }).then((response) => {
    expect(response.status).to.eq(404);
  });
});

Given('I have added an item to my shopping cart', () => {
  cy.request('POST', '/api/cart', { productId: 1, quantity: 1 });
});

When('I update the quantity to {int}', (quantity) => {
  cy.visit('/cart');
  cy.get('.cart-item .quantity-input').clear().type(quantity);
  cy.get('.cart-item .update-quantity').click();
});
