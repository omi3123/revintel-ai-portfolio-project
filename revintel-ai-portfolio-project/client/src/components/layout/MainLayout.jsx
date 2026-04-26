import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 lg:flex">
      <Sidebar />
      <div className="flex-1">
        <main className="mx-auto max-w-[1600px] px-4 py-4 md:px-6 lg:px-8">
          <TopNavbar />
          <Outlet />
        </main>
      </div>
    </div>
  );
}
