export const callbackUrl = "http://localhost:4321/api/auth/callback";

export const pages = {
    'newMusic':'/discover',
    'home' : '/home'
}

export const clientRedirect = (page: keyof typeof pages) => {
    if (window) window.location.href = pages[page];
}