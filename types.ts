
// E-commerce Types
export interface Product {
    id: number;
    created_at: string;
    name: string;
    description: string;
    long_description?: string;
    price: number;
    image_url: string;
}

export interface CartItem extends Product {
    quantity: number;
}

// Employee & Timesheet Types
export interface Profile {
  id: string; // should match user.id
  updated_at: string;
  full_name: string;
  avatar_url: string;
  role: 'admin' | 'employee';
}

export interface TimeEntry {
  id: number;
  user_id: string;
  start_time: string; // ISO 8601 format date string
  end_time: string | null; // ISO 8601 format date string, null if shift is active
  revenue: number; // Added: Revenue for this shift
  created_at: string;
}

export interface DailyNote {
  id: number;
  user_id: string;
  date: string; // YYYY-MM-DD format
  note: string | null;
  file_url: string | null;
  created_at: string;
}

export interface PerformanceReview {
    id: number;
    user_id: string;
    score: number;
    comments: string;
    reviewDate: string; // YYYY-MM-DD
}

export interface ChartDayData {
  day: number;
  totalHours: number;
  totalRevenue?: number; // Added: Total revenue for the day
  label?: string;
  entries?: TimeEntry[];
}

/**
 * Interface representing the translation dictionary used throughout the app.
 * This ensures type safety when accessing localized strings and functions.
 */
export interface Translation {
  [key: string]: any;
  copyright: (year: number) => string;
  shiftStartedAt: (time: string) => string;
  timeEntriesFor: (name: string) => string;
  deleteConfirmationMessage: (entryInfo: string) => string;
  deleteEmployeeConfirmationMessage: (name: string) => string;
}
