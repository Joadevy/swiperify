import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";

export const GET: APIRoute = async ({ cookies, redirect }) => {
  const { error } = await supabase.auth.signOut({
    scope:"global"
  });

if (error) {
    return new Response(error.message, { status: 500 });
}

  cookies.delete("sb-access-token", {path: '/'});
  cookies.delete("sb-refresh-token", {path: '/'});
  cookies.delete('spotify-access-token', {path: '/'});
  cookies.delete('spotify-refresh-token', {path: '/'});


  return redirect("/");
};