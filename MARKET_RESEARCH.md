# iPay — Investigación de Mercado
### Estilo McKinsey | Solana LATAM Hackathon 2026

---

## EXECUTIVE SUMMARY

iPay se posiciona como la **primera plataforma de pagos + lealtad + IA nativa de Solana para LATAM**, combinando Solana Pay, Blinks (blockchain links), SPL Token Extensions y un AI Agent que personaliza la experiencia tanto para comercios como para consumidores.

El mercado está maduro: $1.5T en cripto en LATAM, 57.7M de holders, stablecoins representando 39% de compras crypto, y una convergencia sin precedentes entre AI y blockchain en 2026. Sin embargo, **ninguna solución existente combina pagos + lealtad + IA + Blinks en un solo producto para LATAM**.

---

## 1. ECOSISTEMA DE PAGOS EN SOLANA — Estado Actual

### 1.1 Solana Pay
- **Qué es:** Protocolo open-source para pagos con SOL y SPL tokens vía QR codes y payment links
- **Capacidades:** Transferencias SOL/SPL, QR codes, payment pointers, NFT minting at checkout, loyalty tokens at point of sale
- **Adopción:** Miles de comercios en Shopify vía integración con Helio
- **Institucional:** Visa ($3.5B en volumen anualizado USDC), Stripe, Worldpay (50% reducción en tiempos de procesamiento)
- **YouTube:** Habilitó payouts en PYUSD sobre Solana para creadores de EE.UU. (dic 2025)
- **Limitación:** No tiene capa de lealtad nativa, ni IA, ni dashboard para comercios

### 1.2 Solana Actions & Blinks
- **Qué son:** APIs estándar que entregan transacciones firmables desde cualquier app directamente al usuario
- **Blinks:** Convierten cualquier Solana Action en un link compartible con metadata rica
- **Cómo funcionan:** 2 endpoints (GET para metadata, POST para transacción firmable) + archivo actions.json
- **SDK:** `@solana/actions` para desarrollo rápido
- **Inspector:** blinks.xyz para testing/debugging
- **Capacidades:** Votar, donar, mintear, swapear, pagar — todo desde un link sin app tercera
- **Estado:** Funcional pero con adopción limitada — OPORTUNIDAD ENORME para hackathon

### 1.3 Competidores Directos en Solana

| Plataforma | Qué hace | Limitaciones | Oportunidad para iPay |
|---|---|---|---|
| **Helio** | Pagos crypto para Shopify, 6,000+ merchants, auto off-ramp a fiat | Solo pagos, sin lealtad, sin IA, sin Blinks | iPay integra todo |
| **TipLink** | Wallet vía Google login, elimina seed phrases | Solo wallet/transfers, no es plataforma comercial | iPay es B2B+B2C |
| **Sphere** | Payment processing, API-first | Developer-focused, no tiene UX consumer | iPay tiene UX consumer |
| **Code App** | Micropagos instantáneos | Ecosistema cerrado, sin loyalty | iPay es open + loyalty |
| **Decaf** | Wallet + off-ramp | Solo wallet, no plataforma de comercio | iPay es ecosistema completo |
| **MESO Network** | Bank-to-wallet transfers, 50%+ mejor que on-ramps tradicionales | Solo on-ramp, no pagos merchant | iPay complementa esto |

### 1.4 SPL Token Extensions (Token-2022)
- **Transfer Hooks:** Ejecutan programa custom en cada transfer (ideal para acumular loyalty points automáticamente)
- **Confidential Transfers:** Balances ocultos con zero-knowledge proofs
- **Permanent Delegation:** Token-gating por NFTs o loyalty cards
- **Metadata nativa:** Sin necesidad de Metaplex
- **Adopción enterprise:** Paxos y GMO-Z.com Trust ya lo usan para stablecoins

**INSIGHT CLAVE:** Transfer Hooks permiten que CADA pago en iPay automáticamente acumule loyalty tokens sin transacción extra — esto es un game changer técnico.

---

## 2. ANÁLISIS COMPETITIVO GLOBAL

