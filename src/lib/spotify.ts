import type { DevicesResponse } from "./types";

const API_BASEURL = 'https://api.spotify.com/v1';

export const getCurrentDevice = async (spotifyToken:string) => {
  const {devices}:DevicesResponse = await fetch('https://api.spotify.com/v1/me/player/devices',
  {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${spotifyToken}`
    }
  }).then(res => res.json());
  console.log({devices})

  const currentDevice = devices.find(device => device.is_active || device.supports_volume) ?? devices[0];

  console.log({currentDevice})
  return currentDevice ? currentDevice : null;
}