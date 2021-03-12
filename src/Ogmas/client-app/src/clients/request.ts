export const fetchJson = async <T>(url: string, init?: RequestInit): Promise<T> => {
    const response = await fetch(url, init);
    if(!response.ok) {
        throw new Error(`Request returned error code: ${response.status}`);
    }

    return response.json();
};