# iPay — Regulatory Compliance Roadmap
### From Day Zero to Multi-Country Licensed Operation

---

## TABLE OF CONTENTS

1. Compliance Philosophy
2. Phase 1: What iPay Can Do Now (Months 0-3)
3. Phase 2: Partner with Licensed Entity (Months 3-9)
4. Phase 3: Own Licenses in Colombia & Mexico (Months 9-18)
5. Phase 4: Multi-Country Expansion (Months 18-36)
6. KYC/AML Implementation Plan
7. Token Classification Strategy
8. Data Privacy Compliance
9. Regulatory Risk Matrix
10. Key Contacts & Resources

---

## 1. COMPLIANCE PHILOSOPHY

iPay takes a **compliance-first, launch-fast** approach:

> Build within legal boundaries from day one, partner with licensed entities to accelerate go-to-market, and obtain own licenses as the business scales.

**Core principles:**
- Never operate outside regulatory boundaries
- iPAY token is a loyalty reward, not a financial instrument
- Partner with regulated entities rather than avoid regulation
- Over-communicate with regulators (proactive, not reactive)
- Design for the strictest jurisdiction and relax where permitted

---

## 2. PHASE 1: WHAT iPay CAN DO NOW (Months 0-3)

### 2.1 Activities That Require NO License

iPay's current operations fall within activities that do not require financial licenses in most LATAM jurisdictions:

| Activity | Legal Basis | Notes |
|---|---|---|
| **Software platform (SaaS)** | General commerce | iPay is a technology platform, not a financial institution |
| **Facilitating crypto-to-crypto payments** | Not regulated as money transmission in most LATAM countries | Solana wallet to Solana wallet; iPay never touches funds |
| **Loyalty token (iPAY)** | Consumer protection law (not securities law) | Non-tradable utility token = loyalty points |
| **Merchant dashboard & analytics** | General commerce | Software tool with no financial activity |
| **AI Agent** | General commerce | Natural language interface to existing functionality |
| **QR codes & payment links (Blinks)** | General commerce | Technology that creates transaction instructions |

### 2.2 Why iPay Does NOT Need a License Today

**Key legal argument:** iPay is a **technology platform** that generates transaction instructions on the Solana blockchain. iPay never:
- Holds, custodies, or controls user funds
- Converts between fiat and cryptocurrency
- Issues financial instruments or securities
- Provides lending, credit, or insurance
- Operates as a money transmitter (funds flow wallet-to-wallet)

**Analogies:**
- iPay is to Solana payments what Shopify is to Stripe — a frontend, not a financial processor
- The wallet (Phantom, Solflare) is the custodian, not iPay
- The blockchain (Solana) is the settlement layer, not iPay

### 2.3 Phase 1 Compliance Actions

| Action | Timeline | Cost Estimate | Priority |
|---|---|---|---|
| Obtain legal opinion (Colombia) confirming iPay's non-regulated status | Month 1 | $3,000 - $5,000 | P0 |
| Obtain legal opinion on iPAY token classification (loyalty, not security) | Month 1 | $3,000 - $5,000 | P0 |
| Implement basic Terms of Service and Privacy Policy | Month 1 | $2,000 - $3,000 | P0 |
| Register company in Colombia (SAS) | Month 1 | $500 - $1,000 | P0 |
| Implement basic user data collection (email, wallet address) | Month 2 | Internal | P1 |
| Engage compliance advisor | Month 2 | $2,000/month retainer | P1 |
| Document all compliance decisions and rationale | Ongoing | Internal | P1 |

### 2.4 Limitations in Phase 1

| What iPay CANNOT Do | Why | When It Becomes Possible |
|---|---|---|
| Accept fiat payments (credit card, bank transfer) | Requires payment processor license or partnership | Phase 2 |
| Convert crypto to fiat for merchants | Requires money transmission / exchange license | Phase 2 |
| Store fiat balances | Requires electronic money institution license | Phase 3 |
| Operate in regulated sandbox without application | Requires formal application | Phase 2 |
| Process cross-border fiat transfers | Requires remittance license | Phase 3 |

