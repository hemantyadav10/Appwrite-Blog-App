// slug transformation
export const slugify = (title) => {
  if (title) return title
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

//convert data/time to readable time/date
export const convertToReadableTime = (dateTimeStr) => {
  const givenDateTime = new Date(dateTimeStr);
  const now = new Date();
  const timeDifference = now - givenDateTime;

  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return 'just now';
  } else if (minutes < 60) {
    return `${minutes} min ago`;
  } else if (hours < 24) {
    return `${hours} hr ago`;
  } else if (days < 7) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return givenDateTime.toLocaleDateString('en-US', options);
  }
};

//function to capitalize words
export function capitalizeWords(sentence) {
  if (!sentence) return ''; // Handle empty strings or undefined
  return sentence
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
