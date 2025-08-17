import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const DEFAULT_ADMIN = {
  email: 'admin@example.com',
  password: 'Admin@123', // In production, this should be set via environment variables
  displayName: 'Admin User',
  role: 'admin'
};

export const setupDefaultAdmin = async () => {
  try {
    // Check if admin already exists in Auth
    const adminEmail = DEFAULT_ADMIN.email;
    
    // Check if admin user exists in Firestore
    const userDoc = await getDoc(doc(db, 'users', adminEmail));
    
    if (!userDoc.exists()) {
      // Create auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        DEFAULT_ADMIN.email,
        DEFAULT_ADMIN.password
      );

      // Update profile with display name
      await updateProfile(userCredential.user, {
        displayName: DEFAULT_ADMIN.displayName
      });

      // Create user document in Firestore
      const userData = {
        uid: userCredential.user.uid,
        email: DEFAULT_ADMIN.email,
        displayName: DEFAULT_ADMIN.displayName,
        role: DEFAULT_ADMIN.role,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };

      await setDoc(doc(db, 'users', userCredential.user.uid), userData);
      
      console.log('Default admin user created successfully!');
      return { success: true, user: userData };
    } else {
      console.log('Admin user already exists');
      return { success: true, message: 'Admin user already exists' };
    }
  } catch (error) {
    console.error('Error setting up admin user:', error);
    return { success: false, error: error.message };
  }
};

// Run the setup when this module is imported
// setupDefaultAdmin().catch(console.error);
