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

  const { access_token, refresh_token } = data.session;

  // Pareciera que aca deberia guardarse el token de spotify para poder hacer las llamadas a la api de spotify, podria
  // guardarse el token en una cookie y luego leerlo desde el cliente para hacer las llamadas a la api de spotify
  // Authorization code flow
// Spotify supports OAuth 2.0 for authenticating all API requests.

// Authorization url
// https://accounts.spotify.com/authorize

// Token url
// https://accounts.spotify.com/api/token

  cookies.set("sb-access-token", access_token, {
    path: "/",
  });
  cookies.set("sb-refresh-token", refresh_token, {
    path: "/",
  });

  return redirect("/dashboard");
};