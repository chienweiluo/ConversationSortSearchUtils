# Conversation Utilities
## Overview
This library offers robust search and sorting functionalities for conversation objects in TypeScript for the certain area.

## Features
**Search Functionality**: Offers priority-based field search, identifying the first field matching the search text.

**Sorting Capabilities**: Includes multiple sorting criteria like last message time, activity status, alphabetical order, archival status, and group status.

**Customizable**: Supports custom filtering conditions for search and custom ordering functions for sorting.

**Functional Programming Design**: Embraces functional programming paradigms, ensuring immutability and stateless functions for reliability and predictability.

**Composable Utilities**: Features are designed for composition, allowing them to be easily combined and reused for flexible and efficient data manipulation.

**Efficient Search Functionality**: Implements a priority-based field search, quickly pinpointing the first relevant field match.

**Versatile Sorting Mechanisms**: Offers a variety of sorting criteria, such as activity status and alphabetical order, tailored for dynamic conversation data.

## Usage
Import the necessary functions and apply them to an array of conversation objects. The search functionality locates the first match in conversation fields, while sorting functions organize conversations based on specified criteria.

```
// For searching
import searchAndPopulateMatches from 'path-to-search-library';
const searchResults = searchAndPopulateMatches(conversations, 'query');

// For sorting
import { newGroupCompare } from 'path-to-sort-library';
const sortedConversations = conversations.sort(newGroupCompare);
```

## Performance Characteristics
Search algorithm prioritizes speed and minimizes unnecessary processing.
Sorting functions are optimized for large datasets using lodash functions and efficient comparison mechanisms.
The use of custom sorting functions allows for flexibilit
