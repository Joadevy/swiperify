import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

type SignUpData = {
  message: string,  
  emailToRegister: string,
};

export function AccessFormModal() {
  const [isOpen, setIsOpen] = useState(true);
  const {register, handleSubmit, formState:{errors}} = useForm({
    defaultValues:{
      emailToRegister: '',
      message: '',
    }
  });

  const closeModal = () => {
    setIsOpen(false);
  };

   useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

   // To avoid submitting the form when pressing the enter key in the input fields
  useEffect(() => {
    const handleKeyDown = (event:KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []); 

  const handleCreatePlaylist = async (data: SignUpData) => {
    const response:{
      ok: boolean,
      status: number,
      json: () => Promise<null>
    } = await fetch(`/api/register`, {
      method: 'POST',
      body: JSON.stringify({
        message: data.message,
        emailToRegister: data.emailToRegister,
      })
    })

    console.log(response)
    }

  return (
    <div className={isOpen ? 'fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 ' : ''}>
      {isOpen && (
        <dialog
          open
          className="bg-zinc-800 text-slate-200 shadow-lg rounded-md w-80 sm:w-[500px] inset-0"
        >
          <button className='border border-zinc-300 rounded-full px-2  absolute top-2 right-2 hover:opacity-75 transition-opacity text-base text-zinc-300' onClick={closeModal}>X</button>
          <div className="p-4 rounded m-4">
            <h2 className="text-xl font-bold mb-4">Sign up process information</h2>
            <p className='text-base'>
              Because the app is currently in Spotify's "dev mode tier," I have only 25 user slots available for testing, which I can manually edit. So, <span className='text-accent-light'> if you want to try this app with your Spotify Premium account, I need your Spotify email to register it on the access list. </span>
              Once I add your email, you'll be able to log in with your Spotify account.
            </p>
            <p className="mt-2 mb-4 text-base">
              I understand that it may sound inconvenient and possibly unsafe, and I'm truly sorry about that, but <span className=' text-accent-light'>
              this is the only way until Spotify approves the app for public access.</span>
            </p>

            <footer className='flex text-base justify-between'>
              <button type='submit' onClick={() => {}} className="px-2 py-1 bg-accent-light text-zinc-800 rounded-sm hover:scale-105 hover:cursor-pointer transition-all hover:opacity-85'">
                Let me in!
              </button>
              <button onClick={closeModal} className="bg-zinc-700 py-1 px-2 rounded-sm hover:opacity-75 transition-opacity">
                Close
              </button>
            </footer>
          </div>
        </dialog>
      )}
    </div>
  );
}