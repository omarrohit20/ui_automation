# OWASP Juice Shop Comprehensive Test Plan

## Application Overview

The OWASP Juice Shop is an intentionally insecure web application designed for security testing and learning. It features an e-commerce interface with product catalog, user authentication, search functionality, customer reviews, feedback system, and various security vulnerabilities for educational purposes.

## Test Scenarios

### 1. User Authentication and Account Management

**Seed:** `tests/seed.spec.ts`

#### 1.1. TC001 - User Registration with Valid Data

**File:** `tests/user-auth/TC001-valid-registration.spec.ts`

**Steps:**
  1. Navigate to the homepage
  2. Click on the Account menu
  3. Click on 'Login'
  4. Click on 'Not yet a customer?' to go to registration page
  5. Enter a valid email address in the Email field
  6. Enter a valid password (5-40 characters) in the Password field
  7. Re-enter the same password in the Repeat Password field
  8. Click on the Security Question dropdown and select a question
  9. Enter an answer to the security question
  10. Click the Register button

**Expected Results:**
  - Homepage loads successfully
  - Account menu dropdown appears
  - Login page displays with login form
  - Registration page displays with all required fields
  - Email field accepts valid email format
  - Password field accepts text and shows character count
  - Repeat Password field accepts matching password
  - Security question dropdown shows available questions
  - Answer field accepts text input
  - Registration completes successfully and user is redirected

#### 1.2. TC002 - User Registration with Invalid Data

**File:** `tests/user-auth/TC002-invalid-registration.spec.ts`

**Steps:**
  1. Navigate to the registration page
  2. Attempt registration with invalid email format
  3. Attempt registration with password less than 5 characters
  4. Attempt registration with password more than 40 characters
  5. Attempt registration with mismatched passwords
  6. Attempt registration without selecting security question
  7. Attempt registration with empty answer field

**Expected Results:**
  - Registration page loads properly
  - Invalid email shows validation error
  - Short password shows validation error
  - Long password shows validation error
  - Mismatched passwords show validation error
  - Missing security question prevents submission
  - Empty answer field prevents submission

#### 1.3. TC003 - User Login with Valid Credentials

**File:** `tests/user-auth/TC003-valid-login.spec.ts`

**Steps:**
  1. Navigate to the login page
  2. Enter valid email address
  3. Enter valid password
  4. Check the 'Remember me' checkbox
  5. Click the Login button

**Expected Results:**
  - Login page displays correctly
  - Email field accepts valid email
  - Password field accepts password with masking
  - Remember me checkbox can be selected
  - Login succeeds and user is authenticated

#### 1.4. TC004 - User Login with Invalid Credentials

**File:** `tests/user-auth/TC004-invalid-login.spec.ts`

**Steps:**
  1. Navigate to the login page
  2. Attempt login with invalid email format
  3. Attempt login with empty password
  4. Attempt login with incorrect credentials
  5. Verify login button is disabled for empty fields

**Expected Results:**
  - Login page loads correctly
  - Invalid email format shows error
  - Empty password field prevents login
  - Incorrect credentials show appropriate error message
  - Login button remains disabled when required fields are empty

#### 1.5. TC005 - Password Reset Functionality

**File:** `tests/user-auth/TC005-password-reset.spec.ts`

**Steps:**
  1. Navigate to the login page
  2. Click on 'Forgot your password?' link
  3. Enter valid email address
  4. Submit password reset request
  5. Verify email field validation for invalid formats

**Expected Results:**
  - Login page displays properly
  - Password reset page opens
  - Email field accepts valid email addresses
  - Password reset request processes appropriately
  - Invalid email formats show validation errors

### 2. Product Catalog and Search Functionality

**Seed:** `tests/seed.spec.ts`

#### 2.1. TC006 - Product Catalog Display

**File:** `tests/product-catalog/TC006-catalog-display.spec.ts`

**Steps:**
  1. Navigate to the homepage
  2. Verify all products are displayed
  3. Check product information (name, price, availability)
  4. Verify pagination controls
  5. Test items per page dropdown functionality

**Expected Results:**
  - Homepage loads with product grid
  - All products display with proper information
  - Product names, prices, and availability status are visible
  - Pagination controls are functional
  - Items per page setting changes product display count

#### 2.2. TC007 - Product Search with Valid Keywords

**File:** `tests/product-catalog/TC007-valid-search.spec.ts`

**Steps:**
  1. Click on the search field
  2. Enter 'apple' as search term
  3. Press Enter or click search button
  4. Verify search results
  5. Clear search and try different keywords like 'juice'

