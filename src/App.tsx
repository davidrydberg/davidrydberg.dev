import type { RouteRecord } from 'vite-react-ssg';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { BuildsIndex } from './pages/BuildsIndex';
import { BuildPage } from './pages/BuildPage';
import { BUILDS } from './content/builds.generated';

export const routes: RouteRecord[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'builds', element: <BuildsIndex /> },
      ...BUILDS.map((build) => ({
        path: build.path.slice(1),
        element: <BuildPage build={build} />,
      })),
    ],
  },
];
