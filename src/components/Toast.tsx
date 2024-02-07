import { useEffect } from 'react';
import { Toaster, toast } from 'sonner'

type Props = {
  message: string;
  type:'success' | 'error' | 'warning' | 'info';
}

export function Toast({message, type}:Props) {
    useEffect(() => {
    type === 'error' ? toast.error(message) 
    : type === 'success' ? toast.success(message)
    : type === 'warning' ? toast.warning(message)
    : toast.info(message)
  }, []);


  return (
      <Toaster theme='dark' duration={7500} position='bottom-right'/>
  )
}