---

## 3. PHASE 2: PARTNER WITH LICENSED ENTITY (Months 3-9)

### 3.1 Strategy

Rather than spending 12-18 months obtaining licenses, iPay will partner with already-licensed entities to unlock regulated functionality:

```
┌──────────────┐     technology      ┌──────────────┐     regulated      ┌──────────────┐
│   iPay       │ ──────────────────► │   Licensed   │ ─────────────────► │   End Users  │
│  (Platform)  │   platform layer    │   Partner    │   fiat services    │  (Merchants  │
│              │ ◄────────────────── │              │ ◄───────────────── │  & Consumers)│
└──────────────┘   compliance APIs   └──────────────┘   user activity    └──────────────┘
```

### 3.2 Partner Types Needed

| Capability | Partner Type | Examples in LATAM | Estimated Timeline |
|---|---|---|---|
| **Fiat on-ramp** (user deposits COP/MXN → USDC) | Licensed exchange or payment processor | Bitso, Mercado Pago, Nequi, Transak | Month 3-4 |
| **Fiat off-ramp** (merchant converts USDC → COP/MXN) | Licensed exchange or money transmitter | Bridge (Stripe), Circle, Bitso, Decaf | Month 3-4 |
| **KYC/AML verification** | Identity verification provider | Metamap (LATAM-focused), Onfido, Sumsub | Month 3 |
| **Banking relationship** | Licensed bank | Bancolombia, BBVA Mexico, Nu | Month 6-9 |

### 3.3 Colombia: Specific Partner Strategy

**Regulatory context:**
- Colombia's Superintendencia Financiera has no specific crypto regulation but issued Circular 052/2022 allowing financial institutions to pilot crypto services
- Ley 2169 de 2021 (Ley Fintech) is under development — expected to provide regulatory clarity
- Sandbox financiero (SFC) available for fintech innovation

**Partner targets:**

| Partner | What They Provide | Integration Type |
|---|---|---|
| **Nequi** (Bancolombia) | COP on/off-ramp, 20M+ users, banking license | API integration for fiat conversion |
| **Bitso** | Crypto exchange license, COP/USDC pairs, compliance infrastructure | White-label on/off-ramp |
| **Bold** | Payment processing license, POS infrastructure | Merchant acquisition channel |
| **Movii** | SEDPE license (electronic deposit), mobile payments | Fiat wallet integration |

**Regulatory sandbox application:**
- Apply to Superintendencia Financiera sandbox by Month 4
- Sandbox allows testing regulated services for 12 months
- Successful sandbox graduates receive expedited licensing

### 3.4 Mexico: Specific Partner Strategy

**Regulatory context:**
- Ley Fintech (2018) — one of the most advanced fintech laws in LATAM
- CNBV (Comision Nacional Bancaria y de Valores) regulates fintech institutions
- ITF (Instituciones de Tecnologia Financiera) license required for certain activities
- Virtual asset service providers must register with CNBV

**Partner targets:**

| Partner | What They Provide | Integration Type |
|---|---|---|
| **Bitso** | ITF license, MXN/USDC pairs, largest LATAM crypto exchange | On/off-ramp API |
| **Mercado Pago** | Payment processing, 50M+ users in Mexico | Merchant onboarding channel |
| **Clip** | Payment processing license, SME focus | Merchant acquisition |
| **Conekta** | Payment aggregator license, developer-friendly | Fiat payment processing |

### 3.5 Phase 2 Compliance Actions

| Action | Timeline | Cost Estimate | Priority |
|---|---|---|---|
| Sign partnership with KYC/AML provider (Metamap) | Month 3 | $500-2,000/month | P0 |
| Sign partnership with fiat on/off-ramp (Bitso or Bridge) | Month 4 | Revenue share model | P0 |
| Implement tiered KYC (see Section 7) | Month 4-5 | $15,000-25,000 dev cost | P0 |
| Apply to Colombia regulatory sandbox (SFC) | Month 4 | $5,000 legal fees | P1 |
| Obtain legal opinion for Mexico market entry | Month 5 | $5,000-8,000 | P1 |
| Implement transaction monitoring system | Month 5-6 | $1,000-3,000/month | P0 |
| Engage Mexico compliance counsel | Month 6 | $3,000/month retainer | P1 |
| Draft AML/CFT compliance manual | Month 4 | $5,000-8,000 | P0 |

