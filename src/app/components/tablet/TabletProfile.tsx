import { ProfilePage } from '../profile/ProfilePage';
import type { PageType, UserData } from '../../App';

interface TabletProfileProps {
  onNavigate: (page: PageType) => void;
  userData: UserData;
  onUpdateUser: (updates: Partial<UserData>) => void;
  onToggleNav: (hidden: boolean) => void;
}

export function TabletProfile({ onNavigate, userData, onUpdateUser, onToggleNav }: TabletProfileProps) {
  // Simply use the full ProfilePage component
  return <ProfilePage onNavigate={onNavigate} userData={userData} onUpdateUser={onUpdateUser} onToggleNav={onToggleNav} />;
}
