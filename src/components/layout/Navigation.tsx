'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import Button from '@/components/ui/Button';

const links = [
  { href: '/', label: 'Home' },
  { href: '/#contact', label: 'Contact' },
  { href: '/admin/contacts', label: 'Admin' }
];

export function Navigation() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-border bg-background">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/" className="font-semibold text-lg" aria-label="Go to homepage">
          Portfolio
        </Link>
        <button
          className="md:hidden inline-flex items-center justify-center rounded-md p-2 border border-border"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen(prev => !prev)}
        >
          <span className="sr-only">Toggle menu</span>
          <div className="flex flex-col gap-1">
            <span className="block h-0.5 w-5 bg-foreground" />
            <span className="block h-0.5 w-5 bg-foreground" />
            <span className="block h-0.5 w-5 bg-foreground" />
          </div>
        </button>
        <div className="hidden md:flex items-center gap-6">
          {links.map(link => (
            <Link key={link.href} href={link.href} className="text-sm hover:text-primary">
              {link.label}
            </Link>
          ))}
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm">{user.name}</span>
              <Button variant="ghost" size="sm" onClick={logout} aria-label="Logout">
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" aria-label="Login">
                Login
              </Button>
              <Button size="sm" aria-label="Sign up">
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </nav>
      {open && (
        <div className="md:hidden border-t border-border px-4 py-3 space-y-3">
          {links.map(link => (
            <Link key={link.href} href={link.href} className="block text-sm" onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
          {user ? (
            <Button variant="ghost" size="sm" onClick={logout} aria-label="Logout">
              Logout
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" aria-label="Login">
                Login
              </Button>
              <Button size="sm" aria-label="Sign up">
                Sign Up
              </Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export default Navigation;