---

## 4. PHASE 3: OWN LICENSES IN COLOMBIA & MEXICO (Months 9-18)

### 4.1 Colombia Licensing Path

| License / Registration | Authority | What It Enables | Timeline | Cost |
|---|---|---|---|---|
| **SEDPE Registration** (Sociedad Especializada en Depositos y Pagos Electronicos) | Superintendencia Financiera | Electronic deposits, digital wallet, payment processing | 9-15 months | $50K-100K |
| **Sandbox graduation** | SFC | Full regulatory approval for tested services | 12-15 months | Included in sandbox |
| **Data processing registration** | SIC (Superintendencia de Industria y Comercio) | Legal data processing under Ley 1581/2012 | 1-2 months | $1,000-2,000 |

**Alternative path:** Rather than seeking a SEDPE license directly, iPay can operate as a technology provider to a licensed entity and gradually take on more regulated functions.

### 4.2 Mexico Licensing Path

| License / Registration | Authority | What It Enables | Timeline | Cost |
|---|---|---|---|---|
| **ITF Registration** (Institucion de Tecnologia Financiera) | CNBV | Operate as fintech institution, process electronic payments | 12-18 months | $80K-150K |
| **RNAVASPS Registration** (Registro Nacional de Activos Virtuales) | CNBV | Operate as virtual asset service provider | 6-9 months | $20K-40K |
| **LFPDPPP compliance** | INAI | Data privacy compliance | 2-3 months | $5,000-10,000 |

### 4.3 Licensing Requirements Common to Both Countries

| Requirement | Description | iPay Readiness |
|---|---|---|
| **Minimum capital** | Varies by license type ($100K-$500K) | Covered by seed round |
| **AML/CFT compliance program** | Written policies, officer, training, reporting | Developed in Phase 2 |
| **Technology security audit** | Independent audit of systems and controls | Smart contract audit + SOC 2 prep |
| **Corporate governance** | Board, compliance officer, risk management | Establish during Phase 2 |
| **Business continuity plan** | Disaster recovery, data backup, incident response | Standard cloud infrastructure |
| **Consumer protection policies** | Dispute resolution, refunds, transparency | Built into platform from day 1 |

### 4.4 Phase 3 Compliance Actions

| Action | Timeline | Cost Estimate | Priority |
|---|---|---|---|
| File Colombia SEDPE application or sandbox graduation | Month 9 | $30,000-50,000 | P0 |
| File Mexico RNAVASPS registration | Month 9 | $15,000-25,000 | P0 |
| Appoint dedicated Compliance Officer | Month 9 | $5,000-8,000/month | P0 |
| Conduct smart contract security audit (CertiK, OtterSec, or Neodyme) | Month 10 | $30,000-80,000 | P0 |
| Begin SOC 2 Type 1 preparation | Month 10 | $20,000-40,000 | P1 |
| Implement automated suspicious activity reporting | Month 11 | $10,000-20,000 | P0 |
| File Mexico ITF application | Month 12 | $50,000-80,000 | P1 |
| Establish formal risk management committee | Month 12 | Internal | P1 |

---

## 5. PHASE 4: MULTI-COUNTRY EXPANSION (Months 18-36)

### 5.1 Brazil

**Regulatory framework:**
- Marco Legal das Criptomoedas (Law 14,478/2022) — comprehensive crypto regulation
- Banco Central do Brasil — primary regulator for payment institutions
- CVM (securities regulator) — relevant if token classification changes
- LGPD (Lei Geral de Protecao de Dados) — data privacy law (similar to GDPR)

**Licensing path:**

