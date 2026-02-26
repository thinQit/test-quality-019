'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ContactForm from '@/components/portfolio/ContactForm';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { api } from '@/lib/api';
import { useToast } from '@/providers/ToastProvider';

interface SiteProfile {
  title?: string;
  tagline?: string;
  ctaText?: string;
  ctaHref?: string;
}

export function HomePage() {
  const { toast } = useToast();
  const [profile, setProfile] = useState<SiteProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchProfile = async () => {
      setLoading(true);
      const res = await api.get<SiteProfile>('/api/site-profile');
      if (!isMounted) return;
      if (res.error) {
        setError(res.error);
        setLoading(false);
        toast('Failed to load site profile.', 'error');
        return;
      }
      setProfile(res.data);
      setError(null);
      setLoading(false);
    };

    fetchProfile();
    return () => {
      isMounted = false;
    };
  }, [toast]);

  const fallbackProfile: SiteProfile = {
    title: 'Your Name',
    tagline: 'I build accessible, performant web experiences with a focus on simplicity.',
    ctaText: 'Contact Me',
    ctaHref: '#contact'
  };

  const resolvedProfile = profile && (profile.title || profile.tagline || profile.ctaText || profile.ctaHref)
    ? profile
    : fallbackProfile;

  return (
    <div className="flex flex-col">
      <section className="px-6 py-16 md:py-24 bg-muted">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          {loading ? (
            <div className="flex flex-col items-center gap-3">
              <Spinner className="h-8 w-8" />
              <p className="text-sm text-secondary">Loading profile...</p>
            </div>
          ) : error ? (
            <div className="space-y-2">
              <h1 className="text-2xl md:text-4xl font-semibold">Portfolio</h1>
              <p className="text-sm text-secondary">We couldn't load the profile content.</p>
              <Button onClick={() => window.location.reload()} variant="outline" size="sm">
                Retry
              </Button>
            </div>
          ) : (
            <>
              <h1 className="text-3xl md:text-5xl font-bold">
                {resolvedProfile.title || 'Portfolio'}
              </h1>
              <p className="text-lg text-secondary">
                {resolvedProfile.tagline || 'A simple portfolio site.'}
              </p>
              <Link href={resolvedProfile.ctaHref || '#contact'} aria-label="Go to contact section">
                <Button>{resolvedProfile.ctaText || 'Contact Me'}</Button>
              </Link>
            </>
          )}
        </div>
      </section>
      <section id="contact" className="px-6 py-16 md:py-24">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-2xl font-semibold">Get in touch</h2>
          <ContactForm />
        </div>
      </section>
    </div>
  );
}

export default HomePage;
