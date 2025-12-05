
export function currencyFormatter(price: number): string {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
    }).format(price)
}


/**
 * Enhanced time formatter with better month/year accuracy
 * @param {Date|string|number} inputDate 
 * @returns {string}
 */
export function formatTimeAgo(inputDate:Date|string) {
  const date = new Date(inputDate);
  const now = new Date();
  const diffInMs = now.getUTCMilliseconds() - date.getUTCMilliseconds();
  console.log({diffInMs,date,now, inputDate})
  const diffInSeconds = Math.floor(diffInMs / 1000);
  
  // Less than a minute
  if (diffInSeconds < 60) {
    return diffInSeconds < 10 ? 'just now' : `${diffInSeconds} seconds ago`;
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return diffInMinutes === 1 ? '1 minute ago' : `${diffInMinutes} minutes ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return diffInHours === 1 ? '1 hour ago' : `${diffInHours} hours ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return diffInDays === 1 ? 'yesterday' : `${diffInDays} days ago`;
  }
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return diffInWeeks === 1 ? '1 week ago' : `${diffInWeeks} weeks ago`;
  }
  
  // More accurate month calculation
  const diffInMonths = (now.getFullYear() - date.getFullYear()) * 12 
    + (now.getMonth() - date.getMonth());
  
  if (diffInMonths < 12) {
    return diffInMonths <= 1 ? '1 month ago' : `${diffInMonths} months ago`;
  }
  
  // Year calculation
  const diffInYears = now.getFullYear() - date.getFullYear();
  const remainingMonths = now.getMonth() - date.getMonth();
  
  if (remainingMonths < 0) {
    return diffInYears === 1 ? '1 year ago' : `${diffInYears - 1} years ago`;
  }
  
  return diffInYears === 1 ? '1 year ago' : `${diffInYears} years ago`;
}