| License | Authority | What It Enables | Timeline |
|---|---|---|---|
| **Payment Institution (IP)** | Banco Central | Process payments, issue electronic money | 12-18 months |
| **Virtual Asset Service Provider** | Banco Central (new framework) | Operate crypto services | 6-12 months |

**Key considerations:**
- PIX integration requires Banco Central authorization
- NuCoin (Nubank) precedent validates blockchain loyalty tokens
- Largest LATAM market but most complex regulatory environment

### 5.2 Argentina

**Regulatory framework:**
- CNV (Comision Nacional de Valores) — regulates virtual assets
- BCRA (Banco Central) — regulates payment systems
- UIF (Unidad de Informacion Financiera) — AML authority
- High inflation makes stablecoin payments extremely compelling

**Licensing path:**

| License | Authority | Timeline |
|---|---|---|
| **PSP Registration** (Proveedor de Servicios de Pago) | BCRA | 6-9 months |
| **Virtual Asset Registration** | CNV | 3-6 months |

### 5.3 Chile

**Regulatory framework:**
- Ley Fintech (2023) — new fintech regulation
- CMF (Comision para el Mercado Financiero) — primary regulator
- Relatively straightforward licensing process

### 5.4 Expansion Decision Framework

Before entering a new country, iPay evaluates:

| Criterion | Weight | Threshold |
|---|---|---|
| Crypto adoption rate | 25% | >5% of adult population |
| Regulatory clarity | 25% | Clear fintech/crypto framework exists |
| Market size (GDP) | 20% | >$100B GDP |
| Digital payment adoption | 15% | >40% of population uses digital payments |
| Strategic partner availability | 15% | Licensed partner identified |

### 5.5 Phase 4 Compliance Actions

| Action | Timeline | Cost Estimate |
|---|---|---|
| Brazil market entry legal analysis | Month 18 | $10,000-15,000 |
| Brazil payment institution application | Month 20 | $80,000-120,000 |
| Argentina PSP registration | Month 22 | $15,000-25,000 |
| Chile CMF fintech registration | Month 24 | $15,000-25,000 |
| SOC 2 Type 2 certification | Month 24 | $30,000-50,000 |
| ISO 27001 certification (information security) | Month 30 | $40,000-60,000 |
| Multi-jurisdiction compliance management platform | Month 18 | $2,000-5,000/month |

---

## 6. KYC/AML IMPLEMENTATION PLAN

### 6.1 Tiered KYC Approach

iPay implements risk-based KYC that balances compliance with user experience:

| Tier | Requirements | Limits | When Applied |
|---|---|---|---|
| **Tier 0 — Wallet Only** | Solana wallet address only | Crypto-to-crypto, <$100/month | Phase 1 (current) |
| **Tier 1 — Basic** | Email + phone number + wallet | <$1,000/month transaction volume | Phase 2 |
| **Tier 2 — Standard** | Government ID + selfie + proof of address | <$10,000/month transaction volume | Phase 2 |
| **Tier 3 — Enhanced** | All of Tier 2 + source of funds + video call | >$10,000/month or flagged by monitoring | Phase 3 |

### 6.2 KYC Technology Stack

| Component | Provider | Purpose | Cost |
|---|---|---|---|
| **Identity verification** | Metamap (LATAM-focused) | Document verification, liveness check, facial matching | $0.50-2.00 per verification |
| **Sanctions screening** | Chainalysis / Elliptic | OFAC, EU, UN sanctions list screening | $500-2,000/month |
| **Wallet screening** | Chainalysis KYT | Check wallet addresses against known illicit addresses | $1,000-3,000/month |
| **Transaction monitoring** | Custom + Chainalysis | Pattern detection, threshold alerts, suspicious activity | $1,000-3,000/month |
| **Case management** | Custom (Supabase) | Compliance team workflow for flagged accounts | Internal |

### 6.3 AML/CFT Program Components

