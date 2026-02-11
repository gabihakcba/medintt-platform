import DoctorImage from "../componentes/inicio/DoctorImage";
import WhyMedintt from "../componentes/inicio/WhyMedintt";
import CarouselMedintt from "../componentes/inicio/CarouselMedintt";
import Services from "../componentes/inicio/Services";
import ClubSalud from "../componentes/inicio/ClubSalud";

export default function Home() {
  return (
    <main className="flex flex-col">
      <DoctorImage />
      <section className="m-0 w-full self-center bg-white px-4 pb-12 sm:px-6 sm:pb-14 lg:px-8 xl:px-[15rem]">
        <CarouselMedintt />
      </section>
      <WhyMedintt />
      <Services />
      <ClubSalud />
    </main>
  );
}
