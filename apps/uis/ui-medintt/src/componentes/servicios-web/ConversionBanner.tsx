function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

interface ConversionBannerProps {
  onCtaClick?: () => void;
}

export default function ConversionBanner({
  onCtaClick,
}: ConversionBannerProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-main-azul px-6 py-12 text-center text-white shadow-xl md:px-12 md:py-16">
      {/* Background Pattern (Optional subtle decoration) */}
      <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-3xl mx-auto space-y-6">
        <h2 className="text-3xl font-bold md:text-4xl leading-tight">
          ¿Listo para digitalizar la salud de su empresa?
        </h2>
        <p className="text-lg md:text-xl text-blue-100/90 text-balance">
          Agende una prueba gratuita de 15 días y descubra por qué las empresas
          líderes confían en Medintt.
        </p>

        <div className="pt-4">
          <button
            onClick={onCtaClick}
            className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-base font-bold text-main-azul transition-transform hover:scale-105 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-main-azul shadow-lg"
          >
            SOLICITAR DEMO PERSONALIZADA
          </button>
        </div>
      </div>
    </section>
  );
}
