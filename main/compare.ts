import { find, compact, reverse } from 'lodash';
import { ConversationType, MatchedResultMap, OrderFunction } from './type';

// less index represents order of priority\

const SEARCHED_FIELDS = [
  'name',
  'signature',
  'email',
  'id',
  'title',
  'profileName',
  'protectedConfigs',
];

const matchedResultsMapOrder =
  (matchedResultMap: MatchedResultMap, fallbackOrderFn?: OrderFunction) =>
  (left: ConversationType, right: ConversationType) => {
    const matchLeft = matchedResultMap.get(left.id);
    const matchRight = matchedResultMap.get(right.id);

    if (matchLeft && matchRight) {
      if (matchLeft.value !== matchRight.value) {
        // less value is higher priority
        return matchLeft.value - matchRight.value > 0 ? 1 : -1;
      }

      if (matchLeft.position !== matchRight.position) {
        // less position is higher priority
        return matchLeft.position - matchRight.position > 0 ? 1 : -1;
      }

      // If both value and position are same, fallback to another ordering function
      if (fallbackOrderFn) {
        return fallbackOrderFn(left, right);
      } else {
        return 0;
      }
    }

    if (matchLeft) {
      return -1;
    }

    if (matchRight) {
      return 1;
    }

    return 0;
  };

// ActiveAt ordering
const activeAtOrder = (left: ConversationType, right: ConversationType) => {
  if (left.activeAt || right.activeAt) {
    return (left.activeAt ?? 0) > (right.activeAt ?? 0) ? -1 : 1;
  }
  return 0;
};

const collator = new Intl.Collator();

// name || id ordering: A-> Z, 0 -> 9
const nameAndIdOrder = (left: ConversationType, right: ConversationType) => {
  const leftLower = (left.name || left.id).toLowerCase().trim();
  const rightLower = (right.name || right.id).toLowerCase().trim();

  return collator.compare(leftLower, rightLower);
};

// Alive group ordering
const orderAliveGroup: OrderFunction = (left, right) => {
  if (!left.isAliveGroup !== !right.isAliveGroup) {
    if (left.type === 'group' && !left.isAliveGroup) {
      return 1;
    } else if (right.type === 'group' && !right.isAliveGroup) {
      return -1;
    }
  }
  return 0;
};

// Archived ordering
const orderArchived: OrderFunction = (left, right) => {
  // isArchived: true/false/undefined
  if (!!left.isArchived !== !!right.isArchived) {
    return left.isArchived ? 1 : -1;
  }
  return 0;
};

// Last message time ordering
// TODO: use explicit type for lastMessageTime
const orderLastMessageTime: OrderFunction = (left, right) => {
  if (!!left.lastMessage?.text !== !!right.lastMessage?.text) {
    return right.lastMessage?.text ? 1 : -1;
  }
  if (left.lastMessage?.text && right.lastMessage?.text) {
    return right.timestamp - left.timestamp;
  }
  return 0;
};

const orderByActiveIndexMap =
  (activeUserNumberToIndexMap: Map<string, number>) =>
  (left: ConversationType, right: ConversationType) => {
    const indexOfLeft = activeUserNumberToIndexMap.get(left.id);
    const indexOfRight = activeUserNumberToIndexMap.get(right.id);

    if (indexOfLeft === undefined && indexOfRight === undefined) {
      return 0;
    }
    // put the other one who is not in the activelsit to the top
    if (indexOfLeft === undefined) {
      return -1;
    }
    if (indexOfRight === undefined) {
      return 1;
    }
    return indexOfLeft - indexOfRight;
  };

// use find to avoid unnecessary comparisons
const compareConversation: (orderFns: OrderFunction[]) => OrderFunction =
  orderFns => (left, right) => {
    const result = find(orderFns, (fn: OrderFunction) => {
      const order = fn(left, right);
      return order !== 0;
    });

    return result ? result(left, right) : 0;
  };

const newGroupCompare = compareConversation([
  orderLastMessageTime,
  activeAtOrder,
  nameAndIdOrder,
]);

const engageMembersCompare = compareConversation([
  orderLastMessageTime,
  activeAtOrder,
  nameAndIdOrder,
]);

const newGroupSearchingCompare: (
  matchedResultMap: MatchedResultMap
) => OrderFunction = (matchedResultMap: MatchedResultMap) =>
  compareConversation([
    orderLastMessageTime,
    matchedResultsMapOrder(matchedResultMap, orderLastMessageTime),
    activeAtOrder,
    nameAndIdOrder,
  ]);

const engageMembersSearchingCompare: (
  matchedResultMap: MatchedResultMap
) => OrderFunction = (matchedResultMap: MatchedResultMap) =>
  compareConversation([
    orderLastMessageTime,
    matchedResultsMapOrder(matchedResultMap, orderLastMessageTime),
    activeAtOrder,
    nameAndIdOrder,
  ]);

const atPersonCompare: (matchedResultMap: MatchedResultMap) => OrderFunction = (
  matchedResultMap: MatchedResultMap
) =>
  compareConversation([
    matchedResultsMapOrder(matchedResultMap, orderLastMessageTime),
    nameAndIdOrder,
  ]);

const addOwnerToChatFolderCompare = compareConversation([
  orderLastMessageTime,
  activeAtOrder,
  nameAndIdOrder,
]);

const addOwnerToChatFolderSearchingCompare: (
  matchedResultMap: MatchedResultMap
) => OrderFunction = (matchedResultMap: MatchedResultMap) =>
  compareConversation([
    orderLastMessageTime,
    matchedResultsMapOrder(matchedResultMap, orderLastMessageTime),
    activeAtOrder,
    nameAndIdOrder,
  ]);

const forwardMessageCompare = compareConversation([
  orderLastMessageTime,
  activeAtOrder,
  nameAndIdOrder,
]);

const forwardMessageSearchingCompare: (
  matchedResultMap: MatchedResultMap
) => OrderFunction = (matchedResultMap: MatchedResultMap) =>
  compareConversation([
    orderLastMessageTime,
    matchedResultsMapOrder(matchedResultMap, orderLastMessageTime),
    activeAtOrder,
    nameAndIdOrder,
  ]);

export {
  SEARCHED_FIELDS,
  orderArchived,
  orderLastMessageTime,
  compareConversation,
  engageMembersCompare,
  newGroupCompare,
  newGroupSearchingCompare,
  addOwnerToChatFolderCompare,
  addOwnerToChatFolderSearchingCompare,
  forwardMessageCompare,
  forwardMessageSearchingCompare,
  atPersonCompare,
  engageMembersSearchingCompare,
};
