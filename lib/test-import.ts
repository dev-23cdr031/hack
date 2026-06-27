// Test import
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

// This is just a test file to check if the import works
export const testFunction = () => {
  const supabase = createClientComponentClient()
  return supabase
}