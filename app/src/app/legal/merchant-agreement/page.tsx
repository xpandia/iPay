import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "iPay | Acuerdo Comercial para Merchants",
  description:
    "Acuerdo comercial y terminos para comerciantes que utilizan la plataforma iPay.",
};

export default function MerchantAgreementPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-300">
      {/* Header */}
      <header className="border-b border-white/[0.06] px-6 py-5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center font-bold text-white text-[10px]">
              iP
            </div>
            <span className="text-white font-semibold text-sm">iPay</span>
          </Link>
          <nav className="flex gap-6 text-sm text-gray-500">
            <Link
              href="/legal/terms"
              className="hover:text-white transition-colors"
            >
              Terminos
            </Link>
            <Link
              href="/legal/privacy"
              className="hover:text-white transition-colors"
            >
              Privacidad
            </Link>
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Acuerdo Comercial
        </h1>
        <p className="text-sm text-gray-500 mb-2">Merchant Agreement</p>
        <p className="text-sm text-gray-500 mb-12">
          Ultima actualizacion: Marzo 2026
        </p>

        {/* Intro */}
        <section className="mb-10">
          <p className="leading-relaxed mb-3">
            Este Acuerdo Comercial (&quot;Acuerdo&quot;) establece los terminos
            y condiciones bajo los cuales usted (&quot;Comerciante&quot;,
            &quot;Merchant&quot; o &quot;usted&quot;) puede utilizar la
            plataforma iPay para aceptar pagos en criptoactivos. Este Acuerdo
            complementa los Terminos de Servicio generales de iPay.
          </p>
          <p className="leading-relaxed">
            Al registrarse como comerciante en iPay y conectar su wallet, usted
            acepta todos los terminos de este Acuerdo.
          </p>
        </section>

        {/* 1. Obligaciones del Comerciante */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">
            1. Obligaciones del Comerciante
          </h2>
          <p className="leading-relaxed mb-3">
            Al utilizar iPay como plataforma de pagos, el Comerciante se
            compromete a:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4 mb-3">
            <li>
              <strong className="text-white">Informacion veraz:</strong> proporcionar
              informacion precisa, completa y actualizada sobre su negocio,
              incluyendo nombre comercial, descripcion, categoria de productos o
              servicios, e informacion de contacto
            </li>
            <li>
              <strong className="text-white">Productos y servicios legales:</strong>{" "}
              ofrecer unicamente productos y servicios que sean legales en todas
              las jurisdicciones donde opere. El Comerciante es el unico
              responsable de cumplir con todas las leyes, regulaciones y
              requisitos de licencias aplicables a su negocio
            </li>
            <li>
              <strong className="text-white">Transparencia con el comprador:</strong>{" "}
              informar claramente a los compradores sobre los precios, terminos
              de venta, politicas de devolucion y cualquier otra condicion
              relevante antes de completar una transaccion
            </li>
            <li>
              <strong className="text-white">Seguridad del wallet:</strong> mantener la
              seguridad de su wallet de comerciante y claves privadas. iPay no
              sera responsable por accesos no autorizados a wallets de
              comerciantes
            </li>
            <li>
              <strong className="text-white">Cumplimiento tributario:</strong> cumplir con
              todas las obligaciones tributarias aplicables a los ingresos
              recibidos a traves de la Plataforma. iPay no brinda asesoria fiscal
              y no es responsable de las obligaciones tributarias del Comerciante
            </li>
            <li>
              <strong className="text-white">Prohibiciones:</strong> no utilizar la
              Plataforma para vender productos falsificados, sustancias
              controladas, armas, material ilegal, ni cualquier producto o
              servicio que viole los Terminos de Servicio de iPay
            </li>
          </ul>
        </section>

        {/* 2. Estructura de Comisiones */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">
            2. Estructura de Comisiones (Fee Structure)
          </h2>
          <div className="bg-gray-900/50 border border-white/[0.06] rounded-xl p-6 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <span className="text-gray-500 block mb-1 text-sm">
                  Platform Fee
                </span>
                <span className="text-white font-bold text-3xl">0.5%</span>
                <span className="text-gray-500 block text-sm mt-1">
                  por cada transaccion procesada
                </span>
              </div>
              <div>
                <span className="text-gray-500 block mb-1 text-sm">
                  Costos Adicionales
                </span>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="text-white">Network Fee:</span> comision de
                    la red Solana (~$0.00025 por transaccion), pagada por el
                    comprador
                  </p>
                  <p>
                    <span className="text-white">Cargos ocultos:</span> ninguno
                  </p>
                  <p>
                    <span className="text-white">Setup fee:</span> $0
                  </p>
                  <p>
                    <span className="text-white">Tarifa mensual:</span> $0
                  </p>
                </div>
              </div>
            </div>
          </div>
          <p className="leading-relaxed mb-3">
            La comision del 0.5% (&quot;Platform Fee&quot;) se deduce
            automaticamente de cada transaccion al momento de su procesamiento
            mediante el smart contract de iPay. El monto neto (99.5% del monto
            de la transaccion) se deposita directamente en el wallet del
            Comerciante.
          </p>
          <p className="leading-relaxed">
            iPay se reserva el derecho de modificar la estructura de comisiones
            con un preaviso de treinta (30) dias. Las modificaciones no
            aplicaran de forma retroactiva a transacciones ya procesadas.
          </p>
        </section>

        {/* 3. Terminos de Liquidacion */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">
            3. Terminos de Liquidacion (Settlement Terms)
          </h2>
          <p className="leading-relaxed mb-3">
            iPay ofrece liquidacion instantanea de pagos:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4 mb-3">
            <li>
              <strong className="text-white">Liquidacion instantanea:</strong> los fondos
              se depositan directamente en el wallet del Comerciante al momento
              de la confirmacion de la transaccion en la blockchain de Solana,
              tipicamente en menos de 1 segundo
            </li>
            <li>
              <strong className="text-white">Sin periodo de retencion:</strong> iPay no
              retiene, custodia ni congela fondos del Comerciante en ningun
              momento. Los fondos fluyen directamente del comprador al
              Comerciante a traves del smart contract
            </li>
            <li>
              <strong className="text-white">Tokens soportados:</strong> SOL, USDC, EURC y
              PYUSD. El Comerciante recibe el pago en el mismo token utilizado
              por el comprador
            </li>
            <li>
              <strong className="text-white">Sin chargebacks:</strong> debido a la
              naturaleza irreversible de las transacciones en blockchain, no
              existen chargebacks. Las disputas entre compradores y comerciantes
              deben resolverse directamente entre las partes
            </li>
          </ul>
        </section>

        {/* 4. Programa de Lealtad */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">
            4. Programa de Lealtad &mdash; Token iPAY
          </h2>
          <p className="leading-relaxed mb-3">
            Como parte de la Plataforma, el Comerciante participa
            automaticamente en el programa de lealtad iPAY:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4 mb-3">
            <li>
              <strong className="text-white">Distribucion automatica:</strong> por cada
              transaccion procesada, tanto el Comerciante como el comprador
              reciben tokens iPAY automaticamente distribuidos por el smart
              contract
            </li>
            <li>
              <strong className="text-white">Tasas de distribucion:</strong> las tasas de
              emision de tokens iPAY son determinadas por el smart contract y
              pueden variar. iPay se reserva el derecho de modificar las tasas
              de distribucion en cualquier momento
            </li>
            <li>
              <strong className="text-white">Uso de tokens:</strong> los tokens iPAY
              podran ser utilizados para beneficios dentro de la Plataforma,
              cuya naturaleza y disponibilidad seran determinados por iPay
            </li>
            <li>
              <strong className="text-white">Sin obligacion:</strong> iPay no garantiza la
              continuidad del programa de lealtad ni el valor de los tokens
              iPAY. Consulte el disclaimer completo en los Terminos de Servicio,
              Seccion 6
            </li>
          </ul>
          <p className="leading-relaxed text-sm">
            El Comerciante reconoce que el token iPAY es un utility token y no
            un valor financiero, y que su participacion en el programa de
            lealtad no constituye una relacion de inversion con iPay.
          </p>
        </section>

        {/* 5. Politica de Reembolsos */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">
            5. Politica de Reembolsos (Refund Policy)
          </h2>
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-6 mb-4">
            <p className="text-amber-200/90 text-sm font-medium mb-2">
              IMPORTANTE: Las transacciones en blockchain son irreversibles
            </p>
            <p className="text-sm leading-relaxed">
              iPay no puede revertir, cancelar ni modificar transacciones una
              vez confirmadas en la blockchain. Cualquier reembolso debe ser
              iniciado directamente por el Comerciante.
            </p>
          </div>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              <strong className="text-white">Reembolsos iniciados por el Comerciante:</strong>{" "}
              el Comerciante es el unico responsable de gestionar reembolsos con
              sus compradores. Los reembolsos deben realizarse como una nueva
              transaccion del wallet del Comerciante al wallet del comprador
            </li>
            <li>
              <strong className="text-white">iPay no interviene:</strong> iPay no media en
              disputas entre comerciantes y compradores respecto a reembolsos.
              iPay no tiene la capacidad tecnica de forzar reembolsos
            </li>
            <li>
              <strong className="text-white">Comisiones no reembolsables:</strong> el
              Platform Fee (0.5%) cobrado en la transaccion original no es
              reembolsable, ya que fue procesado y liquidado al momento de la
              transaccion
            </li>
            <li>
              <strong className="text-white">Politica propia:</strong> se recomienda
              encarecidamente que cada Comerciante establezca y publique su
              propia politica de reembolsos y devoluciones para sus compradores
            </li>
          </ul>
        </section>

        {/* 6. Terminacion */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">
            6. Terminacion
          </h2>
          <p className="leading-relaxed mb-3">
            Este Acuerdo puede ser terminado por cualquiera de las partes:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-900/50 border border-white/[0.06] rounded-lg p-5">
              <h3 className="text-white font-medium mb-2">
                Terminacion por el Comerciante
              </h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>
                  En cualquier momento, dejando de utilizar la Plataforma
                </li>
                <li>
                  Desconectando su wallet y dejando de aceptar pagos a traves de
                  iPay
                </li>
                <li>Sin penalidades ni cargos por terminacion</li>
              </ul>
            </div>
            <div className="bg-gray-900/50 border border-white/[0.06] rounded-lg p-5">
              <h3 className="text-white font-medium mb-2">
                Terminacion por iPay
              </h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Por incumplimiento de este Acuerdo o los Terminos de Servicio</li>
                <li>Por participacion en actividades prohibidas</li>
                <li>Por requerimiento legal o regulatorio</li>
                <li>Por discontinuacion del servicio (con 30 dias de preaviso)</li>
                <li>De forma inmediata en casos de fraude o riesgo de seguridad</li>
              </ul>
            </div>
          </div>

          <p className="leading-relaxed">
            Tras la terminacion, los fondos existentes en el wallet del
            Comerciante permanecen bajo su control. Las transacciones
            previamente procesadas no se ven afectadas. Los tokens iPAY en
            posesion del Comerciante no seran confiscados, aunque su utilidad
            podria verse limitada si el programa de lealtad se modifica o
            discontinua.
          </p>
        </section>

        {/* 7. Indemnizacion */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">
            7. Indemnizacion (Indemnification)
          </h2>
          <p className="leading-relaxed mb-3">
            El Comerciante acepta indemnizar, defender y mantener indemne a
            iPay, sus directores, empleados, agentes y afiliados de y contra
            cualquier reclamo, demanda, responsabilidad, dano, perdida, costo y
            gasto (incluyendo honorarios razonables de abogados) que surjan de o
            se relacionen con:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4 mb-3">
            <li>
              El incumplimiento por parte del Comerciante de este Acuerdo o de
              los Terminos de Servicio
            </li>
            <li>
              Los productos o servicios vendidos por el Comerciante a traves de
              la Plataforma
            </li>
            <li>
              Disputas entre el Comerciante y sus compradores, incluyendo
              reclamos por reembolsos, calidad del producto, o incumplimiento
              de entregas
            </li>
            <li>
              Violaciones de leyes, regulaciones o derechos de terceros por
              parte del Comerciante
            </li>
            <li>
              Reclamaciones tributarias o fiscales relacionadas con los ingresos
              del Comerciante
            </li>
            <li>
              El uso indebido de la Plataforma por parte del Comerciante o sus
              empleados o agentes
            </li>
          </ul>
          <p className="leading-relaxed">
            Esta obligacion de indemnizacion sobrevivira a la terminacion de
            este Acuerdo.
          </p>
        </section>

        {/* 8. Propiedad Intelectual */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">
            8. Propiedad Intelectual
          </h2>
          <p className="leading-relaxed mb-3">
            iPay otorga al Comerciante una licencia limitada, no exclusiva,
            revocable y no transferible para utilizar la marca, logotipos y
            materiales de marketing de iPay unicamente en relacion con la
            aceptacion de pagos a traves de la Plataforma.
          </p>
          <p className="leading-relaxed">
            El Comerciante no podra modificar, sublicenciar, ni utilizar las
            marcas de iPay de manera que sugiera una afiliacion, patrocinio o
            endorsement mas alla de la relacion de comerciante establecida en
            este Acuerdo.
          </p>
        </section>

        {/* 9. Disposiciones Generales */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">
            9. Disposiciones Generales
          </h2>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              <strong className="text-white">Acuerdo completo:</strong> este Acuerdo, junto
              con los Terminos de Servicio y la Politica de Privacidad,
              constituye el acuerdo completo entre las partes
            </li>
            <li>
              <strong className="text-white">Independencia de las partes:</strong> la
              relacion entre iPay y el Comerciante es de prestador de servicios
              y usuario. Nada en este Acuerdo crea una relacion de sociedad,
              joint venture, agencia, o empleo
            </li>
            <li>
              <strong className="text-white">Cesion:</strong> el Comerciante no podra ceder
              ni transferir este Acuerdo sin el consentimiento previo por
              escrito de iPay
            </li>
            <li>
              <strong className="text-white">Divisibilidad:</strong> si alguna disposicion
              de este Acuerdo se considera invalida o inaplicable, las
              disposiciones restantes continuaran en pleno vigor y efecto
            </li>
            <li>
              <strong className="text-white">Ley aplicable:</strong> este Acuerdo se rige
              por las leyes de la Republica de Colombia. La resolucion de
              disputas se realizara conforme a lo establecido en los Terminos de
              Servicio
            </li>
          </ul>
        </section>

        {/* 10. Contacto */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">
            10. Contacto para Comerciantes
          </h2>
          <p className="leading-relaxed mb-3">
            Para preguntas sobre este Acuerdo Comercial o asuntos relacionados
            con su cuenta de comerciante:
          </p>
          <div className="bg-gray-900/50 border border-white/[0.06] rounded-lg p-5 text-sm">
            <p className="text-white font-medium">
              iPay &mdash; Soporte para Comerciantes
            </p>
            <p>Email: merchants@ipay.so</p>
            <p>Email legal: legal@ipay.so</p>
            <p>Web: https://ipay.so</p>
          </div>
        </section>

        {/* Links a otros documentos legales */}
        <div className="border-t border-white/[0.06] pt-8 mt-16 flex flex-wrap gap-6 text-sm">
          <Link
            href="/legal/terms"
            className="text-gray-500 hover:text-white transition-colors"
          >
            Terminos de Servicio &rarr;
          </Link>
          <Link
            href="/legal/privacy"
            className="text-gray-500 hover:text-white transition-colors"
          >
            Politica de Privacidad &rarr;
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-8 px-6">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            &copy; 2026 iPay. Todos los derechos reservados.
          </p>
          <Link
            href="/"
            className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </footer>
    </div>
  );
}
