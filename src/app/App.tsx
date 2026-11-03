import React, { useState, useEffect } from "react";
import { Matchmaking } from "./components/matchmaking/Matchmaking";
import { Preferences } from "./components/matchmaking/Preferences";
import { ModulesDifficulty } from "./components/matchmaking/ModulesDifficulty";
import { ModeAvailability } from "./components/matchmaking/ModeAvailability";
import { AutoMatch } from "./components/matchmaking/AutoMatch";
import { MatchProfile } from "./components/matchmaking/MatchProfile";
import { SendRequest } from "./components/matchmaking/SendRequest";
import { MatchStatus } from "./components/matchmaking/MatchStatus";
import { RequestDetail } from "./components/matchmaking/RequestDetail";
import { Messages } from "./components/chat/Messages";
import { Chat } from "./components/chat/Chat";
import { ViewAllRequests } from "./components/matchmaking/ViewAllRequests";
import { Login } from "./components/Login";
import { StudySession } from "./components/study/StudySession";
import { SharedNotes } from "./components/chat/extensions/SharedNotes";
import { StudyPlanner } from "./components/chat/extensions/StudyPlanner";
import { AIChatbot } from "./components/home/AIChatbot";
import { NotificationsPanel } from "./components/home/NotificationsPanel";
import { SearchPanel } from "./components/home/SearchPanel";
import { FileUploadView } from "./components/home/FileUploadView";
import { SearchResultView } from "./components/home/SearchResultView";
import { CommunityEvents } from "./components/chat/extensions/CommunityEvents";
import { ProfilePage } from "./components/profile/ProfilePage";
import { CallView } from "./components/chat/CallView";
import { PIPCallView } from "./components/chat/PIPCallView";
import { CoSolveLobby } from "./components/study/CoSolveLobby";
import { PublicWorkspace } from "./components/study/PublicWorkspace";
import { PrivateWorkspace } from "./components/study/PrivateWorkspace";
import { Results } from "./components/study/Results";
import { ActivitySummary } from "./components/study/ActivitySummary";
import { SessionComplete } from "./components/study/SessionComplete";
import { SessionSummary } from "./components/study/SessionSummary";
import { SessionReflection } from "./components/study/SessionReflection";
import { ConsultationInstructor } from "./components/study/ConsultationInstructor";
import { ConsultationStudent } from "./components/study/ConsultationStudent";
import { ConsultationReflection } from "./components/study/ConsultationReflection";
import { ConsultationChatLog } from "./components/study/ConsultationChatLog";
import { BottomNav } from "./components/BottomNav";
import { Home } from "./components/home/Home";
import { ProgressTrackerPage } from "./components/home/ProgressTrackerPage";
import { CalendarPage } from "./components/home/CalendarPage";
import { EventDetails } from "./components/home/EventDetails";
import { EditEvent } from "./components/home/EditEvent";
import { EventComments } from "./components/home/EventComments";
import { TabletLayout } from "./components/tablet/TabletLayout";
import { TabletHome } from "./components/tablet/TabletHome";
import { TabletMatchmaking } from "./components/tablet/TabletMatchmaking";
import { TabletMessages } from "./components/tablet/TabletMessages";
import { TabletCalendar } from "./components/tablet/TabletCalendar";
import { TabletProfile } from "./components/tablet/TabletProfile";
import { TabletSettings } from "./components/tablet/TabletSettings";

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
  | "settings"
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
  status: 'Pending' | 'Done' | 'Rejected' | 'New' | 'Accepted' | 'Cancelled';
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
  languages: string[];
}

