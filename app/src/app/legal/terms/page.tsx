import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "iPay | Terminos de Servicio",
  description:
    "Terminos y condiciones de uso de la plataforma de pagos iPay en Solana.",
};

export default function TermsOfServicePage() {
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
              href="/legal/privacy"
              className="hover:text-white transition-colors"
            >
              Privacidad
            </Link>
            <Link
              href="/legal/merchant-agreement"
              className="hover:text-white transition-colors"
            >
              Acuerdo Comercial
            </Link>
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Terminos de Servicio
        </h1>
        <p className="text-sm text-gray-500 mb-12">
          Ultima actualizacion: Marzo 2026
        </p>

        {/* 1. Aceptacion */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">
            1. Aceptacion de los Terminos
          </h2>
          <p className="leading-relaxed mb-3">
            Al acceder o utilizar la plataforma iPay (&quot;la Plataforma&quot;),
            usted acepta cumplir y estar sujeto a estos Terminos de Servicio
            (&quot;Terminos&quot;). Si no esta de acuerdo con alguna parte de
            estos Terminos, no debera utilizar la Plataforma. Estos Terminos
            constituyen un acuerdo legalmente vinculante entre usted y iPay
            (&quot;iPay&quot;, &quot;nosotros&quot;, &quot;nos&quot; o
            &quot;nuestro&quot;).
          </p>
          <p className="leading-relaxed">
            iPay se reserva el derecho de modificar estos Terminos en cualquier
            momento. Las modificaciones entraran en vigencia al momento de su
            publicacion en la Plataforma. El uso continuado de la Plataforma
            tras dichas modificaciones constituira su aceptacion de los Terminos
            actualizados.
          </p>
        </section>

        {/* 2. Descripcion del Servicio */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">
            2. Descripcion del Servicio
          </h2>
          <p className="leading-relaxed mb-3">
            iPay es una plataforma de pagos digitales construida sobre la
            blockchain de Solana que permite a comerciantes y usuarios realizar y
            recibir pagos en criptoactivos, incluyendo SOL, USDC, EURC y PYUSD.
            La Plataforma ofrece:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4 mb-3">
            <li>
              Procesamiento de pagos en tiempo real mediante smart contracts en
              Solana
            </li>
            <li>
              Generacion de Solana Blinks y codigos QR para aceptar pagos
            </li>
            <li>
              Dashboard de comerciantes con analitica e inteligencia artificial
            </li>
            <li>
              Programa de lealtad con distribucion automatica de tokens iPAY
            </li>
            <li>Integracion con wallets compatibles con Solana</li>
          </ul>
          <p className="leading-relaxed">
            iPay no es un banco, una entidad financiera regulada, ni un
            proveedor de servicios de custodia. iPay actua exclusivamente como
            facilitador tecnologico para el procesamiento de pagos en blockchain.
          </p>
        </section>

        {/* 3. Elegibilidad */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">
            3. Elegibilidad del Usuario
          </h2>
          <p className="leading-relaxed mb-3">
            Para utilizar la Plataforma, usted declara y garantiza que:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Tiene al menos 18 anos de edad o la mayoria de edad legal en su jurisdiccion</li>
            <li>
              No se encuentra en ninguna lista de sanciones emitida por la OFAC
              (Office of Foreign Assets Control), la Union Europea, las Naciones
              Unidas, ni ninguna otra autoridad gubernamental aplicable
            </li>
            <li>
              No es residente ni se encuentra en un pais o territorio sujeto a
              sanciones integrales (incluyendo, sin limitacion: Corea del Norte,
              Iran, Cuba, Siria, y las regiones de Crimea, Donetsk y Luhansk)
            </li>
            <li>
              Tiene la capacidad legal para celebrar contratos vinculantes en su
              jurisdiccion
            </li>
            <li>
              No ha sido previamente suspendido o removido de la Plataforma
            </li>
          </ul>
        </section>

        {/* 4. Cuenta y Wallet */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">
            4. Cuenta y Wallet
          </h2>
          <p className="leading-relaxed mb-3">
            El acceso a la Plataforma requiere la conexion de un wallet
            compatible con Solana (por ejemplo, Phantom, Solflare, Backpack). iPay
            no crea, custodia, ni gestiona wallets ni claves privadas.
          </p>
          <p className="leading-relaxed mb-3">
            Usted es el unico responsable de:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4 mb-3">
            <li>Mantener la seguridad de su wallet y claves privadas</li>
            <li>
              Todas las transacciones realizadas a traves de su wallet conectado
            </li>
            <li>
              Garantizar que su wallet tenga fondos suficientes para completar
              las transacciones, incluyendo las comisiones de la red Solana (gas
              fees)
            </li>
          </ul>
          <p className="leading-relaxed">
            iPay no sera responsable por la perdida de acceso a su wallet, la
            perdida de claves privadas, ni por transacciones no autorizadas
            resultantes de la compromision de su wallet.
          </p>
        </section>

        {/* 5. Procesamiento de Pagos */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">
            5. Procesamiento de Pagos
          </h2>
          <div className="bg-gray-900/50 border border-white/[0.06] rounded-xl p-6 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-500 block mb-1">
                  Comision de la Plataforma
                </span>
                <span className="text-white font-semibold text-lg">0.5%</span>
                <span className="text-gray-500 block text-xs">
                  por transaccion
                </span>
              </div>
              <div>
                <span className="text-gray-500 block mb-1">Liquidacion</span>
                <span className="text-white font-semibold text-lg">
                  Instantanea
                </span>
                <span className="text-gray-500 block text-xs">
                  directamente al wallet del comerciante
                </span>
              </div>
              <div>
                <span className="text-gray-500 block mb-1">Chargebacks</span>
                <span className="text-white font-semibold text-lg">
                  No aplica
                </span>
                <span className="text-gray-500 block text-xs">
                  las transacciones en blockchain son irreversibles
                </span>
              </div>
            </div>
          </div>
          <p className="leading-relaxed mb-3">
            Todas las transacciones procesadas a traves de iPay estan sujetas a
            una comision del 0.5% del monto total de la transaccion
            (&quot;Platform Fee&quot;). Esta comision se deduce automaticamente
            al momento de la transaccion mediante el smart contract de iPay.
          </p>
          <p className="leading-relaxed mb-3">
            Los pagos se liquidan de forma instantanea directamente al wallet del
            comerciante. No existe periodo de espera ni retencion de fondos.
          </p>
          <p className="leading-relaxed font-medium text-white">
            Las transacciones en blockchain son finales e irreversibles. iPay no
            puede revertir, cancelar ni modificar transacciones una vez
            confirmadas en la blockchain de Solana. No existen chargebacks ni
            disputas de pago como en los sistemas de pago tradicionales.
          </p>
        </section>

        {/* 6. Token iPAY */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">
            6. Token de Lealtad iPAY &mdash; Disclaimer
          </h2>
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-6 mb-4">
            <p className="text-amber-200/90 text-sm font-medium mb-3">
              AVISO LEGAL IMPORTANTE SOBRE EL TOKEN iPAY
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-amber-400 mt-0.5 shrink-0">&bull;</span>
                <span>
                  El token iPAY <strong className="text-white">NO es un valor financiero (security)</strong>.
                  No representa participacion accionaria, derechos de voto, ni
                  participacion en las ganancias de iPay.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 mt-0.5 shrink-0">&bull;</span>
                <span>
                  El token iPAY <strong className="text-white">NO es una inversion</strong>. No debe adquirirse
                  con expectativa de beneficio economico. No existe promesa ni
                  garantia de apreciacion de valor.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 mt-0.5 shrink-0">&bull;</span>
                <span>
                  El token iPAY es exclusivamente un{" "}
                  <strong className="text-white">utility token</strong> disenado para ser
                  utilizado dentro del ecosistema iPay como mecanismo de
                  recompensa y lealtad para comerciantes y compradores.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 mt-0.5 shrink-0">&bull;</span>
                <span>
                  El token iPAY <strong className="text-white">no tiene valor garantizado</strong>.
                  Su utilidad, distribucion, y las tasas de emision estan
                  sujetas a cambios a discrecion de iPay sin previo aviso.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 mt-0.5 shrink-0">&bull;</span>
                <span>
                  iPay se reserva el derecho de modificar, suspender o
                  descontinuar el programa de tokens iPAY en cualquier momento y
                  por cualquier razon.
                </span>
              </li>
            </ul>
          </div>
          <p className="leading-relaxed">
            El token iPAY se distribuye automaticamente a compradores y
            comerciantes que realizan transacciones a traves de la Plataforma.
            Las tasas de distribucion son determinadas por el smart contract y
            pueden variar. Los tokens iPAY podran ser utilizados para obtener
            beneficios dentro de la Plataforma, como descuentos u otros
            incentivos, sujetos a disponibilidad y a los terminos vigentes del
            programa de lealtad.
          </p>
        </section>

        {/* 7. Riesgos */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">
            7. Divulgacion de Riesgos (Risk Disclosure)
          </h2>
          <p className="leading-relaxed mb-4">
            Al utilizar la Plataforma, usted reconoce y acepta los siguientes
            riesgos inherentes:
          </p>

          <div className="space-y-4">
            <div className="bg-gray-900/50 border border-white/[0.06] rounded-lg p-5">
              <h3 className="text-white font-medium mb-2">
                Volatilidad de Criptoactivos
              </h3>
              <p className="text-sm leading-relaxed">
                Los criptoactivos, incluyendo SOL, USDC, EURC y PYUSD, pueden
                experimentar fluctuaciones significativas de precio. Aunque las
                stablecoins buscan mantener paridad con monedas fiat, no
                garantizan dicha paridad en todo momento. iPay no asume
                responsabilidad por perdidas derivadas de la volatilidad del
                mercado.
              </p>
            </div>

            <div className="bg-gray-900/50 border border-white/[0.06] rounded-lg p-5">
              <h3 className="text-white font-medium mb-2">
                Irreversibilidad de Transacciones en Blockchain
              </h3>
              <p className="text-sm leading-relaxed">
                Las transacciones confirmadas en la blockchain de Solana son
                permanentes e irreversibles. Un error en la direccion de destino,
                el monto, o la seleccion de token resultara en la perdida
                irrecuperable de fondos. iPay no tiene la capacidad tecnica de
                revertir transacciones on-chain.
              </p>
            </div>

            <div className="bg-gray-900/50 border border-white/[0.06] rounded-lg p-5">
              <h3 className="text-white font-medium mb-2">
                Riesgo de Smart Contracts
              </h3>
              <p className="text-sm leading-relaxed">
                La Plataforma utiliza smart contracts desplegados en la
                blockchain de Solana. Aunque estos contratos han sido disenados
                con precaucion, pueden contener vulnerabilidades no
                descubiertas, errores de programacion (bugs), o estar sujetos a
                exploits. iPay no garantiza el funcionamiento perfecto e
                ininterrumpido de los smart contracts.
              </p>
            </div>

            <div className="bg-gray-900/50 border border-white/[0.06] rounded-lg p-5">
              <h3 className="text-white font-medium mb-2">
                Riesgo Regulatorio
              </h3>
              <p className="text-sm leading-relaxed">
                El marco regulatorio aplicable a criptoactivos y pagos digitales
                esta en constante evolucion. Cambios legislativos o regulatorios
                podrian afectar la disponibilidad o funcionalidad de la
                Plataforma en determinadas jurisdicciones. Es responsabilidad
                del usuario cumplir con las leyes aplicables en su jurisdiccion.
              </p>
            </div>
          </div>
        </section>

        {/* 8. Actividades Prohibidas */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">
            8. Actividades Prohibidas
          </h2>
          <p className="leading-relaxed mb-3">
            Queda estrictamente prohibido utilizar la Plataforma para:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              <strong className="text-white">Lavado de activos (money laundering):</strong>{" "}
              utilizar la Plataforma para ocultar el origen ilicito de fondos o
              para integrar fondos provenientes de actividades ilegales al
              sistema financiero
            </li>
            <li>
              <strong className="text-white">Fraude:</strong> realizar transacciones
              fraudulentas, enganos, suplantacion de identidad, o cualquier
              conducta disenada para obtener un beneficio ilicito
            </li>
            <li>
              <strong className="text-white">Evasion de sanciones (sanctions evasion):</strong>{" "}
              utilizar la Plataforma para evadir sanciones economicas impuestas
              por la OFAC, la Union Europea, las Naciones Unidas, u otra
              autoridad competente
            </li>
            <li>
              <strong className="text-white">Financiamiento del terrorismo:</strong>{" "}
              utilizar la Plataforma para financiar actividades terroristas o
              proporcionar apoyo material a organizaciones designadas como
              terroristas
            </li>
            <li>
              <strong className="text-white">Actividades ilegales:</strong> cualquier uso de
              la Plataforma en conexion con actividades que violen las leyes
              aplicables, incluyendo pero no limitado a la compra o venta de
              productos o servicios ilegales
            </li>
            <li>
              <strong className="text-white">Manipulacion del sistema:</strong> intentar
              explotar, hackear, realizar ingenieria inversa, o manipular los
              smart contracts, la infraestructura, o cualquier componente de la
              Plataforma
            </li>
          </ul>
          <p className="leading-relaxed mt-3">
            iPay se reserva el derecho de suspender o terminar el acceso de
            cualquier usuario que participe o se sospeche que participa en
            actividades prohibidas, y de reportar dichas actividades a las
            autoridades competentes.
          </p>
        </section>

        {/* 9. Limitacion de Responsabilidad */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">
            9. Limitacion de Responsabilidad (Limitation of Liability)
          </h2>
          <p className="leading-relaxed mb-3">
            EN LA MAXIMA MEDIDA PERMITIDA POR LA LEY APLICABLE, iPAY, SUS
            DIRECTORES, EMPLEADOS, AGENTES, AFILIADOS Y PROVEEDORES DE
            SERVICIOS NO SERAN RESPONSABLES POR:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4 mb-3">
            <li>
              Danos indirectos, incidentales, especiales, consecuenciales o
              punitivos
            </li>
            <li>
              Perdida de beneficios, ingresos, datos, o oportunidades de negocio
            </li>
            <li>
              Perdida o dano a fondos, criptoactivos, o tokens resultantes del
              uso de la Plataforma
            </li>
            <li>
              Interrupciones del servicio, incluyendo interrupciones de la red
              Solana
            </li>
            <li>
              Acciones de terceros, incluyendo hackeos, exploits, o fallas de
              wallets externos
            </li>
          </ul>
          <p className="leading-relaxed">
            LA RESPONSABILIDAD TOTAL ACUMULADA DE iPAY POR CUALQUIER RECLAMO
            RELACIONADO CON ESTOS TERMINOS NO EXCEDERA EL MONTO TOTAL DE
            COMISIONES PAGADAS POR USTED A iPAY DURANTE LOS DOCE (12) MESES
            ANTERIORES AL EVENTO QUE DIO ORIGEN AL RECLAMO.
          </p>
        </section>

        {/* 10. Resolucion de Disputas */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">
            10. Resolucion de Disputas (Dispute Resolution)
          </h2>
          <p className="leading-relaxed mb-3">
            Cualquier disputa, controversia o reclamo que surja de o se
            relacione con estos Terminos, incluyendo su validez, interpretacion,
            cumplimiento, o terminacion, sera resuelta mediante{" "}
            <strong className="text-white">arbitraje vinculante</strong> administrado de
            conformidad con las reglas de arbitraje aplicables.
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4 mb-3">
            <li>El arbitraje sera conducido por un (1) arbitro unico</li>
            <li>
              El idioma del arbitraje sera el espanol, con documentos tecnicos
              admisibles en ingles
            </li>
            <li>
              La sede del arbitraje sera determinada de acuerdo con la
              jurisdiccion aplicable
            </li>
            <li>
              El laudo arbitral sera definitivo y vinculante para ambas partes
            </li>
          </ul>
          <p className="leading-relaxed">
            <strong className="text-white">Renuncia a Acciones Colectivas (Class Action Waiver):</strong>{" "}
            Usted acepta que cualquier disputa sera resuelta de manera
            individual y renuncia al derecho de participar en acciones
            colectivas o representativas (class actions).
          </p>
        </section>

        {/* 11. Ley Aplicable */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">
            11. Ley Aplicable (Governing Law)
          </h2>
          <p className="leading-relaxed">
            Estos Terminos se regiran e interpretaran de conformidad con las
            leyes de la Republica de Colombia, sin dar efecto a sus principios
            de conflicto de leyes. En la medida en que el arbitraje no sea
            aplicable o ejecutable, las partes se someten a la jurisdiccion
            exclusiva de los tribunales competentes de Bogota, Colombia.
          </p>
        </section>

        {/* 12. Terminacion */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">
            12. Terminacion
          </h2>
          <p className="leading-relaxed mb-3">
            iPay puede suspender o terminar su acceso a la Plataforma en
            cualquier momento y por cualquier razon, incluyendo, sin limitacion:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4 mb-3">
            <li>Incumplimiento de estos Terminos</li>
            <li>Participacion en actividades prohibidas</li>
            <li>Requerimiento legal o regulatorio</li>
            <li>Discontinuacion del servicio</li>
          </ul>
          <p className="leading-relaxed">
            Tras la terminacion, los fondos en su wallet permanecen bajo su
            control, ya que iPay no custodia fondos. Las obligaciones de
            indemnizacion, limitacion de responsabilidad y resolucion de
            disputas sobreviviran a la terminacion de estos Terminos.
          </p>
        </section>

        {/* 13. Contacto */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">
            13. Contacto
          </h2>
          <p className="leading-relaxed mb-3">
            Para preguntas sobre estos Terminos de Servicio, puede comunicarse
            con nosotros a:
          </p>
          <div className="bg-gray-900/50 border border-white/[0.06] rounded-lg p-5 text-sm">
            <p className="text-white font-medium">iPay</p>
            <p>Email: legal@ipay.so</p>
            <p>Web: https://ipay.so</p>
          </div>
        </section>

        {/* Links a otros documentos legales */}
        <div className="border-t border-white/[0.06] pt-8 mt-16 flex flex-wrap gap-6 text-sm">
          <Link
            href="/legal/privacy"
            className="text-gray-500 hover:text-white transition-colors"
          >
            Politica de Privacidad &rarr;
          </Link>
          <Link
            href="/legal/merchant-agreement"
            className="text-gray-500 hover:text-white transition-colors"
          >
            Acuerdo Comercial &rarr;
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
