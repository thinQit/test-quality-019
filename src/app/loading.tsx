import Spinner from '@/components/ui/Spinner';

export function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Spinner className="h-8 w-8" />
    </div>
  );
}

export default Loading;
