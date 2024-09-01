import { supabase } from "@src/lib/supabase";

interface Match {
  match_rate: number;
  participants: string[];
  topic_id: string;
}

export const saveMatchResult = async (match: Match) => {
  const { data, error } = await supabase.from("matches").insert(match);
  if (error) {
    console.error("Error saving match result:", error);
  } else {
    console.log("Match result saved:", data);
  }
};
