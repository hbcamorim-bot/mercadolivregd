import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import HowItWorks from "@/components/sections/HowItWorks";
import BenefitsClients from "@/components/sections/BenefitsClients";
import BenefitsSuppliers from "@/components/sections/BenefitsSuppliers";
import EconomySimulator from "@/components/sections/EconomySimulator";
import StatsSection from "@/components/sections/StatsSection";
import Differentials from "@/components/sections/Differentials";
import FAQ from "@/components/sections/FAQ";
import CTASection from "@/components/sections/CTASection";

export const metadata: Metadata = {
  title: "Mercado Livre GD | Economize até 35% na Conta de Energia",
  description:
    "Plataforma que conecta clientes e fornecedores de energia para gerar desconto real na conta de luz em todo o Brasil. Cadastre-se gratuitamente.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <StatsSection />
      <BenefitsClients />
      <EconomySimulator />
      <BenefitsSuppliers />
      <Differentials />
      <FAQ />
      <CTASection />
    </>
  );
}
