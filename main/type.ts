
export type ConversationType = {
  keyPosition?: number;
  id: string;
  name?: string;
  isArchived: boolean;
  activeAt?: number;
  timestamp: number;
  lastMessage?: {
    status: 'error' | 'sending' | 'sent' | 'delivered' | 'read';
    text: string;
  };
  activeUserNumberList: Array<string>;
  atPersons?: string;
  phoneNumber: string;
  type: 'direct' | 'group';
  isMe: boolean;
  lastUpdated: number;
  unreadCount: number;
  isSelected: boolean;
  isTyping: boolean;
  signature?: string;
  timeZone?: string;
  email?: string;
  directoryUser?: boolean;
  isStick?: boolean;
  members?: Array<string>;
  notificationSetting?: number;
  searchResultMembers?: Array<ConversationType>;
  extId?: any;
  isAliveGroup?: boolean;
  [k: string]: any;
};


export type OrderFunction = (
  left: ConversationType,
  right: ConversationType
) => number;

export type MatchedResult = {
  field: string;
  value: number;
  position: number;
};

export type MatchedResultMap = Map<string, MatchedResult>;