'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CSSProperties } from 'react'

const navBarStyles = {
  nav: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100%',
    zIndex: 999,
    background: '#1e1e1e',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    borderBottom: '1px solid #333',
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1024px',
    margin: '0 auto',
    padding: '16px',
  },
  title: {
    color: '#fff',
    fontSize: '20px',
    fontWeight: 'bold',
  },
}

const getLinkStyle = (isActive: boolean): CSSProperties => ({
  display: 'inline-block',
  color: isActive ? '#4fc3f7' : '#fff',
  fontWeight: isActive ? 'bold' : 'normal',
  textDecoration: 'none',
  padding: '8px 12px',
  marginLeft: '8px',
  transition: 'color 0.2s ease',
})

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav style={navBarStyles.nav}>
      <div style={navBarStyles.container}>
        <div style={navBarStyles.title}>Vault Admin</div>
        <div>
          <Link href="/dashboard" style={getLinkStyle(pathname === '/dashboard')}>
            Dashboard
          </Link>
          <Link href="/admin" style={getLinkStyle(pathname === '/admin')}>
            Admin
          </Link>
          <Link href="/reset-password" style={getLinkStyle(pathname === '/reset-password')}>
            Reset Password
          </Link>
        </div>
      </div>
    </nav>
  )
}