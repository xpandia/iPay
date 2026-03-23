# iPay — Business Plan
### The Square of PayFi: Intelligent Payments on Solana for Latin America

---

## TABLE OF CONTENTS

1. Executive Summary
2. Problem
3. Solution
4. Market Size
5. Business Model
6. Unit Economics
7. Go-to-Market Strategy
8. Competitive Landscape
9. Team
10. Financial Projections
11. Funding Ask
12. Use of Funds
13. Milestones & Roadmap

---

## 1. EXECUTIVE SUMMARY

**iPay is the first intelligent payment platform on Solana that combines blockchain payment links (Blinks), automatic loyalty tokens, and AI-powered merchant tools for Latin America.**

The global payment infrastructure is being rebuilt on stablecoins. Stripe acquired Bridge for $1.1B. Mastercard acquired BVNK for $1.8B. Rain raised $250M at a $1.95B valuation. Over $5B has been invested in stablecoin payment infrastructure in the past 12 months alone.

But all of that capital went to **plumbing** — invisible infrastructure. Nobody has built the **application layer** that merchants and consumers actually use.

iPay is that application layer.

We combine:
- **Bridge** (stablecoin infrastructure) — accept SOL, USDC, any SPL token
- **Blackbird** (loyalty tokens) — automatic iPAY token rewards via Transfer Hooks
- **Square** (merchant tools) — dashboard, analytics, payment management
- **ChatGPT** (AI agent) — natural language commands to create payments, run promotions, analyze sales
- **Solana Blinks** (shareable payments) — payment links that work on WhatsApp, Instagram, X, anywhere

All in **one product**, focused on the fastest-growing crypto market in the world: **Latin America**.

**Key metrics:**
- Platform deployed on Solana devnet with 7 on-chain instructions
- 12-route Next.js frontend with real blockchain integration
- Live at ipay.xpandia.co
- iPAY loyalty token minted: `CRJqookT2EuxZtCJmG8Z69S1qUSTV2rHGh62CQowwFsZ`
- Platform fee: 0.5% (50 basis points)

---

## 2. PROBLEM

### 2.1 For Merchants in Latin America

| Problem | Data |
|---|---|
| **Excessive fees** | Credit card processors charge 3-7% per transaction in LATAM |
| **Slow settlement** | Merchants wait 14-30 days to receive their funds |
| **No loyalty programs** | SMEs cannot afford Salesforce or custom loyalty systems |
| **No business intelligence** | Small merchants have zero analytics on customer behavior |
| **Payment fragmentation** | Each country has different dominant methods (PIX, PSE, OXXO, Nequi) |
| **Cross-border costs** | International payments cost 5-10% in fees and take 3-5 days |

### 2.2 For Consumers in Latin America

| Problem | Data |
|---|---|
| **Unbanked population** | 130M adults in LATAM lack bank accounts (26% of adult population) |
| **Inflation** | Argentina 200%+, Venezuela 300%+, Colombia 10%+ eroding purchasing power |
| **Fee extraction** | Consumers pay fees for basic financial services (transfers, withdrawals) |
| **Loyalty programs are broken** | Points expire, cannot be used across merchants, low perceived value |

### 2.3 The Infrastructure Gap

$5B+ has been invested in stablecoin payment infrastructure (Bridge, BVNK, Rain, Mesh), but:

> **There is no consumer-facing application layer for stablecoin payments in Latin America.**

The analogy: Visa and Mastercard built the rails. Square built the experience. In PayFi, the rails exist (Bridge, Circle, Solana). The experience does not. **iPay is the Square of PayFi.**

---

## 3. SOLUTION

### 3.1 Platform Overview

iPay is a full-stack payment platform that gives merchants everything they need to accept crypto payments, reward customers, and grow their business:

