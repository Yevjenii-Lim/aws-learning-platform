import { 
  CognitoIdentityProviderClient, 
  InitiateAuthCommand,
  SignUpCommand,
  ConfirmSignUpCommand,
  ResendConfirmationCodeCommand,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand,
  GetUserCommand,
  AdminGetUserCommand,
  AdminCreateUserCommand,
  AdminSetUserPasswordCommand,
  AdminInitiateAuthCommand,
  AdminRespondToAuthChallengeCommand,
  AuthFlowType,
  ChallengeNameType
} from '@aws-sdk/client-cognito-identity-provider';

const client = new CognitoIdentityProviderClient({ region: 'us-east-1' });

// Cognito configuration
const USER_POOL_ID = process.env.COGNITO_USER_POOL_ID || 'us-east-1_GzUzM777v';
const CLIENT_ID = process.env.COGNITO_CLIENT_ID || '3eobi5tbiqng07tvtkkiefvvkn';
const CLIENT_SECRET = process.env.COGNITO_CLIENT_SECRET;

// Debug logging in development
if (process.env.NODE_ENV === 'development') {
  console.log('🔍 Cognito Config Debug:');
  console.log('USER_POOL_ID:', USER_POOL_ID);
  console.log('CLIENT_ID:', CLIENT_ID);
  console.log('NODE_ENV:', process.env.NODE_ENV);
}

// Only throw error in production if variables are missing
if (process.env.NODE_ENV === 'production' && (!process.env.COGNITO_USER_POOL_ID || !process.env.COGNITO_CLIENT_ID)) {
  throw new Error('Cognito configuration missing. Please set COGNITO_USER_POOL_ID and COGNITO_CLIENT_ID environment variables.');
}

export interface CognitoUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  emailVerified: boolean;
  status: string;
}

export interface AuthResult {
  success: boolean;
  user?: CognitoUser;
  error?: string;
  session?: string;
  challengeName?: string;
  challengeParameters?: any;
}

// Helper function to get user attributes from Cognito response
function extractUserAttributes(attributes: any[]): Partial<CognitoUser> {
  const user: Partial<CognitoUser> = {};
  
  attributes.forEach(attr => {
    switch (attr.Name) {
      case 'sub':
        user.id = attr.Value;
        break;
      case 'email':
        user.email = attr.Value;
        break;
      case 'name':
        user.name = attr.Value;
        break;
      case 'custom:role':
        user.role = attr.Value as 'admin' | 'user';
        break;
      case 'email_verified':
        user.emailVerified = attr.Value === 'true';
        break;
    }
  });
  
  return user;
}

// Sign in with username/email and password
export async function signIn(username: string, password: string): Promise<AuthResult> {
  try {
    const command = new InitiateAuthCommand({
      AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
      ClientId: CLIENT_ID,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
    });

    const response = await client.send(command);
    
    if (response.AuthenticationResult) {
      // Successful authentication
      const user = await getUserByUsername(username);
      return {
        success: true,
        user,
        session: response.AuthenticationResult.AccessToken
      };
    } else if (response.ChallengeName) {
      // Authentication challenge (e.g., NEW_PASSWORD_REQUIRED, MFA)
      // Still try to get user data for the challenge
      const user = await getUserByUsername(username);
      return {
        success: true, // Still consider it successful, just with a challenge
        user,
        challengeName: response.ChallengeName,
        challengeParameters: response.ChallengeParameters,
        error: 'Authentication challenge required'
      };
    } else {
      return {
        success: false,
        error: 'Authentication failed'
      };
    }
  } catch (error: any) {
    console.error('Cognito sign in error:', error);
    
    if (error.name === 'NotAuthorizedException') {
      return {
        success: false,
        error: 'Invalid credentials'
      };
    } else if (error.name === 'UserNotConfirmedException') {
      return {
        success: false,
        error: 'Please confirm your email address'
      };
    } else if (error.name === 'UserNotFoundException') {
      return {
        success: false,
        error: 'User not found'
      };
    } else {
      return {
        success: false,
        error: 'Authentication failed'
      };
    }
  }
}

