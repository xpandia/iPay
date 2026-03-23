# iPay — AUDIT COMPLETO DE GAPS
## ¿Qué nos falta para 1er puesto + incubación + adquisición?

---

## BENCHMARK: Qué hicieron los ganadores recientes

### MCPay — Ganador $25K (Solana Cypherpunk Hackathon, Dic 2025)
- Conectó MCP (Model Context Protocol) + x402 para pagos de AI agents
- Infraestructura de pagos abierta
- **Lección:** Los jueces de Solana AMAN la intersección AI + Payments

### TapeDrive — Ganador $50K (Solana Breakout, Jul 2025)
- Storage descentralizado con rewards
- **Lección:** Infraestructura con incentivos económicos gana

### Baxxis — Caso de éxito con Blinks
- Vendió 375+ botellas, $70-80K en revenue solo con Blinks
- **Lección:** Blinks con e-commerce real FUNCIONA y los jueces lo saben

### Patrón de los ganadores:
1. ✅ Prototipo funcional end-to-end (no a medias)
2. ✅ Demo clara en los primeros 60 segundos
3. ✅ Problema real + solución creíble
4. ✅ Código limpio y documentado
5. ✅ Integración técnica profunda con Solana
6. ✅ Potencial de mercado post-hackathon

---

## ESTADO ACTUAL DE iPay

### ✅ LO QUE TENEMOS
- [x] Market Research completo (MARKET_RESEARCH.md)
- [x] Estrategia completa (STRATEGY.md)
- [x] Smart contract compilado con 5 instrucciones
- [x] Posicionamiento claro: "El Square de PayFi"
- [x] Alineamiento con Solana Foundation (PayFi)
- [x] Toolchain instalado y funcionando

### ❌ LO QUE NOS FALTA (ordenado por impacto)

---

## PRIORIDAD 1 — SIN ESTO NO GANAMOS (Bloqueantes)

### 1.1 Frontend Next.js [CRÍTICO]
**Estado:** No existe
**Impacto:** Sin frontend no hay demo, sin demo no hay premio
**Necesitamos:**
- Landing page atractiva que explique iPay
- Merchant Dashboard (registro, ver pagos, analytics, config loyalty)
- Consumer Checkout (pagar vía wallet, ver loyalty acumulado)
- AI Chat interface (generar Blinks con lenguaje natural)
- Mobile responsive (85%+ merchants LATAM usan Android)

### 1.2 Blinks API [CRÍTICO]
**Estado:** No existe
**Impacto:** Blinks es nuestro CORE differentiator y la categoría principal
**Necesitamos:**
- API Route GET → metadata del action (título, ícono, descripción)
- API Route POST → transacción firmable de pago
- Archivo actions.json en la raíz del dominio
- QR code generator que encode la URL del Blink
- Compartir Blink por link (WhatsApp, redes, email)

### 1.3 Deploy a Devnet [CRÍTICO]
**Estado:** Compilado pero NO deployed
**Impacto:** Requisito explícito de la hackathon
**Necesitamos:**
- SOL en devnet (airdrop o faucet web)
- Deploy programa con `anchor deploy`
- Inicializar platform + loyalty mint en devnet
- Verificar que todo funcione on-chain

### 1.4 Video Demo 3min [CRÍTICO]
**Estado:** No existe
**Impacto:** Requisito explícito, los jueces VEN el video primero
**Necesitamos:**
- Script ensayado (ya lo tenemos en STRATEGY.md)
- Screen recording con Loom
- Mostrar flujo completo: merchant → blink → pago → loyalty → AI
- Hook en los primeros 10 segundos

### 1.5 GitHub Repo Público [CRÍTICO]
**Estado:** Repo no creado
**Impacto:** Requisito explícito de la hackathon
**Necesitamos:**
- Inicializar git repo
- README.md profesional (logo, descripción, arquitectura, setup, screenshots)
- License (MIT)
- Push a GitHub público

---

## PRIORIDAD 2 — CON ESTO GANAMOS EL 1ER PUESTO (Diferenciadores)

