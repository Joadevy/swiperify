export const pages = {
    'newMusic':'/discover',
    'home' : '/home'
}

export const clientRedirect = (page: keyof typeof pages, params?: Record<string, string>) => {
    if (typeof window !== 'undefined') {
        const url = new URL(pages[page], window.location.origin);
        if (params) {
            for (const [key, value] of Object.entries(params)) {
                url.searchParams.append(key, value);
            }
        }
        
        window.location.href = url.toString();
    }
}