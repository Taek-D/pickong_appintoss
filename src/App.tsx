// 픽콩 App shell — 세션 hydrate, 공유 링크 진입 감지, 라우터, 토스트
import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { useSession } from './state/session';
import { useItems } from './state/items';
import { useShareEntry } from './lib/share-entry';
import { ToastHost } from './components/Toast';
import { setUnauthenticatedHandler } from './lib/api';

export function App(): JSX.Element {
  const { hydrated, hydrate, userKey } = useSession();

  useEffect(() => {
    void hydrate();
    void useShareEntry.getState().detect();
    setUnauthenticatedHandler(() => {
      void useSession.getState().clear();
      window.location.href = '/login';
    });
  }, [hydrate]);

  useEffect(() => {
    if (userKey) void useItems.getState().load(userKey);
  }, [userKey]);

  // 공유 링크 진입 감지 — 라우터가 이미 /card/:hash를 처리하지만,
  // SDK getSchemeUri 결과가 늦게 도착할 수도 있어 redirect 보강
  useEffect(() => {
    const unsub = useShareEntry.subscribe((s) => {
      if (s.cardId && !window.location.pathname.startsWith(`/card/${s.cardId}`)) {
        window.location.replace(`/card/${s.cardId}`);
      }
    });
    return unsub;
  }, []);

  if (!hydrated) {
    return (
      <div className="flex h-full items-center justify-center text-[var(--color-text-muted)]">
        픽콩 준비 중...
      </div>
    );
  }

  return (
    <>
      <RouterProvider router={router} />
      <ToastHost />
    </>
  );
}
