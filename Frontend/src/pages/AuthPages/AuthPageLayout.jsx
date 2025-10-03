import React from "react";
import { Link } from "react-router";
import ThemeToggle from "../../components/ThemeToggle";
import ThemeTogglerTwo from "../../components/ThemeTogglerTwo";
// import Logo from "../components/ui/Logo";
import Logo from "../../components/ui/Logo";
export default function AuthLayout({ children,layout }) {
  if (layout == "signin") {
    return (
      <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
        <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900 sm:p-0">
          {children}
          <div className="items-center hidden w-full h-full lg:w-1/2 bg-brand-950 dark:bg-white/5 lg:grid">
            <div className="relative flex items-center justify-center z-1">
              {/* <!-- ===== Common Grid Shape Start ===== --> */}

              <div className="flex flex-col items-center max-w-xs">
                <Link to="/" className="block mb-4">
                  <Logo />
                </Link>
                <p className="text-center text-gray-400 dark:text-white/60">
                  Free and Open-Source Tailwind CSS Admin Dashboard Template
                </p>
              </div>
            </div>
          </div>
          <div className="fixed z-50 hidden bottom-6 right-6 sm:block font-2xl">
            <ThemeTogglerTwo />
          </div>
        </div>
      </div>
    );
  }
  if (layout == "signup") {
    return (
      <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
        <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900 sm:p-0">
          
          <div className="items-center hidden w-full h-full lg:w-1/2 bg-brand-950 dark:bg-white/5 lg:grid">
            <div className="relative flex items-center justify-center z-1">
              {/* <!-- ===== Common Grid Shape Start ===== --> */}

              <div className="flex flex-col items-center max-w-full">
                <Link to="/" className="block mb-4">
                  <Logo />
                </Link>
                <p className="text-center text-gray-400 dark:text-white/60">
                  Free and Open-Source Tailwind CSS Admin Dashboard Template
                </p>
              </div>
            </div>
          </div>
          {children}
          <div className="fixed z-50 hidden bottom-6 right-6 sm:block font-2xl">
            <ThemeTogglerTwo />
          </div>
        </div>
      </div>
    );
  }
}
