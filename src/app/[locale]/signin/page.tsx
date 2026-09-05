'use client';

import { useState, type FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';

// The layout's Header reads the session cookie, which already forces this
// whole tree dynamic — make it explicit so Next doesn't attempt (and fail)
// to statically prerender this page.
export const dynamic = 'force-dynamic';

const VERIFY_ERROR_KEYS: Record<string, string> = {
  invalid: 'invalid',
  expired: 'expired',
  used: 'used',
};

export default function SignInPage() {
  const t = useTranslations('SignIn');
  const tVerify = useTranslations('Verify');
  const searchParams = useSearchParams();
  const verifyError = searchParams.get('error');

  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg(null);

    try {
      const res = await fetch('/api/auth/request-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus('sent');
        return;
      }

      const data = await res.json().catch(() => ({}));
      setErrorMsg(data.error === 'unsupported' ? t('errorUnsupported') : t('errorGeneric'));
      setStatus('error');
    } catch {
      setErrorMsg(t('errorGeneric'));
      setStatus('error');
    }
  }

  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
      <p className="mt-2 text-gray-600">{t('subtitle')}</p>

      {verifyError && status === 'idle' && (
        <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {verifyError === 'unsupported'
            ? t('errorUnsupported')
            : tVerify(VERIFY_ERROR_KEYS[verifyError] ?? 'invalid')}
        </p>
      )}

      {status === 'sent' ? (
        <p className="mt-8 rounded-xl bg-brand-light p-4 text-brand-dark">{t('checkEmail')}</p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-3">
          <label className="block text-sm font-medium text-gray-700" htmlFor="email">
            {t('emailLabel')}
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@wiut.uz"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand focus:outline-none"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full rounded-full bg-brand px-4 py-2 font-semibold text-white hover:bg-brand-dark disabled:opacity-50"
          >
            {status === 'loading' ? '…' : t('submit')}
          </button>
          {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}
        </form>
      )}
    </main>
  );
}