### 2.1 Competidores Cross-Chain
| Plataforma | Modelo | Debilidad |
|---|---|---|
| **Coinbase Commerce** | Pagos crypto para e-commerce | Sin lealtad, sin IA, UX compleja |
| **BitPay** | Pagos crypto + tarjeta débito | Legacy, lento, fees altos |
| **MoonPay/Ramp/Transak** | On-ramp fiat→crypto | Solo on-ramp, no commerce |
| **Strike** | Pagos Lightning Bitcoin | Solo Bitcoin, no tokens custom |
| **Request Network** | Invoicing crypto | Solo facturación, no POS |

### 2.2 Programas de Lealtad Blockchain

| Programa | Estado | Lección para iPay |
|---|---|---|
| **Blackbird** (restaurantes) | ✅ EXITOSO — 1,000+ restaurantes, $50M funding, token $FLY, Flynet L3 en Base | Modelo a seguir pero en vertical restaurantes solamente. iPay es horizontal. |
| **Starbucks Odyssey** | ❌ MUERTO — Cerrado en 2024 | Falló por complejidad y desconexión con pagos reales |
| **NuCoin (Nubank)** | ✅ ACTIVO — Relanzado 2025, enfoque en engagement no especulación | Validación de que LATAM quiere loyalty crypto |
| **Hang** | ✅ ACTIVO — NFT memberships para marcas | Solo memberships, no pagos |

**INSIGHT:** Blackbird es el caso de éxito #1 pero está limitado a restaurantes en EE.UU. y usa Base (no Solana). iPay puede ser "Blackbird para todo LATAM, en Solana, con IA".

### 2.3 Pagos Tradicionales + Lealtad
- **Square Loyalty:** API robusta, webhooks para eventos loyalty, integración POS — GOLD STANDARD de UX
- **Stripe:** Mejor developer experience del mundo, webhooks completos, CRM integration nativa
- **Toast/Clover:** Vertical restaurantes, loyalty integrado

**GAP:** Ninguno ofrece pagos crypto + loyalty + IA. El puente entre Square/Stripe y crypto NO EXISTE para LATAM.

---

## 3. MERCADO LATAM — La Oportunidad

### 3.1 Números Clave
- **$1.5T** en crypto en LATAM
- **57.7M** de personas (12.1% población) tienen crypto
- **63%** crecimiento en adopción crypto (mid-2024 a mid-2025)
- **116%** crecimiento en uso crypto durante 2024
- **39%** de compras crypto son stablecoins
- **68%** market share de PIX en Brasil
- **40%** de pagos e-commerce en LATAM son métodos alternativos

### 3.2 Ecosistema de Pagos LATAM

| País | Solución Dominante | Pain Points |
|---|---|---|
| **Brasil** | PIX (68% market share) | Regulación LGPD, fees para merchants en tarjetas |
| **México** | SPEI / CoDi | Adopción lenta de CoDi, fragmentación |
| **Colombia** | Nequi / PSE | Comisiones, limitaciones cross-border |
| **Argentina** | Mercado Pago | Inflación, controles cambiarios, necesidad de USD |
| **El Salvador** | Bitcoin legal tender | Infraestructura débil, volatilidad |

### 3.3 Pain Points de Comercios en LATAM
1. **Fees altos** en tarjetas de crédito (3-7% por transacción)
2. **Settlement lento** (24-72 horas para recibir fondos)
3. **Sin programas de lealtad accesibles** para PyMEs
4. **Fragmentación** de medios de pago por país
5. **Cross-border payments** son caros y lentos
6. **Sin analytics** accesibles para pequeños comercios

### 3.4 Solana en LATAM
- Brasil aprobó los primeros ETFs spot de SOL del mundo (B3 Exchange)
- Bitso integró USDT en Solana
- Visa expandió settlements USDC en Solana para LATAM
- MiniPay conecta stablecoins con PIX y Mercado Pago
- Comunidad activa de devs Solana en LATAM (WayLearn, Superteam LATAM)

---

## 4. AI + BLOCKCHAIN — El Diferencial Game Changer

### 4.1 La Convergencia 2026
> "2025 será recordado como el último año en que AI, pagos y blockchains operaron como sistemas separados" — Entrepreneur.com

- **Tempo** (respaldado por Stripe + Paradigm): Blockchain de pagos con Machine Payments Protocol para AI agents
- **Coinbase Agentic Wallets:** 50M+ transacciones machine-to-machine desde late 2025
- **x402 Protocol en Solana:** 35M+ transacciones, $10M+ en volumen procesado
- **Mercado AI Agents:** $7.84B (2025) → $52.62B (2030), CAGR 46.3%

