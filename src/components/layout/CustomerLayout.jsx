import { Outlet } from "react-router-dom";
import AnnouncementBar from "./AnnouncementBar";
import Header from "./Header";
import Footer from "./Footer";
import BottomNav from "./BottomNav";

export default function CustomerLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar />
      <Header />
      <main className="flex-1 pb-20 md:pb-0"><Outlet /></main>
      <Footer />
      <BottomNav />
    </div>
  );
}