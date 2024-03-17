import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase"; 

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'spotify',
    options: {
        // redirectTo: 'https://swiperify.vercel.app/api/auth/callback',
        redirectTo: 'http://localhost:4321/api/auth/callback',
        scopes: 'streaming user-read-playback-state user-modify-playback-state user-read-email user-read-private playlist-read-private playlist-read-collaborative playlist-modify-public playlist-modify-private',
      },
  })

  if (error) {
    return new Response(error.message, { status: 500 });
  }
  return redirect(data.url);
};