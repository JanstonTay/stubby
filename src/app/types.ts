export type PageType =
  | "home"
  | "matchmaking"
  | "search"
  | "preferences"
  | "modules-difficulty"
  | "mode-availability"
  | "auto-match"
  | "match-profile"
  | "send-request"
  | "match-status"
  | "request-detail"
  | "messages"
  | "chat"
  | "view-all-requests"
  | "login"
  | "study-session"
  | "ai-chatbot"
  | "notifications"
  | "search-overlay"
  | "upload-audio"
  | "upload-document"
  | "upload-video"
  | "search-result"
  | "profile"
  | "call"
  | "co-solve-lobby"
  | "public-workspace"
  | "private-workspace"
  | "results"
  | "activity-summary"
  | "session-complete"
  | "session-summary"
  | "session-reflection"
  | "consultation-instructor"
  | "consultation-student"
  | "consultation-reflection"
  | "consultation-chat"
  | "progress-tracker"
  | "calendar-page"
  | "event-details"
  | "edit-event"
  | "event-comments"
  | "shared-notes"
  | "study-planner"
  | "community-events"
  | "consultation-chat-log";

export type UserStatus = 'focus' | 'break' | 'need-help';

export interface Member {
  id: string;
  name: string;
  avatar: string;
  status: UserStatus;
  statusTimer: number;
}

export interface AppState {
  currentPage: PageType;
  isSessionActive: boolean;
  sessionDuration: number;
  focusDuration: number;
  breakDuration: number;
  userStatus: UserStatus;
  members: Member[];
  selectedMembers: string[];
  currentQuestion: number;
  userAnswers: Record<number, string>;
  workingInPublic: boolean;
  workMode: 'text' | 'whiteboard';
  showConsultationReflectionPrompt: boolean;
}

export interface MatchmakingRequest {
  id: string;
  name: string;
  module: string;
  time: string;
  location: string;
  status: 'Pending' | 'Done' | 'Rejected' | 'New' | 'Accepted';
  message?: string;
  category: 'sent' | 'received';
  type?: 'one-on-one' | 'group';
}

export interface Student {
  name: string;
  initials: string;
  year: number;
  diploma: string;
  modules: string[];
  online: boolean;
  preferredTime: string;
  match: number;
  avatar: string;
  location: string;
  about: string;
  goals: string;
}

export interface MatchPreferences {
  selectedModules: string[];
  scheduleSet: boolean;
  autoMatchEnabled: boolean;
  availabilityDays: string;
  availabilityDaysArray: string[];
  selectedModes: string[];
  selectedTimes: string[];
  startTime: string;
  endTime: string;
  matchRate: string;
  style: string;
  language: string;
  duration: number;
  priority: number;
  genderPref: string;
  partnerLevel: string;
  additionalDetails: string;
}

export interface UserData {
  name: string;
  profilePicture: string | null;
  profileText: string;
  addedFriends: Array<{name: string, emoji: string}>;
  isAccountPrivate: boolean;
  pushNotifications: boolean;
  emailNotifications: boolean;
  autoSave: boolean;
  selectedBadges: string[];
  unlockedBadges: string[];
  matches: Array<{name: string, emoji: string}>;
}

export interface CalendarEvent {
  id: string;
  date: string;
  status: string;
  booking: string;
  name: string;
  topic: string;
  location: string;
  isoDate: string;
}

export interface ChatMessage {
  id: number | string;
  text: string;
  isMe: boolean;
  time: string;
  sender?: string;
  isAnnouncement?: boolean;
}

export interface ChatConversation {
  id: number | string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  type: 'friend' | 'group' | 'community';
  members?: string[];
  memberCount?: number;
  messages: ChatMessage[];
}