### 4.2 Solana Agent Kit (SendAI)
- **60+ acciones pre-construidas:** Token ops, NFT minting, DeFi, pagos
- **Open source:** github.com/sendaifun/solana-agent-kit
- **Integración directa** con wallets de Solana
- **Ideal para iPay:** Podemos usar el Agent Kit para crear un AI assistant que maneje pagos y loyalty

### 4.3 Griffain
- Agentes AI autónomos en Solana
- 1M+ transacciones automatizadas procesadas
- Agentes especializados (trading, NFTs, sniper)
- **No tiene:** Agentes para pagos comerciales + loyalty → OPORTUNIDAD iPay

### 4.4 Funcionalidades AI para iPay (PROPUESTA)

| Feature AI | Para quién | Qué hace | Por qué es game changer |
|---|---|---|---|
| **AI Loyalty Optimizer** | Comercios | Analiza patrones de compra y ajusta automáticamente multiplicadores de rewards | Ningún competidor crypto tiene esto |
| **Natural Language Blinks** | Comercios | "Crea un link de cobro de $50 con doble puntos" → genera Blink automáticamente | Elimina barrera técnica para comercios |
| **Smart Receipt AI** | Consumidores | Categoriza gastos, predice presupuesto, sugiere dónde usar loyalty tokens | Combina finanzas personales + loyalty |
| **Fraud Detection On-Chain** | Plataforma | Detecta patrones anómalos en transacciones en tiempo real | Seguridad nativa, no add-on |
| **Cashflow Predictor** | Comercios | Dashboard con predicción de flujo de caja basado en historial de pagos | Analytics que PyMEs LATAM no tienen hoy |
| **AI Agent Payments** | Developers | Agente autónomo que puede realizar pagos y gestionar loyalty via API | Alineado con tendencia x402/agentic |

---

## 5. INTEGRACIONES — CRM, Web, Link, QR

### 5.1 Modelo de Integración iPay

```
┌─────────────────────────────────────────────────────────┐
│                    iPay ECOSYSTEM                        │
├──────────┬──────────┬──────────┬──────────┬─────────────┤
│  QR Code │  Blink   │  Widget  │   API    │  AI Agent   │
│  (POS)   │  (Link)  │  (Web)   │ (CRM)   │  (Auto)     │
├──────────┴──────────┴──────────┴──────────┴─────────────┤
│              Solana Program (Anchor)                     │
│         Pagos + Loyalty + Token Extensions               │
├─────────────────────────────────────────────────────────┤
│                   Solana Devnet                          │
└─────────────────────────────────────────────────────────┘
```

### 5.2 Canal: QR Code (POS Físico)
- **Estándar:** Solana Pay QR specification
- **Flujo:** Comercio muestra QR → Cliente escanea con wallet → Aprueba tx → Loyalty tokens se acumulan automáticamente vía Transfer Hook
- **Diferencial vs WeChat/Alipay:** Descentralizado, sin intermediario, loyalty automático
- **Diferencial vs PIX/CoDi:** Loyalty integrado, funciona cross-border

### 5.3 Canal: Blink (Link Compartible)
- **Estándar:** Solana Actions API (GET + POST endpoints)
- **Flujo:** Comercio genera Blink (vía dashboard o AI) → Comparte por WhatsApp/Instagram/email → Cliente abre link → Firma tx → Loyalty automático
- **Diferencial:** Ningún competidor combina Blinks + Loyalty. TipLink hace transfers, no commerce+loyalty.

### 5.4 Canal: Widget Web (E-commerce)
- **Implementación:** JavaScript SDK embebible (`<script src="ipay.js">`)
- **Flujo:** Botón "Pagar con iPay" en checkout → Modal con wallet connect → Pago + loyalty
- **Modelo a seguir:** Stripe Checkout embeddable, pero on-chain
- **Integraciones target:** Shopify (vía app), WooCommerce, landing pages

### 5.5 Canal: API REST (CRM/Third-party)
- **Modelo:** Stripe-like API con API keys, webhooks, SDKs
- **Webhooks clave:**
  - `payment.completed` — Pago confirmado on-chain
  - `loyalty.points_earned` — Puntos acumulados
  - `loyalty.reward_redeemed` — Recompensa canjeada
  - `loyalty.milestone_reached` — Nivel alcanzado
  - `merchant.analytics_update` — Update de analytics
