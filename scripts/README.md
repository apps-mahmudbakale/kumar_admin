# Admin Setup Script

This directory contains scripts for setting up and managing admin users in the Firebase application.

## Setup Admin User

To create a default admin user, follow these steps:

1. Install the required dependencies:
   ```bash
   npm install firebase firebase-admin
   ```

2. Update the Firebase configuration in `setupAdmin.js` with your Firebase project details.

3. Run the setup script:
   ```bash
   node scripts/setupAdmin.js
   ```

4. The script will create a default admin user with the following credentials:
   - Email: admin@example.com
   - Password: Admin@123

5. After first login, it's highly recommended to change the password.

## Security Notes

- Never commit your Firebase configuration with real API keys to version control.
- In production, use environment variables for sensitive information.
- The default password should be changed immediately after first login.
- Consider implementing email verification for admin accounts.

## Troubleshooting

- If you get permission errors, make sure your Firebase project's authentication and Firestore rules allow user creation.
- Check the Firebase Console for any error logs if the script fails.
- Make sure the email address isn't already registered in your Firebase Authentication.
