import { API } from 'decap-cms-backend-github';

import AwsCognitoGitHubProxyBackend from './implementation.tsx';
import AuthenticationPage from './AuthenticationPage.jsx';

export const DecapCmsBackendAwsCognitoGithubProxy = {
  AwsCognitoGitHubProxyBackend,
  API,
  AuthenticationPage,
};

export { AwsCognitoGitHubProxyBackend, API, AuthenticationPage };
