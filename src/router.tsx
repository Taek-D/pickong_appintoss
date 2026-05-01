// 라우터 — Phase 1 + 2 전체 (PRD §6.1, §6.2)
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Onboarding } from './screens/Onboarding';
import { Login } from './screens/Login';
import { Nickname } from './screens/Nickname';
import { Home } from './screens/Home';
import { AddFlow } from './screens/Add';
import { Done } from './screens/Done';
import { CategoryDetail } from './screens/CategoryDetail';
import { Card } from './screens/Card';
import { CardView } from './screens/CardView';
import { ViewerIntro } from './screens/ViewerIntro';
import { AdInterlude } from './screens/Ad';
import { Settings } from './screens/Settings';
import { NickEdit } from './screens/NickEdit';
import { List } from './screens/List';
import { useSession } from './state/session';
import { onboarding, viewerIntro } from './lib/storage';

function RootGate(): JSX.Element {
  const { userKey, nickname } = useSession();
  const [onbDone, setOnbDone] = useState<boolean | null>(null);
  useEffect(() => { void onboarding.isCompleted().then(setOnbDone); }, []);
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

// 공유 링크 진입자 — 신규 가입자면 viewer-intro 경유
function ShareCardGate(): JSX.Element {
  const { userKey, nickname } = useSession();
  const [seen, setSeen] = useState<boolean | null>(null);
  useEffect(() => {
    if (userKey) void viewerIntro.wasSeen(userKey).then(setSeen);
  }, [userKey]);

  if (!userKey) return <Navigate to={`/login?from=share&next=${encodeURIComponent(window.location.pathname)}`} replace />;
  if (!nickname) return <Navigate to={`/nick?from=share&next=${encodeURIComponent(window.location.pathname)}`} replace />;
  if (seen === null) return <div className="p-8 text-center">...</div>;
  if (!seen) {
    const hash = window.location.pathname.split('/card/')[1];
    return <Navigate to={`/viewer-intro/${hash}`} replace />;
  }
  return <CardView />;
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
      { path: '/card/own', element: <Card /> },
      { path: '/ad/card', element: <AdInterlude /> },
      { path: '/list', element: <List /> },
      { path: '/set', element: <Settings /> },
      { path: '/set/nickname', element: <NickEdit /> },
      { path: '/viewer-intro/:hash', element: <ViewerIntro /> },
    ],
  },
  // 공유 링크 — 인증 게이트 + 신규 가입자 분기
  { path: '/card/:hash', element: <ShareCardGate /> },
  { path: '*', element: <Navigate to="/" replace /> },
]);
