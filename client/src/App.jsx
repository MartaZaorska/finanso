import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router-dom';

import Layout from './components/Layout';
import Loader from './components/Loader';
import ErrorBoundary from './components/ErrorBoundary';
import Protected from './components/Protected';
import GroupAccessControl from './components/GroupAccessControl';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<ErrorBoundary />}>
      <Route path="/" element={<Protected />}>
        <Route path="/" element={<GroupAccessControl />}>
          <Route index lazy={() => import("./pages/Dashboard")} />
          <Route path="budget" lazy={() => import("./pages/Budget")} />
          <Route path="plan" lazy={() => import("./pages/Plan")} />
          <Route path="analysis" lazy={() => import("./pages/Analysis")} />
          <Route path="settings" lazy={() => import("./pages/Settings")} />
          <Route path="notifications" lazy={() => import("./pages/Notifications")} />
        </Route>
        <Route path="user" lazy={() => import("./pages/User")} />
      </Route>
      <Route path="auth" lazy={() => import("./components/AuthLayout")}>
        <Route index lazy={() => import("./pages/Auth/Login")} />
        <Route path="register" lazy={() => import("./pages/Auth/Register")} />
      </Route>
    </Route>
  )
);

function App() {
  return (
    <RouterProvider
      router={router}
      fallbackElement={<Loader />}
    />
  )
}

export default App