| Component | Description | Implementation |
|---|---|---|
| **Written AML policy** | Comprehensive policy document covering all obligations | Month 4 (Phase 2) |
| **Compliance Officer** | Named individual responsible for AML program | Month 4 (part-time), Month 9 (full-time) |
| **Risk assessment** | Annual assessment of ML/TF risks by product, geography, customer type | Month 4, then annually |
| **Customer Due Diligence (CDD)** | Tiered KYC as described above | Month 4 |
| **Enhanced Due Diligence (EDD)** | Additional scrutiny for high-risk customers (PEPs, high volume) | Month 6 |
| **Suspicious Activity Reporting (SAR)** | File reports with relevant FIU (UIAF Colombia, UIF Mexico) | Month 6 |
| **Record keeping** | Maintain transaction records for 5-10 years (jurisdiction-dependent) | Month 3 |
| **Employee training** | Annual AML training for all staff | Month 6, then annually |
| **Independent audit** | External review of AML program effectiveness | Month 12, then annually |

### 6.4 Transaction Monitoring Rules

| Rule | Trigger | Action |
|---|---|---|
| **Large transaction** | Single tx > $3,000 USD equivalent | Auto-flag for review |
| **Structuring detection** | Multiple tx just below threshold in 24h | Auto-flag for review |
| **Velocity check** | >10 transactions in 1 hour from same wallet | Temporary hold + review |
| **Sanctions hit** | Wallet address matches sanctions list | Block transaction + report |
| **High-risk country** | Transaction originates from FATF grey/black list country | Enhanced review |
| **Unusual pattern** | Significant deviation from customer's historical pattern | Auto-flag for review |
| **Round amounts** | Repeated exact round-number transactions | Flag if combined with other indicators |

### 6.5 Reporting Obligations by Country

| Country | Authority | Report Type | Threshold | Deadline |
|---|---|---|---|---|
| **Colombia** | UIAF | ROS (Reporte de Operacion Sospechosa) | No threshold (suspicion-based) | Immediate |
| **Colombia** | UIAF | Transacciones en efectivo | >$10M COP (~$2,500) | Monthly |
| **Mexico** | UIF | Reporte de Operaciones Inusuales | No threshold (suspicion-based) | 24 hours |
| **Mexico** | UIF | Reportes de Operaciones Relevantes | >$7,500 USD equivalent | Monthly |
| **Brazil** | COAF | Comunicacao de Operacao Suspeita | No threshold (suspicion-based) | 24 hours |

---

## 7. TOKEN CLASSIFICATION STRATEGY

### 7.1 Objective

Ensure iPAY is consistently classified as a **loyalty/utility token** (not a security, virtual asset for trading, or electronic money) across all operating jurisdictions.

### 7.2 Classification Defense

iPAY is designed to satisfy loyalty token classification in every jurisdiction:

| Regulatory Test | iPAY Design Feature | Outcome |
|---|---|---|
| **Howey Test (USA)** | No investment of money, no profit expectation, no common enterprise | NOT a security |
| **Colombia (SFC)** | Not tradable on exchanges, earned through commerce, redeemed for discounts | Loyalty program, not virtual asset |
| **Mexico (CNBV/Ley Fintech)** | Not used as medium of exchange, store of value, or unit of account outside iPay network | Not a "virtual asset" under Ley Fintech |
| **Brazil (CVM)** | No investment contract, no profit expectation, utility-only | Not a "valor mobiliario" (security) |
| **EU (MiCA)** | Utility token with defined function, not transferable on secondary markets | Excluded from MiCA scope or classified as utility token |

### 7.3 Design Choices That Protect Classification

| Design Choice | Regulatory Purpose |
|---|---|
| **No exchange listing** | Prevents classification as tradable virtual asset |
| **No liquidity pools** | Prevents price discovery and speculative trading |
| **No token sale / ICO** | Prevents "investment of money" argument |
| **Burn on redemption** | Demonstrates utility-only purpose |
| **Merchant-defined redemption values** | Value is in discounts, not market price |
| **No governance rights** | Prevents classification as equity-like instrument |
| **Adjustable earning rate** | Platform controls supply, preventing artificial scarcity |
| **Cross-merchant but closed network** | Prevents use as general-purpose currency |

