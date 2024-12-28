'use client';

import { Amplify } from 'aws-amplify';
import { getCurrentUser, fetchUserAttributes, signOut, fetchAuthSession } from '@aws-amplify/auth';

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
      throw new Error('Missing required environment variables for Amplify configuration');
    }
  
    Amplify.configure({
      Auth: {
        Cognito: {
          userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID,
          userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID,
          loginWith: {
            oauth: {
              domain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
              scopes: ['email', 'openid', 'profile'],
              responseType: 'code',
              redirectSignIn: ['http://localhost:3000', 'https://mapability.vercel.app'],
              redirectSignOut: ['http://localhost:3000', 'https://mapability.vercel.app']
            }
          }
        }
      }
    });
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