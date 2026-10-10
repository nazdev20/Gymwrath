import type { Metadata } from 'next';
import '../src/index.css';

export const metadata: Metadata = {
  title: 'GymWrath — Channel the fire. Own the result.',
  description: 'Set the target. Execute the plan. Prove the progress. GymWrath brings strength training, nutrition, and coaching progress into one focused platform.',
  applicationName: 'GymWrath',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(() => { try { const mode = localStorage.getItem('gymwrath-theme') || 'dark'; const light = mode === 'light' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: light)').matches); document.documentElement.classList.toggle('theme-light', light); document.documentElement.style.colorScheme = light ? 'light' : 'dark'; } catch (_) {} })();` }} />
      </head>
      <body>
        <div id="gymwrath-boot-loader" role="status" aria-live="polite" aria-label="Loading Gymwrath" style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111113', color: '#fafafa', fontFamily: 'system-ui, sans-serif' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, padding: 24, textAlign: 'center' }}>
            <div style={{ position: 'relative', display: 'flex', height: 64, width: 64, alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ position: 'absolute', inset: 0, border: '4px solid #334155', borderRadius: '9999px' }} />
              <div style={{ position: 'absolute', inset: 0, border: '4px solid transparent', borderTopColor: '#34d399', borderRightColor: '#34d399', borderRadius: '9999px', animation: 'gymwrath-boot-spin 0.8s linear infinite' }} />
              <span style={{ color: '#34d399', fontSize: 20, fontWeight: 900 }}>G</span>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 18, fontWeight: 700, letterSpacing: '0.04em' }}>Gymwrath</p>
              <p style={{ margin: '4px 0 0', fontSize: 14, color: '#94a3b8' }}>Preparing your experience…</p>
            </div>
          </div>
          <style>{'@keyframes gymwrath-boot-spin { to { transform: rotate(360deg); } }'}</style>
        </div>
        {children}
      </body>
    </html>
  );
}