**Expected Results:**
  - Search field becomes active
  - Search term is entered successfully
  - Search executes and shows results page
  - Results show products matching 'apple' keyword
  - Different search terms return appropriate results

#### 2.3. TC008 - Product Search with No Results

**File:** `tests/product-catalog/TC008-no-results-search.spec.ts`

**Steps:**
  1. Click on the search field
  2. Enter a search term that yields no results (e.g., 'xyz123')
  3. Execute the search
  4. Verify no results message or empty state

**Expected Results:**
  - Search field accepts the input
  - Search term with no matches is entered
  - Search executes successfully
  - Appropriate 'no results' message or empty state is displayed

#### 2.4. TC009 - Product Details View

**File:** `tests/product-catalog/TC009-product-details.spec.ts`

**Steps:**
  1. Navigate to homepage
  2. Click on any product card
  3. Verify product details dialog opens
  4. Check product image, name, description, and price
  5. Expand the reviews section
  6. Close the product details dialog

**Expected Results:**
  - Homepage displays product grid
  - Product details dialog opens when product is clicked
  - All product information is displayed correctly
  - Product image, name, description, and price are visible
  - Reviews section expands showing customer reviews
  - Dialog closes properly when close button is clicked

### 3. Customer Feedback and Communication

**Seed:** `tests/seed.spec.ts`

#### 3.1. TC010 - Submit Valid Customer Feedback

**File:** `tests/customer-feedback/TC010-valid-feedback.spec.ts`

**Steps:**
  1. Navigate to Customer Feedback page via side menu
  2. Verify author field is pre-populated with 'anonymous'
  3. Enter a comment in the comment field (within 160 characters)
  4. Adjust the star rating using the slider
  5. Solve the CAPTCHA by calculating the mathematical expression
  6. Enter the CAPTCHA solution
  7. Click Submit button

**Expected Results:**
  - Customer Feedback page loads correctly
  - Author field shows 'anonymous' by default
  - Comment field accepts text and shows character count
  - Star rating slider allows selection of rating
  - CAPTCHA displays mathematical expression correctly
  - CAPTCHA solution field accepts numeric input
  - Feedback submission processes successfully

#### 3.2. TC011 - Submit Feedback with Invalid Data

**File:** `tests/customer-feedback/TC011-invalid-feedback.spec.ts`

**Steps:**
  1. Navigate to Customer Feedback page
  2. Leave comment field empty and attempt submission
  3. Enter more than 160 characters in comment field
  4. Enter incorrect CAPTCHA solution
  5. Verify validation messages for each error case

**Expected Results:**
  - Feedback page displays correctly
  - Empty comment prevents form submission
  - Character limit is enforced for comment field
  - Incorrect CAPTCHA solution shows error message
  - Appropriate validation messages appear for all error cases

#### 3.3. TC012 - CAPTCHA Functionality

**File:** `tests/customer-feedback/TC012-captcha-functionality.spec.ts`

**Steps:**
  1. Navigate to Customer Feedback page
  2. Identify the CAPTCHA mathematical expression
  3. Calculate the correct answer
  4. Enter the correct answer in the result field
  5. Test with an incorrect answer
  6. Verify CAPTCHA validation behavior

**Expected Results:**
  - Feedback page loads with CAPTCHA displayed
  - CAPTCHA shows mathematical expression clearly
  - Correct calculation can be determined
  - Result field accepts numeric input
  - Incorrect answer prevents form submission
  - CAPTCHA validation works as expected

### 4. Navigation and Information Pages

**Seed:** `tests/seed.spec.ts`

#### 4.1. TC013 - Side Navigation Menu Functionality

**File:** `tests/navigation/TC013-side-navigation.spec.ts`

**Steps:**
  1. Click the hamburger menu icon to open side navigation
  2. Verify all menu items are present (Customer Feedback, About Us, Photo Wall, Score Board, GitHub)
  3. Click on each menu item to verify navigation
  4. Close the side menu using Escape key or backdrop click

**Expected Results:**
  - Side navigation menu opens when hamburger icon is clicked
  - All expected menu items are visible and accessible
  - Each menu item navigates to the correct page
  - Side menu closes properly using Escape or backdrop click

#### 4.2. TC014 - About Us Page Content

**File:** `tests/navigation/TC014-about-page.spec.ts`

**Steps:**
  1. Navigate to About Us page through side menu
  2. Verify page content and information display
  3. Check for any interactive elements or links
  4. Verify page layout and accessibility

**Expected Results:**
  - About Us page loads successfully
  - Page displays relevant company information
  - Any links or interactive elements function correctly
  - Page layout is appropriate and accessible

#### 4.3. TC015 - Photo Wall Functionality

