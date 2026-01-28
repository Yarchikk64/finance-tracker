import { Navbar } from "@/components/organisms/Navbar";
import { DashboardContent} from "@/components/templates/DashboardContent"

export default function Home() {
  return (
    <main className="max-w-6xl mx-auto p-6 md:p-10">
      <Navbar />
      <DashboardContent />
    </main>
  )
}