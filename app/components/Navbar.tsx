'use client'
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/admin", label: "Admin" },
  { href: "/reset", label: "Reset Password" },
]

const navBarStyles = {
  nav: {
    position: 'fixed',
    top: 0, left: 0, width: '100%',
    zIndex: 50,
    background: 'rgba(28,32,48,0.85)',
    backdropFilter: 'blur(16px)',
    boxShadow: '0 2px 24px rgba(10,20,40,0.24)',
    borderBottom: '1px solid rgba(255,255,255,0.09)'
  },
  container: {
    maxWidth: 960, margin: '0 auto',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '0.5rem 1.25rem'
  },
  title: {
    fontSize: 22, fontWeight: 700,
    letterSpacing: '-1px',
    color: 'white',
    textShadow: '0 1px 8px rgba(60, 110, 240, 0.15)'
  },
  link: isActive => ({
    display: 'inline-block',
    margin: '0 4px',
    padding: '7px 18px',
    borderRadius: 8,
    fontWeight: 600,
    fontSize: 16,
    color: isActive ? '#fff' : '#abd7ff',
    background: isActive
      ? 'linear-gradient(90deg, #334fff 60%, #132e4f 120%)'
      : 'transparent',
    textDecoration: 'none',
    transition: 'background 0.2s,color 0.2s',
    boxShadow: isActive ? '0 2px 8px rgba(60,80,240,0.13)' : 'none'
  }),
  logoutBtn: {
    marginLeft: 8,
    padding: '7px 18px',
    borderRadius: 8,
    border: 'none',
    background: 'linear-gradient(90deg,#c22d4c 60%,#3b2038 120%)',
    color: 'white',
    fontWeight: 700,
    fontSize: 16,
    boxShadow: '0 2px 8px rgba(240,40,80,0.13)',
    cursor: 'pointer'
  }
}

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout(e) {
    e.preventDefault()
    setLoggingOut(true)
    document.cookie = "session=; Max-Age=0; path=/"
    setTimeout(() => {
      router.push("/")
      setLoggingOut(false)
    }, 400)
  }

  return (
    <nav style={navBarStyles.nav}>
      <div style={navBarStyles.container}>
        <div style={navBarStyles.title}>
          <Link href="/dashboard" style={{color: 'white', textDecoration: 'none'}}>Vault Admin</Link>
        </div>
        <div style={{display: 'flex', gap: 4, alignItems: 'center'}}>
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              style={navBarStyles.link(pathname === link.href)}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            style={navBarStyles.logoutBtn}
          >
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>
    </nav>
  )
}