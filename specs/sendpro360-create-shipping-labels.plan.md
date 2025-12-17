# SendPro360 Create Shipping Labels Test Plan

## Application Overview

Test plan for 'Create Shipping Labels' feature in SendPro360 PPD environment. Covers core flows: create/print labels, address verification, rates selection, international/customs, presets, multi-recipient, email notifications, and validation/error handling.

## Test Scenarios

### 1. Create Shipping Labels

**Seed:** `tests/seed.spec.ts`

#### 1.1. TC001 - Create & Print Shipping Label (Happy Path)

**File:** `specs/create-shipping-labels/TC001-create-and-print.spec.ts`

**Steps:**
  1. Navigate to Create Shipping Labels page.
  2. Ensure 'Create New' shipping options are selected.
  3. Under Recipient: enter Name 'John Doe', Country 'United States', Address Line 1 '1 Main St', ZIP '10001', City 'New York', State 'NY', Email 'john.doe@example.com', Phone '555-123-4567'.
  4. Under Packaging: select 'My Box' or 'Package', set Weight to 2 lbs.
  5. Click 'Select Rates and Services' and choose a suitable available service.
  6. Click 'Print Label to PDF'.
  7. Confirm PDF download or label preview appears, and shipment appears in 'Recents' or 'History'.

**Expected Results:**
  - Rates become available after valid recipient and packaging details are entered.
  - Selected rate displays carrier and cost in shipment summary.
  - Clicking 'Print Label to PDF' generates a label PDF or opens a print preview.
  - Shipment is recorded and visible in Recents/History with correct details and tracking number (if returned by API).

#### 1.2. TC002 - Verify Address (Success)

**File:** `specs/create-shipping-labels/TC002-verify-address-success.spec.ts`

**Steps:**
  1. Open Create Shipping Labels page.
  2. Enter a valid, complete US address for Recipient.
  3. Click 'Verify Address'.
  4. If verification offers suggested fixes, accept the suggested corrected address.
  5. Proceed to Select Rates and Services, then print or save as needed.

**Expected Results:**
  - Address verification succeeds and shows 'Address verified' or accepted suggestion applied.
  - Verification updates address fields where applicable and allows continuation to rates selection.

#### 1.3. TC003 - Verify Address (Ambiguous / Failure)

**File:** `specs/create-shipping-labels/TC003-verify-address-fail.spec.ts`

**Steps:**
  1. Open Create Shipping Labels page.
  2. Enter an ambiguous or incomplete Recipient address (e.g., missing ZIP or partial street).
  3. Click 'Verify Address'.
  4. Observe verification result and any error messages or suggested alternatives.

**Expected Results:**
  - UI shows clear message indicating verification failed or multiple matches exist.
  - User is presented with suggested corrections or guidance to edit the address.

#### 1.4. TC004 - International Shipment (Customs Info Required)

**File:** `specs/create-shipping-labels/TC004-international-customs.spec.ts`

**Steps:**
  1. Open Create Shipping Labels page.
  2. Set Recipient Country to a non-US country (e.g., Canada).
  3. Enter complete recipient address fields and packaging details.
  4. If customs fields are required, fill required customs fields (e.g., Contents, Value, Harmonized Code, Currency).
  5. Select a rate and print or save the label.

**Expected Results:**
  - Customs form is shown when destination requires it and marks required fields.
  - Rates are available after required customs info is provided.
  - Label generation completes and customs details are included on the generated label/documentation.

#### 1.5. TC005 - Multiple Recipients / Bulk Labels

**File:** `specs/create-shipping-labels/TC005-multiple-recipients.spec.ts`

**Steps:**
  1. Open Create Shipping Labels page.
  2. Switch Recipient to 'Multiple'.
  3. Add multiple recipients manually or upload CSV (if supported) with at least two valid recipients.
  4. For each recipient, fill packaging and weight, choose rates if required.
  5. Generate labels for all recipients and export as supported.

**Expected Results:**
  - UI accepts multiple recipients and lets tester enter distinct recipient details.
  - System generates labels for each recipient and provides combined or per-recipient downloads as supported.
  - Shipments appear individually in History/Recents with their tracking numbers.

#### 1.6. TC006 - Rates and Services Selection and Pricing

**File:** `specs/create-shipping-labels/TC006-rates-and-pricing.spec.ts`

**Steps:**
  1. Open Create Shipping Labels page and enter valid recipient and packaging/weight.
  2. Click 'Select Rates and Services'.
  3. Verify multiple rate options are returned (carrier/service/price).
  4. Change packaging or weight and verify that rates update accordingly and pricing changes reflect in the summary.
  5. Select a specific rate and proceed to label generation.

**Expected Results:**
  - Rate list displays carrier, service name, transit time, and price.
  - Changing weight/dimensions updates rate results and the shipment summary reflects price changes.
  - Selected rate is used for final label and price shown on payment/receipt screens.

#### 1.7. TC007 - Save as Preset and Use Preset

**File:** `specs/create-shipping-labels/TC007-presets.spec.ts`

**Steps:**
  1. Configure a shipment (sender, packaging, common recipient or placeholders) and click 'Save as Preset'.
  2. Name and save the preset.
  3. Start a new session, click 'Use a Preset' and select the saved preset.
  4. Confirm the form fields populate correctly from the preset and generate a label using it.

**Expected Results:**
  - Preset saves successfully and is retrievable via 'Use a Preset'.
  - Selecting a preset populates relevant fields correctly.
  - Label can be generated from a preset without manual re-entry.

#### 1.8. TC008 - Email Notifications (Send & Delivery)

**File:** `specs/create-shipping-labels/TC008-email-notifications.spec.ts`

**Steps:**
  1. Open Create Shipping Labels page and enter recipient email and/or additional emails.
  2. Toggle/checkbox 'Email the tracking number' and 'Email when the shipment is delivered' as required for Sender and/or Recipient.
  3. Create the label and confirm UI shows that email(s) will be sent.
  4. (If test mailbox available) Validate that an email with tracking is received; simulate delivery to validate delivery email if possible.

**Expected Results:**
  - Email options are honored and reflected in shipment summary.
  - Email with tracking is sent on label creation; delivery email sent on delivery event if triggered.

#### 1.9. TC009 - Validation and Error Handling (Missing/Invalid Data)

**File:** `specs/create-shipping-labels/TC009-validation-errors.spec.ts`

**Steps:**
  1. Open Create Shipping Labels page.
  2. Attempt to proceed with missing required Recipient fields (e.g., blank Name or Address Line 1).
  3. Enter invalid formats (e.g., alphabetic characters in ZIP, malformed email) and try to continue.
  4. Try weight/dimension zero and attempt to select rates/print.
  5. Observe validation messages and blocking behavior.

**Expected Results:**
  - Form validation prevents progression and highlights missing/invalid fields with clear messages.
  - Invalid formats show specific error text.
  - System blocks label generation for critical constraint violations and guides remediation.

#### 1.10. TC010 - Address Book Integration

**File:** `specs/create-shipping-labels/TC010-address-book.spec.ts`

**Steps:**
  1. Open Create Shipping Labels page and click 'Open Address Book'.
  2. Search for an existing contact and select it for Recipient.
  3. Confirm selected address populates fields correctly.
  4. If editing is permitted, update an address and save; verify edits persist and populate form on selection.

**Expected Results:**
  - Address Book opens and supports searching and selecting contacts.
  - Selecting a contact populates recipient fields.
  - Edits to address entries persist and populate correctly on subsequent selection.
