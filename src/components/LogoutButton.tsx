'use client';

import { useRouter } from '@/navigation';

export function LogoutButton({ label }: { label: string }) {
  const router = useRouter();

  async function handleClick() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.refresh();
  }

  return (
    <button onClick={handleClick} className="text-sm text-gray-500 hover:text-gray-800">
      {label}
    </button>
  );
}
