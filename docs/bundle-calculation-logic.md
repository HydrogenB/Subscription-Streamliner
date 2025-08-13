# Bundle Builder Pricing & Calculation Logic

## 1. Overview

This document outlines the frontend calculation logic for the **Subscription Streamliner** bundle building page (`/subscriptions/add`). It details how pricing, discounts, and bundle offers are calculated and displayed to the user.

The core principle is to provide a transparent and intuitive experience, allowing users to understand the value of bundling while building their custom subscription package.

**Data Source Assumption:** All data, including available services and bundle offers, is assumed to be provided by a backend API. In this POC, this data is mocked in `src/lib/data.ts`.
-   `subscriptionServices`: A list of all individual services available for purchase.
-   `offerGroups`: A comprehensive list of all possible bundle deals, defining the services included and the special pricing.

## 2. Core User Experience & Logic

The user interacts with two main components on the page:
1.  **Hero Bundles Carousel:** A curated list of premade bundles for quick selection.
2.  **Service Selection List:** A complete list of services allowing for custom bundle creation.

The logic is designed to dynamically update pricing in real-time as the user makes selections.

## 3. Pricing Calculation Breakdown

### Step 1: Individual Service Card Pricing

Each card in the "build your own bundle" list displays a dynamic price based on the user's current selection. There are two main states:

**A. No Services Selected (Initial State)**
- The price displayed is the **standalone promotional price** for that service.
- This price is sourced from the `offerGroups` where the bundle contains only that single service (identified as `Pack0` in `data.ts`).
- The service's original, full price is displayed below it with a strikethrough for comparison.
- **Example (`Viu`):**
    - Promotional Price: `59 THB` (from `offerGroup1`)
    - Full Price: `149 THB` (from `subscriptionServices`)

**B. One or More Services Selected**
- The card displays the **incremental cost** to add that service to the current selection.
- This is the most complex calculation. It is determined by the `getPriceInfo` function in `add/page.tsx`.

#### Incremental Cost Algorithm (`getPriceInfo`):
The function calculates the cost difference between the user's current selection and what the selection *would be* if they added the service they are hovering over.

1.  **Calculate Current Total Price:**
    - The system takes the set of services the user has *already selected*.
    - It calls the `calculateBestPrice` utility (which uses `findBestOffer`) to find the most cost-effective deal for this current set.
    - If a matching bundle is found, its `sellingPrice` is used as the `currentTotal`.
    - If no bundle is found, the `currentTotal` is the sum of the individual promotional prices of the selected services.

2.  **Calculate Potential New Total Price:**
    - The system creates a *hypothetical* new set of services, which includes all currently selected services *plus* the service being hovered over.
    - It calls `calculateBestPrice` again on this new, hypothetical set to find the best bundle deal.
    - The resulting price is the `potentialNewTotal`.

3.  **Determine and Display Incremental Cost:**
    - The incremental cost is the difference between the two calculated totals:
    - `Incremental Cost = potentialNewTotal - currentTotal`
    - This value is displayed on the card with a `+` prefix (e.g., `+60 THB`).
    - The service's full standalone price remains visible (e.g., `149 THB`) with a strikethrough to provide context and show the value of bundling.

#### Special Case: Plan Swapping (e.g., Netflix Tiers)
- If the user has a service selected (e.g., Netflix Standard) and hovers over another variant of the same service (e.g., Netflix Mobile), the logic calculates the cost for a *swap* rather than an addition.
- In this scenario, the `currentTotal` is calculated *without* any Netflix plan, and the `potentialNewTotal` is calculated with only the *new* Netflix plan added.
- If the new plan is cheaper, the incremental cost is displayed as a **negative value** inside parentheses, representing a savings.
- **Example:** User has Netflix Standard (349 THB) selected. Hovering over Netflix Mobile (99 THB).
    - `Incremental Cost = 99 - 349 = -250`
    - The UI will display: `(-250) THB`

#### Pseudocode for `getPriceInfo`

