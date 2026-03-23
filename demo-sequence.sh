#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# iPay — Secuencia de Demo para Grabación
# ═══════════════════════════════════════════════════════════════
#
# INSTRUCCIONES:
# 1. Abre Loom o QuickTime (Cmd+Shift+5) para grabar pantalla
# 2. Ejecuta: bash demo-sequence.sh
# 3. Cada URL se abre en el momento correcto
# 4. Tú narras siguiendo VIDEO_SCRIPT.md
#
# ANTES DE EJECUTAR:
# - Cierra todas las tabs del browser
# - Pon el browser en fullscreen (Ctrl+Cmd+F)
# - Conecta tu Phantom wallet a devnet
# - Ten Phantom desbloqueado
#
# ═══════════════════════════════════════════════════════════════

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║       iPay — Secuencia de Grabación          ║"
echo "║       Duración total: 3 minutos              ║"
echo "╠══════════════════════════════════════════════╣"
echo "║  Verifica que tengas:                        ║"
echo "║  ✓ Grabación de pantalla lista               ║"
echo "║  ✓ Browser en fullscreen                     ║"
echo "║  ✓ Phantom en devnet y desbloqueado          ║"
echo "║  ✓ VIDEO_SCRIPT.md abierto como referencia   ║"
echo "╚══════════════════════════════════════════════╝"
echo ""
echo "Presiona ENTER cuando estés listo..."
read

# ─── [0:00-0:15] APERTURA DE IMPACTO ───
echo ""
echo "▶ [0:00] APERTURA — Pantalla negra o texto overlay"
echo "  🎙️ 'Hace seis días, Mastercard pagó mil ochocientos millones...'"
echo "  📌 Espera 15 segundos hablando sobre los números"
echo ""
echo "  → Presiona ENTER cuando termines la apertura..."
read

# ─── [0:15-0:30] QUÉ ES iPAY ───
echo "▶ [0:15] Abriendo LANDING PAGE..."
open "https://ipay.xpandia.co"
echo "  🎙️ 'iPay es el Square de PayFi...'"
echo "  📌 Muestra el hero. Scrollea lento hasta los features."
echo ""
echo "  → Presiona ENTER cuando termines..."
read

# ─── [0:30-0:40] REGISTRO DEL COMERCIO ───
echo "▶ [0:30] Abriendo ONBOARDING..."
open "https://ipay.xpandia.co/onboarding"
echo "  🎙️ 'El comercio se registra. Nombre, wallet, listo. Diez segundos.'"
echo "  📌 Conecta wallet → llena datos → registra"
echo ""
echo "  → Presiona ENTER cuando termines..."
read

# ─── [0:40-0:55] ASISTENTE IA ───
echo "▶ [0:40] Abriendo ASISTENTE IA..."
open "https://ipay.xpandia.co/merchant/ai"
echo "  🎙️ 'Ahora miren esto.'"
echo "  📌 Escribe: 'Crea un cobro de \$50 con doble puntos de lealtad'"
echo "  📌 Muestra el Blink generado → click WhatsApp"
echo ""
echo "  → Presiona ENTER cuando termines..."
read

# ─── [0:55-1:10] PAGO DEL CLIENTE ───
echo "▶ [0:55] Abriendo PÁGINA DE PAGO..."
open "https://ipay.xpandia.co/pay?amount=1&merchant=EPasYQuqK2ix9jnn8SVdiJc1FWWXq5SHfHt8mwt7U9ZW&memo=Demo+iPay"
echo "  🎙️ 'El cliente abre el link. Conecta su wallet... y paga.'"
echo "  📌 Conecta Phantom → Paga → Muestra confirmación + loyalty tokens"
echo ""
echo "  → Presiona ENTER cuando termines..."
read

# ─── [1:10-1:20] DASHBOARD DEL COMERCIO ───
echo "▶ [1:10] Abriendo DASHBOARD..."
open "https://ipay.xpandia.co/merchant"
echo "  🎙️ 'Revenue en tiempo real, volumen, mejores clientes...'"
echo "  📌 Muestra stats, charts, lista de pagos"
echo ""
echo "  → Presiona ENTER cuando termines..."
read

# ─── [1:20-1:30] API DE DEVELOPERS ───
echo "▶ [1:20] Abriendo DEVELOPER PORTAL..."
open "https://ipay.xpandia.co/developer"
echo "  🎙️ 'APIs REST completas. Pagos, facturas, suscripciones, webhooks.'"
echo "  📌 Scrollea rápido mostrando los endpoints"
echo ""
echo "  → Presiona ENTER cuando termines..."
read

# ─── [1:30-2:00] PROFUNDIDAD TÉCNICA ───
echo "▶ [1:30] Abriendo SOLANA EXPLORER..."
open "https://explorer.solana.com/address/2DhfCmG1sUiX8ZJc4wZkq42hfbhNf6PPnhR7bXPyxEAc?cluster=devnet"
echo "  🎙️ 'Veintiuna instrucciones on-chain. No tres. Veintiuna.'"
echo "  📌 Muestra que el programa existe y está deployed"
echo ""
echo "  → Presiona ENTER para ir a GitHub..."
read

echo "▶ [1:40] Abriendo GITHUB..."
open "https://github.com/xpandia/iPay"
echo "  🎙️ 'Seis vulnerabilidades críticas parcheadas. Esto es ingeniería nivel producción.'"
echo "  📌 Muestra README, badges, estructura del proyecto"
echo ""
echo "  → Presiona ENTER cuando termines..."
read

# ─── [2:00-2:30] MERCADO + TRACCIÓN ───
echo "▶ [2:00] Abriendo PITCH DECK..."
open "https://ipay.xpandia.co/pitch"
echo "  🎙️ '730 mil millones de dólares...'"
echo "  📌 Scrollea a slide de Market (\$730B) → Why Now → 4 días"
echo "  🎙️ 'Construimos todo esto en cuatro días. Imaginen cuatro meses con inversión.'"
echo ""
echo "  → Presiona ENTER para el cierre..."
read

# ─── [2:30-3:00] CIERRE ───
echo "▶ [2:30] CIERRE — Scrollea al slide final del pitch"
echo "  🎙️ 'No estamos aquí por un premio.'"
echo "  🎙️ 'iPay es como Solana gana Latinoamérica.'"
echo "  🎙️ 'iPay. Por xpandia. ipay punto xpandia punto co.'"
echo "  📌 Deja la URL en pantalla 3 segundos. Corte a negro."
echo ""
echo "  → Presiona ENTER para finalizar..."
read

# ─── FIN ───
echo ""
echo "═══════════════════════════════════════════════════"
echo "  ✅ DEMO COMPLETA — Detén la grabación"
echo "═══════════════════════════════════════════════════"
echo ""
echo "  Próximos pasos:"
echo "  1. Sube el video a Loom o YouTube"
echo "  2. Copia el link del video"
echo "  3. Submit en DoraHacks con DORAHACKS_SUBMISSION.md"
echo ""
