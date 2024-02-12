import { useState } from "react";

export function usePlaylist(spotifyToken:string, playlistId:string) {
  const handleAddToPlaylist = async (track_uris:string[]) => {
  const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${spotifyToken}`,
    },
    body: JSON.stringify({
      uris: track_uris
    })
  });

  console.log(response)

  return {
    ok: response.ok,
    status: response.status
  }
}

  return [handleAddToPlaylist]
}