### 7.4 Legal Opinions Required

| Opinion | Jurisdiction | Purpose | Timeline | Cost |
|---|---|---|---|---|
| iPAY is not a security | Colombia | Confirm non-security status under Colombian law | Month 1 | $3,000-5,000 |
| iPAY is not a virtual asset | Colombia | Confirm iPAY does not trigger SFC virtual asset rules | Month 1 | $3,000-5,000 |
| iPAY is not a virtual asset | Mexico | Confirm iPAY does not trigger Ley Fintech registration | Month 5 | $5,000-8,000 |
| iPAY is not a security | USA (for investor comfort) | Confirm non-security status under Howey test | Month 6 | $10,000-15,000 |
| iPAY is not a valor mobiliario | Brazil | Confirm non-security status under Brazilian law | Month 18 | $5,000-8,000 |

### 7.5 Ongoing Classification Monitoring

| Activity | Frequency | Purpose |
|---|---|---|
| Review token usage patterns | Monthly | Ensure iPAY is being used as loyalty (not speculative trading) |
| Monitor regulatory changes | Weekly | Track new laws/guidance that may affect classification |
| Update legal opinions | Annually | Refresh legal analysis with current regulatory landscape |
| Review peer classifications | Quarterly | Monitor how similar tokens (Blackbird FLY, NuCoin) are treated |
| Engage with regulators proactively | As needed | Attend regulatory consultations, submit comments on proposed rules |

---

## 8. DATA PRIVACY COMPLIANCE

### 8.1 Applicable Laws

| Jurisdiction | Law | Key Requirements | Effective |
|---|---|---|---|
| **Colombia** | Ley 1581/2012 (Habeas Data) + Decreto 1377/2013 | Consent-based, data subject rights, SIC registration | Active |
| **Mexico** | LFPDPPP (Ley Federal de Proteccion de Datos Personales en Posesion de Particulares) | Privacy notice, consent, ARCO rights, INAI oversight | Active |
| **Brazil** | LGPD (Lei Geral de Protecao de Dados) | GDPR-equivalent, DPO required, ANPD oversight | Active |
| **EU** | GDPR | Strictest standard, relevant for EU users/investors | Active |

### 8.2 Data iPay Collects

| Data Category | Examples | Legal Basis | Retention |
|---|---|---|---|
| **Wallet data** | Solana public address, transaction history | Legitimate interest (service provision) | Duration of account + 5 years |
| **Identity data (KYC)** | Name, ID document, selfie, address | Legal obligation (AML compliance) | 5-10 years after account closure |
| **Contact data** | Email, phone number | Consent | Duration of account |
| **Transaction data** | Payment amounts, merchant, timestamp | Contract performance + legal obligation | 5-10 years |
| **Usage data** | Dashboard interactions, AI queries | Legitimate interest (product improvement) | 2 years (anonymized) |
| **Device data** | IP address, browser, device type | Legitimate interest (security) | 1 year |

### 8.3 Privacy-by-Design Implementation

| Principle | Implementation |
|---|---|
| **Data minimization** | Collect only what is legally required or essential for service |
| **Purpose limitation** | Each data point has a documented purpose; no secondary use without consent |
| **Storage limitation** | Automated deletion schedules per data category |
| **Encryption at rest** | AES-256 encryption for all personal data in Supabase |
| **Encryption in transit** | TLS 1.3 for all API communications |
| **Access control** | Role-based access; compliance team only for KYC data |
| **Audit logging** | All access to personal data is logged and monitored |
| **Right to deletion** | Automated workflow for data deletion requests (within legal retention limits) |
| **Data portability** | Export user data in standard format on request |
| **Pseudonymization** | On-chain data uses wallet addresses (pseudonymous by default) |

### 8.4 Data Privacy Actions by Phase

