import Navbar from "./Navbar";
import Footer from "./Footer";

function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <Navbar />

      <main className="pt-20">
        {children}
      </main>

      <Footer />

    </div>
  );
}

export default MainLayout;