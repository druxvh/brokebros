import Footer from "@/components/general/Footer";
import { Header } from "@/components/general/Header";
import { NavDock } from "@/components/general/NavDock";


export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen relative flex flex-col font-sans pb-20 sm:pb-0">
            <Header />
            {children}
            <NavDock />
            <Footer />
        </div>

    );
}