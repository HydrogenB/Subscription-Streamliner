# Bundle Builder Documentation

This document outlines the complete interaction, user journey, rules, calculations, and UI/UX design for the subscription bundle builder page located at `/subscriptions/add`.

## 1. User Journey & Emotion

The user journey is designed to be simple, intuitive, and rewarding. The core emotional goal is to make the user feel smart and in control, as if they are discovering a great deal tailored just for them.

1.  **Landing & Discovery:** The user arrives on the page and is immediately presented with a clean grid of available subscription services. The feeling is one of possibility and exploration.
2.  **Selection & Interaction:** As the user clicks on services, the UI provides instant feedback. Prices update dynamically, and a summary section clearly shows their potential savings. This creates a feeling of empowerment and transparency.
3.  **Guidance & Rules:** The system gently guides the user. If they try to select more than four services or multiple Netflix plans, a clear message appears. This prevents frustration and makes the rules feel helpful rather than restrictive.
4.  **Confirmation & Value:** The final summary reinforces the value of the chosen bundle, showing the total price and savings. The user feels confident and satisfied with their choice before proceeding.

## 2. UI & Interaction

The UI is composed of several key components:

*   **Header:** Displays the title "Create Your Own Bundle".
*   **Service Grid:** A responsive grid of [ServiceCard](cci:1://file:///e:/Jirad-Project/Subscription-Streamliner/src/app/subscriptions/add/page.tsx:389:0-459:1) components.
    *   **ServiceCard:** Each card represents a subscription service and contains:
        *   A checkbox for selection.
        *   The service's logo and name.
        *   A price display that updates dynamically.
        *   A list of features (e.g., 'Full HD', 'Ad-free').
        *   An indicator for selection conflicts (e.g., "Only one Netflix plan allowed").
*   **Summary Footer:** A sticky footer that is always visible, containing:
    *   A list of selected services.
    *   The total monthly price.
    *   The total savings.
    *   A "Next" button to proceed.

### Interactions:

*   **Clicking a ServiceCard:** Toggles the selection state of the service.
*   **Dynamic Price Updates:** Prices on each card and in the summary footer update instantly upon selection/deselection.
*   **Summary Expansion:** The summary section in the footer can be expanded or collapsed.

## 3. Rules & Logic

### Selection Rules:

*   **Maximum Selection:** A user can select a maximum of **4** services.
*   **Netflix Conflict:** A user can only select **one** Netflix plan at a time. If a user tries to select a second Netflix plan, a conflict message is displayed.

### Calculation & Formula:

*   **[findBestOffer(selectedIds)](cci:1://file:///e:/Jirad-Project/Subscription-Streamliner/src/app/subscriptions/add/page.tsx:36:0-58:1):** This function finds the best offer for the exact set of selected services.
    1.  It filters `offerGroups` to find offers that have the same number of services as the user's selection.
    2.  It then compares the sorted list of selected service IDs with the sorted list of service IDs in the filtered offers.
    3.  If a match is found, it returns the offer with the lowest `sellingPrice`.
*   **[findNextBestOffer(selectedIds)](cci:1://file:///e:/Jirad-Project/Subscription-Streamliner/src/app/subscriptions/add/page.tsx:61:0-81:1):** This function suggests the next best offer to encourage users to add more services for better value.
    1.  It filters `offerGroups` to find potential bundles that include all currently selected services plus at least one more.
    2.  It calculates the savings for each potential offer (`fullPrice - sellingPrice`).
    3.  It returns the offer with the highest savings.
*   **Price Display Logic:** The [getPriceInfo](cci:1://file:///e:/Jirad-Project/Subscription-Streamliner/src/app/subscriptions/add/page.tsx:148:2-204:4) function determines what price to display on each [ServiceCard](cci:1://file:///e:/Jirad-Project/Subscription-Streamliner/src/app/subscriptions/add/page.tsx:389:0-459:1) based on the current selection and potential offers.

## 4. Data Tables (from [data.ts](cci:7://file:///e:/Jirad-Project/Subscription-Streamliner/src/lib/data.ts:0:0-0:0))

### `subscriptionServices`

| id                 | name                 | description                                     | plans                                                              |
| ------------------ | -------------------- | ----------------------------------------------- | ------------------------------------------------------------------ |
| 'viu'              | 'Viu'                | 'Asian dramas, movies, and originals.'          | `[{ id: 'viu-premium', name: 'Premium', price: 149, features: ['Ad-free', 'Full HD'] }]`      |
| 'wetv'             | 'WeTV'               | 'Binge-watch original & exclusive content.'     | `[{ id: 'wetv-vip', name: 'VIP', price: 129, features: ['Ad-free', 'Early access'] }]`      |
| 'iqiyi'            | 'iQIYI VIP Standard' | 'Popular Asian dramas, variety shows, and animes.' | `[{ id: 'iqiyi-standard', name: 'VIP Standard', price: 119, features: ['Full HD', '2 screens'] }]` |
| 'oned'             | 'oneD'               | 'Thai dramas and exclusive content.'            | `[{ id: 'oned-premium', name: 'Premium', price: 99, features: ['Ad-free', 'Early access'] }]`      |
| 'trueplus'         | 'True Plus'          | 'Movies, series, and sports from True.'         | `[{ id: 'trueplus-monthly', name: 'Monthly', price: 119, features: ['Live TV', 'VOD content'] }]` |
| 'trueidshort'      | 'True ID Short'      | 'Short-form video content from True ID.'        | `[{ id: 'trueidshort-access', name: 'Access', price: 349, features: ['Exclusive short clips'] }]` |
| 'youtube'          | 'YouTube Premium'    | 'Ad-free YouTube and YouTube Music.'            | `[{ id: 'yt-premium', name: 'Premium', price: 179, features: ['Ad-free', 'Background play'] }]` |
| 'netflix-mobile'   | 'Netflix Mobile'     | 'Watch on your mobile device.'                  | `[{ id: 'n-mobile', name: 'Mobile', price: 99, features: ['480p', 'Mobile/Tablet'] }]`      |
| 'netflix-basic'    | 'Netflix Basic'      | 'Basic plan for all devices.'                   | `[{ id: 'n-basic', name: 'Basic', price: 169, features: ['720p', 'All devices'] }]`      |
| 'netflix-standard' | 'Netflix Standard'   | 'Standard HD plan.'                             | `[{ id: 'n-standard', name: 'Standard', price: 349, features: ['1080p', '2 screens'] }]`      |
| 'netflix-premium'  | 'Netflix Premium'    | 'Premium 4K+HDR plan.'                          | `[{ id: 'n-premium', name: 'Premium', price: 419, features: ['4K+HDR', '4 screens'] }]`      |

### `offerGroups`

This table contains all possible bundle combinations and their pricing.

| id             | packName | services                               | fullPrice | sellingPrice |
| -------------- | -------- | -------------------------------------- | --------- | ------------ |
| 'offerGroup1'  | 'Pack0'  | `['viu']`                              | 149       | 59           |
| 'offerGroup2'  | 'Pack0'  | `['wetv']`                             | 129       | 59           |
| 'offerGroup12' | 'Pack1'  | `['viu', 'wetv']`                      | 278       | 119          |
| 'offerGroup33' | 'Pack2'  | `['viu', 'wetv', 'netflix-mobile']`    | 377       | 229          |
| ...            | ...      | ...                                    | ...       | ...          |

*(Note: This is a truncated representation. The full table contains 137 offer groups.)*

### `userSubscriptions`

This table holds the user's current, active subscriptions.

| id     | serviceName   | status   | renewalDate | price |
| ------ | ------------- | -------- | ----------- | ----- |
| 'sub1' | 'Viu Premium' | 'Active' | '2024-08-15'| 119   |
| 'sub2' | 'WeTV VIP'    | 'Active' | '2024-08-22'| 139   |

### `billingHistory`

This table contains the user's past billing records.

| id      | date       | description   | amount |
| ------- | ---------- | ------------- | ------ |
| 'bill1' | '2024-07-15' | 'Viu Premium' | 119    |
| 'bill2' | '2024-07-22' | 'WeTV VIP'    | 139    |

## 5. 📱 World‑Class Subscription Journey – v3 (Low‑Click Optimisation)

> **Objective:** Win global UX awards by delivering the *fastest* and *clearest* mobile subscription flow on the market—purchasable in **≤ 5 taps** for a first‑time user—while preserving transparency and the business rule that **bundles recur** and **can be cancelled only as a whole in the next cycle**.

---

### 1. Experience Pillars  (Optimised for Cognitive Ease)

| Pillar                 | Why it Matters                        | Low‑Click Tactics                                            |
| ---------------------- | ------------------------------------- | ------------------------------------------------------------ |
| **Zero Friction**      | Fewer taps = lower drop‑off.          | Smart defaults, single‑screen checkout, biometric pay.       |
| **Instant Clarity**    | Users decide in 5‑7 s.                | Price chips, live savings ticker, icon‑led copy.             |
| **Guided Freedom**     | Prevent errors without modal fatigue. | Inline toasts, service cap progress ring, Netflix auto‑swap. |
| **Reward Loop**        | Dopamine hit drives completion.       | Savings counter animation; hero badge at confirmation.       |
| **Effortless Control** | Trust requires visible exit path.     | One‑toggle cancel (scheduled), renewal timeline.             |

---

### 2. 3‑Screen Journey Map (≤ 5 Taps)

| #                                                                                | Screen / Sheet                          | Key Actions & Micro‑Interactions         | Avg. Taps | Emotion |
| -------------------------------------------------------------------------------- | --------------------------------------- | ---------------------------------------- | --------- | ------- |
| **1**                                                                            | **Smart Intro** (deep‑link/fullscreen)  | • Hero graphic + “Start Now”             |           |         |
| • *Optional* swipe‑up to see benefits (doesn’t block path)                       | 1                                       | ✨Curiosity                               |           |         |
| **2**                                                                            | **Quick Choose** (`/subscriptions/add`) | • Pre‑selected **Top Pick** (Quiz or ML) |           |         |
| • Tap cards to add/remove                                                        |                                         |                                          |           |         |
| • Progress ring + live price                                                     |                                         |                                          |           |         |
| • Bottom sheet **One‑Tap Pay** slides up automatically once ≥ 1 service selected | 1‑3                                     | 🚀Empowerment                            |           |         |
| **3**                                                                            | **Pay & Confirm** (bottom sheet)        | • Biometric / Apple/Google Pay           |           |         |
| • Success tick → "Manage Bundle" button                                          |                                         |                                          |           |         |
| • Auto‑deep‑link into Subscription Centre                                        | 1                                       | 🎉Success                                |           |         |
| *Flow is complete—user lands in after‑sale centre without extra navigation.*     |                                         |                                          |           |         |

> **Total new‑user taps to purchase:** **≤ 5** (1 intro + up to 3 selections + 1 pay)

---

### 3. Low‑Click Design Patterns

| Pattern                  | Implementation                                                     | Note                               |
| ------------------------ | ------------------------------------------------------------------ | ---------------------------------- |
| **Smart Defaults**       | Pre‑select a single best‑value service based on quiz or segment.   | User can deselect in 1 tap.        |
| **Inline Validation**    | Netflix conflict auto‑swaps previous plan instead of error pop‑up. | Reduces decision fatigue.          |
| **Dynamic Bottom Sheet** | Payment sheet expands from footer; no page transition.             | Maintains context, saves 1 click.  |
| **Auto‑Handoff**         | Post‑purchase, overlay collapses to show Subscription Centre.      | Removes manual "Back to app" step. |

---

### 4. Core Components (Revised)

| Component              | Purpose                          | Low‑Click Upgrade                                                    |
| ---------------------- | -------------------------------- | -------------------------------------------------------------------- |
| **SmartIntroCard**     | Entry surface from ads/email.    | Hero + single CTA; dismissible details via swipe.                    |
| **QuickChooseGrid**    | Service selection.               | 3‑column grid, haptic on select, long‑press for features (no modal). |
| **ProgressRing**       | Shows 0‑4 services.              | Colour + numeric centre (e.g., 2/4).                                 |
| **SavingsTicker**      | Live THB saved.                  | Located inside Pay sheet header to reinforce value pre‑purchase.     |
| **OneTapPaySheet**     | Combines payment + confirmation. | Biometric first; card fallback inline; shows VAT & totals.           |
| **SubscriptionCentre** | After‑sale hub.                  | First‑run tour (2 tooltips max), lifetime‑savings stat.              |

---

### 5. Cancellation & Renewal (No Extra Clicks)

1. **ScheduledCancelToggle** always visible on landing in Subscription Centre.
2. Toggle → sheet summarises “Ends on 30 Sep” with **Undo**.
3. Undo available until 24 h pre‑renewal—same control, no navigation.

---

### 6. Metrics Focused on Drop‑Off Reduction

| Funnel Step                 | Current CTR | Target     | Measurement Hook                                   |
| --------------------------- | ----------- | ---------- | -------------------------------------------------- |
| Intro → QuickChoose         | 92 %        | **≥ 98 %** | `analytics.track('intro_start')` vs `intro_select` |
| QuickChoose → PaySheet open | 63 %        | **≥ 80 %** | `select_count >=1`                                 |
| PaySheet → Success          | 78 %        | **≥ 90 %** | `payment_success`                                  |
| Overall Conversion          | 45 %        | **≥ 70 %** | end‑to‑end event chain                             |

---

### 7. Information Architecture Updates

```
src/components/
├── intro/
│   └── SmartIntroCard.tsx
├── subscriptions/
│   ├── QuickChooseGrid.tsx
│   ├── ProgressRing.tsx
│   └── OneTapPaySheet.tsx
└── ui/
    └── HapticButton.tsx
```

---

### 8. Next Execution Steps

1. Prototype new 3‑screen flow in Figma; run 5‑second tests for clarity.
2. Implement **QuickChooseGrid** with pre‑selection logic.
3. Integrate biometric payment via native bridge.
4. A/B test v2 vs v3; gate 30 % traffic.

---

**🏆 With a ≤ 5‑tap purchase path, inline validation, and one‑sheet checkout, this v3 design slashes cognitive load and maximises completion without sacrificing transparency—positioning us to top global UX benchmarks.**

---

## 6. File Structure

The project follows a standard Next.js `app` directory structure.

-   **`src/app`**: Contains all the pages of the application.
    -   **`page.tsx`**: The homepage.
    -   **`layout.tsx`**: The main layout for the application.
    -   **`account`**: The user's account page, including active subscriptions and billing history.
    -   **`recommendations`**: The AI-powered recommendation page.
    -   **`subscriptions`**: The subscription management pages, including the bundle builder, confirmation, and receipt pages.
-   **`src/components`**: Contains all the reusable components used throughout the application.
    -   **`account`**: Components for the account page.
    -   **`icons`**: Custom icons for the subscription services.
    -   **`layout`**: Layout components like the header.
    -   **`recommendations`**: Components for the recommendations page.
    -   **`subscriptions`**: Components for the subscription management pages.
    -   **`ui`**: UI components like buttons, cards, and forms.
-   **`src/lib`**: Contains the application's data and type definitions.
    -   **`data.ts`**: Contains all the static data for the application, including subscription services, offer groups, and user data.
    -   **`types.ts`**: Contains all the TypeScript type definitions.
    -   **`utils.ts`**: Utility functions.
-   **`src/ai`**: Contains the AI-related code, including the subscription recommendation flow.