**For Merchants:**
- **One-click registration** — Connect wallet, set business name, start accepting payments
- **Payment Blinks** — Shareable payment links that work on WhatsApp, X, Instagram, email, QR codes
- **Automatic loyalty** — iPAY tokens minted to customers on every purchase via Transfer Hooks (zero config)
- **AI Agent** — "Create a $50 payment with double points" generates a Blink instantly
- **Analytics dashboard** — Real-time sales, customer behavior, loyalty metrics
- **Multi-channel** — QR codes, payment links, embeddable widgets, API

**For Consumers:**
- **Pay with any wallet** — Phantom, Solflare, Backpack, any Solana wallet
- **Automatic rewards** — iPAY tokens appear in wallet instantly after payment
- **Cross-merchant value** — Use iPAY earned at any merchant to get discounts at any other
- **No app required** — Pay by clicking a Blink link (works in any browser)

### 3.2 Technical Differentiators

| Feature | How It Works | Why It Matters |
|---|---|---|
| **Solana Blinks** | Payment links with GET/POST endpoints following Solana Actions spec | Payments shareable on any platform without an app |
| **Transfer Hooks (Token-2022)** | Smart contract auto-mints iPAY on every payment | Zero-friction loyalty — no scanning, no codes, automatic |
| **AI Agent (Claude + Solana Agent Kit)** | Natural language to on-chain actions | Merchants need zero crypto knowledge |
| **On-chain analytics** | Payment records stored as PDAs on Solana | Transparent, verifiable, real-time |
| **Sub-second settlement** | Solana finality ~400ms | Merchants receive funds in under 1 second (vs. 14-30 days) |

### 3.3 User Flow

```
MERCHANT                              CONSUMER
   │                                     │
   │  1. Register on iPay                │
   │  2. "Create $50 payment" (AI/UI)    │
   │  3. Share Blink via WhatsApp        │
   │         ──────────────────────►     │
   │                                     │  4. Click Blink link
   │                                     │  5. Connect wallet
   │                                     │  6. Approve transaction
   │         ◄──────────────────────     │
   │  7. Receive SOL/USDC instantly      │  7. Receive iPAY tokens instantly
   │  8. See in dashboard + analytics    │  8. See in wallet
   │                                     │
   │         NEXT PURCHASE               │
   │                                     │  9. Redeem iPAY for discount
   │  10. Apply discount automatically   │
   │                                     │
```

---

## 4. MARKET SIZE

### 4.1 Total Addressable Market (TAM)

**$890B — Digital payments volume in Latin America (2026)**

Sources: Statista, Americas Market Intelligence, McKinsey Global Payments Report

- LATAM digital payments growing at 25% CAGR
- $1.5T in crypto held by LATAM residents
- 57.7M people (12.1% of population) hold cryptocurrency
- 63% year-over-year growth in crypto adoption (2024-2025)

### 4.2 Serviceable Addressable Market (SAM)

**$45B — Crypto and stablecoin payment volume in LATAM (2026)**

- Stablecoins represent 39% of all crypto purchases in LATAM
- $150-160B/year in remittances to LATAM (growing target for stablecoin rails)
- PayFi sector valued at $2.27B with $148M daily transaction volume

### 4.3 Serviceable Obtainable Market (SOM)

**$2B — Target payment volume by Year 3 (50,000 merchants)**

Conservative capture rate: 4.4% of crypto payment volume in LATAM

| Timeframe | Merchants | TPV (Total Payment Volume) | Market Share |
|---|---|---|---|
| Year 1 | 500 | $5M | 0.01% |
| Year 2 | 5,000 | $100M | 0.22% |
| Year 3 | 50,000 | $2B | 4.4% |
| Year 5 | 200,000 | $10B | ~15% |

### 4.4 Market Validation

| Signal | Data Point |
|---|---|
| Stripe acquired Bridge | $1.1B for stablecoin payment APIs |
| Mastercard acquired BVNK | $1.8B for stablecoin-to-fiat rails (March 2026) |
| Rain Series C | $250M at $1.95B valuation for stablecoin cards |
| Blackbird Series B | $50M for restaurant loyalty on Base chain |
| Crypto VC funding Q4 2025 | $8.5B — 3-year record |
| Y Combinator | Now offers $500K in stablecoins instead of wire transfers |
| NuCoin (Nubank) | Relaunched crypto loyalty in LATAM (2025) |

