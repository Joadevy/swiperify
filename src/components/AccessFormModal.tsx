import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Toast } from './Toast';

type SignUpData = {
  message: string,  
  emailToRegister: string,
};

const preventInputDefault = (event: React.KeyboardEvent<HTMLInputElement>) => {
  if (event.key === 'Enter') {
      event.preventDefault();
  }
}

type Props = {
  withButton?: boolean
}

export function AccessFormModal({withButton}:Props) {
  const [isOpen, setIsOpen] = useState(withButton ? false : true);
  const [emailSent, setEmailSent] = useState(false);
  const [errorOnEmail, setErrorOnEmail] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
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
    if (emailSent)
      setTimeout(() => {
        setEmailSent(false);
      }, 5000);
  } , [emailSent]);

  useEffect(() => {
    if (errorOnEmail)
      setTimeout(() => {
        setErrorOnEmail(false);
      }, 5000);
  }, [errorOnEmail]);



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

  const handleSendRegisterInformation = async (data: SignUpData) => {
    setSendingEmail(true);
    const response:{
      message:string,
      status:number
    } = await fetch(`/api/register/sendEmail`, {
      method: 'POST',
      body: JSON.stringify({
        message: data.message,
        emailToRegister: data.emailToRegister,
      })
    }).then(res => res.json());

      if (response.status === 200) {
        setEmailSent(true);
        closeModal();
      } else setErrorOnEmail(true);

      setSendingEmail(false);
    }

  return (
    <>
      {withButton ? <button onClick={() => setIsOpen(true)} className="bg-accent-light rounded-md shadow-md px-2 bg-opacity-50 hover:opacity-75 transition-opacity">Access request</button> : null }
      <div className={isOpen ? 'fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 ' : ''}>
        {isOpen && (
          <dialog
            open
            className="bg-zinc-800 text-slate-200 shadow-lg rounded-md w-80 sm:w-[500px] inset-0"
          >
            <button className='border border-zinc-300 rounded-full px-2 absolute top-2 right-2 hover:opacity-75 transition-opacity text-base text-zinc-300' onClick={closeModal}>X</button>
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

                <form className='flex flex-col gap-4 my-2' onSubmit={handleSubmit((data) => {
                handleSendRegisterInformation(data)})}>
                  <label className='flex flex-col gap-1' htmlFor="Email">
                    <p>
                      Spotify Email
                      <span className={errors.emailToRegister ? 'ml-1 text-tinder-red' : 'ml-1 text-accent-light'}> 
                        *
                      </span>
                    </p>
                    <input onKeyDown={preventInputDefault} className={'text-zinc-800 rounded-sm px-2 py-1 placeholder:text-sm outline-none focus:outline-accent-light ' + (errors.emailToRegister ? 'focus:outline-tinder-red' : '')} {...register("emailToRegister",{required:"Email is required",  pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
              message: "Invalid email address"
            }})} id="Email" type="text" placeholder="Type your spotify's email..." />
                  </label>
                  {errors.emailToRegister && <span className='text-tinder-red text-sm'>{errors.emailToRegister.message}</span>}

                  <label className='flex flex-col gap-1' htmlFor="Description"> Optional message
                      <textarea className='resize-y max-h-24  text-zinc-800 rounded-sm px-2 py-1 placeholder:text-sm outline-none focus:outline-accent-light' placeholder="Type an optional message to me..."   {...register("message")} id="Message"></textarea>
                  </label>
              
              <footer className='flex text-base justify-between'>
                <button disabled={sendingEmail} type='submit' className={"w-24 px-2 py-1 bg-accent-light text-zinc-800 rounded-sm " + (sendingEmail ? " bg-zinc-500 animate-pulse" : "hover:scale-105 hover:cursor-pointer transition-all hover:opacity-85") }>
                  {sendingEmail ? "Sending..." : "Let me in!"}
                </button>
                <button onClick={closeModal} className="bg-zinc-700 py-1 px-2 rounded-sm hover:opacity-75 transition-opacity">
                  Close
                </button>
              </footer>
              </form>

            </div>
          </dialog>
        )}

        {emailSent && <Toast message="Email sent, please wait for a response in the entered email to sign in to swiperify!" type="success" />}
        {errorOnEmail && <Toast message="Error sending email, please try again." type="error" />}
      </div>
    </>
  );
}