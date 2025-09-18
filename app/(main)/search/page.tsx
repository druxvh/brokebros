
import Loader from "@/components/general/Loader";
import { Suspense } from "react";
import SearchResults from "@/components/general/SearchResults";

export default function Page() {

    return (
        <main className="min-h-screen w-full h-full">
            <Suspense fallback={<Loader />}>
                <SearchResults />
            </Suspense>
        </main>
    )
}