# AWS Cognito Integration Setup

This document explains how to set up AWS Cognito for authentication in the AWS Learning Platform.

## Overview

We're migrating from a custom DynamoDB-based authentication system to AWS Cognito for better security, user management, and AWS integration. The existing users and their progress data will remain in DynamoDB, while authentication will be handled by Cognito.

## Benefits of Using Cognito

- **Security**: Built-in security features, password policies, and MFA support
- **Scalability**: Managed service that scales automatically
- **Integration**: Seamless integration with other AWS services
- **User Management**: Built-in user management and admin features
- **Compliance**: Helps with security compliance requirements

## Setup Steps

### 1. Create Cognito User Pool and App Client

Run the setup script to create the Cognito resources:

```bash
node scripts/setup-cognito.js
```

This script will:
- Create a User Pool with appropriate settings
- Create an App Client for web authentication
- Create an admin user for testing
- Generate environment variables
- Save configuration to `cognito-config.json`

### 2. Configure Environment Variables

Add the following environment variables to your `.env.local` file:

```env
COGNITO_USER_POOL_ID=us-east-1_xxxxxxxxx
COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 3. Migrate Existing Users

Run the migration script to move existing users to Cognito:

```bash
node scripts/migrate-users-to-cognito.js
```

This script will:
- Scan your DynamoDB users table
- Create corresponding users in Cognito
- Set temporary passwords for each user
- Generate a detailed migration report

### 4. Update Application Configuration

The application has been updated to use Cognito authentication. Key changes include:

- **Login API**: Now uses Cognito authentication with fallback to legacy DynamoDB
- **Registration API**: Uses Cognito user registration
- **Password Reset**: Uses Cognito password reset functionality
- **Session Management**: Uses Cognito tokens with DynamoDB progress data

## Authentication Flow

### New User Registration
1. User registers with email, password, and name
2. Cognito creates user account (unconfirmed)
3. User receives confirmation email
4. User confirms email address
5. User can now log in

### User Login
1. User provides email and password
2. Application tries Cognito authentication first
3. If user not found in Cognito, tries legacy DynamoDB authentication
4. On success, creates session with Cognito user data
5. Fetches user progress from DynamoDB
6. Returns combined user data

### Password Reset
1. User requests password reset
2. Cognito sends reset code to user's email
3. User enters reset code and new password
4. Cognito updates password
5. User can log in with new password

## User Data Structure

### Cognito User Attributes
- `sub`: Unique user ID
- `email`: User's email address
- `name`: User's display name
- `custom:role`: User role (admin/user)
- `email_verified`: Email verification status

### DynamoDB Progress Data
- `completedTutorials`: Array of completed tutorials
- `quizScores`: Quiz scores and results
- `totalTimeSpent`: Total learning time
- `lastActivity`: Last activity timestamp
- `learningStreak`: Current learning streak
- `achievements`: User achievements
- `recentActivity`: Recent activity log

## Migration Strategy

### Phase 1: Dual Authentication (Current)
- New users register through Cognito
- Existing users can log in through either Cognito or legacy system
- All user progress remains in DynamoDB

### Phase 2: Full Cognito Migration
- All users migrated to Cognito
- Legacy authentication disabled
- DynamoDB used only for progress data

### Phase 3: Optional - Progress Migration
- Consider moving progress data to Cognito user attributes
- Or keep in DynamoDB for better querying capabilities

## Security Considerations

### Password Policy
- Minimum 8 characters
- Must contain uppercase, lowercase, number, and special character
- Enforced by Cognito

### Session Management
- Cognito access tokens (1 day expiry)
- HTTP-only cookies for session storage
- Secure cookie settings in production

### User Verification
- Email verification required for new users
- Admin can verify users manually
- Password reset requires email confirmation

## Testing

### Admin User
After running the setup script, you can test with:
- Email: `admin@awslearning.com`
- Password: `Admin123!`

### Migration Testing
1. Run migration script
2. Check migration results file
3. Test login with migrated users
4. Verify progress data is preserved

## Troubleshooting

### Common Issues

1. **User not found in Cognito**
   - Check if user was migrated successfully
   - Verify email address is correct
   - Check migration results file

2. **Password reset not working**
   - Verify email is confirmed in Cognito
   - Check email delivery settings
   - Ensure reset code is entered correctly

3. **Session issues**
   - Clear browser cookies
   - Check token expiration
   - Verify environment variables

### Debug Mode
Enable debug logging by setting:
```env
DEBUG_COGNITO=true
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Password Management
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Confirm password reset

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `COGNITO_USER_POOL_ID` | Cognito User Pool ID | Yes |
| `COGNITO_CLIENT_ID` | Cognito App Client ID | Yes |
| `DEBUG_COGNITO` | Enable debug logging | No |

## Next Steps

1. **Production Deployment**
   - Update callback URLs for production domain
   - Configure email settings for production
   - Set up monitoring and alerts

2. **Advanced Features**
   - Enable MFA for additional security
   - Configure social login providers
   - Set up user groups and permissions

3. **Monitoring**
   - Monitor authentication metrics
   - Set up CloudWatch alarms
   - Track user engagement

## Support

For issues with Cognito setup or migration:
1. Check the migration results file
2. Review CloudWatch logs
3. Verify environment variables
4. Test with admin user first
