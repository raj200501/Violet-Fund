import Nav from "@/components/Nav";
import Landing from "@/components/marketing/Landing";

export default function Home() {
  return (
    <main className="px-6 pb-24">
      <div className="mx-auto max-w-6xl space-y-16">
        <Nav />
        <Landing />
      </div>
    </main>
  );
}
