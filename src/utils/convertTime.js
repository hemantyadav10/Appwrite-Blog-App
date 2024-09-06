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