// Admin sign in (for existing users migration)
export async function adminSignIn(username: string, password: string): Promise<AuthResult> {
  try {
    const command = new AdminInitiateAuthCommand({
      AuthFlow: AuthFlowType.ADMIN_USER_PASSWORD_AUTH,
      UserPoolId: USER_POOL_ID,
      ClientId: CLIENT_ID,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
    });

    const response = await client.send(command);
    
    if (response.AuthenticationResult) {
      const user = await getUserByUsername(username);
      return {
        success: true,
        user,
        session: response.AuthenticationResult.AccessToken
      };
    } else if (response.ChallengeName) {
      // Authentication challenge (e.g., NEW_PASSWORD_REQUIRED, MFA)
      // Still try to get user data for the challenge
      const user = await getUserByUsername(username);
      return {
        success: true, // Still consider it successful, just with a challenge
        user,
        challengeName: response.ChallengeName,
        challengeParameters: response.ChallengeParameters,
        error: 'Authentication challenge required'
      };
    } else {
      return {
        success: false,
        error: 'Authentication failed'
      };
    }
  } catch (error: any) {
    console.error('Cognito admin sign in error:', error);
    
    if (error.name === 'NotAuthorizedException') {
      return {
        success: false,
        error: 'Invalid credentials'
      };
    } else if (error.name === 'UserNotFoundException') {
      return {
        success: false,
        error: 'User not found'
      };
    } else {
      return {
        success: false,
        error: 'Authentication failed'
      };
    }
  }
}

// Get user by username
export async function getUserByUsername(username: string): Promise<CognitoUser | undefined> {
  try {
    console.log('🔍 Getting user by username:', username);
    
    const command = new AdminGetUserCommand({
      UserPoolId: USER_POOL_ID,
      Username: username,
    });

    const response = await client.send(command);
    console.log('🔍 AdminGetUser response:', JSON.stringify(response, null, 2));
    
    // Check if we have user data in the response
    if (response && response.UserAttributes && response.UserAttributes.length > 0) {
      console.log('🔍 User found in response');
      const userAttributes = extractUserAttributes(response.UserAttributes);
      console.log('🔍 Extracted user attributes:', userAttributes);
      
      const user = {
        id: userAttributes.id || '',
        email: userAttributes.email || '',
        name: userAttributes.name || '',
        role: userAttributes.role || 'user',
        emailVerified: userAttributes.emailVerified || false,
        status: response.UserStatus || 'UNKNOWN'
      };
      
      console.log('🔍 Returning user:', user);
      return user;
    } else {
      console.log('🔍 No UserAttributes in response');
    }
    
    console.log('🔍 No user found');
    return undefined;
  } catch (error) {
    console.error('🔍 Get user error:', error);
    return undefined;
  }
}

// Get user by access token
export async function getUserByToken(accessToken: string): Promise<CognitoUser | undefined> {
  try {
    const command = new GetUserCommand({
      AccessToken: accessToken,
    });

    const response = await client.send(command);
    
    if (response.UserAttributes) {
      const userAttributes = extractUserAttributes(response.UserAttributes);
      return {
        id: userAttributes.id || '',
        email: userAttributes.email || '',
        name: userAttributes.name || '',
        role: userAttributes.role || 'user',
        emailVerified: userAttributes.emailVerified || false,
        status: 'CONFIRMED' // If we can get user with token, they're confirmed
      };
    }
    
    return undefined;
  } catch (error) {
    console.error('Get user by token error:', error);
    return undefined;
  }
}

// Sign up new user
export async function signUp(email: string, password: string, name: string, role: 'admin' | 'user' = 'user'): Promise<AuthResult> {
  try {
    const command = new SignUpCommand({
      ClientId: CLIENT_ID,
      Username: email,
      Password: password,
      UserAttributes: [
        {
          Name: 'email',
          Value: email,
        },
        {
          Name: 'name',
          Value: name,
        },
        {
          Name: 'custom:role',
          Value: role,
        },
      ],
    });

    await client.send(command);
    
    return {
      success: true,
      error: 'Please check your email to confirm your account'
    };
  } catch (error: any) {
    console.error('Cognito sign up error:', error);
    
    if (error.name === 'UsernameExistsException') {
      return {
        success: false,
        error: 'User already exists'
      };
    } else if (error.name === 'InvalidPasswordException') {
      return {
        success: false,
        error: 'Password does not meet requirements'
      };
    } else {
      return {
        success: false,
        error: 'Registration failed'
      };
    }
  }
}

// Confirm sign up
export async function confirmSignUp(email: string, confirmationCode: string): Promise<AuthResult> {
  try {
    const command = new ConfirmSignUpCommand({
      ClientId: CLIENT_ID,
      Username: email,
      ConfirmationCode: confirmationCode,
    });

    await client.send(command);
    
    return {
      success: true
    };
  } catch (error: any) {
    console.error('Cognito confirm sign up error:', error);
    
    if (error.name === 'CodeMismatchException') {
      return {
        success: false,
        error: 'Invalid confirmation code'
      };
    } else if (error.name === 'ExpiredCodeException') {
      return {
        success: false,
        error: 'Confirmation code has expired'
      };
    } else {
      return {
        success: false,
        error: 'Confirmation failed'
      };
    }
  }
}

