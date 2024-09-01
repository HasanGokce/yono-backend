import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const restUrl = process.env.SUPABASE_URL as string;
const supabaseServiceRoleSecret = process.env
  .SUPABASE_SERVICE_ROLE_SECRET as string;

console.log(process.env);

console.log(restUrl, supabaseServiceRoleSecret);

export const supabase = createClient(restUrl, supabaseServiceRoleSecret);
