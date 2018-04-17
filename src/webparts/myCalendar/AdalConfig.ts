const adalConfig: adal.Config = {
    clientId: 'b40a4acd-433e-4b35-a426-523d9243551c',
    tenant: 'common',
    extraQueryParameter: 'nux=1',
    endpoints: {
      'https://graph.microsoft.com': 'https://graph.microsoft.com'
    },
    postLogoutRedirectUri: window.location.origin,
    cacheLocation: 'sessionStorage'
  };
  
  export default adalConfig;