# Smart Mandi Pro

Build a farmer-centric mobile web app called "Tech Titan - Smart Mandi" for SIH 2026.



PROBLEM STATEMENT: Strengthening Market Linkages and Price Discovery for Farmers.

Core insight: Farmers have price information from AGMARKNET, e-NAM, Bijak but still don't know WHERE to sell, TO WHOM to sell, and WHAT will be actual net profit. This app converts scattered information into ONE personalized selling decision.



APP WORKFLOW - 5 STEPS (MUST IMPLEMENT THIS FLOW):

1. Farmer Input Screen: Input for Crop (dropdown: Wheat, Rice, Onion, Soybean etc), Quantity in KG (example 1000 KG), Quality (Grade A/B/C), Location (auto GPS + manual) with Voice Input button using Google Speech-to-Text.

2. Market Discovery Screen: Show nearby mandis (within 50km) with current modal price from AGMARKNET API (mock data for now). Display: Mandi Name, Distance (use Google Distance Matrix mock), Modal Price Rs/quintal.

3. Buyer Reliability Screen: Show 3-4 buyers per mandi. Each buyer card must show: Buyer Name, Offered Price, Payment Success % (e.g. 96%), Cancellation % (e.g. 2%), Rating (e.g. 4.8/5), Total Transactions. This is NOT just highest price.

4. Net Profit Engine - CORE FEATURE: Calculate and display: Net Profit = (Mandi Rate × Quantity) - Transportation Cost. Transportation cost = Distance × Rate per KM (mock Rs 5/km). Show comparison table sorted by NET PROFIT, not just price. Highlight BEST PROFIT option with green badge "RECOMMENDED - Highest Net Profit". Example: 1000kg Onion, Mandi A 2000 Rs/qtl distance 20km = Profit calculation.

5. Smart Deal Lock Screen: After farmer selects buyer, show Deal Summary: Crop, Qty, Buyer, Locked Price, Net Profit, Transport. Button "Lock This Deal" which freezes price and shows Deal ID, timestamp, terms. This prevents post-deal renegotiation. Show success screen.



UNIQUE SELLING POINTS TO HIGHLIGHT IN UI:

- Tagline: "We don't just tell where price is high, we tell where actual earning is better and buyer is reliable"

- Feature 1: Personalized Best Selling Option based on crop, quantity, location

- Feature 2: Safest Buyer Recommendation (payment history, not just price)

- Feature 3: Smart Deal Protection (price freeze)



DESIGN REQUIREMENTS:

- Farmer-friendly: Big buttons, Hindi + English toggle, Voice input prominent, Simple icons

- Color: Green (#2E7D32) and Yellow (#F9A825) agriculture theme, white background

- Mobile-first responsive design

- Bottom navigation: Home, Markets, My Deals, Profile

- Dashboard with farmer photo placeholder, location, last profit



TECH STACK (Mock for now, but structure like real):

- Frontend: React Native style UI with Tailwind

- Backend: Mock FastAPI endpoints

- Database: Mock PostgreSQL data

- APIs: Mock Data.gov.in / AGMARKNET API, Google Distance Matrix, Kisan Sabha Logistics framework

- Add voice input button (mock)



DUMMY DATA TO PRE-LOAD:

- 5 mandis: Pune, Solapur, Nashik, Nagpur, Kolhapur with different modal prices for onion

- 8 buyers with different payment success rates

- Transportation cost calculation logic must actually work



BUILD SCREENS:

1. Splash / Login (Farmer login with phone OTP)

2. Farmer Input Form

3. Market List with Net Profit calculated

4. Buyer Comparison (Safest Buyer Score visible)

5. Deal Lock Confirmation + My Deals list



Make it look like a real SIH prototype that judges can click through in 5 minutes. Workflow must be: Farmer -> Input -> Markets -> Buyers -> Calculation -> Recommendation -> Deal Lock

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://cropwise-profit-path.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/5f4523e3-b706-4b86-b2de-3222ac297171).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
