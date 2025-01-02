'use client';

import { Amplify } from 'aws-amplify';
import { getCurrentUser, fetchUserAttributes, signOut, fetchAuthSession } from '@aws-amplify/auth';
import { cognitoUserPoolsTokenProvider } from '@aws-amplify/auth/cognito';
import { type ResourcesConfig } from 'aws-amplify';

// export const configureAmplify = () => {
//   Amplify.configure({
//     Auth: {
//       Cognito: {
//         userPoolId: '',
//         userPoolClientId: '',
//         loginWith: {
//           oauth: {
//             domain: '',
//             scopes: ['email', 'openid', 'profile'],
//             responseType: 'code',
//             redirectSignIn: ['http://localhost:3000'],
//             redirectSignOut: ['http://localhost:3000']
//           }
//         }
//       }
//     }
//   });
// };
export const configureAmplify = () => {
  if (!process.env.NEXT_PUBLIC_USER_POOL_ID || 
      !process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID || 
      !process.env.NEXT_PUBLIC_AUTH_DOMAIN) {
    console.error('Environment variables:', {
      userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID,
      clientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID,
      domain: process.env.NEXT_PUBLIC_AUTH_DOMAIN
    });
    throw new Error('Missing required environment variables for Amplify configuration');
  }

  const config: ResourcesConfig = {
    Auth: {
      Cognito: {
        userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID,
        userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID,
        loginWith: {
          oauth: {
            domain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
            scopes: ['email', 'openid', 'profile'],
            responseType: 'code',
            redirectSignIn: ['http://localhost:3000'],  // Simplified for testing
            redirectSignOut: ['http://localhost:3000']  // Simplified for testing
          }
        }
      }
    }
  };

  console.log('Amplify Configuration:', JSON.stringify(config, null, 2));

  try {
    Amplify.configure(config);
    console.log('Amplify configured successfully');

    cognitoUserPoolsTokenProvider.setKeyValueStorage({
      async getItem(key: string) {
        const value = localStorage.getItem(key);
        console.log('Storage getItem:', { key, value });
        return value;
      },
      async setItem(key: string, value: string) {
        console.log('Storage setItem:', { key, value });
        localStorage.setItem(key, value);
      },
      async removeItem(key: string) {
        console.log('Storage removeItem:', { key });
        localStorage.removeItem(key);
      },
      async clear() {
        console.log('Storage clear');
        localStorage.clear();
      }
    });
    console.log('Token provider storage configured');
  } catch (error) {
    console.error('Error configuring Amplify:', error);
    throw error;
  }
};

export const getIdToken = async () => {
  try {
    const session = await fetchAuthSession();
    return session.tokens?.idToken?.toString();
  } catch (error) {
    console.error('Error getting ID token:', error);
    return null;
  }
};

export const getAuthenticatedUser = async () => {
  try {
    const user = await getCurrentUser();
    const attributes = await fetchUserAttributes();
    return { user, attributes };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};