---

## 5. BUSINESS MODEL

### 5.1 Revenue Streams

iPay generates revenue through four primary channels:

#### Stream 1: Transaction Fees (Core Revenue)

| Tier | Fee | Target | Volume |
|---|---|---|---|
| **Starter** | 0% | Freelancers, micro-merchants (<$1K/month) | User acquisition |
| **Business** | 0.5% | SMEs ($1K-$50K/month) | Core revenue driver |
| **Pro** | 0.3% + $49/month | Medium businesses, AI features unlocked | Upsell |
| **Enterprise** | 0.2% + custom | Large merchants, full API access | High-value accounts |

**Comparison:** Traditional card processors charge 3-7% in LATAM. iPay's 0.5% fee represents an 85-93% cost reduction.

#### Stream 2: SaaS Subscriptions

| Plan | Price | Features |
|---|---|---|
| **Free** | $0/month | Basic payments, standard loyalty, 1 Blink type |
| **Pro** | $49/month | AI Agent, advanced analytics, custom loyalty tiers, unlimited Blinks |
| **Enterprise** | $299/month | API access, webhooks, white-label checkout, dedicated support |

#### Stream 3: White-Label Licensing

- Banks and fintechs license iPay's technology to offer crypto payment + loyalty under their own brand
- Annual license fee: $50K-$500K depending on volume
- Target customers: Nequi (Colombia), Nu (Brazil), Mercado Pago (LATAM)

#### Stream 4: Data & Insights (Future)

- Anonymized, aggregated market intelligence for brands
- Consumer spending trend reports
- Loyalty program benchmarking

### 5.2 Revenue Model Comparison

| Metric | iPay | Square | Stripe | Blackbird |
|---|---|---|---|---|
| Transaction fee | 0.2-0.5% | 2.6% + $0.10 | 2.9% + $0.30 | ~1% |
| Settlement time | <1 second | 1-2 days | 2-7 days | Instant |
| Loyalty included | Yes (automatic) | $45/month add-on | No | Yes |
| AI included | Yes | No | No | No |
| LATAM focus | Yes | Limited | Global | No (USA only) |

---

## 6. UNIT ECONOMICS

### 6.1 Cost Per Transaction

| Cost Component | Amount | Notes |
|---|---|---|
| Solana network fee | ~$0.00025 | ~5,000 lamports per transaction |
| iPAY mint cost | ~$0.00025 | Token mint via Transfer Hook |
| RPC infrastructure | ~$0.001 | Helius/Triton RPC at scale |
| Server/API costs | ~$0.002 | Vercel + Supabase at scale |
| **Total cost per tx** | **~$0.004** | |

### 6.2 Revenue Per Transaction

| Scenario | Transaction Size | Fee Rate | Revenue | Cost | Margin |
|---|---|---|---|---|---|
| Small merchant | $10 | 0.5% | $0.05 | $0.004 | 92% |
| Medium merchant | $100 | 0.5% | $0.50 | $0.004 | 99.2% |
| Large merchant | $1,000 | 0.3% | $3.00 | $0.004 | 99.9% |
| Pro subscriber | $5,000/mo | $49/mo + 0.3% | $64/mo | $0.50/mo | 99.2% |

### 6.3 Key Metrics

| Metric | Target (Y1) | Target (Y3) |
|---|---|---|
| **Average Transaction Value (ATV)** | $10 | $25 |
| **Transactions per Merchant/Month** | 50 | 200 |
| **Merchant Acquisition Cost (MAC)** | $20 | $50 |
| **Merchant Lifetime Value (LTV)** | $500 | $5,000 |
| **LTV:CAC Ratio** | 25:1 | 100:1 |
| **Monthly Churn** | 8% | 3% |
| **Gross Margin** | 90%+ | 95%+ |
| **Break-even** | Month 18 | — |

### 6.4 Break-Even Analysis

