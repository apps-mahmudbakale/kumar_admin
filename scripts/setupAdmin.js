const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword, updateProfile } = require('firebase/auth');
const { getFirestore, doc, setDoc, getDoc } = require('firebase/firestore');

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const DEFAULT_ADMIN = {
  email: 'admin@example.com',
  password: 'Admin@123', // In production, this should be set via environment variables
  displayName: 'Admin User',
  role: 'admin'
};

async function setupDefaultAdmin() {
  try {
    console.log('Starting admin setup...');
    
    // Check if admin already exists in Firestore
    const adminEmail = DEFAULT_ADMIN.email;
    const userDoc = await getDoc(doc(db, 'users', adminEmail));
    
    if (!userDoc.exists()) {
      console.log('Creating new admin user...');
      
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
        lastLogin: new Date().toISOString(),
        emailVerified: false
      };

      await setDoc(doc(db, 'users', userCredential.user.uid), userData);
      
      console.log('✅ Default admin user created successfully!');
      console.log('Email:', DEFAULT_ADMIN.email);
      console.log('Password:', DEFAULT_ADMIN.password);
      console.log('IMPORTANT: Change this password after first login!');
      
      // Force token refresh to ensure auth state is updated
      await userCredential.user.getIdToken(true);
      
      return { success: true, user: userData };
    } else {
      console.log('ℹ️ Admin user already exists');
      return { success: true, message: 'Admin user already exists' };
    }
  } catch (error) {
    console.error('❌ Error setting up admin user:', error);
    return { 
      success: false, 
      error: error.message,
      code: error.code
    };
  } finally {
    // Exit the process when done
    process.exit(0);
  }
}

// Run the setup
setupDefaultAdmin().catch(console.error);
