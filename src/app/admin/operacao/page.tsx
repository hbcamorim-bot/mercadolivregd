import type { Metadata } from "next"
import OperationsHub from "@/components/admin/OperationsHub"

export const metadata: Metadata = {
  title: "Operação GD",
  robots: { index: false, follow: false },
}

export default function OperationsPage() {
  return <OperationsHub />
}
