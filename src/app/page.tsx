import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#070B14] text-[#F5F5F7] selection:bg-[#5B7CFF]/40 selection:text-white">
      <Hero />
      <HowItWorks />
      <Features />
      <Footer />
    </main>
  );
}
