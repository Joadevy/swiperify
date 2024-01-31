import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase"; 
import { callbackUrl } from "../../../lib/utils";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'spotify',
    options: {
        redirectTo: callbackUrl,
        scopes: 'user-read-email user-read-private playlist-read-private playlist-read-collaborative',
      },
  })

  if (error) {
    return new Response(error.message, { status: 500 });
  }

  return redirect(data.url);
};