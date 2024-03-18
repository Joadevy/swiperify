import type { APIRoute } from "astro";
import handleSendEmail from "../../../components/nodemailer/email";

export const POST: APIRoute = async ({ request, redirect }) => {
  const body:{
    message: string,
    emailToRegister: string,
  } = await request.json();

  if (!body.emailToRegister) return Response.json({message:"Missing email to register in the app!", status: 500 });

  await handleSendEmail("SOLICITUD ACCESO SWIPERIFY", "Se genero una nueva solicitud de acceso que implicaria agregar el email que me paso por parametro a la lista de user managment en https://developer.spotify.com/dashboard/ para que pueda iniciar sesion luego con su cuenta de spotify sin problemas, RECORDAR AVISARLE AL USUARIO A ESE MISMO EMAIL, el usuario ingreso como correo electronico: " + body.emailToRegister + " y el mensaje fue: " + body.message);

  return Response.json({message:"Email sent!", status: 200 });
};