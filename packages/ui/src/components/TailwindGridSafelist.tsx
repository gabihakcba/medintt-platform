/**
 * This file forces Tailwind v4 to generate all grid column classes
 * by using them literally in the code. Don't import or use this component.
 * It exists only to ensure Tailwind's scanner detects these classes.
 */
export const TailwindGridClassesSafelist = () => (
  <div className="hidden">
    {/* Grid container classes */}
    <div className="grid grid-cols-12 gap-4" />

    {/* Mobile-first: all fields full width on mobile */}
    <div className="col-span-12" />

    {/* Desktop breakpoint (md): column span variants */}
    <div className="md:col-span-1" />
    <div className="md:col-span-2" />
    <div className="md:col-span-3" />
    <div className="md:col-span-4" />
    <div className="md:col-span-5" />
    <div className="md:col-span-6" />
    <div className="md:col-span-7" />
    <div className="md:col-span-8" />
    <div className="md:col-span-9" />
    <div className="md:col-span-10" />
    <div className="md:col-span-11" />
    <div className="md:col-span-12" />
  </div>
);
