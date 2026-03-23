import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "iPay | Politica de Privacidad",
  description:
    "Politica de privacidad y proteccion de datos de la plataforma iPay.",
};

export default function PrivacyPolicyPage() {
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
          Politica de Privacidad
        </h1>
        <p className="text-sm text-gray-500 mb-12">
          Ultima actualizacion: Marzo 2026
        </p>

        {/* 1. Introduccion */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">
            1. Introduccion
          </h2>
          <p className="leading-relaxed mb-3">
            En iPay (&quot;iPay&quot;, &quot;nosotros&quot;, &quot;nos&quot; o
            &quot;nuestro&quot;) nos comprometemos a proteger la privacidad de
            nuestros usuarios. Esta Politica de Privacidad describe como
            recopilamos, utilizamos, almacenamos y protegemos su informacion
            cuando utiliza nuestra plataforma de pagos en Solana.
          </p>
          <p className="leading-relaxed">
            Esta politica aplica a todos los usuarios de la Plataforma,
            incluyendo comerciantes, compradores y visitantes del sitio web.
          </p>
        </section>

        {/* 2. Datos Recopilados */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">
            2. Datos que Recopilamos
          </h2>

          <div className="space-y-4">
            <div className="bg-gray-900/50 border border-white/[0.06] rounded-lg p-5">
              <h3 className="text-white font-medium mb-2">
                Datos On-Chain (Publicos)
              </h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Direcciones de wallet publicas (public keys)</li>
                <li>Historial de transacciones en la blockchain de Solana</li>
                <li>Montos de transacciones y tokens utilizados</li>
                <li>Balances de tokens iPAY</li>
                <li>Interacciones con los smart contracts de iPay</li>
              </ul>
              <p className="text-xs text-gray-500 mt-2">
                Nota: Los datos on-chain son publicos por naturaleza de la
                blockchain y no pueden ser eliminados ni modificados.
              </p>
            </div>

            <div className="bg-gray-900/50 border border-white/[0.06] rounded-lg p-5">
              <h3 className="text-white font-medium mb-2">
                Datos Off-Chain (Gestionados por iPay)
              </h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>
                  Informacion del comerciante: nombre del negocio, descripcion,
                  categoria, informacion de contacto
                </li>
                <li>
                  Configuraciones de la cuenta: preferencias de tokens, montos
                  predeterminados, configuraciones de Blinks
                </li>
                <li>
                  Conversaciones con el asistente de IA: consultas y respuestas
                  generadas
                </li>
                <li>
                  Datos de analitica: metricas de rendimiento del comerciante,
                  estadisticas de ventas
                </li>
                <li>Datos de sesion: timestamps de conexion, wallet conectado</li>
              </ul>
            </div>

            <div className="bg-gray-900/50 border border-white/[0.06] rounded-lg p-5">
              <h3 className="text-white font-medium mb-2">
                Datos Tecnicos
              </h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Direccion IP (anonimizada)</li>
                <li>Tipo de navegador y sistema operativo</li>
                <li>Paginas visitadas y tiempo de permanencia</li>
                <li>Identificadores de dispositivo</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 3. Almacenamiento */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">
            3. Almacenamiento de Datos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-900/50 border border-white/[0.06] rounded-lg p-5">
              <h3 className="text-white font-medium mb-2">
                Datos On-Chain
              </h3>
              <p className="text-sm leading-relaxed">
                Los datos registrados en la blockchain de Solana son{" "}
                <strong className="text-white">permanentes e inmutables</strong>.
                Esta es una caracteristica inherente de la tecnologia blockchain
                y esta fuera del control de iPay. Las transacciones, direcciones
                de wallet e interacciones con smart contracts permanecen en la
                blockchain de forma indefinida y son publicamente visibles.
              </p>
            </div>
            <div className="bg-gray-900/50 border border-white/[0.06] rounded-lg p-5">
              <h3 className="text-white font-medium mb-2">
                Datos Off-Chain
              </h3>
              <p className="text-sm leading-relaxed">
                Los datos almacenados fuera de la blockchain se mantienen en
                servidores seguros con{" "}
                <strong className="text-white">encriptacion en reposo y en transito</strong>{" "}
                (AES-256 y TLS 1.3). Implementamos controles de acceso
                estrictos, auditorias periodicas y medidas de seguridad
                conformes con las mejores practicas de la industria.
              </p>
            </div>
          </div>
        </section>

        {/* 4. Uso de Datos */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">
            4. Como Utilizamos sus Datos
          </h2>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Procesar y facilitar transacciones de pago</li>
            <li>Distribuir tokens iPAY del programa de lealtad</li>
            <li>Proporcionar analitica e informes a comerciantes</li>
            <li>
              Alimentar el asistente de IA con contexto relevante para responder
              consultas
            </li>
            <li>Generar Solana Blinks y codigos QR para pagos</li>
            <li>Mejorar la seguridad y prevenir actividades fraudulentas</li>
            <li>Cumplir con obligaciones legales y regulatorias</li>
            <li>Mejorar y optimizar la Plataforma</li>
          </ul>
        </section>

        {/* 5. GDPR */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">
            5. Derechos bajo el GDPR (Reglamento General de Proteccion de Datos
            &mdash; Union Europea)
          </h2>
          <p className="leading-relaxed mb-3">
            Si usted es residente del Espacio Economico Europeo (EEE), tiene los
            siguientes derechos sobre sus datos personales:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left py-3 pr-4 text-white font-medium">
                    Derecho
                  </th>
                  <th className="text-left py-3 text-white font-medium">
                    Descripcion
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                <tr>
                  <td className="py-3 pr-4 text-white">Acceso (Access)</td>
                  <td className="py-3">
                    Solicitar una copia de sus datos personales que procesamos
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 text-white">
                    Rectificacion (Rectification)
                  </td>
                  <td className="py-3">
                    Solicitar la correccion de datos inexactos o incompletos
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 text-white">
                    Supresion (Erasure / Right to be Forgotten)
                  </td>
                  <td className="py-3">
                    Solicitar la eliminacion de sus datos personales donde sea
                    tecnicamente factible. <strong className="text-amber-300">Nota:</strong>{" "}
                    los datos on-chain no pueden ser eliminados debido a la
                    naturaleza inmutable de la blockchain
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 text-white">
                    Portabilidad (Data Portability)
                  </td>
                  <td className="py-3">
                    Recibir sus datos en un formato estructurado y legible por
                    maquina
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 text-white">
                    Oposicion (Objection)
                  </td>
                  <td className="py-3">
                    Oponerse al procesamiento de sus datos para ciertos fines
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 text-white">
                    Limitacion (Restriction)
                  </td>
                  <td className="py-3">
                    Solicitar la limitacion del procesamiento de sus datos en
                    determinadas circunstancias
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="leading-relaxed mt-3 text-sm">
            Para ejercer cualquiera de estos derechos, contactenos a{" "}
            <span className="text-white">privacy@ipay.so</span>. Responderemos
            a su solicitud dentro de los 30 dias establecidos por el GDPR.
          </p>
        </section>

        {/* 6. LGPD */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">
            6. Cumplimiento con la LGPD (Lei Geral de Protecao de Dados &mdash;
            Brasil)
          </h2>
          <p className="leading-relaxed mb-3">
            Si usted es residente de Brasil, la Ley General de Proteccion de
            Datos (Lei n.&deg; 13.709/2018) le otorga derechos adicionales sobre
            sus datos personales, incluyendo:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4 mb-3">
            <li>
              Confirmacion de la existencia de tratamiento de datos personales
            </li>
            <li>Acceso a sus datos personales</li>
            <li>
              Correccion de datos incompletos, inexactos o desactualizados
            </li>
            <li>
              Anonimizacion, bloqueo o eliminacion de datos innecesarios o
              tratados en incumplimiento de la LGPD
            </li>
            <li>
              Portabilidad de datos a otro proveedor de servicios, mediante
              solicitud expresa
            </li>
            <li>
              Informacion sobre entidades publicas y privadas con las cuales se
              compartieron datos
            </li>
            <li>
              Revocacion del consentimiento en cualquier momento
            </li>
          </ul>
          <p className="leading-relaxed text-sm">
            La base legal para el tratamiento de sus datos bajo la LGPD incluye
            el consentimiento, la ejecucion de contrato, y el interes legitimo.
            Para ejercer sus derechos bajo la LGPD, contactenos a{" "}
            <span className="text-white">privacy@ipay.so</span>.
          </p>
        </section>

        {/* 7. Ley 1581 Colombia */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">
            7. Cumplimiento con la Ley 1581 de 2012 (Colombia)
          </h2>
          <p className="leading-relaxed mb-3">
            De conformidad con la Ley Estatutaria 1581 de 2012 y su Decreto
            Reglamentario 1377 de 2013, iPay informa a los titulares de datos
            personales en Colombia:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4 mb-3">
            <li>
              <strong className="text-white">Responsable del Tratamiento:</strong> iPay,
              con domicilio en Bogota, Colombia
            </li>
            <li>
              <strong className="text-white">Finalidad:</strong> los datos personales seran
              tratados para las finalidades descritas en la Seccion 4 de esta
              politica
            </li>
            <li>
              <strong className="text-white">Derechos del Titular:</strong> conocer, actualizar,
              rectificar y solicitar la supresion de sus datos personales;
              revocar la autorizacion otorgada; acceder de forma gratuita a sus
              datos
            </li>
            <li>
              <strong className="text-white">Canal de Atencion:</strong> las consultas y
              reclamos pueden dirigirse a{" "}
              <span className="text-white">privacy@ipay.so</span> o al canal
              habilitado en la Plataforma
            </li>
            <li>
              <strong className="text-white">Autorizacion:</strong> al utilizar la
              Plataforma, usted otorga autorizacion previa, expresa e informada
              para el tratamiento de sus datos personales conforme a esta
              politica
            </li>
          </ul>
          <p className="leading-relaxed text-sm">
            iPay atendera las consultas dentro de los diez (10) dias habiles y
            los reclamos dentro de los quince (15) dias habiles siguientes a su
            recepcion, de conformidad con lo establecido en la ley.
          </p>
        </section>

        {/* 8. Cookies y Analitica */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">
            8. Cookies y Analitica
          </h2>
          <p className="leading-relaxed mb-3">
            iPay utiliza cookies y tecnologias similares para:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left py-3 pr-4 text-white font-medium">
                    Tipo de Cookie
                  </th>
                  <th className="text-left py-3 pr-4 text-white font-medium">
                    Finalidad
                  </th>
                  <th className="text-left py-3 text-white font-medium">
                    Duracion
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                <tr>
                  <td className="py-3 pr-4 text-white">Esenciales</td>
                  <td className="py-3 pr-4">
                    Funcionamiento basico de la Plataforma, estado de conexion
                    del wallet
                  </td>
                  <td className="py-3">Sesion</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 text-white">Funcionales</td>
                  <td className="py-3 pr-4">
                    Recordar preferencias del usuario, tema, idioma
                  </td>
                  <td className="py-3">1 ano</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 text-white">Analiticas</td>
                  <td className="py-3 pr-4">
                    Metricas de uso, rendimiento de la Plataforma, mejora de la
                    experiencia
                  </td>
                  <td className="py-3">2 anos</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="leading-relaxed mt-3 text-sm">
            Puede configurar su navegador para rechazar cookies, aunque esto
            podria afectar el funcionamiento de la Plataforma.
          </p>
        </section>

        {/* 9. Servicios de Terceros */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">
            9. Servicios de Terceros (Third-Party Services)
          </h2>
          <p className="leading-relaxed mb-4">
            iPay integra los siguientes servicios de terceros que pueden recibir
            o procesar datos del usuario:
          </p>
          <div className="space-y-4">
            <div className="bg-gray-900/50 border border-white/[0.06] rounded-lg p-5">
              <h3 className="text-white font-medium mb-1">
                Anthropic (Claude AI)
              </h3>
              <p className="text-sm leading-relaxed">
                El asistente de inteligencia artificial de iPay esta impulsado
                por los modelos de Anthropic. Las consultas realizadas al
                asistente de IA y el contexto del comerciante pueden ser
                procesados por los servidores de Anthropic de acuerdo con su
                politica de privacidad. No se envian claves privadas ni
                informacion de autenticacion del wallet.
              </p>
            </div>
            <div className="bg-gray-900/50 border border-white/[0.06] rounded-lg p-5">
              <h3 className="text-white font-medium mb-1">
                Solana RPC Providers
              </h3>
              <p className="text-sm leading-relaxed">
                Para interactuar con la blockchain de Solana, iPay utiliza
                proveedores de RPC (Remote Procedure Call) que pueden registrar
                direcciones IP y solicitudes de transacciones. Estos proveedores
                operan bajo sus propias politicas de privacidad.
              </p>
            </div>
            <div className="bg-gray-900/50 border border-white/[0.06] rounded-lg p-5">
              <h3 className="text-white font-medium mb-1">MoonPay</h3>
              <p className="text-sm leading-relaxed">
                Para la adquisicion de criptoactivos mediante moneda fiat, iPay
                puede integrar MoonPay como proveedor de on-ramp. MoonPay
                recopila informacion adicional, incluyendo datos de
                identificacion para cumplimiento KYC/AML, de acuerdo con su
                propia politica de privacidad.
              </p>
            </div>
          </div>
        </section>

        {/* 10. Retencion de Datos */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">
            10. Retencion de Datos (Data Retention)
          </h2>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              <strong className="text-white">Datos on-chain:</strong> permanentes e
              inmutables (no sujetos a eliminacion)
            </li>
            <li>
              <strong className="text-white">Datos de cuenta del comerciante:</strong>{" "}
              mientras la cuenta este activa y hasta 3 anos despues de la
              desactivacion
            </li>
            <li>
              <strong className="text-white">Conversaciones de IA:</strong> 90 dias desde
              la ultima interaccion
            </li>
            <li>
              <strong className="text-white">Datos de analitica:</strong> 2 anos desde su
              generacion
            </li>
            <li>
              <strong className="text-white">Logs tecnicos:</strong> 12 meses
            </li>
            <li>
              <strong className="text-white">Datos requeridos por ley:</strong> el periodo
              que establezca la legislacion aplicable
            </li>
          </ul>
        </section>

        {/* 11. Seguridad */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">
            11. Medidas de Seguridad
          </h2>
          <p className="leading-relaxed mb-3">
            Implementamos medidas tecnicas y organizativas para proteger sus
            datos, incluyendo:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Encriptacion AES-256 para datos en reposo</li>
            <li>TLS 1.3 para datos en transito</li>
            <li>Controles de acceso basados en roles (RBAC)</li>
            <li>Auditorias de seguridad periodicas</li>
            <li>
              Monitoreo continuo de amenazas y actividades sospechosas
            </li>
          </ul>
          <p className="leading-relaxed mt-3 text-sm">
            Ninguna medida de seguridad es completamente infalible. En caso de
            una violacion de datos que afecte sus datos personales, le
            notificaremos conforme a lo requerido por la legislacion aplicable.
          </p>
        </section>

        {/* 12. Contacto */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">
            12. Contacto
          </h2>
          <p className="leading-relaxed mb-3">
            Para preguntas, solicitudes de ejercicio de derechos, o consultas
            sobre esta Politica de Privacidad:
          </p>
          <div className="bg-gray-900/50 border border-white/[0.06] rounded-lg p-5 text-sm">
            <p className="text-white font-medium">
              iPay &mdash; Oficial de Proteccion de Datos
            </p>
            <p>Email: privacy@ipay.so</p>
            <p>Email alternativo: legal@ipay.so</p>
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
