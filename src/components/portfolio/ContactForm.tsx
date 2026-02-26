'use client';

import { FormEvent, useState } from 'react';
import { z } from 'zod';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { api } from '@/lib/api';
import { useToast } from '@/providers/ToastProvider';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email required'),
  message: z.string().min(5, 'Message is too short')
});

type FormState = z.infer<typeof schema>;

export function ContactForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [values, setValues] = useState<FormState>({ name: '', email: '', message: '' });

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof FormState, string>> = {};
      parsed.error.errors.forEach(err => {
        const field = err.path[0] as keyof FormState;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    const res = await api.post<{ id: string; createdAt: string }>('/api/contact', parsed.data);
    setLoading(false);

    if (res.error) {
      toast(res.error, 'error');
      return;
    }

    toast('Message sent successfully!', 'success');
    setValues({ name: '', email: '', message: '' });
  };

  return (
    <form className="space-y-4" onSubmit={onSubmit} aria-label="Contact form">
      <Input
        label="Name"
        name="name"
        value={values.name}
        onChange={e => setValues(prev => ({ ...prev, name: e.target.value }))}
        error={errors.name}
        required
      />
      <Input
        label="Email"
        name="email"
        type="email"
        value={values.email}
        onChange={e => setValues(prev => ({ ...prev, email: e.target.value }))}
        error={errors.email}
        required
      />
      <div className="space-y-1">
        <label htmlFor="message" className="block text-sm font-medium text-foreground">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          className="w-full min-h-[120px] px-3 py-2 border rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent border-border"
          value={values.message}
          onChange={e => setValues(prev => ({ ...prev, message: e.target.value }))}
          aria-invalid={!!errors.message}
          required
        />
        {errors.message && <p className="text-sm text-error">{errors.message}</p>}
      </div>
      <Button type="submit" loading={loading} fullWidth>
        Send Message
      </Button>
    </form>
  );
}

export default ContactForm;
