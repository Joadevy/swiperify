import { useState, useEffect } from 'react';
import type { Device } from '../lib/types';
import { getCurrentDevice } from '../lib/spotify';

export function useCurrentDevice(spotifyToken:string) {
  const [currentDevice, setCurrentDevice] = useState<Device | null>(null);
  const [showNoDeviceToast, setShowNoDeviceToast] = useState(false);


  useEffect(() => {
    const fetchCurrentDevice = async () => {
      const device = await getCurrentDevice(spotifyToken);

      if (device) {
        setCurrentDevice(device);
      } else {
        setShowNoDeviceToast(true);
        console.error('No se ha podido obtener el dispositivo actual');
      }
    };

    fetchCurrentDevice();
  }, [spotifyToken]);

  return {currentDevice, showNoDeviceToast};
}