| Action | Phase | Timeline | Cost |
|---|---|---|---|
| Draft Privacy Policy (multi-jurisdiction) | Phase 1 | Month 1 | $3,000-5,000 |
| Register with SIC (Colombia) | Phase 1 | Month 2 | $1,000-2,000 |
| Implement cookie consent and data preferences | Phase 1 | Month 2 | Internal |
| Data Processing Impact Assessment (DPIA) | Phase 2 | Month 4 | $5,000-8,000 |
| Appoint Data Protection Officer (DPO) | Phase 2 | Month 6 | Part of Compliance Officer role |
| LGPD compliance assessment (Brazil) | Phase 4 | Month 18 | $8,000-12,000 |
| Register with ANPD (Brazil) | Phase 4 | Month 20 | $2,000-3,000 |
| Annual privacy audit | Ongoing | Annually from Month 12 | $5,000-10,000 |

### 8.5 Cross-Border Data Transfers

iPay may transfer data across borders (e.g., Colombian user data processed by Metamap in another jurisdiction). Compliance approach:

| Mechanism | When Used |
|---|---|
| **Standard contractual clauses** | Data transfer to processors outside originating country |
| **Adequacy decisions** | Transfer to countries with recognized adequate protection |
| **Explicit consent** | When other mechanisms are not available |
| **Data localization** | Keep critical data (KYC documents) in originating country where required |

---

## 9. REGULATORY RISK MATRIX

### 9.1 Risk Assessment

| Risk | Likelihood | Impact | Mitigation | Residual Risk |
|---|---|---|---|---|
| **iPAY reclassified as security** | Low | Critical | No sale, no exchange, burn-on-redeem, legal opinions | Very Low |
| **iPAY reclassified as virtual asset** | Low-Medium | High | No secondary market, non-tradable design, legal opinions | Low |
| **Colombia bans crypto payments** | Very Low | High | Multi-country strategy; Colombia trending toward regulation, not prohibition | Very Low |
| **Mexico Ley Fintech restricts crypto payments** | Low | High | Partner with licensed ITF; design within existing framework | Low |
| **KYC provider data breach** | Low | High | Use SOC 2 certified providers; contractual liability; insurance | Low |
| **AML violation (undetected illicit funds)** | Low-Medium | Critical | Wallet screening, transaction monitoring, SAR filing | Low |
| **FATF travel rule non-compliance** | Medium | Medium | Implement travel rule for transfers >$1,000 via Notabene or similar | Low |
| **Data privacy violation** | Low | High | Privacy-by-design, DPO, regular audits | Very Low |
| **Smart contract exploit** | Low | Critical | Security audits (CertiK/OtterSec), bug bounty, insurance | Low |
| **Regulatory sandbox rejection** | Medium | Medium | Alternative: operate under partner's license | Low |

### 9.2 Regulatory Monitoring

| Source | Frequency | Responsible |
|---|---|---|
| Colombia SFC circulars and resolutions | Weekly | Compliance Officer |
| Mexico CNBV regulatory updates | Weekly | Mexico compliance counsel |
| Brazil Banco Central communications | Weekly | Brazil compliance counsel |
| FATF publications and country assessments | Monthly | Compliance Officer |
| Chainalysis/Elliptic regulatory reports | Monthly | Compliance Officer |
| Peer company regulatory actions | Weekly | Legal team |
| CoinDesk/The Block regulatory coverage | Daily | Compliance Officer |

---

## 10. KEY CONTACTS & RESOURCES

### 10.1 Regulatory Authorities

| Country | Authority | Jurisdiction | Website |
|---|---|---|---|
| Colombia | Superintendencia Financiera (SFC) | Financial regulation, sandbox | superfinanciera.gov.co |
| Colombia | SIC | Data privacy, consumer protection | sic.gov.co |
| Colombia | UIAF | AML/CFT reporting | uiaf.gov.co |
| Mexico | CNBV | Fintech regulation, virtual assets | gob.mx/cnbv |
| Mexico | INAI | Data privacy | home.inai.org.mx |
| Mexico | UIF | AML/CFT reporting | gob.mx/uif |
| Brazil | Banco Central | Payment institutions, virtual assets | bcb.gov.br |
| Brazil | CVM | Securities regulation | gov.br/cvm |
| Brazil | ANPD | Data privacy | gov.br/anpd |

