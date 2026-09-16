import { Link, NavLink, useNavigate } from "react-router-dom";
import { Heart, Menu, Globe2, LogOut } from "lucide-react";
import { useI18n, LANGS } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Layout({ children }) {
  const { t, lang, setLang } = useI18n();
  const { token, role, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const navLink = (to, key) => (
    <NavLink
      to={to}
      data-testid={`nav-${key}`}
      onClick={() => setOpen(false)}
      className={({ isActive }) =>
        `text-sm tracking-wide font-medium transition-colors ${
          isActive ? "text-[#2A5A4A]" : "text-[#4A5D54] hover:text-[#1C2220]"
        }`
      }
    >
      {t(`nav_${key}`)}
    </NavLink>
  );

  const doLogout = () => {
    logout();
    navigate("/");
  };

  const dashboardPath = role === "admin" ? "/admin" : role === "hospital" ? "/hospital" : "/donor";

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F7F3]">
      <header className="glass-header sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5" data-testid="brand-logo">
            <div className="w-9 h-9 rounded-full bg-[#2A5A4A] flex items-center justify-center heartbeat">
              <Heart className="w-4.5 h-4.5 text-white" fill="white" strokeWidth={0} size={18} />
            </div>
            <div className="leading-none">
              <div className="font-serif text-xl text-[#1C2220]">OrganBridge</div>
              <div className="text-[10px] tracking-[0.25em] text-[#4A5D54] uppercase">India · Non-Profit</div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-9">
            {navLink("/", "home")}
            {navLink("/about", "about")}
            {navLink("/waitlist", "waitlist")}
            {navLink("/faq", "faq")}
            {navLink("/contact", "contact")}
          </nav>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" data-testid="lang-switcher" className="text-[#1C2220]">
                  <Globe2 className="w-4 h-4 mr-1.5" />
                  <span className="text-xs uppercase tracking-widest">{lang}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white">
                {LANGS.map((l) => (
                  <DropdownMenuItem
                    key={l.code}
                    data-testid={`lang-option-${l.code}`}
                    onClick={() => setLang(l.code)}
                    className={lang === l.code ? "font-semibold text-[#2A5A4A]" : ""}
                  >
                    {l.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {token ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  data-testid="nav-dashboard"
                  onClick={() => navigate(dashboardPath)}
                  className="hidden sm:inline-flex"
                >
                  Dashboard
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  data-testid="nav-logout"
                  onClick={doLogout}
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  data-testid="nav-login-btn"
                  onClick={() => navigate("/login")}
                  className="hidden sm:inline-flex text-[#1C2220]"
                >
                  {t("nav_login")}
                </Button>
                <Button
                  size="sm"
                  data-testid="nav-pledge-btn"
                  onClick={() => navigate("/register")}
                  className="btn-accent rounded-full px-5"
                >
                  {t("nav_pledge")}
                </Button>
              </>
            )}

            <button
              data-testid="mobile-menu-toggle"
              className="lg:hidden p-2 text-[#1C2220]"
              onClick={() => setOpen((o) => !o)}
              aria-label="Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {open && (
          <div className="lg:hidden border-t border-[#D3D9D5] bg-[#F9F7F3] px-6 py-4 flex flex-col gap-4">
            {navLink("/", "home")}
            {navLink("/about", "about")}
            {navLink("/waitlist", "waitlist")}
            {navLink("/faq", "faq")}
            {navLink("/contact", "contact")}
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-[#D3D9D5] bg-[#EDF0EB] mt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14 grid md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-full bg-[#2A5A4A] flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" fill="white" strokeWidth={0} />
              </div>
              <span className="font-serif text-xl">OrganBridge India</span>
            </div>
            <p className="text-sm text-[#4A5D54] leading-relaxed max-w-md">
              {t("footer_about")}
            </p>
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-[#4A5D54] mb-3">Platform</div>
            <ul className="space-y-2 text-sm">
              <li><Link to="/register" className="hover:text-[#2A5A4A]">Pledge</Link></li>
              <li><Link to="/waitlist" className="hover:text-[#2A5A4A]">Waitlist</Link></li>
              <li><Link to="/about" className="hover:text-[#2A5A4A]">About donation</Link></li>
              <li><Link to="/faq" className="hover:text-[#2A5A4A]">Myths & FAQ</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-[#4A5D54] mb-3">Helpline</div>
            <ul className="space-y-2 text-sm">
              <li>NOTTO: 1800-11-4770</li>
              <li>Email: care@organbridge.in</li>
              <li>Emergency: 112</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[#D3D9D5] py-4 text-center text-xs text-[#4A5D54]">
          © {new Date().getFullYear()} OrganBridge India · A college project for social impact
        </div>
      </footer>
    </div>
  );
}
