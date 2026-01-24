export const formatDateShort = (dateString) => {
  if (!dateString) return 'No date';
  const [year, month, day] = dateString.split('-');
  return `${month}/${day}/${year}`
};

export const formatDate = (dateString) => {
  if (!dateString) return 'No date';
  const [year, month, day] = dateString.split('-');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[parseInt(month) - 1]} ${parseInt(day)}, ${year}`;
};

export const formatDateLong = (dateString) => {
  if (!dateString) return 'No date';
  const [year, month, day] = dateString.split('-');
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  // Create date at noon to avoid timezone issues
  const date = new Date(year, parseInt(month) - 1, parseInt(day), 12, 0, 0);
  const dayName = days[date.getDay()];
  
  return `${dayName}, ${months[parseInt(month) - 1]} ${parseInt(day)}, ${year}`;
};