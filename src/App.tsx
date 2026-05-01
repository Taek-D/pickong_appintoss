// 픽콩 App shell — 세션 hydrate, 라우터, 토스트 호스트
import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { useSession } from './state/session';
import { useItems } from './state/items';
import { ToastHost } from './components/Toast';
import { setUnauthenticatedHandler } from './lib/api';

export function App(): JSX.Element {
  const { hydrated, hydrate, userKey } = useSession();

  useEffect(() => {
    void hydrate();
    setUnauthenticatedHandler(() => {
      // 401 시 라우터 가드가 /login으로 보내므로 여기서는 토스트만
      void useSession.getState().clear();
      window.location.href = '/login';
    });
  }, [hydrate]);

  useEffect(() => {
    if (userKey) void useItems.getState().load(userKey);
  }, [userKey]);

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