export const globalStudents: Student[] = [
  {
    name: "Sarah Lim",
    initials: "SL",
    year: 2,
    diploma: "DIT",
    modules: ["FOP2", "BED", "PDS","DEUI", "PCDS"],
    languages: ["english", "chinese"],
    online: true,
    preferredTime: "Morning",
    match: 94,
    avatar: "👩",
    location: "Library Level 5 & Online",
    about: "Hi! I'm looking for a serious study partner. I prefer morning sessions at the library (Level 5). I use Pomodoro (25/5 min cycles) for maximum focus.",
    goals: "Aiming for an A in FOP2 and improving consistency in BED. Looking for a dedicated partner for weekly reviews."
  },
  {
    name: "Marcus Tan",
    initials: "MT",
    year: 2,
    diploma: "DIT",
    modules: ["DF", "BED"],
    languages: ["english", "chinese"],
    online: false,
    preferredTime: "Morning",
    match: 85,
    avatar: "👨",
    location: "Library Level 2",
    about: "Frontend enthusiast and UI designer. I like discussing architecture and best practices.",
    goals: "Mastering React testing and improving performance optimization skills."
  },
  {
    name: "Emily Wong",
    initials: "EW",
    year: 1,
    diploma: "DIT",
    modules: ["FOP",],
    languages: ["english"],
    online: true,
    preferredTime: "Morning",
    match: 68,
    avatar: "👩‍💻",
    location: "Coffee Shop / Discord",
    about: "Struggling bit with recursion and logic. Looking for someone to explain concepts in simple terms.",
    goals: "Pass the mid-terms with confidence and build my first simple web app."
  },
  {
    name: "Chloe Lee",
    initials: "CL",
    year: 1,
    diploma: "DIT",
    modules: ["FOP", "FED",],
    languages: ["english"],
    online: true,
    preferredTime: "Afternoon",
    match: 60,
    avatar: "🙋‍♀️",
    location: "School Hub",
    about: "Love data science! I enjoy visualizing datasets and finding trends.",
    goals: "Learn Python for data analysis and get comfortable with SQL."
  },
  {
    name: "Daniel Ng",
    initials: "DN",
    year: 2,
    diploma: "DIT",
    modules: ["DF", "BED", "FOP2"],
    languages: ["chinese"],
    online: false,
    preferredTime: "Afternoon",
    match: 75,
    avatar: "🧑",
    location: "Study Lounge Level 4",
    about: "Focused on cybersecurity and forensics. I enjoy CTF challenges.",
    goals: "Understand fundamental forensics techniques and improve my report writing."
  },
  {
    name: "Alicia Goh",
    initials: "AG",
    year: 2,
    diploma: "DIT",
    modules: ["PDS", "DEUI"],
    languages: ["english"],
    online: true,
    preferredTime: "Evening",
    match: 82,
    avatar: "👩‍🔬",
    location: "Online",
    about: "Loves data visualization and UI design. Mixing creativity with tech.",
    goals: "Complete the PDS project with a focus on high-fidelity dashboard design."
  },
  {
    name: "Jason Lim",
    initials: "JL",
    year: 3,
    diploma: "DIT",
    modules: ["BED", "FYP", "DF", "PDS", "DEUI", "PCDS"],
    languages: ["english", "malay"],
    online: false,
    preferredTime: "Morning",
    match: 88,
    avatar: "👨‍🔧",
    location: "Library",
    about: "Final year student focused on backend infrastructure and API design.",
    goals: "Bridge the gap between simple CRUD systems and scalable architectures."
  },
  {
    name: "Kimberly",
    initials: "K",
    year: 1,
    diploma: "DIT",
    modules: ["FED"],
    languages: ["english"],
    online: true,
    preferredTime: "Afternoon",
    match: 72,
    avatar: "👩‍🎨",
    location: "Library",
    about: "Always sketching and coding. I like making things look good and work well.",
    goals: "Solidify my understanding of JavaScript fundamentals for FOP2."
  },
  {
    name: "Aiden Koh",
    initials: "AK",
    year: 2,
    diploma: "DIT",
    modules: ["FOP2", "BED", "DF"],
    languages: ["english", "malay"],
    online: true,
    preferredTime: "Evening",
    match: 92,
    avatar: "🧟‍♂️",
    location: "Library",
    about: "Obsessed with BED assignments. I study best when things get technical.",
    goals: "Implement a fully secure auth system for my assignments."
  },
  {
    name: "Ryan Ong",
    initials: "RO",
    year: 1,
    diploma: "DIT",
    modules: ["FOP", "FED"],
    languages: ["english", "chinese"],
    online: true,
    preferredTime: "Morning",
    match: 65,
    avatar: "🧛‍♂️",
    location: "Online",
    about: "Starting out in data science. I enjoy working through logic puzzles.",
    goals: "Master basic statistics and how to apply them to coding projects."
  },
  {
    name: "Vanessa Cong",
    initials: "VC",
    year: 2,
    diploma: "DIT",
    modules: ["DF", "PDS", "DEUI", "PCDS"],
    languages: ["chinese"],
    online: false,
    preferredTime: "Afternoon",
    match: 78,
    avatar: "🧜‍♀️",
    location: "Library Level 6",
    about: "Critical thinker and problem solver. Digital forensics is my passion.",
    goals: "Improve my evidence analysis speed and accuracy."
  },
  {
    name: "Michelle Tan",
    initials: "MT",
    year: 2,
    diploma: "DIT",
    modules: ["DF", "DEUI"],
    languages: ["english", "malay"],
    online: true,
    preferredTime: "Evening",
    match: 81,
    avatar: "🧚‍♀️",
    location: "Library Level 6",
    about: "Supportive study partner. I find that explaining things helps me learn them better.",
    goals: "Ace the DF weekly reviews and build a strong revision folder."
  },
  {
    name: "Zara Teo",
    initials: "ZT",
    year: 1,
    diploma: "DIT",
    modules: ["FOP"],
    languages: ["english", "tamil"],
    online: false,
    preferredTime: "Evening",
    match: 64,
    avatar: "🦸‍♀️",
    location: "Common Study Area",
    about: "Beginner coder looking to build strong foundations in Python and Java.",
    goals: "Get a B+ or higher in FOP and start a side project."
  }
];

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
  unlockedBadges: Array<{name: string, dateEarned: string}>;
  matches: Array<{name: string, emoji: string}>;
  year: number;
  hasCompletedQuiz: boolean;
  darkMode: boolean;
}