// Resend confirmation code
export async function resendConfirmationCode(email: string): Promise<AuthResult> {
  try {
    const command = new ResendConfirmationCodeCommand({
      ClientId: CLIENT_ID,
      Username: email,
    });

    await client.send(command);
    
    return {
      success: true,
      error: 'Verification code resent to your email'
    };
  } catch (error: any) {
    console.error('Cognito resend confirmation code error:', error);
    
    if (error.name === 'UserNotFoundException') {
      return {
        success: false,
        error: 'User not found'
      };
    } else if (error.name === 'InvalidParameterException') {
      return {
        success: false,
        error: 'User is already confirmed'
      };
    } else if (error.name === 'NotAuthorizedException') {
      return {
        success: false,
        error: 'Cannot resend codes. Please try again later.'
      };
    } else {
      return {
        success: false,
        error: `Failed to resend verification code: ${error.message || error.name}`
      };
    }
  }
}

// Forgot password
export async function forgotPassword(email: string): Promise<AuthResult> {
  try {
    const command = new ForgotPasswordCommand({
      ClientId: CLIENT_ID,
      Username: email,
    });

    await client.send(command);
    
    return {
      success: true,
      error: 'Password reset code sent to your email'
    };
  } catch (error: any) {
    console.error('Cognito forgot password error:', error);
    
    if (error.name === 'UserNotFoundException') {
      return {
        success: false,
        error: 'User not found'
      };
    } else {
      return {
        success: false,
        error: 'Password reset failed'
      };
    }
  }
}

// Confirm forgot password
export async function confirmForgotPassword(email: string, confirmationCode: string, newPassword: string): Promise<AuthResult> {
  try {
    const command = new ConfirmForgotPasswordCommand({
      ClientId: CLIENT_ID,
      Username: email,
      ConfirmationCode: confirmationCode,
      Password: newPassword,
    });

    await client.send(command);
    
    return {
      success: true
    };
  } catch (error: any) {
    console.error('Cognito confirm forgot password error:', error);
    
    if (error.name === 'CodeMismatchException') {
      return {
        success: false,
        error: 'Invalid confirmation code'
      };
    } else if (error.name === 'ExpiredCodeException') {
      return {
        success: false,
        error: 'Confirmation code has expired'
      };
    } else if (error.name === 'InvalidPasswordException') {
      return {
        success: false,
        error: 'Password does not meet requirements'
      };
    } else {
      return {
        success: false,
        error: 'Password reset failed'
      };
    }
  }
}

// Admin create user (for migration)
export async function adminCreateUser(email: string, name: string, role: 'admin' | 'user' = 'user'): Promise<AuthResult> {
  try {
    const command = new AdminCreateUserCommand({
      UserPoolId: USER_POOL_ID,
      Username: email,
      UserAttributes: [
        {
          Name: 'email',
          Value: email,
        },
        {
          Name: 'name',
          Value: name,
        },
        {
          Name: 'custom:role',
          Value: role,
        },
        {
          Name: 'email_verified',
          Value: 'true',
        },
      ],
      MessageAction: 'SUPPRESS', // Don't send welcome email
    });

    const response = await client.send(command);
    
    if (response.User) {
      return {
        success: true
      };
    } else {
      return {
        success: false,
        error: 'Failed to create user'
      };
    }
  } catch (error: any) {
    console.error('Cognito admin create user error:', error);
    
    if (error.name === 'UsernameExistsException') {
      return {
        success: false,
        error: 'User already exists'
      };
    } else {
      return {
        success: false,
        error: 'User creation failed'
      };
    }
  }
}

// Admin set user password (for migration)
export async function adminSetUserPassword(username: string, password: string, permanent: boolean = true): Promise<AuthResult> {
  try {
    const command = new AdminSetUserPasswordCommand({
      UserPoolId: USER_POOL_ID,
      Username: username,
      Password: password,
      Permanent: permanent,
    });

    await client.send(command);
    
    return {
      success: true
    };
  } catch (error: any) {
    console.error('Cognito admin set user password error:', error);
    
    if (error.name === 'UserNotFoundException') {
      return {
        success: false,
        error: 'User not found'
      };
    } else if (error.name === 'InvalidPasswordException') {
      return {
        success: false,
        error: 'Password does not meet requirements'
      };
    } else {
      return {
        success: false,
        error: 'Password setting failed'
      };
    }
  }
}
