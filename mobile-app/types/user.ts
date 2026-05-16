/**
 * LaBouffe — User Type Definitions
 */

export interface UserProfile {
  uid: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  avatarUrl?: string;
  role: 'customer' | 'admin';
  fcmTokens?: string[];
  createdAt: any; // Firestore Timestamp
}