```
Fixed Costs (Monthly):
  Infrastructure (RPC, hosting, DB):    $2,000
  Team (initial):                       $15,000
  Marketing:                            $3,000
  Legal/compliance:                     $2,000
  Total fixed:                          $22,000

Variable margin per $1 processed:       $0.005 (0.5% fee)

Break-even TPV:                         $22,000 / 0.005 = $4.4M/month
Break-even merchants (at $10K/mo each): ~440 merchants

Timeline to break-even:                 ~18 months post-launch
```

---

## 7. GO-TO-MARKET STRATEGY

### 7.1 Phase 1: Colombia (Months 0-6)

**Why Colombia first:**
- Team is based in Colombia
- 4th largest economy in LATAM ($340B GDP)
- 3.5M+ crypto holders (growing rapidly)
- High smartphone penetration (78%)
- Nequi (digital wallet) has 20M+ users — proves digital payment adoption
- PSE (interbank transfer) dominant — merchants familiar with digital payments
- Regulatory environment favorable for fintech innovation

**Strategy:**
- Target: 500 merchants in Bogota, Medellin, Barranquilla
- Verticals: Restaurants, cafes, retail stores, freelancers
- Acquisition: Direct sales team (3 people), partnerships with coworking spaces and merchant associations
- Onboarding: AI-assisted setup in under 5 minutes
- Incentive: Free tier for first 6 months, 10x loyalty multiplier for early adopters

### 7.2 Phase 2: Mexico (Months 6-12)

