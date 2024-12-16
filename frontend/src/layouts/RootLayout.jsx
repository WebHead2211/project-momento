import { Outlet } from "react-router-dom";
import Nav from "../components/Other/Nav";

export default function RootLayout() {
  return (
    <div className="root-layout">
      <header>
        <Nav />
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
