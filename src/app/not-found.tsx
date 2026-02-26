import Link from 'next/link';
import Button from '@/components/ui/Button';

export function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="text-sm text-secondary">The page you are looking for does not exist.</p>
      <Link href="/" aria-label="Go home">
        <Button>Go Home</Button>
      </Link>
    </div>
  );
}

export default NotFound;