**Why Mexico second:**
- Largest LATAM economy ($1.8T GDP)
- 12M+ crypto holders
- OXXO (convenience stores) proves cash-to-digital conversion works
- CoDi (BANXICO's digital payment system) has limited adoption — opportunity
- Large remittance corridor ($60B+/year from USA)
- Bitso partnership potential (dominant crypto exchange)

**Strategy:**
- Target: 2,000 merchants in CDMX, Monterrey, Guadalajara
- Verticals: E-commerce, retail, remittance-receiving businesses
- Partnerships: Bitso for on/off-ramp, local fintech accelerators
- Localization: Full Spanish UX, OXXO cash-in integration (via partner)

### 7.3 Phase 3: Brazil (Months 12-24)

**Why Brazil third:**
- Largest LATAM market ($2.1T GDP)
- 25M+ crypto holders (largest in LATAM)
- PIX processes $500B+/year — massive digital payment culture
- Nubank (100M+ customers) validated crypto loyalty with NuCoin
- Regulatory framework (Marco Legal das Criptomoedas) provides clarity

**Strategy:**
- Target: 10,000 merchants in Sao Paulo, Rio, Belo Horizonte
- Verticals: E-commerce, restaurants, service providers
- Partnerships: Local payment processors, Mercado Pago integration
- Localization: Portuguese UX, PIX bridge for fiat on/off-ramp

### 7.4 Phase 4: LATAM Expansion (Months 24-36)

- Argentina (inflation hedge narrative, high crypto adoption)
- Chile (stable economy, tech-forward)
- Peru (growing fintech ecosystem)

### 7.5 Phase 5: Global (Months 36+)

- Southeast Asia (similar unbanked population, high mobile penetration)
- Africa (fastest-growing crypto market)
- Eastern Europe (tech-savvy, growing crypto adoption)

### 7.6 Growth Channels

| Channel | Strategy | Expected CAC |
|---|---|---|
| **Direct sales** | 3-person team in Colombia, expand per market | $30-50 |
| **Referral program** | Merchants earn iPAY for referring other merchants | $10-20 |
| **Partnerships** | Coworking spaces, merchant associations, accelerators | $15-25 |
| **Content marketing** | iPay Academy: tutorials on crypto payments for merchants | $5-10 |
| **Community** | Solana Superteam LATAM, local crypto meetups | $5-15 |
| **Product-led growth** | Free tier, viral Blinks (consumers see iPay when paying) | $2-5 |

---

## 8. COMPETITIVE LANDSCAPE

### 8.1 Competitive Matrix

| Feature | iPay | Helio | Blackbird | Square | Stripe | Rain |
|---|---|---|---|---|---|---|
| **Crypto payments** | Yes | Yes | Yes | No | Partial | Yes |
| **Fiat payments** | Planned | No | No | Yes | Yes | Yes |
| **Loyalty tokens** | Automatic | No | Yes | Add-on ($45/mo) | No | No |
| **AI agent** | Yes | No | No | No | No | No |
| **Blinks/shareable** | Yes | No | No | No | No | No |
| **Cross-merchant loyalty** | Yes | N/A | Yes | No | N/A | N/A |
| **LATAM focus** | Yes | No | No | Limited | Global | No |
| **Settlement time** | <1 sec | <1 sec | Instant | 1-2 days | 2-7 days | <1 sec |
| **Transaction fee** | 0.2-0.5% | 0.5-1% | ~1% | 2.6%+$0.10 | 2.9%+$0.30 | Varies |
| **Blockchain** | Solana | Solana | Base | N/A | N/A | Multi |
| **Funding** | Pre-seed | $3.3M | $50M | $590M+ | $2.3B+ | $250M |

### 8.2 Competitive Advantages

1. **Only platform combining Blinks + Loyalty + AI** — No competitor offers all three
2. **Transfer Hooks for zero-friction loyalty** — Technical innovation unique to iPay
3. **LATAM-native** — Built for and in Latin America, not adapted from a US product
4. **85-93% cheaper than cards** — 0.5% vs 3-7% is a compelling merchant value prop
5. **AI-first merchant experience** — Zero crypto knowledge required to operate

### 8.3 Defensibility

| Moat | Description |
|---|---|
| **Network effects** | More merchants = more iPAY utility = more consumers = more merchants |
| **Cross-merchant loyalty** | Switching cost increases as consumers accumulate iPAY across merchants |
| **AI data flywheel** | More transactions = better AI recommendations = higher merchant retention |
| **First mover in PayFi LATAM** | No competitor combines payments + loyalty + AI on Solana for LATAM |
| **Technical depth** | Transfer Hook + Blinks + AI integration is complex to replicate |

---

## 9. TEAM

> *Note: Team section to be completed with final founding team details.*

### Required Roles (Founding Team)

| Role | Responsibility | Status |
|---|---|---|
| **CEO / Product** | Vision, strategy, fundraising, product direction | [To be confirmed] |
| **CTO / Engineering** | Smart contracts, backend, infrastructure | [To be confirmed] |
| **Head of Growth** | Merchant acquisition, partnerships, marketing | Hiring |
| **Head of Compliance** | Regulatory strategy, KYC/AML, licensing | Hiring |

### Advisors (Target)

- Solana Foundation ecosystem lead
- LATAM fintech founder (Rappi, Nu, or similar)
- Regulatory expert in Colombian/Mexican fintech law
- Token economics specialist

---

## 10. FINANCIAL PROJECTIONS

### 10.1 Five-Year Projection

| Metric | Year 1 | Year 2 | Year 3 | Year 4 | Year 5 |
|---|---|---|---|---|---|
| **Merchants** | 500 | 5,000 | 50,000 | 120,000 | 200,000 |
| **Countries** | 1 (CO) | 2 (CO, MX) | 3 (CO, MX, BR) | 6 | 10+ |
| **TPV** | $5M | $100M | $2B | $6B | $10B |
| **Tx Fee Revenue** | $25K | $500K | $7M | $18M | $25M |
| **SaaS Revenue** | $0 | $50K | $3M | $10M | $20M |
| **White-Label Revenue** | $0 | $0 | $500K | $3M | $10M |
| **Total Revenue** | $25K | $550K | $10.5M | $31M | $55M |
| **Gross Margin** | 85% | 90% | 93% | 94% | 95% |
| **Operating Costs** | $300K | $1.5M | $6M | $15M | $25M |
| **EBITDA** | -$275K | -$950K | $4.5M | $16M | $30M |
| **Team Size** | 5 | 15 | 50 | 120 | 200 |

### 10.2 Key Assumptions

- Average transaction value grows from $10 (Y1) to $50 (Y5) as larger merchants join
- Merchant churn decreases from 8% (Y1) to 2% (Y5) monthly
- SaaS conversion rate: 5% of merchants upgrade to Pro (Y2), 15% by Y5
- White-label deals begin Y3 with 2 contracts, growing to 20 by Y5
- Operating costs include team, infrastructure, marketing, legal, compliance
- No fiat on/off-ramp revenue included (upside scenario)

### 10.3 Path to Profitability

```
Revenue ($M)     EBITDA ($M)
    │                  │
 55 ┤ ............●    │  30 ┤ ...............●
    │           ╱      │     │             ╱
 31 ┤ ........●        │  16 ┤ ..........●
    │       ╱          │     │         ╱
10.5┤ ....●            │ 4.5 ┤ ......●
    │   ╱              │     │      │
 0.6┤ .●               │-0.9 ┤ ...●  ← Break-even ~Month 30
    │ ╱                │     │  ╱
0.03┤●                 │-0.3 ┤●
    └──┬──┬──┬──┬──┬   │     └──┬──┬──┬──┬──┬
      Y1 Y2 Y3 Y4 Y5  │       Y1 Y2 Y3 Y4 Y5
```

---

## 11. FUNDING ASK

### 11.1 Seed Round

| Parameter | Value |
|---|---|
| **Raise Amount** | $2M - $5M |
| **Instrument** | SAFE (Simple Agreement for Future Equity) |
| **Valuation Cap** | $20M - $30M |
| **Runway** | 18-24 months |

### 11.2 Why This Amount

- **$2M (minimum):** Covers 18 months of runway with a lean team (8-10 people), enough to reach 2,000 merchants and $20M TPV, demonstrating product-market fit
- **$5M (target):** Covers 24 months, enables simultaneous Colombia + Mexico launch, larger engineering team (15 people), and faster path to break-even

### 11.3 Investor Profile (Target)

| Investor Type | Why |
|---|---|
| **Solana ecosystem funds** | Colosseum, Solana Ventures — aligned with ecosystem growth |
| **LATAM fintech VCs** | Kaszek, Monashees, a][ Fund — deep LATAM market knowledge |
| **PayFi-focused funds** | Polychain, Multicoin Capital — thesis-aligned |
| **Strategic angels** | Founders of Rappi, Nu, Bitso, Mercado Pago — operational expertise |

### 11.4 Prior Milestones (De-risking for Investors)

- Fully functional platform deployed on Solana devnet
- Smart contract with 7 on-chain instructions, compiled and tested
- Frontend with 12 routes, real blockchain integration
- iPAY loyalty token minted and operational
- AI Agent functional (Claude API + Solana Agent Kit)
- Live demo at ipay.xpandia.co
- Open-source code on GitHub

---

## 12. USE OF FUNDS

### 12.1 Allocation ($3.5M Scenario — Midpoint)

| Category | Amount | % | Details |
|---|---|---|---|
| **Engineering** | $1,400,000 | 40% | 6 engineers (Solana, frontend, backend, AI) |
| **Go-to-Market** | $700,000 | 20% | Sales team (3), merchant onboarding, local marketing |
| **Compliance & Legal** | $350,000 | 10% | KYC/AML integration, legal opinions, licensing prep |
| **Operations** | $525,000 | 15% | Infrastructure, RPC nodes, security audits, office |
| **Reserve** | $525,000 | 15% | Buffer for 6 additional months runway |
| **Total** | **$3,500,000** | **100%** | |

### 12.2 Key Hires (First 12 Months)

| Role | Priority | Monthly Cost (LATAM) |
|---|---|---|
| Senior Solana Engineer | P0 | $6,000 - $10,000 |
| Full-Stack Engineer (2) | P0 | $4,000 - $7,000 each |
| AI/ML Engineer | P1 | $5,000 - $8,000 |
| Head of Sales (Colombia) | P0 | $3,000 - $5,000 |
| Sales Representatives (2) | P1 | $2,000 - $3,000 each |
| Head of Compliance | P1 | $4,000 - $6,000 |
| Designer (UI/UX) | P1 | $3,000 - $5,000 |
| Community Manager | P2 | $2,000 - $3,000 |

*Note: LATAM-based team provides 3-5x cost advantage over US/EU hires.*

---

## 13. MILESTONES & ROADMAP

### Phase 1: Hackathon MVP (March 2026) — COMPLETED

- [x] Smart contract deployed on Solana devnet
- [x] iPAY loyalty token minted (SPL Token-2022)
- [x] Frontend with merchant dashboard, consumer checkout, AI agent
- [x] Blinks API (GET/POST endpoints)
- [x] QR code generation
- [x] AI natural language to Blinks
- [x] Live demo at ipay.xpandia.co

### Phase 2: Incubation & Beta (April - August 2026)

- [ ] Smart contract audit (security firm)
- [ ] Beta with 20-50 merchants in Colombia
- [ ] Fiat on/off-ramp integration (Bridge API or Circle)
- [ ] KYC/AML partner integration
- [ ] USDC payment support on mainnet
- [ ] Mobile-optimized checkout flow
- [ ] Merchant onboarding automation

### Phase 3: Colombia Launch (September - December 2026)

- [ ] Mainnet deployment
- [ ] 500 merchants onboarded
- [ ] $5M TPV milestone
- [ ] Shopify plugin (Solana Pay integration)
- [ ] Partnerships: Nequi API, local merchant associations
- [ ] Seed round close

### Phase 4: Mexico Expansion (Q1 - Q2 2027)

- [ ] 2,000 merchants (Colombia + Mexico combined)
- [ ] $20M TPV
- [ ] Mexico-specific compliance (CNBV)
- [ ] Bitso partnership for on/off-ramp
- [ ] Pro tier launch ($49/month)

### Phase 5: Brazil & Scale (Q3 2027 - 2028)

- [ ] 50,000 merchants across 3 countries
- [ ] $2B TPV
- [ ] White-label product for banks/fintechs
- [ ] Series A raise ($10M-$20M)
- [ ] API marketplace for third-party integrations
- [ ] CRM connectors (Salesforce, HubSpot)
- [ ] Multi-chain support (Base, Ethereum L2s)

### Phase 6: Global Expansion (2028-2029)

- [ ] 200,000 merchants across 10+ countries
- [ ] $10B TPV
- [ ] Southeast Asia and Africa expansion
- [ ] DAO governance for iPAY token economics
- [ ] Series B or strategic acquisition

---

## APPENDIX A: EXIT SCENARIOS

| Scenario | Valuation Range | Comparable | Probability |
|---|---|---|---|
| **Acquisition by Solana Labs/Foundation** | $50M - $200M | Dialect acquisition | Medium |
| **Acquisition by Stripe/Mastercard/Visa** | $200M - $1B | Bridge ($1.1B), BVNK ($1.8B) | Medium-High |
| **Independent growth (IPO track)** | $500M - $5B | Square ($40B peak), Nu ($45B) | Low-Medium |
| **White-label licensing (cash cow)** | $100M - $500M | Marqeta model | Medium |

## APPENDIX B: RISK MATRIX

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Regulatory change in LATAM | Medium | High | Multi-jurisdiction strategy, compliance-first approach |
| Solana network downtime | Low | High | Multi-chain roadmap (Base as backup) |
| Low merchant adoption | Medium | High | Free tier, aggressive incentives, direct sales |
| Competition from Stripe/Square | Medium | Medium | First-mover in LATAM PayFi, loyalty moat |
| Security breach / hack | Low | Critical | Smart contract audits, bug bounties, insurance |
| iPAY token regulatory risk | Low | Medium | Structured as loyalty points, legal opinions obtained |
| Stablecoin regulatory risk | Medium | Medium | Use regulated stablecoins (USDC/Circle) |

---

*Document version: 1.0*
*Last updated: March 2026*
*iPay — The Square of PayFi*
