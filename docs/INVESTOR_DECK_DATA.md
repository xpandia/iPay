# iPay — Investor Deck Data Points
### Series A / $100M+ Fundraise | March 2026

---

## ONE-LINER
**iPay is the Square of PayFi — the only platform combining crypto payments, automatic loyalty tokens, and AI merchant tools on Solana, built for Latin America.**

## THE OPPORTUNITY
- $730B crypto volume in LATAM (2025), growing 60% YoY
- $324B in stablecoin transactions in LATAM, up 89% YoY
- LATAM crypto user growth is 3x faster than the US
- 130M unbanked adults in Latin America
- Card processing fees in LATAM: 3-7%. iPay: 0.5%. That's 85-93% cheaper.

## WHAT MAKES iPAY UNIQUE (No Competitor Has All 3)
1. **Automatic Loyalty** — iPAY tokens minted on every payment via Transfer Hooks (zero friction)
2. **AI Merchant Assistant** — "Create a $50 payment with double points" generates a Blink instantly
3. **Solana Blinks** — Payment links shareable on WhatsApp, X, Instagram, email, QR codes

## COMPARABLE TRANSACTIONS

| Company | Valuation | What They Do | What iPay Does Better |
|---|---|---|---|
| Bridge (Stripe) | $1.1B acquisition | Stablecoin orchestration | + Loyalty + AI + merchant tools |
| Rain | $1.95B | Stablecoin corporate cards | + Loyalty + AI + SME focus |
| Mesh | $482M | Pay-with-any-crypto | + Loyalty + Blinks + LATAM |
| Blackbird | ~$300M | Restaurant loyalty (Base) | Multi-vertical + AI + Solana speed |
| Huma Finance | ~$200M | PayFi lending | Consumer-facing + loyalty + AI |
| Helio | Acquired by MoonPay | Solana payment links | + Loyalty + AI + analytics |

## PROTOCOL DEPTH (21 On-Chain Instructions)

### Core Payments
- `process_payment` (SOL + auto loyalty mint)
- `process_payment_spl` (USDC/SPL + auto loyalty)
- `process_payment_with_tip` (fee only on base, not tip)
- `process_split_payment` (marketplace/multi-vendor)

### Trust & E-commerce
- `create_escrow_payment` (hold until delivery)
- `release_escrow` / `dispute_escrow` / `resolve_dispute`

### Recurring Revenue
- `create_subscription` (configurable interval + cycles)
- `execute_subscription_payment` / `cancel_subscription`

### Loyalty Engine
- Auto-mint iPAY on every payment (Transfer Hooks)
- `redeem_loyalty` (burn for discounts)
- `stake_loyalty` / `unstake_loyalty` (lock for benefits)
- Cross-merchant: earn anywhere, redeem anywhere

### Merchant Management
- `register_merchant` / `update_merchant`
- `verify_merchant` (KYC tiers 0-3)
- `process_refund`

### Platform
- `initialize_platform` / `pause_platform` / `unpause_platform`

## DEVELOPER ECOSYSTEM (12 REST APIs)
- `/api/payments` — Payment intents with Blink, checkout, QR URLs
- `/api/webhooks` — 13 event types for real-time notifications
- `/api/invoices` — Professional invoice generation
- `/api/subscriptions` — Recurring payment plan management
- `/api/merchants` — Merchant data queries
- `/api/actions/pay` — Solana Actions/Blinks spec
- `/api/qr` — QR code generation

## UNIT ECONOMICS

| Metric | Value |
|---|---|
| Cost per transaction | ~$0.004 |
| Revenue per $100 tx | $0.50 (0.5% fee) |
| Gross margin | 99.2% |
| Merchant acquisition cost (target) | $20-50 |
| Merchant LTV (target) | $500-5,000 |
| LTV:CAC ratio | 25:1 → 100:1 |

## MARKET SIZE

| Segment | TAM |
|---|---|
| LATAM digital payments | $890B (2026) |
| LATAM crypto payments | $45B (2026) |
| Global stablecoin monthly volume | $650-700B |
| Global remittances to LATAM | $150-160B/year |
| iPay target (Year 3) | $2B TPV, 50K merchants |

## FUNDRAISE STRUCTURE

| Parameter | Value |
|---|---|
| Round | Series A |
| Raise amount | $15-25M |
| Valuation target | $100-150M pre-money |
| Use of funds | 40% Engineering, 25% BD/Sales, 15% Compliance, 10% Ops, 10% Reserve |
| Target investors | Paradigm, a16z crypto, Multicoin, Kaszek, Circle Ventures, Solana Ventures |
| Milestone to Series B | $500M+ TPV, 3+ countries, $5M+ ARR → $400-600M valuation |

## REGULATORY READINESS

| Jurisdiction | Strategy | Budget | Timeline |
|---|---|---|---|
| Colombia | SFC sandbox + SEDPE | $150-250K | 6-12 months |
| Mexico | RNAVASPS + Bitso partnership | $300-480K | 9-15 months |
| Brazil | Banco Central VASP auth | $600K-1M | 12-18 months |
| UAE/Singapore | Fundraising + Asia HQ | $750K-1.5M | 6-12 months |
| US (Phase 2) | Licensed partner → own MTLs | $5-8M | 18-24 months |
| EU (Phase 2) | MiCA CASP via Ireland | $1.6-3.2M | 12-18 months |

## TEAM NEEDS
- CTO / Lead Solana Engineer
- Head of Growth (LATAM)
- Chief Compliance Officer
- Head of Partnerships
- 4-6 full-stack engineers

## EXIT SCENARIOS

| Scenario | Valuation | Comparable |
|---|---|---|
| Stripe/Mastercard/Visa acquisition | $200M-1B | Bridge ($1.1B), BVNK ($1.8B) |
| Solana Foundation acquisition | $50-200M | Dialect pattern |
| Independent growth (IPO track) | $500M-5B | Square ($40B peak), Nu ($45B) |
| White-label licensing | $100-500M | Marqeta model |

---

*iPay — The Square of PayFi*
*Built on Solana | Focused on LATAM | Targeting Global*