- **CRM Integration:** Salesforce, HubSpot, Zoho vía webhooks
- **Contabilidad:** QuickBooks, Xero vía API sync

### 5.6 Canal: AI Agent (Automatización)
- **Basado en:** Solana Agent Kit (SendAI) + modelo propio
- **Flujo:** Comercio dice "Quiero cobrar a mi cliente $100 con 3x puntos" → AI genera Blink → Envía por WhatsApp → Procesa pago → Actualiza CRM
- **Para developers:** API de AI Agent que puede integrarse a chatbots, asistentes, etc.

---

## 6. ANÁLISIS DE GAPS — ¿Qué NO Existe Hoy?

### Matriz de Funcionalidades vs Competencia

| Feature | Helio | TipLink | Sphere | Blackbird | Square | Stripe | **iPay** |
|---|---|---|---|---|---|---|---|
| Pagos Solana | ✅ | ✅ | ✅ | ❌ (Base) | ❌ | Parcial | ✅ |
| Blinks nativo | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Loyalty tokens | ❌ | ❌ | ❌ | ✅ ($FLY) | ✅ (fiat) | ❌ | ✅ |
| AI Assistant | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| QR Payments | ✅ | ❌ | ✅ | ❌ | ✅ | ❌ | ✅ |
| Merchant Dashboard | Básico | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ + AI |
| CRM Webhooks | ❌ | ❌ | Parcial | ❌ | ✅ | ✅ | ✅ |
| Foco LATAM | ❌ | ❌ | ❌ | ❌ (USA) | ❌ | ❌ | ✅ |
| Token Extensions | ❌ | ❌ | ❌ | N/A | N/A | N/A | ✅ |
| Open Source | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

### Lo que NO existe y iPay sí tendrá:
1. **Blinks + Loyalty** — Nadie combina Solana Blinks con programa de lealtad
2. **AI para comercios crypto** — Ningún payment processor crypto tiene IA para optimizar loyalty
3. **Transfer Hooks para loyalty automático** — Innovación técnica usando Token-2022
4. **Foco LATAM nativo** — Todos los competidores Solana son USA/Global-first
5. **Dashboard AI para PyMEs** — Analytics con predicción para pequeños comercios

---

## 7. LOS 10 GAPS DE SOLANA vs STRIPE/SQUARE — Roadmap de Integración

Basado en análisis profundo de las APIs de Stripe, Square, y el ecosistema Solana actual:

| # | Gap | Stripe/Square tiene | Solana tiene | Prioridad iPay |
|---|---|---|---|---|
| 1 | **Sistema de Webhooks/Eventos** | 200+ event types, retries, signature verification | Nada — merchants deben correr su propio indexer | **P0 — MVP** |
| 2 | **Hosted Checkout con captura de identidad** | Payment Links con line items, tax, shipping, coupons | Solo transfer request o transaction request básico | **P0 — MVP** |
| 3 | **Conector Contabilidad** | Auto-sync con QuickBooks, Xero, FreshBooks | Cero — reconciliación manual | P1 |
| 4 | **Auto off-ramp a fiat** | USD en cuenta bancaria automáticamente | USDC en wallet, merchant debe off-rampear manualmente | P1 |
| 5 | **Gestión de reembolsos** | `POST /v1/refunds` — un API call | Tx nueva sin linkeo al pago original | P1 |
| 6 | **Billing recurrente/suscripciones** | Scheduling, retries, dunning, proration completa | No existe primitive de "pull" payment | P2 |
| 7 | **Conector CRM** | Native Salesforce, HubSpot, Zoho sync | Cero — wallets son pseudónimas | P2 |
| 8 | **Conector Marketing** | Stripe+Klaviyo, Square+Mailchimp nativo | Cero — no hay identity layer | P2 |
| 9 | **Plugin E-commerce** | Shopify Checkout Extension, WooCommerce plugin | Solana Pay Shopify plugin (abandoned) | P2 |
| 10 | **Integración POS** | Square POS, Clover, Toast nativos | No existe POS SDK para Solana | P3 |

**Para el MVP de la hackathon, nos enfocamos en Gap #1 y #2** — sistema de eventos + checkout con Blinks — que es exactamente lo que iPay resuelve.

---

## 8. DEEP DIVE LATAM — Datos Duros del Mercado

