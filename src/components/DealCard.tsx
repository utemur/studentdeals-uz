'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/navigation';

export type DealForCard = {
  id: string;
  title: string;
  description?: string | null;
  discountLabel: string;
  brand: { name: string; slug: string };
};

export function DealCard({ deal }: { deal: DealForCard }) {
  const t = useTranslations('Deals');
  const router = useRouter();
  const [code, setCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function reveal() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/deals/${deal.id}/reveal`, { method: 'POST' });

      if (res.status === 401) {
        router.push('/signin');
        return;
      }
      if (!res.ok) {
        setError(t('error'));
        return;
      }

      const data = (await res.json()) as { code: string };
      setCode(data.code);
    } catch {
      setError(t('error'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-gray-200 p-5 shadow-sm">
      <div>
        <p className="text-sm font-medium text-brand">{deal.brand.name}</p>
        <h3 className="mt-1 text-lg font-semibold text-gray-900">{deal.title}</h3>
        <p className="mt-1 text-2xl font-bold text-gray-900">{deal.discountLabel}</p>
        {deal.description && <p className="mt-2 text-sm text-gray-600">{deal.description}</p>}
      </div>

      <div className="mt-4">
        {code ? (
          <div className="rounded-lg bg-brand-light px-4 py-3 text-center">
            <p className="text-xs font-medium text-brand-dark">{t('yourCode')}</p>
            <p className="mt-1 font-mono text-lg font-bold text-brand-dark">{code}</p>
          </div>
        ) : (
          <button
            onClick={reveal}
            disabled={loading}
            className="w-full rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black disabled:opacity-50"
          >
            {loading ? '…' : t('reveal')}
          </button>
        )}
        {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
      </div>
    </div>
  );
}
