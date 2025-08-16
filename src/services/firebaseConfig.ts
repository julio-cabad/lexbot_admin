import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDlFA17bhyfEIVfI25GESN4Ka5bk5UDBv8",
  authDomain: "lexbot-1f68e.firebaseapp.com",
  projectId: "lexbot-1f68e",
  storageBucket: "lexbot-1f68e.firebasestorage.app",
  messagingSenderId: "190723675941",
  appId: "1:190723675941:web:9caafb58b7f4e7473daccc",
  measurementId: "G-912LDZRSFM"
};

// Firebase configuration is now hardcoded for production
// For development, you can still use environment variables if needed

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);


// Set auth language
auth.languageCode = 'es';

// Initialize Analytics (optional)
export const analytics = getAnalytics(app);

export default app;