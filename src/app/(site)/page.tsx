import type { Metadata } from "next"
import PlatformLanding from "@/components/PlatformLanding"

export const metadata: Metadata = {
  title: "Operação comercial para Geração Distribuída",
  description: "Organize fornecedores, usinas, capacidade, parceiros, prospects e a locação de quotas em geração compartilhada.",
}

export default function HomePage() {
  return <PlatformLanding />
}
