import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase"

export const GET: APIRoute = async ({ url, cookies, redirect }) => {
  const authCode = url.searchParams.get("code");

  if (!authCode) {
    return new Response("No code provided", { status: 400 });
  }

  const { data, error } = await supabase.auth.exchangeCodeForSession(authCode);

  if (error) {
    return new Response(error.message, { status: 500 });
  }

  const { access_token, refresh_token, provider_token, provider_refresh_token } = data.session;

  // Store the Spotify access token in a cookie
  cookies.set("spotify-access-token", provider_token!, {
    path: "/",
  });

  // Store the Spotify refresh token in a cookie
  cookies.set("spotify-refresh-token", provider_refresh_token!, {
    path: "/",
  });

  cookies.set("sb-access-token", access_token, {
    path: "/",
  });
  cookies.set("sb-refresh-token", refresh_token, {
    path: "/",
  });

  return redirect("/dashboard");
};