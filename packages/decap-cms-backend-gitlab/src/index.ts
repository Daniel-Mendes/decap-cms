import GitLabBackend from './implementation.ts';
import API from './API.ts';
import AuthenticationPage from './AuthenticationPage.jsx';

export const DecapCmsBackendGitlab = {
  GitLabBackend,
  API,
  AuthenticationPage,
};


export {default as GitLabBackend} from './implementation.ts';
export {default as API} from './API.ts';
export {default as AuthenticationPage} from './AuthenticationPage.jsx';