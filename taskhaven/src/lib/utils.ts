import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { FaIcon, AiIcon } from 'react-icons/all';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      resolve(fileReader.result as string);
    };

    fileReader.onerror = (error) => {
      reject(error);
    };
  });
}

export function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return new Intl.DateTimeFormat('en-US', options).format(date);
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) {
    return str;
  }

  return `${str.slice(0, maxLength)}...`;
}

export function getInitials(name: string): string {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  return initials.length > 2 ? initials.slice(0, 2) : initials;
}

export function getRandomIcon(): React.ReactNode {
  const icons = [FaIcon, AiIcon];
  const randomIndex = Math.floor(Math.random() * icons.length);
  const RandomIcon = icons[randomIndex];

  return <RandomIcon />;
}

export function debounce<F extends (...args: any[]) => any>(
  func: F,
  wait: number,
  immediate?: boolean
): (...args: Parameters<F>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function executedFunction(...args: Parameters<F>): void {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };

    const callNow = immediate && !timeout;

    clearTimeout(timeout as ReturnType<typeof setTimeout>);

    timeout = setTimeout(later, wait);

    if (callNow) func(...args);
  };
}

export function formatDuration(duration: number): string {
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = duration % 60;

  const hoursString = hours > 0 ? `${hours}h ` : '';
  const minutesString = minutes > 0 ? `${minutes}m ` : '';
  const secondsString = seconds > 0 ? `${seconds}s` : '';

  return `${hoursString}${minutesString}${secondsString}`.trim();
}