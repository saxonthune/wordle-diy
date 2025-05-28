
export interface UrlService {
    btoaUrlSafe: (input: string) => string;
    atobUrlSafe: (input: string) => string;
}

export const urlService: UrlService = {
    btoaUrlSafe(input: string): string {
        return btoa(input)
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    },

    atobUrlSafe(input: string): string {
        const base64 = input
            .replace(/-/g, '+')
            .replace(/_/g, '/');
        const padding = base64.length % 4 === 0 ? '' : '='.repeat(4 - (base64.length % 4));
        return atob(base64 + padding);
    }
}