// 라우터 — PRD §6.1 화면 트리 + §6.2 라우팅 분기
// Phase 1: S-ONB / S-LOGIN / S-NICK / S-HOME / S-ADD / S-DONE / S-CAT
// Phase 2 placeholders: S-CARD / S-CARD-VIEW / S-SHARE / S-VIEWER-INTRO / S-NICK-EDIT / S-LIST / S-SET
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { Onboarding } from './screens/Onboarding';
import { Login } from './screens/Login';
import { Nickname } from './screens/Nickname';
import { Home } from './screens/Home';
import { AddFlow } from './screens/Add';
import { Done } from './screens/Done';
import { CategoryDetail } from './screens/CategoryDetail';
import { useSession } from './state/session';
import { useEffect, useState } from 'react';
import { onboarding } from './lib/storage';

function RootGate(): JSX.Element {
  const { userKey, nickname } = useSession();
  const [onbDone, setOnbDone] = useState<boolean | null>(null);
  useEffect(() => {
    void onboarding.isCompleted().then(setOnbDone);
  }, []);
  if (onbDone === null) return <div className="p-8 text-center">...</div>;
  if (!onbDone) return <Navigate to="/onb" replace />;
  if (!userKey) return <Navigate to="/login" replace />;
  if (!nickname) return <Navigate to="/nick" replace />;
  return <Home />;
}

function AuthGate(): JSX.Element {
  const { userKey, nickname } = useSession();
  if (!userKey) return <Navigate to="/login" replace />;
  if (!nickname) return <Navigate to="/nick" replace />;
  return <Outlet />;
}

export const router = createBrowserRouter([
  { path: '/', element: <RootGate /> },
  { path: '/onb', element: <Onboarding /> },
  { path: '/login', element: <Login /> },
  { path: '/nick', element: <Nickname /> },
  {
    element: <AuthGate />,
    children: [
      { path: '/add/*', element: <AddFlow /> },
      { path: '/done', element: <Done /> },
      { path: '/cat/:id', element: <CategoryDetail /> },
    ],
  },
  // Phase 2 자리 (스텁)
  { path: '/card/:hash', element: <CardViewStub /> },
  { path: '*', element: <Navigate to="/" replace /> },
]);

function CardViewStub(): JSX.Element {
  return (
    <div className="flex h-full items-center justify-center p-8 text-center text-[var(--color-text-muted)]">
      카드 보기는 Phase 2에서 열려요.
    </div>
  );
}
