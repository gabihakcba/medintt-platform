const faqs = [
  {
    question: '¿Cómo puedo acceder al Campus Virtual?',
    answer:
      'Una vez habilitado, recibirás un correo con tus credenciales personales. Podrás ingresar desde cualquier navegador moderno utilizando tu usuario y contraseña.'
  },
  {
    question: '¿Qué tipo de contenidos encontraré?',
    answer:
      'Cursos autogestionados, webinars grabados, materiales descargables y evaluaciones breves para reforzar los conocimientos clave.'
  },
  {
    question: '¿Puedo invitar a mi equipo?',
    answer:
      'Sí. Los administradores de la empresa podrán crear y gestionar usuarios para sus colaboradores desde el panel principal del Campus.'
  },
  {
    question: '¿Existe seguimiento del progreso?',
    answer:
      'Cada curso incluye métricas de avance, certificados automáticos y reportes descargables para conocer el desempeño de cada integrante.'
  },
  {
    question: '¿Necesito instalar algún software?',
    answer:
      'No. El Campus Virtual funciona 100 % online y está optimizado para computadoras, tablets y smartphones.'
  },
  {
    question: '¿Cómo obtengo soporte técnico?',
    answer:
      'Contamos con un equipo de soporte disponible de lunes a viernes de 9 a 18 h (ART). Podés escribirnos a campus@medintt.com o iniciar un ticket desde la plataforma.'
  }
];

export default function PreguntasFrecuentesPage() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center bg-gradient-to-br from-white via-slate-50 to-emerald-50 p-10">
      <div className="mx-auto max-w-4xl space-y-10 text-center">
        <header className="space-y-4">
          <h1 className="text-4xl font-bold text-slate-900">Preguntas frecuentes</h1>
          <p className="text-lg leading-7 text-slate-600">
            Resolvemos las consultas más habituales sobre Medintt para que aproveches la
            experiencia desde el primer ingreso.
          </p>
        </header>

        <section className="grid gap-6 text-left">
          {faqs.map(({ question, answer }) => (
            <article key={question} className="rounded-3xl bg-white/80 p-6 text-slate-700 shadow-sm backdrop-blur">
              <h2 className="text-xl font-semibold text-slate-900">{question}</h2>
              <p className="mt-3 text-base leading-7 text-slate-600">{answer}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}