```
FUNCTION getPriceInfo(serviceToConsider, selectedServices):
  // Helper to get the best price for a given set of services
  FUNCTION calculateBestPrice(serviceSet):
    bestOffer = findBestOffer(serviceSet)
    IF bestOffer matches serviceSet exactly:
      RETURN bestOffer.sellingPrice
    ELSE:
      // Sum of individual promotional prices if no exact bundle found
      RETURN sum(promotionalPrice of each service in serviceSet)
    ENDIF
  ENDFUNCTION

  // 1. Calculate the current total price
  currentTotal = calculateBestPrice(selectedServices)
  
  // 2. Handle Netflix plan swapping as a special case
  selectedNetflixPlan = find which Netflix plan is in selectedServices (if any)
  isNetflixSwap = (serviceToConsider is a Netflix plan) AND (selectedNetflixPlan is not null) AND (serviceToConsider is not selectedNetflixPlan)

  IF isNetflixSwap:
    // For a swap, calculate the price of the base selection without any Netflix plan
    selectionWithoutNetflix = selectedServices.remove(selectedNetflixPlan)
    totalWithoutNetflix = calculateBestPrice(selectionWithoutNetflix)

    // Calculate the new total with the new Netflix plan added to the base
    potentialSelection = selectionWithoutNetflix.add(serviceToConsider)
    potentialNewTotal = calculateBestPrice(potentialSelection)

    // The incremental cost is the difference from the state without any Netflix plan
    incrementalCost = potentialNewTotal - totalWithoutNetflix
  ELSE:
    // Standard addition scenario
    potentialSelection = selectedServices.add(serviceToConsider)
    potentialNewTotal = calculateBestPrice(potentialSelection)
    incrementalCost = potentialNewTotal - currentTotal
  ENDIF

  RETURN incrementalCost, serviceToConsider.fullPrice
END
```

## 3.1 Promotion Offer Badge

This badge appears to encourage users to reach the next best-value exact bundle when the current selection is not an exact match.

### When to show
- Selected services count is less than 4 (there is room to add).
- The current selection does not exactly match any `OfferGroup` (invalid selection).
- There exists an exact `OfferGroup` that is a superset of the current selection.

### Text & math
Compute the following values where `currentSelection` is the set of currently selected services and `offers` is the list of all `OfferGroup`s:

- **currentTotal**: `calculateTotal(currentSelection)` using original prices when selection is invalid.
- **nextBundle**: the bundle that minimizes selling price subject to containing the current selection and not exceeding remaining slots:

  \[\text{nextBundle} = \underset{offer\in offers}{\arg\min}\; offer.\text{sellingPrice}\quad \text{s.t.}\quad offer.\text{services} \supseteq currentSelection\ \land\ |offer.\text{services}| - |currentSelection| \le (4 - |currentSelection|)\]

- **needCount**: \(|\text{nextBundle.services}| - |\text{currentSelection}|\)
- **delta**: \(\text{nextBundle.sellingPrice} - \text{currentTotal}\)

Render text:
- If \(\delta > 0\):
  "Add {needCount} more service(s) for just {delta} THB to get a discount!"
- If \(\delta \le 0\):
  "Add {needCount} more service(s) to pay only {nextBundle.sellingPrice} THB total (save {currentTotal − nextBundle.sellingPrice} THB)"

### Display details
- Find the cheapest `OfferGroup` that is a superset of the current selection. Example with YouTube + Netflix:
  - Candidate supersets include `YouTube + Netflix`, `YouTube + Netflix + VIU`, `YouTube + Netflix + WeTV`; pick the minimum `sellingPrice` (e.g., `339 THB`).
- Case found → show incremental text:
  - If next bundle price is higher than `currentTotal`, show \(\Delta = \text{BundlePrice} - \text{CurrentTotal}\). Example: `61 THB`.
  - If next bundle price is not higher, show bundle price and savings message as above.
- Case not found → display: "No bundle for this combination".

### Example
- Current: `Netflix + YouTube = 278 THB` (invalid)
- Cheapest next bundle: `YouTube + Netflix + VIU + WeTV = 339 THB`
- \(\text{needCount} = 2\), \(\delta = 339 - 278 = 61\)
- Badge: "Add 2 more service(s) for just 61 THB to get a discount!"

If no next bundle exists → show the standard "No bundle for this combination" notice only.

### Step 2: Footer Summary Calculation

The sticky footer at the bottom of the page provides a real-time summary of the user's monthly bill.