### 8.1 Tamaño de Mercado
- **Pagos digitales LATAM:** $295-320B en valor de transacciones (2024), proyectado >$400B para 2026
- **CAGR:** 15-18% (2022-2027)
- **Brasil:** 50-55% del volumen total LATAM
- **México:** 18-20%, **Colombia:** ~8%, **Argentina:** ~7%
- **2,700+ startups fintech** en la región (IDB/Finnovista)

### 8.2 PIX — El Estándar de Referencia
- **4.2 BILLONES de transacciones/mes** (Q4 2024)
- **160M+ usuarios registrados** (en país de 215M)
- Procesa MÁS transacciones que tarjetas de crédito y débito combinadas
- Gratis para individuos, fees <1% para merchants
- 24/7/365, settlement en <10 segundos
- **Lección para iPay:** Settlement instantáneo + cero fees = adopción explosiva

### 8.3 Competidores Dominantes LATAM Detallados

| Plataforma | Usuarios | TPV | Fortaleza | Debilidad para iPay |
|---|---|---|---|---|
| **Mercado Pago** | 50M+ activos | ~$51B/año | Ecosistema completo, crédito basado en data | Fees 4-5%, vendor lock-in, sin crypto nativo |
| **Nubank** | 100M+ clientes | N/A | Banco digital más grande del mundo | No tiene loyalty tokenizado, NuCoin es limitado |
| **Nequi** | 18-20M | N/A | Dominante en Colombia 18-35 años | Solo Colombia, sin cross-border, sin loyalty avanzado |
| **Rappi Pay** | ~15M | N/A | Super-app con delivery | Pagos son secundarios al delivery |
| **dLocal** | B2B only | $18-20B/año | Cross-border para enterprises | No B2C, no loyalty, no PyMEs |

### 8.4 El Dolor del Comerciante LATAM (Profundizado)
- **Fees en tarjetas:** 3-7% por transacción (vs 2.5% en USA)
- **Settlement:** 14-30 DÍAS para tarjetas (vs 1-2 días en USA)
- **Fraud rates:** 2-3x más altos que promedio global
- **Cuotas/Parcelas:** Consumidores esperan pagar en 12 cuotas sin interés — el comercio absorbe el costo
- **26% de adultos LATAM sin bancarizar** (~130M personas)
- **Solo 30-40%** de micro/pequeños comercios tienen terminal POS
- **85-90%** de merchants usan Android (Samsung, Xiaomi, Motorola)
- **Muchos NO tienen computadora** — todo se gestiona desde el celular

### 8.5 Stablecoins como Revolución Silenciosa
- **50%+ del volumen crypto en LATAM** es stablecoins (mayor que promedio global)
- **Argentina:** $3-5B/mes en volumen stablecoins — hedge contra 200%+ inflación anual
- **Colombia:** Freelancers prefieren cobrar en USDC vs pesos
- **México:** Bitso procesa 3-5% de todas las remesas USA-México ($63-65B/año total)
- **Venezuela:** Stablecoins son medio de pago cotidiano

**OPORTUNIDAD iPay:** Permitir que merchants **reciban en moneda local pero opcionalmente guarden settlement en USDC** = lo mejor de ambos mundos.

### 8.6 Remesas — El Mercado Masivo
- **LATAM recibe ~$150-160B/año** en remesas
- **Corredor USA-México:** El más grande del mundo, $63-65B/año, fees 3.5-5%
- **USA-Colombia:** ~$10B/año, fees 4-6%
- **USA-Centroamérica:** ~$35-40B combinado, fees 4-7%
- **Blockchain ya compite:** Bitso procesa billones vía crypto rails

---

## 9. AI FEATURES — Arquitectura Detallada por Tiers

### Tier 1: Alto Impacto, Construible para MVP

#### A. Natural Language Blinks (PRIORIDAD #1 para hackathon)
```
Merchant: "Crea un link de cobro de $50 con doble puntos, que expire el viernes"
AI → Parsea intent → Llama Solana Agent Kit → Crea Blink con monto + 2x multiplier + expiry
→ Retorna link compartible por WhatsApp
```
- **Tecnología:** Solana Agent Kit (SendAI) + LLM (Claude API) + @solana/actions SDK
- **Diferenciación:** NADIE en el ecosistema Solana ofrece esto