### 2.1 AI Agent con Claude API [ALTO IMPACTO]
**Estado:** No implementado
**Por qué importa:** MCPay ganó $25K por AI + Payments. Es lo que los jueces buscan.
**Necesitamos:**
- Endpoint API que reciba texto natural
- Claude API procesa: "Crea un cobro de $50 con doble puntos para café"
- Retorna Blink generado automáticamente
- Chat UI en el merchant dashboard
- Bonus: conectar con MCP (Model Context Protocol) para que cualquier AI assistant pueda generar pagos iPay

### 2.2 USDC Support (no solo SOL) [ALTO IMPACTO]
**Estado:** Smart contract solo acepta SOL
**Por qué importa:** 50%+ del volumen crypto en LATAM es stablecoins
**Necesitamos:**
- Instrucción `process_payment_spl` que acepte SPL tokens (USDC)
- Usar devnet USDC mint
- Frontend toggle: pagar en SOL o USDC

### 2.3 Merchant Analytics Dashboard [ALTO IMPACTO]
**Estado:** No existe
**Por qué importa:** Demuestra que iPay es un PRODUCTO, no un smart contract
**Necesitamos:**
- Gráficas: volumen de pagos por día, loyalty distribuido, top customers
- Métricas en tiempo real desde on-chain data
- Exportar datos

### 2.4 Multi-merchant Loyalty Network [MEDIO]
**Estado:** Loyalty tokens ya son fungibles (SPL), pero no hay UI
**Por qué importa:** Diferencial vs Blackbird (que es single-vertical)
**Necesitamos:**
- Mostrar que loyalty tokens ganados en merchant A se pueden usar en merchant B
- UI que muestre "Your iPAY tokens are accepted at X merchants"

---

## PRIORIDAD 3 — CON ESTO GANAMOS LA INCUBACIÓN (Business Viability)

### 3.1 Landing Page + Waitlist [IMPORTANTE]
**Estado:** No existe
**Por qué importa:** Demuestra tracción potencial y compromiso post-hackathon
**Necesitamos:**
- Página de aterrizaje con value proposition clara
- Form de registro para waitlist (Supabase)
- Contador de registros visible

### 3.2 Pitch Deck / One-Pager [IMPORTANTE]
**Estado:** Tenemos la info pero no el formato
**Por qué importa:** Los evaluadores de incubación necesitan resumen ejecutivo
**Necesitamos:**
- One-pager PDF o presentación con:
  - Problema, Solución, Mercado, Diferencial, Equipo, Roadmap
  - Puede ser generado con Gamma

### 3.3 Documentación de API [MEDIO]
**Estado:** No existe
**Por qué importa:** Demuestra pensamiento de plataforma/producto
**Necesitamos:**
- Swagger/OpenAPI para las rutas de Blinks
- Webhook events documentation
- SDK de ejemplo

### 3.4 Presencia en Redes [MEDIO]
**Estado:** No existe
**Por qué importa:** Demuestra que hay equipo comprometido
**Necesitamos:**
- Thread en X/Twitter explicando qué estamos construyendo
- Updates diarios de progreso (build in public)

---

## PRIORIDAD 4 — CON ESTO NOS COMPRAN (Escalabilidad)

### 4.1 Refund System
**Estado:** No implementado en smart contract
**Por qué importa:** Gap #5 de Solana vs Stripe — sin refunds no hay commerce real
**Necesitamos:** Instrucción `process_refund` que linke refund → payment original

### 4.2 Webhook System
**Estado:** No implementado
**Por qué importa:** Gap #1 de Solana vs Stripe — es lo que merchants necesitan
**Necesitamos:** Sistema que escuche transacciones on-chain y dispare webhooks

### 4.3 Subscription/Recurring Payments
**Estado:** No implementado
**Por qué importa:** Gap #6 de Solana vs Stripe
**Necesitamos:** Token delegation + scheduler

### 4.4 Fiat Off-ramp Integration
**Estado:** No implementado
**Por qué importa:** Merchants necesitan $$ en su banco
**Necesitamos:** Integración con Circle/Bridge API (post-hackathon)

---

## MEJORAS AL SMART CONTRACT ACTUAL

### Lo que funciona bien:
- ✅ Payment + loyalty automático en una tx (core innovation)
- ✅ Merchant registry con PDA
- ✅ Platform fee configurable
- ✅ Loyalty multiplier por merchant (1x-10x)
- ✅ Token Interface (compatible Token-2022)
- ✅ Error handling

