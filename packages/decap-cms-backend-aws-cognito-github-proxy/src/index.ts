import { API } from 'decap-cms-backend-github';

import AwsCognitoGitHubProxyBackend from './implementation.tsx';
import AuthenticationPage from './AuthenticationPage.jsx';

export const DecapCmsBackendAwsCognitoGithubProxy = {
  AwsCognitoGitHubProxyBackend,
  API,
  AuthenticationPage,
};



export {default as AwsCognitoGitHubProxyBackend} from './implementation.tsx';
export {API} from 'decap-cms-backend-github';
export {default as AuthenticationPage} from './AuthenticationPage.jsx';