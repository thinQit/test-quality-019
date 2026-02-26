'use client';

import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import { api } from '@/lib/api';
import { useAuth } from '@/providers/AuthProvider';
import { useToast } from '@/providers/ToastProvider';

interface ContactMessage {
  id?: string;
  name?: string;
  email?: string;
  message?: string;
  createdAt?: string;
}

export function AdminContactsPage() {
  const { isAdmin, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContacts = async () => {
    setLoading(true);
    const res = await api.get<ContactMessage[]>('/api/contact');
    if (res.error) {
      setError(res.error);
      setLoading(false);
      toast(res.error, 'error');
      return;
    }
    setContacts(res.data || []);
    setError(null);
    setLoading(false);
  };

  useEffect(() => {
    if (isAdmin) {
      fetchContacts();
    }
  }, [isAdmin]);

  return (
    <div className="px-6 py-12 max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Contact Submissions</h1>
        <p className="text-secondary text-sm">Admin access required to view submissions.</p>
      </div>

      {authLoading ? (
        <div className="flex items-center gap-3 text-sm text-secondary">
          <Spinner className="h-5 w-5" />
          Checking credentials...
        </div>
      ) : !isAdmin ? (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Access restricted</h2>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-secondary">
              You need admin access or a valid API key to view submissions.
            </p>
            <Badge variant="warning">Unauthorized</Badge>
          </CardContent>
        </Card>
      ) : loading ? (
        <div className="flex items-center gap-3 text-sm text-secondary">
          <Spinner className="h-5 w-5" />
          Loading submissions...
        </div>
      ) : error ? (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Unable to load submissions</h2>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-secondary">{error}</p>
            <Button variant="outline" size="sm" onClick={fetchContacts}>
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : contacts.length === 0 ? (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">No submissions yet</h2>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-secondary">When users submit the contact form, they will appear here.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {contacts.map(contact => (
            <Card key={contact.id || contact.email}>
              <CardHeader className="flex flex-col gap-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-lg font-semibold">{contact.name || 'Anonymous'}</h2>
                  <Badge variant="secondary">
                    {contact.createdAt ? new Date(contact.createdAt).toLocaleDateString() : 'N/A'}
                  </Badge>
                </div>
                <p className="text-sm text-secondary">{contact.email || 'No email provided'}</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground">
                  {(contact.message || 'No message provided').slice(0, 160)}
                </p>
              </CardContent>
            </Card>
          ))}
          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={fetchContacts}>
              Refresh
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminContactsPage;