export interface CalendarEvent {
  id: string;
  date: string;
  status: string;
  booking: string;
  name: string;
  topic: string;
  location: string;
  isoDate: string; // Internal machine readable format
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

export default function App() {
  const [currentPage, setCurrentPage] =
    useState<PageType>("login");
  const [selectedRequest, setSelectedRequest] =
    useState<any>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [matchmakingTab, setMatchmakingTab] = useState<"browse" | "requests">("browse");
  const [isBottomNavHidden, setIsBottomNavHidden] = useState(false);
  const [toast, setToast] = useState<{message: string, visible: boolean}>({ message: "", visible: false });
  const [isTablet, setIsTablet] = useState(false);
  
  // Call state for PIP functionality
  const [activeCall, setActiveCall] = useState<{chat: any, type: 'voice' | 'video'} | null>(null);
  const [isCallMinimized, setIsCallMinimized] = useState(true);

  // Use the wider navigation layout on tablets and desktop screens.
  useEffect(() => {
    const checkScreenSize = () => {
      setIsTablet(window.innerWidth >= 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
  };

  const [sessionState, setSessionState] = useState<AppState>({
    currentPage: 'home',
    isSessionActive: true,
    sessionDuration: 1940,
    focusDuration: 1520,
    breakDuration: 420,
    userStatus: 'focus',
    members: [
      { id: '1', name: 'Alex', avatar: '👨', status: 'focus', statusTimer: 1034 },
      { id: '2', name: 'Sam', avatar: '🧑', status: 'need-help', statusTimer: 1334 },
      { id: '3', name: 'Sarah', avatar: '👩', status: 'focus', statusTimer: 450 },
    ],
    selectedMembers: ['1', '2', '3'],
    currentQuestion: 0,
    userAnswers: {},
    workingInPublic: true,
    workMode: 'text',
    showConsultationReflectionPrompt: false,
  });

  // Matchmaking State
  const [sentRequests, setSentRequests] = useState<MatchmakingRequest[]>([
    {
      id: "req1",
      name: "Marcus Tan",
      module: "FOP2 Study Session",
      message: "Hey, I'm looking for a study partner for FOP2.",
      time: "17 January 2026, 2:00 PM",
      location: "Library Level 5",
      status: "Pending",
      category: 'sent',
    },
    {
      id: "req2",
      name: "Daniel Ng",
      module: "DF Revision",
      message: "Hey, I'm looking for a study partner for DF.",
      time: "16 January 2026, 11:00 AM",
      location: "Study Lounge Level 4",
      status: "Pending",
      category: 'sent',
    },
    {
      id: "req3",
      name: "Alicia Goh",
      module: "PDS Project Planning",
      message: "Hey, I'm looking for a study partner for PDS Project Planning.",
      time: "10 January 2026, 4:00 PM",
      location: "Online",
      status: "Accepted",
      category: 'sent',
    },
    {
      id: "req4",
      name: "Jason Lim",
      module: "BED Lab Catch-up",
      message: "Hey, I'm looking for a study partner for BED Lab Catch-up.",
      time: "9 January 2026, 1:00 PM",
      location: "Library",
      status: "Accepted",
      category: 'sent',
    },
    {
      id: "req5",
      name: "Kimberly",
      module: "FOP2 Lab 4",
      message: "Hey, I'm looking for a study partner for FOP2 Lab 4.",
      time: "7 January 2026, 1:00 PM",
      location: "Library",
      status: "Cancelled",
      category: 'sent',
    },
  ]);

  const [receivedRequests, setReceivedRequests] = useState<MatchmakingRequest[]>([
    {
      id: "rec1",
      name: "Aiden Koh",
      module: "BED Assignment Help",
      message: "Hey, I saw you're also doing BED. Want to revise together?",
      time: "20 January 2026, 5:10 PM",
      status: "New",
      location: "Library",
      category: 'received',
    },
    {
      id: "rec2",
      name: "Chloe Lee",
      module: "FOP2 Lab Prep",
      message: "Need a partner for tomorrow's practice.",
      time: "18 January 2026, 8:45 PM",
      status: "New",
      location: "Study Lounge Level 4",
      category: 'received',
    },
    {
      id: "rec3",
      name: "Ryan Ong",
      module: "PDS Quiz Revision",
      message: "Are you free this weekend to go through past quizzes?",
      time: "10 January 2026, 2:30 PM",
      status: "Accepted",
      location: "Online",
      category: 'received',
    },
    {
      id: "rec5",
      name: "Vanessa Cong",
      module: "DF Weekly Review",
      message: "Want to go through DF weekly review together?",
      time: "9 January 2026, 4.30 PM",
      status: "Accepted",
      location: "Library Level 6",
      category: 'received',
    },
    {
      id: "rec4",
      name: "Michelle Tan",
      module: "DF Weekly Review",
      message: "Following up on my previous request 😊",
      time: "5 January 2026, 4.30 PM",
      status: "Rejected",
      location: "Library Level 6",
      category: 'received',
    },
  ]);

  const [matchPreferences, setMatchPreferences] = useState<MatchPreferences>({
    selectedModules: ["FOP2", "BED"],
    scheduleSet: true,
    autoMatchEnabled: true,
    availabilityDays: "weekdays", 
    availabilityDaysArray: ["weekdays"],
    selectedModes: ["online", "on-campus"],
    selectedTimes: ["afternoon", "evening"],
    startTime: "6:00 PM",
    endTime: "10:00 PM",
    matchRate: "daily",
    style: "discussion",
    language: "English",
    duration: 60,
    priority: 50,
    genderPref: "any",
    partnerLevel: "same",
    additionalDetails: "",
  });

  const [userData, setUserData] = useState<UserData>({
    name: "James Chow",
    profilePicture: null,
    profileText: "Diploma in IT student looking for focused revision partners for programming and backend modules.",
    addedFriends: [{ name: 'Sarah Johnson', emoji: '👩' }],
    isAccountPrivate: false,
    pushNotifications: true,
    emailNotifications: false,
    autoSave: true,
    selectedBadges: [],
    unlockedBadges: [
      { name: '5 Hours', dateEarned: '2025-12-01' },
      { name: 'Active User', dateEarned: '2025-12-01' },
      { name: 'Good Matchmaker', dateEarned: '2025-12-01' }
    ],
    matches: [
      { name: 'Low Hui Min', emoji: '🤗' },
      { name: 'Heddy Satria', emoji: '🥳' },
      { name: 'Janston Tay', emoji: '😇' },
      { name: 'Tristan Chow', emoji: '😌' },
      { name: 'Azim Thottiyil', emoji: '🤩' }
    ],
    year: 2,
    hasCompletedQuiz: true,
    darkMode: false
  });

  const [sharedNotes, setSharedNotes] = useState([
    { id: 1, type: 'folder', name: 'Biology Notes', count: 2, files: [
      { id: 101, type: 'file', name: 'Cell Structure.pdf', size: '956 KB', parentId: 1 },
      { id: 102, type: 'file', name: 'DNA Notes.docx', size: '564 KB', parentId: 1 }
    ]},
    { id: 2, type: 'folder', name: 'Math Homework', count: 1, files: [
      { id: 201, type: 'file', name: 'Algebra Problems.pdf', size: '1.2 MB', parentId: 2 }
    ]},
    { id: 3, type: 'file', name: 'CS 101 Project.pdf', size: '2.4 MB' },
    { id: 4, type: 'file', name: 'Study Guide.docx', size: '1.1 MB' },
    { id: 5, type: 'file', name: 'Lab Report.pdf', size: '856 KB' },
  ]);

  const [communityEvents, setCommunityEvents] = useState([
    {
      id: 1,
      title: 'Study Group Session',
      description: 'Group study session for upcoming midterms.',
      date: 'Thu, 22 Jan',
      time: '2:00 PM',
      location: 'Library Room 204',
      organizer: 'Sarah Johnson',
      participants: 12,
      isParticipating: false
    },
    {
      id: 2,
      title: 'Career Fair',
      description: 'Meet potential employers and learn about internship opportunities.',
      date: 'Sun, 25 Jan',
      time: '10:00 AM',
      location: 'Student Center',
      organizer: 'Career Services',
      participants: 156,
      isParticipating: true
    },
    {
      id: 3,
      title: 'Game Night',
      description: 'Join us for board games, video games, and fun!',
      date: 'Wed, 28 Jan',
      time: '7:00 PM',
      location: 'Recreation Hall',
      organizer: 'Student Activities',
      participants: 45,
      isParticipating: false
    }
  ]);

  const [studySessions, setStudySessions] = useState<any[]>([
    {
      id: 101,
      time: "2:00 PM - 4:00 PM",
      date: "Sat, Jan 24",
      isoDate: "2026-01-24",
      location: "Online",
      partners: ["Sarah Lim"],
      partnerName: "Sarah Lim",
      topic: "FOP2 Array Revision"
    }
  ]);

  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([
    { id: '1', date: 'Fri, Nov 7', isoDate: '2025-11-07', status: 'Confirmed', booking: '5:00 PM', name: 'Marcus Tan', topic: 'FOP Assignment', location: 'Library' }, // 5:00 PM = 17:00
    { id: '2', date: 'Sat, Nov 22', isoDate: '2025-11-22', status: 'Confirmed', booking: '9:00 AM', name: 'Daniel Ng', topic: 'Data Structures', location: 'Library' },
    { id: '3', date: 'Sun, Nov 30', isoDate: '2025-11-30', status: 'Confirmed', booking: '2:00 PM', name: 'Sarah Lim', topic: 'Web Dev', location: 'Coffee Shop' },
  ]);

  // Notifications State
  const [notifications, setNotifications] = useState(() => {
    const newNotifs = [];
    
    // 1. Map Cancelled Sent Requests
    sentRequests.filter(r => r.status === 'Cancelled').forEach(req => {
      newNotifs.push({
        id: `notif-${req.id}`,
        title: 'BOOKING CANCELLED',
        date: req.time,
        person: req.name,
        type: 'error',
        color: 'bg-rose-50 text-rose-600 border-rose-100',
        isRead: false,
        navTarget: 'request-detail',
        // navData: { 
        //     id: req.id, 
        //     date: req.time.split(',')[0], 
        //     status: 'Cancelled', 
        //     booking: req.time.split(',')[1]?.trim(), 
        //     name: req.name, 
        //     topic: req.module, 
        //     location: req.location || 'Library' 
        // } as CalendarEvent
        navData: req
      });
    });

    // 2. Map Done/Confirmed Requests (Sent & Received) -> Success
    [...sentRequests, ...receivedRequests].filter(r => r.status === 'Accepted').forEach(req => {
       newNotifs.push({
        id: `notif-${req.id}`,
        title: 'BOOKING ACCEPTED',
        date: req.time,
        person: req.name,
        type: 'success',
        color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        isRead: true, // Assume done ones are read for now, or false if specific logic
        navTarget: 'event-details',
        navData: { 
            id: req.id, 
            date: req.time.split(',')[0], 
            status: 'Accepted', 
            booking: req.time.split(',')[1]?.trim(), 
            name: req.name, 
            topic: req.module, 
            location: req.location || 'Online' 
        } as CalendarEvent
      });
    });

    // 3. Map New Received Requests -> Info
    receivedRequests.filter(r => r.status === 'New').forEach(req => {
      newNotifs.push({
        id: `notif-${req.id}`,
        title: 'NEW REQUEST',
        message: req.message || `New request from ${req.name}`,
        person: req.name,
        type: 'info',
        color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
        isRead: false,
        navTarget: 'request-detail', // New requests go to detail view, not event details yet
        navData: req
      });
    });

    return newNotifs.sort((a,b) => (a.isRead === b.isRead ? 0 : a.isRead ? 1 : -1));
  });


  const hasUnreadNotifications = notifications.some(n => !n.isRead);

  const [chats, setChats] = useState<ChatConversation[]>([
    { id: 1, name: 'Sarah Lim', lastMessage: 'See you at the library later!', time: '10:38 AM', unread: 2, type: 'friend', messages: [
      { id: 1, text: 'Hey! How are you?', isMe: false, time: '10:30 AM' },
      { id: 2, text: "I'm good! Just finished the assignment. How about you?", isMe: true, time: '10:32 AM' },
      { id: 3, text: 'Nice! I am still working on it. Mind if I ask you a few questions?', isMe: false, time: '10:33 AM' },
      { id: 4, text: 'Of course! Happy to help', isMe: true, time: '10:35 AM' },
      { id: 5, text: 'Thanks!', isMe: false, time: '10:38 AM' },
      { id: 6, text: 'See you at the library later!', isMe: false, time: '10:38 AM' },
    ]},
    { id: 2, name: 'Marcus Tan', lastMessage: 'Thanks for the notes', time: '1h ago', unread: 0, type: 'friend', messages: [
      { id: 1, text: 'You have the notes?', isMe: false, time: '10:30 AM' },
      { id: 2, text: "Yes, here they are", isMe: true, time: '10:32 AM' },
      { id: 3, text: 'Thanks for the notes!', isMe: false, time: '10:33 AM' }
    ]},
    { id: 5, name: 'CS 101 Study Group', lastMessage: 'Jason Lim: I also need help with chapter 5', time: '10:36 AM', unread: 6, type: 'group', members: ['You', 'Jason Lim', 'Sarah Lim', 'Marcus Tan'], messages: [
        { id: 1, text: 'Hey everyone! Ready for tomorrow exam?', isMe: false, time: '10:30 AM', sender: 'Jason Lim' },
        { id: 2, text: "I'm still reviewing chapter 5, it's pretty complex", isMe: true, time: '10:32 AM' },
        { id: 3, text: 'Anyone can help me with chapter 5?', isMe: true, time: '10:33 AM' },
        { id: 4, text: 'What problems do you have?', isMe: false, time: '10:34 AM', sender: 'Sarah Lim' },
        { id: 5, text: 'I don\'t understand arrays and linked lists', isMe: true, time: '10:35 AM' },
        { id: 6, text: 'I also need help with chapter 5', isMe: false, time: '10:36 AM', sender: 'Jason Lim' },
    ]},
    { id: 8, name: 'Freshman 2025', lastMessage: 'Welcome to the community!', time: '09:42 AM', unread: 12, type: 'community', memberCount: 234, messages: [
        { id: 1, text: `Welcome to Freshman 2024! This is a space for all members to connect and share updates.`, isMe: false, time: '09:30 AM', sender: 'Admin', isAnnouncement: true },
        { id: 2, text: `Hi everyone!`, isMe: false, time: '09:32 AM', sender: 'John' },
        { id: 3, text: `Nice to meet you all!`, isMe: false, time: '09:33 AM', sender: 'John' },
        { id: 4, text: `Hi, I'm Mike!`, isMe: false, time: '09:34 AM', sender: 'Mike' },
        { id: 5, text: `Hey, I'm Emma!`, isMe: false, time: '09:35 AM', sender: 'Emma' },
        { id: 6, text: `Hi guys!`, isMe: false, time: '09:36 AM', sender: 'John' },
        { id: 7, text: `I hope you all have a great semester!`, isMe: false, time: '09:37 AM', sender: 'John' },
        { id: 8, text: `So happy to be here!`, isMe: false, time: '09:38 AM', sender: 'John' },
        { id: 9, text: `Can't wait to make new friends!`, isMe: false, time: '09:39 AM', sender: 'Mike' },
        { id: 10, text: `I'm excited to meet new people!`, isMe: false, time: '09:40 AM', sender: 'Emma' },
        { id: 11, text: `Hi there!`, isMe: false, time: '09:41 AM', sender: 'Sarah' },
        { id: 12, text: `Welcome to the community!`, isMe: false, time: '09:42 AM', sender: 'John' },

    ]},
  ]);

  const addSentRequest = (request: Omit<MatchmakingRequest, 'id' | 'status'>) => {
    const newRequest: MatchmakingRequest = {
      ...request,
      id: `req-${Date.now()}`,
      status: 'Pending',
      category: 'sent',
    };
    setSentRequests((prev: MatchmakingRequest[]) => [newRequest, ...prev]);
    setNotifications((prev: any[]) => [
      {
        id: `notif-${newRequest.id}`,
        title: 'REQUEST SENT',
        message: `Study request sent to ${newRequest.name}`,
        date: newRequest.time,
        person: newRequest.name,
        type: 'info',
        color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
        isRead: false,
        navTarget: 'request-detail',
        navData: newRequest
      },
      ...prev
    ]);
  };

  const requestToCalendarEvent = (req: MatchmakingRequest): CalendarEvent | null => {
    const cleanDateStr = req.time.replace(',', '').replace(/(\d)\.(\d{2})\s*(AM|PM)/i, '$1:$2 $3');
    const dateObj = new Date(cleanDateStr);

    if (Number.isNaN(dateObj.getTime())) return null;

    return {
      id: `evt-${req.id}`,
      date: dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      isoDate: dateObj.toISOString().split('T')[0],
      status: 'Confirmed',
      booking: req.time.split(',')[1]?.trim() || 'TBD',
      name: req.name,
      topic: req.module,
      location: req.location || 'Online'
    };
  };

  const updateRequestStatus = (id: string, category: 'sent' | 'received', newStatus: MatchmakingRequest['status']) => {
    const req = category === 'sent' ? sentRequests.find(r => r.id === id) : receivedRequests.find(r => r.id === id);

    if (category === 'sent') {
      setSentRequests((prev: MatchmakingRequest[]) => prev.map((req: MatchmakingRequest) => {
        if (req.id === id) return { ...req, status: newStatus };
        return req;
      }));
    } else {
      setReceivedRequests((prev: MatchmakingRequest[]) => prev.map((req: MatchmakingRequest) => {
        if (req.id === id) return { ...req, status: newStatus };
        return req;
      }));
    }

    if (req) {
      const updatedReq = { ...req, status: newStatus };
      const notificationCopy: Record<MatchmakingRequest['status'], { title: string; color: string; type: string }> = {
        Pending: { title: 'REQUEST PENDING', color: 'bg-amber-50 text-amber-600 border-amber-100', type: 'info' },
        New: { title: 'NEW REQUEST', color: 'bg-indigo-50 text-indigo-600 border-indigo-100', type: 'info' },
        Accepted: { title: 'BOOKING ACCEPTED', color: 'bg-emerald-50 text-emerald-600 border-emerald-100', type: 'success' },
        Done: { title: 'BOOKING ACCEPTED', color: 'bg-emerald-50 text-emerald-600 border-emerald-100', type: 'success' },
        Rejected: { title: 'REQUEST DECLINED', color: 'bg-rose-50 text-rose-600 border-rose-100', type: 'error' },
        Cancelled: { title: 'REQUEST CANCELLED', color: 'bg-rose-50 text-rose-600 border-rose-100', type: 'error' },
      };
      const notification = notificationCopy[newStatus];

      setNotifications((prev: any[]) => [
        {
          id: `notif-${id}-${newStatus}-${Date.now()}`,
          title: notification.title,
          message: `${req.name}: ${req.module}`,
          date: req.time,
          person: req.name,
          type: notification.type,
          color: notification.color,
          isRead: newStatus === 'Accepted' || newStatus === 'Done',
          navTarget: newStatus === 'Accepted' ? 'event-details' : 'request-detail',
          navData: newStatus === 'Accepted' ? requestToCalendarEvent(updatedReq) || updatedReq : updatedReq
        },
        ...prev
      ]);
    }

    // Handle side effects for Accepted requests
    if (newStatus === 'Accepted') {
        if (req) {
             // 1. Add to Matches if not already present
            setUserData(prev => {
                const alreadyMatched = prev.matches.some(m => m.name === req.name);
                if (!alreadyMatched) {
                    const student = globalStudents.find(s => s.name === req.name);
                    return {
                        ...prev,
                        matches: [...prev.matches, { name: req.name, emoji: student?.avatar || '👤' }]
                    };
                }
                return prev;
            });

            // 2. Create/Enable Chat
            setChats(prev => {
                const existingChat = prev.find(c => c.name === req.name);
                if (!existingChat) {
                    const newChat: ChatConversation = {
                        id: Date.now(),
                        name: req.name,
                        lastMessage: "Request Accepted! Start chatting.",
                        time: "Just now",
                        unread: 0,
                        type: 'friend',
                        messages: [
                          {
                            id: `accepted-${req.id}`,
                            text: `Your ${req.module} session is confirmed for ${req.time}.`,
                            isMe: false,
                            time: "Just now",
                            sender: req.name
                          }
                        ]
                    };
                    return [newChat, ...prev];
                }
                return prev;
            });

            // 3. Add to Calendar
            try {
                const newEvent = requestToCalendarEvent(req);
                if (newEvent) {
                    const timeStr = newEvent.booking;

                    setCalendarEvents(prev => {
                        // Avoid duplicates
                        const exists = prev.some(e => e.isoDate === newEvent.isoDate && e.booking === timeStr && e.name === req.name);
                        if (exists) return prev;
                        return [...prev, newEvent];
                    });

                    // 4. Auto-create Study Session
                    setStudySessions(prev => {
                        const exists = prev.some(s => s.partnerName === req.name && s.date === newEvent.date);
                        if (exists) return prev;

                        return [{
                            id: Date.now(),
                            time: timeStr,
                            date: newEvent.date,
                            location: req.location,
                            partners: [req.name],
                            partnerName: req.name,
                            topic: req.module,
                            isoDate: newEvent.isoDate
                        }, ...prev];
                    });
                }
            } catch (e) {
                console.error("Failed to parse date for calendar", e);
            }
        }
    }
  };

  const updateUserData = (updates: Partial<UserData>) => {
    setUserData((prev: UserData) => ({ ...prev, ...updates }));
  };

  const updateCalendarEvent = (id: string, updates: Partial<CalendarEvent>) => {
    setCalendarEvents((prev: CalendarEvent[]) => prev.map((e: CalendarEvent) => e.id === id ? { ...e, ...updates } : e));
  };

  const deleteCalendarEvent = (id: string) => {
    setCalendarEvents((prev: CalendarEvent[]) => prev.filter((e: CalendarEvent) => e.id !== id));
  };

  const totalUnreadMessages = chats.reduce((acc, chat) => acc + (chat.unread || 0), 0);

  const addChatMessage = (chatId: number | string, message: Omit<ChatMessage, 'id'>) => {
    setChats((prev: ChatConversation[]) => prev.map((c: ChatConversation) => {
        if (c.id === chatId) {
            const newMessage: ChatMessage = { ...message, id: Date.now() };
            return {
                ...c,
                messages: [...c.messages, newMessage],
                lastMessage: message.text,
                time: message.time,
                unread: 0
            };
        }
        return c;
    }));
  };

  const createGroupChat = (name: string) => {
    const newGroup: ChatConversation = {
      id: Date.now(),
      name,
      lastMessage: 'You created this group',
      time: 'Just now',
      unread: 0,
      type: 'group',
      members: ['You'],
      messages: []
    };
    setChats((prev: ChatConversation[]) => [newGroup, ...prev]);
  };

  // Timer countdown
  useEffect(() => {
    if (!sessionState.isSessionActive) return;

    const interval = setInterval(() => {
      setSessionState((prev: AppState) => {
        const nextSessionDuration = prev.sessionDuration + 1;
        const phase = nextSessionDuration % 90;
        const nextUserStatus: UserStatus = phase < 62 ? 'focus' : 'break';

        return {
          ...prev,
          userStatus: nextUserStatus,
          sessionDuration: nextSessionDuration,
          focusDuration: nextUserStatus === 'focus' ? prev.focusDuration + 1 : prev.focusDuration,
          breakDuration: nextUserStatus === 'break' ? prev.breakDuration + 1 : prev.breakDuration,
          members: prev.members.map((m: Member, index: number) => {
            const memberPhase = (nextSessionDuration + index * 23) % 120;
            const nextStatus: UserStatus =
              memberPhase < 70 ? 'focus' : memberPhase < 98 ? 'break' : 'need-help';

            return {
              ...m,
              status: nextStatus,
              statusTimer: nextStatus === m.status ? m.statusTimer + 1 : 1,
            };
          })
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionState.isSessionActive]);

  function onNavigate(nextPage: PageType, data?: any) {
    if (data) {
      if (nextPage === 'search-result' && typeof data === 'string') {
        setSearchQuery(data);
      } else if (nextPage === 'chat') {
        // Clear unread count when entering chat
        const chatId = data.id;
        setChats(prev => prev.map(c => c.id === chatId ? { ...c, unread: 0 } : c));
        setSelectedRequest(data);
      } else if ((nextPage === 'event-details' || nextPage === 'edit-event' || nextPage === 'event-comments') && data) {
        setSelectedRequest(data);
      } else if (nextPage === 'matchmaking' && (data === 'browse' || data === 'requests')) {
        setMatchmakingTab(data);
      } else if (nextPage === 'call') {
        // Start a call with PIP
        setActiveCall({
          chat: data?.chat || data,
          type: data?.type || 'voice'
        });
        setIsCallMinimized(true);
        // Navigate away from call page (call continues in PIP)
        return;
      } else {
        setSelectedRequest(data);
      }
    }
    
    // Regular navigation for non-call pages
    if (nextPage !== 'call') {
      setCurrentPage(nextPage);
    }

    // Hide bottom nav for specific pages
    const pagesWithoutNav: PageType[] = [
      'preferences', 'modules-difficulty', 'mode-availability', 'auto-match', 
      'request-detail', 'match-profile', 'send-request', 'login'
    ];
    setIsBottomNavHidden(pagesWithoutNav.includes(nextPage));

    if (nextPage === 'study-session') {
      setSessionState((prev: AppState) => ({ ...prev, isSessionActive: true, currentPage: nextPage }));
    } else {
      setSessionState((prev: AppState) => ({ ...prev, currentPage: nextPage }));
    }
  }

  const updateSessionState = (updates: Partial<AppState>) => {
    setSessionState((prev: AppState) => ({ ...prev, ...updates }));
  };

  const renderPage = () => {
    // Tablet-optimized pages
    if (isTablet) {
      switch (currentPage) {
        case "login":
          return <Login onNavigate={onNavigate} />;
        case "home":
          return (
            <TabletHome
              onNavigate={onNavigate}
              events={calendarEvents}
              hasUnread={hasUnreadNotifications}
              userName={userData.name.split(' ')[0]}
              darkMode={userData.darkMode}
            />
          );
        case "matchmaking":
          return (
            <TabletMatchmaking
              onNavigate={onNavigate}
              sentRequests={sentRequests}
              receivedRequests={receivedRequests}
              onUpdateStatus={updateRequestStatus}
              defaultTab={matchmakingTab}
              userData={userData}
              matchPreferences={matchPreferences}
              students={globalStudents}
              darkMode={userData.darkMode}
            />
          );
        case "modules-difficulty":
          return (
            <ModulesDifficulty 
              onNavigate={onNavigate} 
              preferences={matchPreferences}
              setPreferences={setMatchPreferences}
              showToast={showToast}
            />
          );
        case "mode-availability":
          return (
            <ModeAvailability 
              onNavigate={onNavigate} 
              preferences={matchPreferences}
              setPreferences={setMatchPreferences}
              showToast={showToast}
            />
          );
        case "auto-match":
          return (
            <AutoMatch 
              onNavigate={onNavigate} 
              preferences={matchPreferences}
              setPreferences={setMatchPreferences}
              showToast={showToast}
            />
          );
        case "match-profile":
          return (
            <MatchProfile 
              onNavigate={onNavigate} 
              student={selectedRequest} 
              sentRequests={sentRequests}
              receivedRequests={receivedRequests}
            />
          );
        case "send-request":
          return (
            <SendRequest 
              onNavigate={onNavigate} 
              recipient={selectedRequest} 
              onSendRequest={addSentRequest}
            />
          );
        case "match-status":
          return (
            <MatchStatus 
              onNavigate={onNavigate} 
              sentRequests={sentRequests}
              receivedRequests={receivedRequests}
              onUpdateStatus={updateRequestStatus}
            />
          );
        case "request-detail":
          return (
            <RequestDetail
              onNavigate={onNavigate}
              request={selectedRequest}
              onUpdateStatus={updateRequestStatus}
            />
          );
        case "view-all-requests":
          return (
            <ViewAllRequests 
              onNavigate={onNavigate} 
              sentRequests={sentRequests}
              receivedRequests={receivedRequests}
              onUpdateStatus={updateRequestStatus}
              defaultTab={selectedRequest === 'pending' || selectedRequest === 'incoming' ? selectedRequest : "incoming"}
            />
          );
        case "preferences":
          // Preferences page shows the Preferences component in tablet view
          return (
            <TabletLayout
              currentPage={currentPage}
              onNavigate={onNavigate}
              hasUnreadMessages={totalUnreadMessages > 0}
              hasUnreadNotifications={hasUnreadNotifications}
              unreadCount={totalUnreadMessages}
              userName={userData.name}
              darkMode={userData.darkMode}
            >
              <Preferences 
                onNavigate={onNavigate} 
                preferences={matchPreferences}
                setPreferences={setMatchPreferences}
              />
            </TabletLayout>
          );
        case "messages":
        case "chat":
          // Messages and chat both use split view
          return (
            <TabletMessages
              onNavigate={onNavigate}
              chats={chats}
              onAddMessage={addChatMessage}
              onCreateGroup={createGroupChat}
              darkMode={userData.darkMode}
            />
          );
        case "calendar-page":
        case "event-details":
        case "edit-event":
        case "event-comments":
          // Calendar pages use tablet calendar view
          return (
            <TabletCalendar
              onNavigate={onNavigate}
              events={calendarEvents}
              onUpdateEvent={updateCalendarEvent}
              onDeleteEvent={deleteCalendarEvent}
              darkMode={userData.darkMode}
            />
          );
        case "profile":
          return (
            <TabletProfile
              onNavigate={onNavigate}
              userData={userData}
              onUpdateUser={updateUserData}
              onToggleNav={setIsBottomNavHidden}
            />
          );
        case "settings":
          return (
            <TabletSettings
              onNavigate={onNavigate}
              userData={userData}
              onUpdateUser={updateUserData}
            />
          );
        default:
          // For other pages, fall through to mobile version
          break;
      }
    }

    // Mobile version (original)
    switch (currentPage) {
      case "login":
        return <Login onNavigate={onNavigate} />;
      case "home":
        return <Home onNavigate={onNavigate} events={calendarEvents} hasUnread={hasUnreadNotifications} darkMode={userData.darkMode} />;
      case "matchmaking":
        return (
          <Matchmaking 
            onNavigate={onNavigate} 
            sentRequests={sentRequests}
            receivedRequests={receivedRequests}
            onUpdateStatus={updateRequestStatus}
            defaultTab={matchmakingTab}
            matchPreferences={matchPreferences}
            userData={userData}
          />
        );
      case "search":
        return (
          <SearchResultView 
            onNavigate={onNavigate} 
            searchQuery={searchQuery}
          />
        );
      case "preferences":
        return (
          <Preferences 
            onNavigate={onNavigate} 
            preferences={matchPreferences}
            setPreferences={setMatchPreferences}
          />
        );
      case "modules-difficulty":
        return (
          <ModulesDifficulty 
            onNavigate={onNavigate} 
            preferences={matchPreferences}
            setPreferences={setMatchPreferences}
            showToast={showToast}
          />
        );
      case "mode-availability":
        return (
          <ModeAvailability 
            onNavigate={onNavigate} 
            preferences={matchPreferences}
            setPreferences={setMatchPreferences}
            showToast={showToast}
          />
        );
      case "auto-match":
        return (
          <AutoMatch 
            onNavigate={onNavigate} 
            preferences={matchPreferences}
            setPreferences={setMatchPreferences}
            showToast={showToast}
          />
        );
      case "match-profile":
        return (
          <MatchProfile 
            onNavigate={onNavigate} 
            student={selectedRequest} 
            sentRequests={sentRequests}
            receivedRequests={receivedRequests}
          />
        );
      case "send-request":
        return (
          <SendRequest 
            onNavigate={onNavigate} 
            recipient={selectedRequest} 
            onSendRequest={addSentRequest}
          />
        );
      case "match-status":
        return (
          <MatchStatus 
            onNavigate={onNavigate} 
            sentRequests={sentRequests}
            receivedRequests={receivedRequests}
            onUpdateStatus={updateRequestStatus}
          />
        );
      case "request-detail":
        return (
          <RequestDetail
            onNavigate={onNavigate}
            request={selectedRequest}
            onUpdateStatus={updateRequestStatus}
          />
        );
      case "messages":
        return <Messages onNavigate={onNavigate} conversations={chats} onCreateGroup={createGroupChat} />;
      case "chat":
        return <Chat onNavigate={onNavigate} chat={selectedRequest} chats={chats} onSendMessage={addChatMessage} onUpdateSharedNotes={setSharedNotes} />;
      case "view-all-requests":
        return (
          <ViewAllRequests 
            onNavigate={onNavigate} 
            sentRequests={sentRequests}
            receivedRequests={receivedRequests}
            onUpdateStatus={updateRequestStatus}
            defaultTab={selectedRequest === 'pending' || selectedRequest === 'incoming' ? selectedRequest : "incoming"}
          />
        );
      case "study-session":
        return <StudySession onNavigate={onNavigate} state={sessionState} updateState={updateSessionState} darkMode={userData.darkMode} />;
      case "shared-notes":
        return <SharedNotes onNavigate={onNavigate} chat={selectedRequest} items={sharedNotes} setItems={setSharedNotes} />;
            case "study-planner":
        return (
            <StudyPlanner 
                onNavigate={onNavigate} 
                sessions={studySessions} 
                setSessions={(newSessions) => {
                    setStudySessions(newSessions);
                    // Sync new sessions to calendar
                    // Assuming the latest added session is the first one
                    if (newSessions.length > studySessions.length) {
                        const newSession = newSessions[0];
                        // Use isoDate (YYYY-MM-DD) input directly to avoid timezone quirks
                        if (newSession.isoDate) {
                             const isoDate = newSession.isoDate;
                             const formattedDate = newSession.date;

                             const newEvent: CalendarEvent = {
                                id: `evt-${newSession.id}`,
                                date: formattedDate,
                                isoDate: isoDate,
                                status: 'Confirmed',
                                booking: newSession.time.split(' - ')[0] || newSession.time,
                                name: newSession.partnerName || newSession.partners[0] || 'Study', 
                                topic: newSession.topic || 'Study Session',
                                location: newSession.location
                            };
                            setCalendarEvents(prev => [...prev, newEvent]);
                        }
                    }
                }} 
                chat={selectedRequest} // Pass the chat context
            />
        );
      case "community-events":
        return <CommunityEvents onNavigate={onNavigate} events={communityEvents} setEvents={setCommunityEvents} />;
      case "co-solve-lobby":
        return <CoSolveLobby state={sessionState} updateState={updateSessionState} onNavigate={onNavigate} />;
      case "public-workspace":
        return <PublicWorkspace state={sessionState} updateState={updateSessionState} onNavigate={onNavigate} />;
      case "private-workspace":
        return <PrivateWorkspace state={sessionState} updateState={updateSessionState} onNavigate={onNavigate} />;
      case "results":
        return <Results state={sessionState} updateState={updateSessionState} onNavigate={onNavigate} />;
      case "activity-summary":
        return <ActivitySummary state={sessionState} updateState={updateSessionState} onNavigate={onNavigate} />;
      case "session-complete":
        return <SessionComplete state={sessionState} updateState={updateSessionState} onNavigate={onNavigate} />;
      case "session-summary":
        return <SessionSummary onNavigate={onNavigate} />;
      case "session-reflection":
        return <SessionReflection onNavigate={onNavigate} />;
      case "consultation-instructor":
        return <ConsultationInstructor state={sessionState} updateState={updateSessionState} onNavigate={onNavigate} />;
      case "consultation-student":
        return <ConsultationStudent state={sessionState} updateState={updateSessionState} onNavigate={onNavigate} />;
      case "consultation-reflection":
        return <ConsultationReflection onNavigate={onNavigate} />;
      case "consultation-chat-log":
        return <ConsultationChatLog onNavigate={onNavigate} />;
      case "notifications":
        return <NotificationsPanel onNavigate={onNavigate} notifications={notifications} setNotifications={setNotifications} onSendMessage={addChatMessage} darkMode={userData.darkMode} />;
      case "ai-chatbot":
        return <AIChatbot onNavigate={onNavigate} onSendMessage={addChatMessage} />;
      case "progress-tracker":
        return <ProgressTrackerPage onNavigate={onNavigate} darkMode={userData.darkMode} />;
      case "calendar-page":
        return <CalendarPage onNavigate={onNavigate} events={calendarEvents} darkMode={userData.darkMode} />;
      case "search-overlay":
        return <SearchPanel onNavigate={onNavigate} />;
      case "upload-audio":
        return <FileUploadView onNavigate={onNavigate} type="audio" />;
      case "upload-document":
        return <FileUploadView onNavigate={onNavigate} type="document" />;
      case "upload-video":
        return <FileUploadView onNavigate={onNavigate} type="video" />;
      case "search-result":
        return <SearchResultView onNavigate={onNavigate} searchQuery={searchQuery} />;
      case "event-details":
        return <EventDetails onNavigate={onNavigate} event={selectedRequest} onCancelEvent={deleteCalendarEvent} />;
      case "edit-event":
        return <EditEvent onNavigate={onNavigate} event={selectedRequest} onUpdateEvent={updateCalendarEvent} />;
      case "event-comments":
        return <EventComments onNavigate={onNavigate} event={selectedRequest} />;
      case "profile":
        return <ProfilePage onNavigate={onNavigate} userData={userData} onUpdateUser={updateUserData} onToggleNav={setIsBottomNavHidden} />;
      case "call":
        return (
          <CallView 
            chat={selectedRequest?.chat || selectedRequest} 
            type={selectedRequest?.type || 'voice'} 
            onEndCall={() => {
              onNavigate('chat', selectedRequest?.chat || selectedRequest);
            }} 
          />
        );
      default:
        return <Home onNavigate={onNavigate} events={calendarEvents} hasUnread={hasUnreadNotifications} darkMode={userData.darkMode} />;
    }
  };

  return (
    <div className="h-dvh min-h-[100svh] w-full overflow-hidden bg-white">
      <div className="h-full w-full overflow-hidden relative">
          {currentPage === 'login' ? (
            <Login onNavigate={onNavigate} />
          ) : isTablet ? (
            <TabletLayout
              currentPage={currentPage}
              onNavigate={onNavigate}
              hasUnreadMessages={totalUnreadMessages > 0}
              hasUnreadNotifications={hasUnreadNotifications}
              unreadCount={totalUnreadMessages}
              userName={userData.name}
              darkMode={userData.darkMode}
            >
              {renderPage()}
              
              {/* Global Toast Notification */}
              {toast.visible && (
                <div className="fixed top-8 left-0 right-0 z-[1000] flex justify-center pointer-events-none px-4 animate-in slide-in-from-top-4 duration-500">
                  <div className="bg-slate-900/95 text-white px-5 py-2 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.2)] border border-white/10 flex items-center gap-2.5 backdrop-blur-xl">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                    <span className="text-[11px] font-bold tracking-wide">{toast.message}</span>
                  </div>
                </div>
              )}
            </TabletLayout>
          ) : (
            <div className="max-w-md mx-auto bg-white h-full min-h-0 shadow-[0_0_50px_rgba(0,0,0,0.03)] relative flex flex-col overflow-hidden">
              <div className={`min-h-0 flex-1 overflow-y-auto overscroll-y-contain ${
                currentPage !== 'login' && 
                currentPage !== 'chat' && 
                currentPage !== 'call' && 
                currentPage !== 'public-workspace' && 
                currentPage !== 'private-workspace' && 
                currentPage !== 'consultation-student' && 
                currentPage !== 'consultation-instructor' && 
                currentPage !== 'search-overlay' &&
                currentPage !== 'shared-notes' &&
                currentPage !== 'study-planner' &&
                currentPage !== 'community-events' &&
                currentPage !== 'ai-chatbot' &&
                currentPage !== 'search-result' &&
                currentPage !== 'calendar-page' &&
                currentPage !== 'edit-event' &&
                currentPage !== 'event-comments' &&
                currentPage !== 'event-details' &&
                currentPage !== 'progress-tracker' &&
                !currentPage.startsWith('upload-') 
                  ? 'pb-24' 
                  : ''
              }`}>
                {renderPage()}
              </div>

              {currentPage === 'notifications' && (
                <div className="absolute inset-0 z-[60]">
                  <NotificationsPanel onNavigate={onNavigate} notifications={notifications} setNotifications={setNotifications} darkMode={userData.darkMode} />
                </div>
              )}

              {/* Global Toast Notification */}
              {toast.visible && (
                <div className="fixed top-8 left-0 right-0 z-[1000] flex justify-center pointer-events-none px-4 animate-in slide-in-from-top-4 duration-500">
                  <div className="bg-slate-900/95 text-white px-5 py-2 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.2)] border border-white/10 flex items-center gap-2.5 backdrop-blur-xl">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                    <span className="text-[11px] font-bold tracking-wide">{toast.message}</span>
                  </div>
                </div>
              )}
              
              {/* Global Navigation */}
              {currentPage !== 'login' && 
               currentPage !== 'chat' && 
               currentPage !== 'call' && 
               currentPage !== 'public-workspace' && 
               currentPage !== 'private-workspace' && 
               currentPage !== 'consultation-student' && 
               currentPage !== 'consultation-instructor' && 
               currentPage !== 'search-overlay' &&
               currentPage !== 'shared-notes' &&
               currentPage !== 'study-planner' &&
               currentPage !== 'community-events' &&
               currentPage !== 'ai-chatbot' &&
               currentPage !== 'search-result' &&
               currentPage !== 'calendar-page' &&
               currentPage !== 'edit-event' &&
               currentPage !== 'event-comments' &&
               currentPage !== 'event-details' &&
               currentPage !== 'progress-tracker' &&
               !currentPage.startsWith('upload-') && 
               !isBottomNavHidden && (
                <BottomNav 
                  currentPage={currentPage} 
                  onNavigate={onNavigate} 
                  unreadMessages={totalUnreadMessages} 
                />
              )}
            </div>
          )}
          
          {/* PIP Call View - Renders as overlay when call is active */}
          {activeCall && (
            <PIPCallView
              chat={activeCall.chat}
              type={activeCall.type}
              isMinimized={isCallMinimized}
              onToggleMinimize={() => setIsCallMinimized(!isCallMinimized)}
              onEndCall={() => {
                setActiveCall(null);
                setIsCallMinimized(true);
              }}
            />
          )}
      </div>
    </div>
  );
}
