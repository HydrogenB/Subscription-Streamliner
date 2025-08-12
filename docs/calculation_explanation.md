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

#### Incremental Cost Algorithm:
1.  **Calculate Current Total:** The system first finds the best possible price for the set of services *already selected* by the user. It does this by searching `offerGroups` for a matching bundle. If no bundle is found, it sums the promotional standalone prices.
2.  **Calculate Potential New Total:** The system then calculates a *hypothetical* new total if the service being hovered over were added to the selection. It finds the best bundle price for this new, larger set of services.
3.  **Determine Incremental Cost:** The incremental cost is the difference between the potential new total and the current total.
    - `Incremental Cost = (Potential New Total) - (Current Total)`
4.  **Display:** This value is displayed with a `+` prefix (e.g., `+60 THB`). The service's full standalone price remains visible (e.g., `149 THB`) with a strikethrough to provide context.

#### Special Case: Plan Swapping (e.g., Netflix Tiers)
- If the user has a service selected (e.g., Netflix Standard) and hovers over another variant of the same service (e.g., Netflix Mobile), the logic calculates the cost difference for a *swap* rather than an addition.
- If the new plan is cheaper, the incremental cost is displayed as a **negative value** inside parentheses, representing a savings.
- **Example:** User has Netflix Standard (349 THB) selected. Hovering over Netflix Mobile (99 THB).
    - `Incremental Cost = 99 - 349 = -250`
    - The UI will display: `(-250) THB`

### Step 2: Footer Summary Calculation

The sticky footer at the bottom of the page provides a real-time summary of the user's monthly bill.

1.  **Find the Best Offer:** The `findBestOffer` utility function is the heart of this logic. It takes the set of currently selected service IDs and searches through all `offerGroups`.
    - It prioritizes an **exact match** (a bundle containing exactly the selected services).
    - If no exact match is found, it looks for a **superset match** (a bundle that includes all selected services plus others, if it's cheaper).
    - If still no match, it checks for **subset matches** to find the best possible deal among the selected items.
2.  **Calculate Total & Savings:**
    - If a `bestOffer` is found and it's an exact match, the `total` is the bundle's `sellingPrice`. The `savings` are `fullPrice - sellingPrice`.
    - If no exact bundle match is found, the `total` is the sum of the individual promotional prices of the selected services, and `savings` are zero. The UI displays an alert that "No bundle available for this combination."
3.  **Display:** The footer displays the `packName` (e.g., "Custom Bundle" or the matched offer's ID), the total savings, and the final monthly price.

## 4. Final Bundle Selection (`findBestOffer`)

The `findBestOffer` function is the critical piece of logic that determines the final `OfferGroup` to which the user will be subscribed. Its goal is to always find the most cost-effective bundle for the user's chosen services.

**Algorithm:**
1.  **Input:** A `Set<ServiceId>` of the user's selected services.
2.  **Priority 1: Exact Match:** Iterate through `offerGroups` to find a bundle where the services match the user's selection exactly. If multiple exact matches exist (e.g., different promotions for the same set of services), it chooses the one with the lowest `sellingPrice`.
3.  **Priority 2: Superset Match:** If no exact match is found, it checks if any bundle contains *all* of the user's selected services, plus potentially others. This can sometimes be cheaper. It selects the cheapest valid superset offer.
4.  **Priority 3: Subset Match (Best Effort):** If neither of the above finds a deal, it looks for the best available bundle among any subset of the user's selections. This is a fallback to ensure some discount is applied if possible.
5.  **Fallback: No Bundle:** If no offer logic applies, the function returns `null`, and the price is calculated by summing the individual standalone promotional prices.
6.  **Output:** The function returns the optimal `OfferGroup` object or `null`. This object is then used to populate the confirmation and receipt pages.

## 5. Localization

- **Currency:** All pricing is currently hardcoded with the "THB" currency symbol. For future-proofing, this should be abstracted into a configuration or localization file.
- **Language:** All text is in English. A full localization implementation would involve using a library like `next-intl` to manage translations for all UI strings.
