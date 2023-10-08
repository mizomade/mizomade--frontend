// dateFormatter.ts
import { date } from 'quasar';

// Format a date to a custom string format
export function formatDate(dateToFormat: Date): string {
  // Use Quasar's date.formatDate method
  return date.formatDate(dateToFormat, 'DD-MMM-YYYY');
}

// Parse a string into a Date object
export function authorPhotoLink(url: string): string {
  // Implement your date parsing logic here
  // Example: return new Date(Date.parse(dateString));
  return (
    'https://mizomade-media-buckets.s3.ap-south-1.amazonaws.com/' +
    'static/' +
    url
  );
}
