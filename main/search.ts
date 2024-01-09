import { ConversationType } from './type';
import { SEARCHED_FIELDS } from './compare';

const findFirstMatch = (
  conversation: ConversationType,
  searchText: string,
  priorityFields: string[] = SEARCHED_FIELDS
) => {
  for (let i = 0; i < priorityFields.length; i++) {
    const field = priorityFields[i];
    const value = conversation[field];

    if (value && typeof value === 'string') {
      const position = value.toLowerCase().indexOf(searchText?.toLowerCase());
      if (position !== -1) {
        return {
          field,
          value: i + 1,
          position,
          name: conversation.name,
        };
      }
    }
  }

  return null;
};

const generateFirstMatchMap = (
  conversations: ConversationType[],
  searchText: string,
  priorityFields: string[] = SEARCHED_FIELDS
): Map<string, { field: string; value: number; position: number }> => {
  const firstMatchMap = new Map();
  for (const conversation of conversations) {
    const matchResult = findFirstMatch(
      conversation,
      searchText,
      priorityFields
    );
    if (matchResult) {
      firstMatchMap.set(conversation.id, matchResult);
    }
  }
  return firstMatchMap;
};

const searchAndPopulateMatches = (
  conversations: ConversationType[],
  searchText: string,
  priorityFields: string[] = SEARCHED_FIELDS,
  conditionFn?: (conversation: ConversationType) => boolean
) => {
  if (!searchText) {
    return { firstMatchMap: new Map(), searchResults: conversations };
  }

  const filteredConversations = conditionFn
    ? conversations.filter(conditionFn)
    : conversations;

  const firstMatchMap = generateFirstMatchMap(
    filteredConversations,
    searchText,
    priorityFields
  );

  if (conditionFn) {
    return {
      firstMatchMap,
      searchResults: filteredConversations,
    };
  }

  return {
    firstMatchMap,
    searchResults: filteredConversations.filter(conversation =>
      firstMatchMap.has(conversation.id)
    ),
  };
};

export default searchAndPopulateMatches;