### Lo que mejorar:
1. **Agregar `process_payment_spl`** — pagos con USDC/SPL tokens, no solo SOL
2. **Agregar `process_refund`** — refund linked al payment original
3. **Agregar eventos (emit!)** — para indexadores y webhooks
4. **Agregar `get_merchant_stats`** — view function para analytics
5. **Payment receipt** — struct más rica con merchant name, items, etc.
6. **Merchant categories** — para filtrar por tipo de negocio
7. **Loyalty tiers** — Bronze/Silver/Gold basado en loyalty acumulado

---

## PLAN DE ACCIÓN REVISADO (Días 2-4)

### DÍA 2 (21 Mar) — CORE FEATURES
| Hora | Tarea | Impacto |
|---|---|---|
| AM | Deploy a devnet + inicializar platform | Desbloquea testing |
| AM | Agregar `process_payment_spl` para USDC | Diferenciador |
| AM | Next.js init + landing page + wallet connect | Frontend base |
| PM | Blinks API (GET + POST + actions.json) | CORE feature |
| PM | Merchant Dashboard (registro, pagos, stats) | Producto real |
| PM | Consumer Checkout (scan/open blink → pay) | UX completa |

### DÍA 3 (22 Mar) — AI + POLISH
| Hora | Tarea | Impacto |
|---|---|---|
| AM | AI Agent: Claude API → Natural Language Blinks | Killer feature |
| AM | AI Chat UI en merchant dashboard | Wow factor |
| PM | QR code generator + sharing | Multi-canal |
| PM | Analytics dashboard con gráficas | Profesionalismo |
| PM | Mobile responsive | Accesibilidad |
| PM | Testing end-to-end en devnet | Confiabilidad |

### DÍA 4 (23 Mar) — SHIP
| Hora | Tarea | Impacto |
|---|---|---|
| AM | Deploy frontend a Vercel | Entregable |
| AM | GitHub repo público + README profesional | Requisito |
| AM | Bug fixes + UI polish | Calidad |
| PM | Grabar video demo (3 min, Loom) | Requisito |
| PM | Crear pitch deck (Gamma) | Incubación |
| PM | Submit en DoraHacks antes de 23:59 GMT-6 | DEADLINE |
| PM | Tweet thread + build in public post | Visibilidad |

---

## CHECKLIST FINAL PARA GANAR

### Requisitos Hackathon (OBLIGATORIOS)
- [ ] Repo GitHub público con código funcional
- [ ] Backend (Smart contracts en Solana devnet)
- [ ] Cliente conectado (wallet adapter)
- [ ] Frontend (wireframe mínimo, app completa ideal)
- [ ] Video tutorial max 3 min
- [ ] Submit en DoraHacks

### Criterios de Evaluación (MAXIMIZAR)
- [ ] Viabilidad técnica → 4 capas Solana (Program, Token-2022, Actions, Agent Kit)
- [ ] Prototipo funcional → App completa con demo end-to-end
- [ ] Complejidad → Transfer Hooks, AI Agent, multi-canal, analytics
- [ ] Originalidad → Primero en combinar Blinks + Loyalty + AI

### Para Incubación (DIFERENCIADORES)
- [ ] Landing page con waitlist
- [ ] Pitch deck / one-pager
- [ ] Evidence de market demand (market research)
- [ ] Roadmap claro post-hackathon
- [ ] Team commitment visible

### Para Adquisición (LARGO PLAZO)
- [ ] Open API documentada
- [ ] Webhook system
- [ ] Multi-token (SOL + USDC)
- [ ] Refund system
- [ ] Merchant analytics

---

## RIESGOS Y MITIGACIONES

| Riesgo | Probabilidad | Mitigación |
|---|---|---|
| No alcanza el tiempo para todo | Alta | Priorizar: Blinks + Frontend + Deploy + Video |
| Devnet airdrop fails | Media | Usar faucet web: https://faucet.solana.com |
| AI Agent no funciona a tiempo | Media | Tener chatbot mockup que muestre la UX |
| Bugs en el demo | Alta | Testing exhaustivo día 3, no features nuevos día 4 |
| Video no queda bien | Baja | Script preparado, ensayar 2x antes de grabar |
