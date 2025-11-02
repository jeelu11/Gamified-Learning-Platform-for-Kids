import { auth } from '@/config/firebase';
import { firebaseAuth, firestoreService } from '@/config/firebase';
import { User } from '@/types/auth';

export class FirebaseAuthenticationService {
  async signInWithGoogle(): Promise<User> {
    try {
      const firebaseUser = await firebaseAuth.signInWithGoogle();

      // Create user data for our system
      const userData: Partial<User> = {
        _id: firebaseUser.uid,
        email: firebaseUser.email!,
        username: firebaseUser.displayName?.replace(/\s+/g, '_').toLowerCase() || firebaseUser.email!.split('@')[0],
        profile: {
          firstName: firebaseUser.displayName?.split(' ')[0] || 'User',
          lastName: firebaseUser.displayName?.split(' ').slice(1).join(' ') || 'Name',
          avatar: '👤',
        },
        settings: {
          notifications: true,
          soundEnabled: true,
          theme: 'light',
          language: 'en'
        },
        subscription: {
          type: 'free',
          status: 'active'
        },
        isActive: true,
        emailVerified: firebaseUser.emailVerified || true,
        lastLogin: new Date(),
        createdAt: new Date(firebaseUser.metadata.creationTime),
        updatedAt: new Date()
      };

      // Save to Firestore
      await firestoreService.saveUser(firebaseUser.uid, userData);

      // Save to MongoDB via API
      await this.syncUserToBackend(userData as User);

      return userData as User;
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  }

  async signInWithEmail(email: string, password: string): Promise<User> {
    try {
      const firebaseUser = await firebaseAuth.signInWithEmail(email, password);

      // Get user data from Firestore or create minimal user object
      let userData = await firestoreService.getUser(firebaseUser.uid);

      if (!userData) {
        userData = {
          _id: firebaseUser.uid,
          email: firebaseUser.email!,
          username: email.split('@')[0],
          profile: {
            firstName: 'User',
            lastName: 'Name',
            avatar: '👤',
          },
          settings: {
            notifications: true,
            soundEnabled: true,
            theme: 'light',
            language: 'en'
          },
          subscription: {
            type: 'free',
            status: 'active'
          },
          isActive: true,
          emailVerified: firebaseUser.emailVerified,
          lastLogin: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        };
      } else {
        userData.lastLogin = new Date();
        userData.updatedAt = new Date();
      }

      // Update Firestore
      await firestoreService.updateUser(firebaseUser.uid, userData);

      // Sync to MongoDB
      await this.syncUserToBackend(userData as User);

      return userData as User;
    } catch (error) {
      console.error('Email sign-in error:', error);
      throw error;
    }
  }

  async signUpWithEmail(email: string, password: string, userData: Partial<User>): Promise<User> {
    try {
      const firebaseUser = await firebaseAuth.signUpWithEmail(email, password);

      const completeUserData: User = {
        _id: firebaseUser.uid,
        email: email,
        username: userData.username || email.split('@')[0],
        role: userData.role || 'student',
        profile: {
          firstName: userData.profile?.firstName || 'User',
          lastName: userData.profile?.lastName || 'Name',
          avatar: userData.profile?.avatar || '👤',
          age: userData.profile?.age,
          grade: userData.profile?.grade,
          school: userData.profile?.school,
          bio: userData.profile?.bio
        },
        settings: userData.settings || {
          notifications: true,
          soundEnabled: true,
          theme: 'light',
          language: 'en'
        },
        subscription: userData.subscription || {
          type: 'free',
          status: 'active'
        },
        parentCode: userData.parentCode,
        linkedParents: userData.linkedParents || [],
        linkedChildren: userData.linkedChildren || [],
        classroom: userData.classroom,
        isActive: true,
        emailVerified: firebaseUser.emailVerified,
        lastLogin: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Save to Firestore
      await firestoreService.saveUser(firebaseUser.uid, completeUserData);

      // Save to MongoDB
      await this.syncUserToBackend(completeUserData);

      return completeUserData;
    } catch (error) {
      console.error('Email sign-up error:', error);
      throw error;
    }
  }

  async resetPassword(email: string): Promise<void> {
    try {
      await firebaseAuth.resetPassword(email);
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      await firebaseAuth.signOut();
      // Clear any local storage
      localStorage.removeItem('firebaseUser');
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) return null;

      const userData = await firestoreService.getUser(firebaseUser.uid);
      return userData as User || null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  private async syncUserToBackend(userData: User): Promise<void> {
    try {
      // Sync user data to MongoDB backend
      const response = await fetch('/api/v1/auth/sync-firebase-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userData }),
      });

      if (!response.ok) {
        console.warn('Failed to sync user to backend:', await response.text());
      }
    } catch (error) {
      console.warn('Backend sync error:', error);
      // Don't throw error, user can still use Firebase auth
    }
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userData = await firestoreService.getUser(firebaseUser.uid);
          callback(userData as User);
        } catch (error) {
          console.error('Auth state change error:', error);
          callback(null);
        }
      } else {
        callback(null);
      }
    });
  }
}

export const firebaseAuthService = new FirebaseAuthenticationService();