1.  **Find the Best Offer:** The `findBestOffer` utility function is the heart of this logic. It takes the set of currently selected service IDs and searches through all `offerGroups` to find the most cost-effective deal.
2.  **Calculate Total & Savings:**
    - If a `bestOffer` is found and it's an **exact match** for the user's selection, the `total` is the bundle's `sellingPrice`. The `savings` are calculated as `fullPrice - sellingPrice`.
    - If no exact bundle match is found, the `total` is the sum of the individual promotional prices of the selected services. In this case, `savings` are zero, and the UI displays an alert that "No bundle available for this combination."
3.  **Display:** The footer displays the `packName` (e.g., "Custom Bundle" or the matched offer's ID), the total savings, and the final monthly price.

## 4. Final Bundle Selection (`findBestOffer`)

The `findBestOffer` function is the critical piece of logic that determines the final `OfferGroup` to which the user will be subscribed. Its goal is to always find the most cost-effective bundle for the user's chosen services. It operates with a clear priority system to resolve ambiguity.

**Algorithm:**
1.  **Input:** A `Set<ServiceId>` of the user's selected services.
2.  **Priority 1: Find Exact Match:**
    - The function first iterates through all `offerGroups` to find a bundle where the services match the user's selection *exactly* (same services and same number of services).
    - If multiple exact matches exist (e.g., different promotions for the same set of services), it will choose the one with the lowest `sellingPrice`. This is considered the optimal outcome.

3.  **Priority 2: Find Superset Match:**
    - If no exact match is found, the function checks if any available bundle contains *all* of the user's selected services, plus potentially others (a "superset").
    - This is considered because a larger bundle might paradoxically be cheaper due to a special promotion.
    - If multiple superset bundles are found, the one with the lowest `sellingPrice` is chosen as the `bestOffer`.

4.  **Priority 3: Find Best-Effort Subset Match:**
    - If neither an exact nor a superset match is found, the function makes a best-effort attempt to find a bundle that is a *subset* of the user's selection.
    - For example, if the user selects A, B, and C, but the best deal is a bundle for A and B, this logic will identify it.
    - It selects the subset bundle that offers the best value (`sellingPrice`) or contains the most items from the user's selection. This is a fallback to ensure some discount is applied if at all possible.

5.  **Fallback: No Bundle Found:**
    - If no offer logic from the above priorities applies, the function returns `null`.
    - When this happens, the UI calculates the total price by summing the individual standalone promotional prices of each selected service.

6.  **Output:** The function returns the single, optimal `OfferGroup` object based on the priority system, or `null` if no suitable bundle is found. This object is then used to populate the confirmation and receipt pages.

#### Pseudocode for `findBestOffer`

```
FUNCTION findBestOffer(selectedIds):
  IF selectedIds is empty:
    RETURN null
  ENDIF

  bestOffer = null
  bestMatchLength = 0

  // Priority 1: Find the best exact match
  FOR each offer in offerGroups:
    IF offer.services is an exact match for selectedIds:
      IF bestOffer is null OR offer.sellingPrice < bestOffer.sellingPrice:
        bestOffer = offer
      ENDIF
    ENDIF
  ENDFOR

  // If an exact match was found, it's the best possible option.
  IF bestOffer is not null:
      RETURN bestOffer
  ENDIF

  // Priority 2: Find the best superset match (offer contains all selected items, plus maybe more)
  FOR each offer in offerGroups:
    IF offer.services contains all ids in selectedIds:
      IF bestOffer is null OR offer.sellingPrice < bestOffer.sellingPrice:
        bestOffer = offer
        bestMatchLength = offer.services.length
      ENDIF
    ENDIF
  ENDFOR

  // Priority 3: Find the best subset match (all items in offer are in selected items)
  // This is a fallback and runs if no exact or superset match was found,
  // or if the found superset is not a better deal than a potential subset.
  IF bestOffer is null OR bestMatchLength < selectedIds.length:
      FOR each offer in offerGroups:
        IF all services in offer are present in selectedIds:
           IF bestOffer is null OR offer.sellingPrice < bestOffer.sellingPrice OR offer.services.length > bestMatchLength:
              bestOffer = offer
              bestMatchLength = offer.services.length
            ENDIF
        ENDIF
      ENDFOR
  ENDIF
  
  RETURN bestOffer
END
```

## 5. Localization

- **Currency:** All pricing is currently hardcoded with the "THB" currency symbol. For future-proofing, this should be abstracted into a configuration or localization file.
- **Language:** All text is in English. A full localization implementation would involve using a library like `next-intl` to manage translations for all UI strings.