#### B. AI Loyalty Optimizer
```
AI analiza: Customer X tiene CLV alto pero frecuencia bajando 30%
→ Auto-incrementa reward multiplier a 3x para re-engagement
→ Costo justificado por revenue retention predicho
```
- **Modelo:** RFM Analysis (Recency, Frequency, Monetary) + churn prediction
- **Referencia:** Starbucks "Deep Brew" hace esto internamente pero NO está disponible para PyMEs

#### C. Smart Receipt & Spending AI
- Auto-categoriza cada pago para consumidores
- Tracking de presupuesto, identificación de suscripciones
- Notificaciones proactivas: "Tu gasto en comida subió 20% este mes"

### Tier 2: Alto Impacto, Post-MVP

#### D. Fraud Detection On-Chain
- Monitoreo de patrones anómalos en transacciones
- Reputation scoring por wallet (edad, diversidad de tx, historial)
- Graph neural networks sobre data transaccional

#### E. Cashflow Predictor para Merchants
```
"Basado en tu historial, recibirás ~$12,400 la próxima semana (8% bajo promedio).
Tu pago de renta de $3,000 es el jueves. Recomendación: activar campaña de loyalty."
```

#### F. Conversational Commerce Agent
- Merchant despliega bot en Telegram/WhatsApp
- Bot responde preguntas, genera Blinks inline, procesa pagos
- Flujo: "¿Cuánto cuesta el café?" → "$5.50, ¿quieres pagar?" → Genera Blink → Pago → Loyalty automático

### Tier 3: Moonshot (Visión largo plazo)

#### G. AI Agent-to-Agent Commerce
- Agente del customer negocia con agente del merchant autónomamente
- Basado en ElizaOS/Agent Kit infrastructure

#### H. Cross-Merchant AI Intelligence Network
- Data agregada anónima genera inteligencia de mercado
- "Revenue en cafeterías de tu zona subió 12% este mes"
- Network effect: más merchants = mejor inteligencia

---

## 10. ESTRATEGIA GAME CHANGER — Recomendación Final

### Positioning Statement
> **iPay es la primera plataforma de pagos inteligentes en Solana para LATAM que combina Blinks, loyalty tokens con Transfer Hooks, y un AI Agent que permite a cualquier comercio crear, gestionar y optimizar pagos y recompensas con lenguaje natural.**

### Por qué iPay GANA la Hackathon

| Criterio de Evaluación | Cómo iPay lo domina | Score esperado |
|---|---|---|
| **Viabilidad Técnica** | Anchor + SPL Token Extensions + Solana Actions API + Solana Agent Kit — integración profunda con 4 capas del ecosistema | 10/10 |
| **Prototipo Funcional** | App completa: dashboard merchant + checkout consumer + AI chatbot + QR + Blinks | 10/10 |
| **Complejidad** | Transfer Hooks para loyalty automático + AI Agent + multi-canal + on-chain analytics | 10/10 |
| **Originalidad** | NADIE combina Blinks + Loyalty + AI. Enfoque LATAM único. Narrativa de impacto real. | 10/10 |

### Los 3 Pilares Diferenciales

#### Pilar 1: "Paga desde cualquier lugar" (Blinks + QR + Widget)
- Un comercio, múltiples canales de cobro
- Blink por WhatsApp, QR en mostrador, widget en web
- Todo conectado al mismo programa en Solana

#### Pilar 2: "Loyalty que se acumula solo" (Transfer Hooks + SPL Tokens)
- Cada pago automáticamente mintea loyalty tokens via Transfer Hook
- Sin transacción extra, sin gas extra, sin fricción
- Tokens intercambiables entre comercios del ecosistema iPay

#### Pilar 3: "Tu negocio con superpoderes AI" (Solana Agent Kit + Analytics)
- AI genera Blinks con lenguaje natural
- AI optimiza multiplicadores de loyalty según patrones
- Dashboard con predicción de cashflow
- Chatbot para consultar balance, generar cobros, ver analytics

### Verticales Prioritarias para MVP
1. **Cafeterías y restaurantes** — Alto volumen de transacciones repetitivas, loyalty es crítico
2. **Tiendas online** — Widget embebible, Blinks por redes sociales
3. **Freelancers y creadores** — Cobrar por Blink, acumular reputación on-chain

