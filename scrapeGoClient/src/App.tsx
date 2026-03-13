import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ManhwaDetails from "./pages/ManhwaDetails";
import Reader from "./pages/Reader";
import Search from "./pages/Search";

export default function App() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/manhwa/*" element={<ManhwaDetails />} />
                    <Route path="/read/:manga/:chapter" element={<Reader />} />
                    <Route path="/search" element={<Search />} />
                </Routes>
            </main>
            <footer className="border-t border-dark-700/50 py-6 text-center text-dark-500 text-sm">
                <p>ManhwaVerse &copy; {new Date().getFullYear()} &mdash; Powered by scrapeGo</p>
            </footer>
        </div>
    );
}
