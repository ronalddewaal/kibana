/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
import React from 'react';
import * as history from 'history';
import { Provider } from 'react-redux';

import { BASE_PATH } from '../../common/constants';
import { AppContextProvider, AppDependencies } from './app_context';
// @ts-ignore
import { licenseManagementStore } from './store';

interface Props {
  appDependencies: AppDependencies;
  children: React.ReactNode;
}

export const AppProviders = ({ appDependencies, children }: Props) => {
  const {
    core,
    plugins,
    services,
    store: { initialLicense },
  } = appDependencies;

  const {
    http,
    notifications: { toasts },
    i18n: { Context: I18nContext },
  } = core;

  // Setup Redux store
  const thunkServices = {
    // So we can imperatively control the hash route
    history: history.createHashHistory({ basename: BASE_PATH }),
    toasts,
    http,
    telemetry: plugins.telemetry,
    licensing: plugins.licensing,
    breadcrumbService: services.breadcrumbService,
  };
  const initialState = { license: initialLicense };

  const store = licenseManagementStore(initialState, thunkServices);

  return (
    <I18nContext>
      <Provider store={store}>
        <AppContextProvider value={appDependencies}>{children}</AppContextProvider>
      </Provider>
    </I18nContext>
  );
};