### Modelo de Revenue (Post-hackathon)
- **Free tier:** 0% fee hasta $1,000/mes en transacciones
- **Pro:** 1% fee + dashboard AI + CRM webhooks
- **Enterprise:** Custom pricing + API completa + dedicated AI agent

### TAM/SAM/SOM
- **TAM:** $400B+ pagos digitales LATAM (2026)
- **SAM:** $4.5B mercado loyalty blockchain (2025) + $150B remesas LATAM
- **SOM:** PyMEs crypto-friendly en LATAM — ~500K merchants potenciales en 3 años

---

## 11. FUENTES

### Ecosistema Solana
- [Solana Pay Docs](https://docs.solanapay.com/)
- [Solana Actions & Blinks Guide](https://solana.com/developers/guides/advanced/actions)
- [Solana Token Extensions](https://solana.com/solutions/token-extensions)
- [Solana Payments Hub](https://solana.com/docs/payments)
- [State of Solana Payments — Messari](https://messari.io/report/state-of-solana-payments)

### Competidores
- [Helio — Web3 Payments](http://www.rootdata.com/Projects/detail/Helio)
- [TipLink Wallet](https://solanafloor.com/news/tip-link-unveils-user-friendly-wallet-aiming-to-accelerate-mass-adoption-on-solana)
- [Blackbird — $50M Raise](https://techcrunch.com/2025/04/08/blackbird-gobbles-up-50m-for-its-blockchain-based-payment-loyalty-app-for-restaurants/)
- [Blackbird Flynet Launch](https://www.coindesk.com/tech/2025/02/26/blackbird-blockchain-restaurant-loyalty-app-goes-live-with-flynet-mainnet/)
- [Solana Payment Platforms — Solana Compass](https://solanacompass.com/projects/category/rwa/payments)

### AI + Blockchain
- [Why 2026 Is When AI, Payments and Blockchains Operate as One — Entrepreneur](https://www.entrepreneur.com/leadership/why-2026-is-the-turning-point-for-ai-crypto-and-global/500864)
- [AI and Crypto Convergence — Chainalysis](https://www.chainalysis.com/blog/ai-and-crypto-agentic-payments/)
- [Stripe Tempo — AI Agent Protocol](https://www.coindesk.com/tech/2026/03/18/stripe-led-payments-blockchain-tempo-goes-live-with-protocol-for-ai-agents)
- [x402 Protocol on Solana](https://solana.com/x402/what-is-x402)
- [Solana Agent Kit — SendAI](https://github.com/sendaifun/solana-agent-kit)
- [Griffain — Solana Compass](https://solanacompass.com/projects/griffain)
- [How to Build Solana AI Agents — Alchemy](https://www.alchemy.com/blog/how-to-build-solana-ai-agents-in-2026)

### LATAM
- [LATAM Crypto Adoption $1.5T — Chainalysis](https://www.chainalysis.com/blog/latin-america-crypto-adoption-2025/)
- [LATAM 2026 Crypto Moment — GoMarkets](https://www.gomarkets.com/en-eu/articles/latin-americas-crypto-moment-why-2026-could-be-latams-biggest-year-yet)
- [LATAM Stablecoin Distribution](https://www.emergingfintech.co/p/the-latam-stablecoin-moat-is-no-longer)
- [Solana Payments Data Report — CoinGate](https://coingate.com/blog/post/solana-payments-data-report)

### Integraciones & CRM
- [CRM Payment Integration — Stripe](https://stripe.com/resources/more/crm-payment-integration-explained)
- [Square Loyalty API](https://developer.squareup.com/docs/loyalty-api/overview)
- [Best Payment APIs 2026 — Postman](https://blog.postman.com/best-payment-apis-for-developers/)
- [Blockchain Loyalty Guide 2026 — Enable3](https://enable3.io/blog/blockchain-loyalty-program-guide)

### Loyalty Programs
- [Blockchain Loyalty Programs 2026 — Medium](https://medium.com/@dumouchelantonin/blockchain-in-loyalty-programs-transparent-and-instant-reward-accrual-by-2026-a3113fe60392)
- [Crypto Loyalty Programs — CoinMetro](https://www.coinmetro.com/learning-lab/crypto-loyalty-programs)
- [Deloitte: Blockchain for Loyalty](https://www.deloitte.com/us/en/Industries/financial-services/articles/making-blockchain-real-customer-loyalty-rewards-programs.html)
