import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole, RolePermissions } from '../types';

export const ROLE_PERMISSIONS_MAP: Record<UserRole, RolePermissions> = {
  Administrator: {
    canRunAI: true,
    canEditOfficerNotes: true,
    canRunPredictions: true,
    canExportPDF: true,
    canManageUsers: true,
    canViewGraphNetwork: true,
    canViewAnalytics: true,
    canSearchFIRs: true,
  },
  Investigator: {
    canRunAI: true,
    canEditOfficerNotes: true,
    canRunPredictions: true,
    canExportPDF: true,
    canManageUsers: false,
    canViewGraphNetwork: true,
    canViewAnalytics: true,
    canSearchFIRs: true,
  },
  'Police Officer': {
    canRunAI: false,
    canEditOfficerNotes: true,
    canRunPredictions: false,
    canExportPDF: true,
    canManageUsers: false,
    canViewGraphNetwork: true,
    canViewAnalytics: true,
    canSearchFIRs: true,
  },
  Viewer: {
    canRunAI: false,
    canEditOfficerNotes: false,
    canRunPredictions: false,
    canExportPDF: false,
    canManageUsers: false,
    canViewGraphNetwork: false,
    canViewAnalytics: true,
    canSearchFIRs: true,
  },
};

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'usr-1',
    name: 'Insp. R. Naik',
    email: 'investigator@scrb.gov.in',
    badgeNumber: 'SCRB-108',
    role: 'Investigator',
    district: 'Mysuru Crime Division',
    department: 'Special Crime Branch',
    lastLogin: 'Today, 09:12 AM',
  },
  {
    id: 'usr-2',
    name: 'Director S. Kumar',
    email: 'admin@scrb.gov.in',
    badgeNumber: 'SCRB-001',
    role: 'Administrator',
    district: 'Karnataka SCRB HQ',
    department: 'State Crime Records Bureau',
    lastLogin: 'Today, 08:30 AM',
  },
  {
    id: 'usr-3',
    name: 'Constable M. Gowda',
    email: 'officer@scrb.gov.in',
    badgeNumber: 'KA-04-332',
    role: 'Police Officer',
    district: 'Whitefield Division',
    department: 'Patrol & First Response',
    lastLogin: 'Yesterday, 06:45 PM',
  },
  {
    id: 'usr-4',
    name: 'Civilian Public Observer',
    email: 'viewer@scrb.gov.in',
    badgeNumber: 'PUBLIC-901',
    role: 'Viewer',
    district: 'Bengaluru District',
    department: 'Public Transparency Portal',
    lastLogin: 'Today, 07:15 AM',
  },
];

interface AuthContextType {
  user: UserProfile;
  usersList: UserProfile[];
  permissions: RolePermissions;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  login: (email: string, pass: string) => boolean;
  register: (data: { name: string; email: string; badgeNumber: string; role: UserRole; district: string }) => void;
  switchUserRole: (role: UserRole) => void;
  switchUserAccount: (userId: string) => void;
  logout: () => void;
  addUserByAdmin: (user: UserProfile) => void;
  deleteUserByAdmin: (userId: string) => void;
  updateUserRoleByAdmin: (userId: string, newRole: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usersList, setUsersList] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('scrb_users_list');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('scrb_current_user');
    if (saved) return JSON.parse(saved);
    return usersList[0] || INITIAL_USERS[0];
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('scrb_users_list', JSON.stringify(usersList));
  }, [usersList]);

  useEffect(() => {
    localStorage.setItem('scrb_current_user', JSON.stringify(user));
  }, [user]);

  const permissions = ROLE_PERMISSIONS_MAP[user.role];

  const login = (email: string, _pass: string): boolean => {
    const found = usersList.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      const updated = { ...found, lastLogin: 'Just now' };
      setUser(updated);
      setIsAuthModalOpen(false);
      return true;
    }
    return false;
  };

  const register = (data: { name: string; email: string; badgeNumber: string; role: UserRole; district: string }) => {
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: data.name,
      email: data.email,
      badgeNumber: data.badgeNumber || `SCRB-${Math.floor(100 + Math.random() * 900)}`,
      role: data.role,
      district: data.district || 'Karnataka State',
      department: 'Crime Response Division',
      lastLogin: 'Just registered',
    };
    setUsersList(prev => [...prev, newUser]);
    setUser(newUser);
    setIsAuthModalOpen(false);
  };

  const switchUserRole = (newRole: UserRole) => {
    const updatedUser = { ...user, role: newRole };
    setUser(updatedUser);
    setUsersList(prev => prev.map(u => u.id === user.id ? updatedUser : u));
  };

  const switchUserAccount = (userId: string) => {
    const target = usersList.find(u => u.id === userId);
    if (target) {
      setUser(target);
    }
  };

  const logout = () => {
    setUser(INITIAL_USERS[3]); // Fall back to Viewer mode
  };

  const addUserByAdmin = (newUser: UserProfile) => {
    setUsersList(prev => [...prev, newUser]);
  };

  const deleteUserByAdmin = (userId: string) => {
    setUsersList(prev => prev.filter(u => u.id !== userId));
  };

  const updateUserRoleByAdmin = (userId: string, newRole: UserRole) => {
    setUsersList(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    if (user.id === userId) {
      setUser(prev => ({ ...prev, role: newRole }));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        usersList,
        permissions,
        isAuthModalOpen,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
        login,
        register,
        switchUserRole,
        switchUserAccount,
        logout,
        addUserByAdmin,
        deleteUserByAdmin,
        updateUserRoleByAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