**File:** `tests/navigation/TC015-photo-wall.spec.ts`

**Steps:**
  1. Navigate to Photo Wall page
  2. Verify image display and layout
  3. Check for image loading and display quality
  4. Test any interactive features on the photo wall

**Expected Results:**
  - Photo Wall page loads without errors
  - Images are displayed in appropriate layout
  - All images load correctly with good quality
  - Interactive features (if any) work as expected

#### 4.4. TC016 - Score Board Access

**File:** `tests/navigation/TC016-score-board.spec.ts`

**Steps:**
  1. Navigate to Score Board page through side menu
  2. Verify score board displays challenges or achievements
  3. Check for any progress indicators or completion status
  4. Verify page functionality and interactivity

**Expected Results:**
  - Score Board page loads successfully
  - Challenges or achievements are displayed appropriately
  - Progress indicators show current status accurately
  - Page interactive elements function correctly

### 5. User Interface and User Experience

**Seed:** `tests/seed.spec.ts`

#### 5.1. TC017 - Language Selection Functionality

**File:** `tests/ui-ux/TC017-language-selection.spec.ts`

**Steps:**
  1. Click on the Language selection menu button
  2. Verify available language options
  3. Select a different language option
  4. Verify page content changes to selected language
  5. Switch back to English

**Expected Results:**
  - Language menu opens showing available options
  - Multiple language options are available for selection
  - Language selection triggers page language change
  - Page content displays in the selected language
  - Language can be switched back successfully

#### 5.2. TC018 - Responsive Design and Layout

**File:** `tests/ui-ux/TC018-responsive-design.spec.ts`

**Steps:**
  1. Test application on different viewport sizes
  2. Verify navigation menu behavior on mobile view
  3. Check product grid layout on tablet view
  4. Verify form layouts adapt to screen size
  5. Test touch interactions on mobile devices

**Expected Results:**
  - Application displays correctly on various screen sizes
  - Navigation menu adapts appropriately for mobile devices
  - Product grid responds to different viewport widths
  - Forms remain usable and accessible on smaller screens
  - Touch interactions work properly on mobile devices

#### 5.3. TC019 - Search Interface Usability

**File:** `tests/ui-ux/TC019-search-usability.spec.ts`

**Steps:**
  1. Click on search area to activate search
  2. Verify search field expansion and focus
  3. Test search with keyboard (Enter key)
  4. Test clearing search results
  5. Verify search results page layout and navigation

**Expected Results:**
  - Search area activates and expands when clicked
  - Search field receives focus and accepts input
  - Enter key executes search successfully
  - Search can be cleared and reset
  - Search results page displays clearly with proper navigation

### 6. Error Handling and Edge Cases

**Seed:** `tests/seed.spec.ts`

#### 6.1. TC020 - Form Validation Edge Cases

**File:** `tests/error-handling/TC020-form-validation.spec.ts`

**Steps:**
  1. Test registration form with edge case inputs (special characters, very long strings)
  2. Test email field with various invalid formats
  3. Test password field with edge case lengths and characters
  4. Verify form behavior with disabled JavaScript
  5. Test form submission with network interruptions

**Expected Results:**
  - Forms handle special characters and long strings appropriately
  - Email validation catches various invalid formats
  - Password validation enforces all requirements correctly
  - Forms maintain basic functionality without JavaScript
  - Network interruptions are handled gracefully

#### 6.2. TC021 - Navigation Error Handling

**File:** `tests/error-handling/TC021-navigation-errors.spec.ts`

**Steps:**
  1. Navigate to invalid/non-existent URLs
  2. Test back button functionality from various pages
  3. Test direct URL access to protected pages
  4. Verify breadcrumb navigation where applicable
  5. Test page refresh on different application states

**Expected Results:**
  - Invalid URLs show appropriate error messages or redirect
  - Back button works consistently across all pages
  - Protected pages handle unauthorized access properly
  - Breadcrumb navigation (if present) works correctly
  - Page refresh maintains application state appropriately

#### 6.3. TC022 - Product Data Edge Cases

**File:** `tests/error-handling/TC022-product-data-edge.spec.ts`

**Steps:**
  1. Test behavior with products that are 'Sold Out'
  2. Verify display of products with 'Only X left' status
  3. Test product details for items with no reviews
  4. Check handling of products with missing images
  5. Test pagination with different product counts

**Expected Results:**
  - Sold out products display appropriate status and restrictions
  - Limited quantity products show accurate availability
  - Products without reviews handle empty state gracefully
  - Missing product images show placeholder or default image
  - Pagination adjusts correctly for different product counts
