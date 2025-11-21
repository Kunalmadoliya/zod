import React from "react";
import {Bell, Moon, Sun, Menu, User as UserIcon} from "lucide-react";
import {useSession} from "next-auth/react";

export const Navbar: React.FC = () => {
  const {data: session, status} = useSession();

  console.log(session);
  console.log(status);

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/70 dark:bg-zinc-950/70 border-b border-slate-200/50 dark:border-zinc-800/50 px-4 md:px-8 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="text-white font-bold text-lg">L</span>
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">
            zod
          </span>
        </div>

        {/* Desktop Nav Items */}
        <div className="hidden md:flex items-center gap-6">
          {status === "authenticated" && (
            <div>
              <p>Welcome, {session?.user.username}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
         
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-zinc-700 dark:to-zinc-800 flex items-center justify-center ring-2 ring-white dark:ring-zinc-950 cursor-pointer">
            <UserIcon
              size={18}
              className="text-slate-600 dark:text-slate-300"
            />
          </div>

          <button className="md:hidden p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-zinc-800">
            <Menu size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};
