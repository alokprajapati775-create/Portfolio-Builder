// Auth Service — Google + Email/Password
// Handles popup with redirect fallback for mobile

import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  GoogleAuthProvider,
} from 'firebase/auth';
import { auth } from '../config/firebase';

const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');
googleProvider.setCustomParameters({ prompt: 'select_account' });

// ── Google Sign In ──
export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { success: true, user: result.user };
  } catch (popupError) {
    // Fallback to redirect on popup-blocked or mobile
    if (
      popupError.code === 'auth/popup-blocked' ||
      popupError.code === 'auth/popup-closed-by-user' ||
      popupError.code === 'auth/cancelled-popup-request'
    ) {
      try {
        await signInWithRedirect(auth, googleProvider);
        return { success: true, user: null }; // page redirects
      } catch (redirectError) {
        return { success: false, error: redirectError.message };
      }
    }
    return { success: false, error: popupError.message };
  }
}

// ── Handle redirect result (called on page load) ──
export async function handleRedirectResult() {
  try {
    const result = await getRedirectResult(auth);
    if (result?.user) return { success: true, user: result.user };
    return { success: false, user: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ── Email/Password Login ──
export async function loginUser(email, password) {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: result.user };
  } catch (error) {
    let msg = error.message;
    if (error.code === 'auth/invalid-credential') msg = 'Invalid email or password.';
    if (error.code === 'auth/user-not-found') msg = 'No account found with this email.';
    if (error.code === 'auth/wrong-password') msg = 'Incorrect password.';
    if (error.code === 'auth/too-many-requests') msg = 'Too many attempts. Try again later.';
    return { success: false, error: msg };
  }
}

// ── Email/Password Register ──
export async function registerUser(email, password, displayName) {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(result.user, { displayName });
    }
    return { success: true, user: result.user };
  } catch (error) {
    let msg = error.message;
    if (error.code === 'auth/email-already-in-use') msg = 'An account already exists with this email.';
    if (error.code === 'auth/weak-password') msg = 'Password should be at least 6 characters.';
    if (error.code === 'auth/invalid-email') msg = 'Please enter a valid email address.';
    return { success: false, error: msg };
  }
}

// ── Logout ──
export async function logoutUser() {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