### 10.2 Industry Associations

| Organization | Relevance |
|---|---|
| Colombia Fintech | Industry association, regulatory advocacy, networking |
| Fintech Mexico | Ley Fintech compliance guidance, industry standards |
| ABFintechs (Brazil) | Brazilian fintech association |
| Blockchain Colombia | Crypto-specific industry group |
| Global Digital Finance (GDF) | International standards for digital assets |

### 10.3 Compliance Service Providers

| Category | Recommended Providers |
|---|---|
| **KYC/Identity** | Metamap (LATAM-focused), Sumsub, Onfido |
| **Blockchain analytics** | Chainalysis, Elliptic, TRM Labs |
| **Travel rule** | Notabene, Sygna |
| **Smart contract audit** | OtterSec, CertiK, Neodyme, Halborn |
| **Legal (Colombia)** | PPU (Posse Herrera Ruiz), Baker McKenzie Bogota, Brigard Urrutia |
| **Legal (Mexico)** | Creel Garcia-Cuellar, Galicia Abogados, Baker McKenzie CDMX |
| **Legal (Brazil)** | Pinheiro Neto, Mattos Filho, TozziniFreire |
| **Insurance** | Evertas (crypto insurance), Nexus Mutual |

---

## COMPLIANCE BUDGET SUMMARY

| Phase | Timeline | Estimated Cost | Cumulative |
|---|---|---|---|
| **Phase 1** (No license needed) | Months 0-3 | $15,000 - $20,000 | $20,000 |
| **Phase 2** (Licensed partner) | Months 3-9 | $60,000 - $100,000 | $120,000 |
| **Phase 3** (Own licenses CO/MX) | Months 9-18 | $150,000 - $250,000 | $370,000 |
| **Phase 4** (Multi-country) | Months 18-36 | $200,000 - $350,000 | $720,000 |
| **Ongoing annual** (post-Phase 4) | Per year | $100,000 - $200,000/year | — |

**Total 3-year compliance investment: $500,000 - $720,000**

This is approximately 15-20% of the seed round ($3.5M-$5M), which is appropriate for a fintech company in regulated markets.

---

## COMPLIANCE CHECKLIST: QUICK REFERENCE

### Immediate (This Month)
- [ ] Register company in Colombia (SAS)
- [ ] Obtain legal opinion: iPAY is not a security (Colombia)
- [ ] Obtain legal opinion: iPay does not need a financial license for current operations
- [ ] Draft and publish Terms of Service
- [ ] Draft and publish Privacy Policy
- [ ] Register with SIC for data processing (Colombia)

### Within 3 Months
- [ ] Engage compliance advisor (monthly retainer)
- [ ] Sign KYC provider contract (Metamap)
- [ ] Implement basic transaction record-keeping
- [ ] Document AML risk assessment
- [ ] Begin partner discussions (Bitso, Bridge, Nequi)

### Within 6 Months
- [ ] Implement tiered KYC (Tiers 0-2)
- [ ] Integrate wallet screening (Chainalysis)
- [ ] Draft AML/CFT compliance manual
- [ ] Apply to Colombia regulatory sandbox
- [ ] Sign fiat on/off-ramp partnership
- [ ] Appoint Compliance Officer
- [ ] Conduct first employee AML training

### Within 12 Months
- [ ] Smart contract security audit completed
- [ ] Transaction monitoring system operational
- [ ] SAR filing process established
- [ ] Mexico RNAVASPS registration filed
- [ ] Begin SOC 2 Type 1 preparation
- [ ] First independent AML program audit

### Within 18 Months
- [ ] Colombia SEDPE or sandbox graduation obtained
- [ ] Mexico ITF application filed
- [ ] SOC 2 Type 1 certification obtained
- [ ] Enhanced KYC (Tier 3) operational
- [ ] Travel rule implementation for >$1,000 transfers
- [ ] Brazil market entry legal analysis completed

---

*Document version: 1.0*
*Last updated: March 2026*
*iPay — The Square of PayFi*
