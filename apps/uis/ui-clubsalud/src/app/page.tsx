import { MedinttButton } from "@medintt/ui";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold">Club Salud</h1>
        <MedinttButton>Click me</MedinttButton>
      </div>
    </main>
  );
}
