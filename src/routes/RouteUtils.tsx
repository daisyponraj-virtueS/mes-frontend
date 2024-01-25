import React from 'react';
import ProtectedRoutes from 'routes/ProtectedRoutes';
import UnProtectedRoutes from 'routes/UnProtectedRoutes';
import Loading from 'components/common/Loading';

export const getRouteElement = (
  Component: React.ElementType,
  isProtected: boolean
): React.ReactNode => (
  <React.Suspense fallback={<Loading />}>
    {isProtected ? (
      <ProtectedRoutes>
        <Component />
      </ProtectedRoutes>
    ) : (
      <UnProtectedRoutes>
        <Component />
      </UnProtectedRoutes>
    )}
  </React.Suspense>
);
