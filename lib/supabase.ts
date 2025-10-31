import 'react-native-url-polyfill/auto'; 
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tsqeqanvqurbzcumqhhe.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzcWVxYW52cXVyYnpjdW1xaGhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NzYxNTUsImV4cCI6MjA3NzI1MjE1NX0.5jdm3GvvgmbFLTQ6U6IgrXIStymJB2CtZiz78vx1DGw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);