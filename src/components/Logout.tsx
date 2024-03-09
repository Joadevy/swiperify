import { useEffect, useState } from 'react';

function LogoutModal() {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

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

  const logout = async (signOutFromSpotify: boolean) => {
    const response = await fetch('/api/auth/signout', {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    if (signOutFromSpotify) window.open('https://www.spotify.com/logout/', '_blank');
    window.location.replace('/');
    closeModal();
  };

  return (
    <div className={isOpen ? 'fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 ' : ''}>
      {!isOpen && <button className='flex items-center hover:opacity-75 transition-opacity text-gray-400' onClick={() => setIsOpen(true)} >
        <span className="sr-only">Logout</span>
        Sign out
      </button>
      }

      {isOpen && (
        <dialog
          open
          className="bg-zinc-800 text-slate-200 shadow-lg rounded-md w-80 sm:w-[500px] inset-0"
        >
          <button className='border border-zinc-300 rounded-full px-2  absolute top-2 right-2 hover:opacity-75 transition-opacity text-base text-zinc-300' onClick={closeModal}>X</button>
          <div className="p-4 rounded m-4">
            <h2 className="text-xl font-bold mb-4">Logout process information</h2>
            <p className='text-base'>
              If you <span className='text-accent-light'> want to log in with another Spotify account the next time </span>
               you'll need to logout your actual Spotify session.
            </p>
            <p className="mt-2 mb-4 text-base">
              We can do this for you if you <span className=' text-accent-light'>
                click the "Log out from Spotify" button</span> and then please close the tab
              to continue using this app.
            </p>

            <footer className='flex text-base justify-between'>
              <button type='submit' onClick={() => logout(false)} className="px-2 py-1 bg-accent-light text-zinc-800 rounded-sm hover:scale-105 hover:cursor-pointer transition-all hover:opacity-85'">
                Remain my Spotify session
              </button>
              <button type='submit' onClick={() => logout(true)} className="bg-zinc-700 py-1 px-2 rounded-sm hover:opacity-75 transition-opacity">
                Log out from Spotify
              </button>
            </footer>
          </div>
        </dialog>
      )}
    </div>
  );
}

export default LogoutModal;