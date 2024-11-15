
export const cn = (...classes) => {
    return classes.filter(Boolean).join(" ");
  };
  
  export const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  };