const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch(
    endpoint: string,
    options: RequestInit = {}
) {
    const response = await fetch(
        `${API_URL}${endpoint}`,
        {
            ...options,
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                ...options.headers,
            },
        }
    );
    const contentType = response.headers.get("content-type");

    if (!contentType?.includes("application/json")) {
        const text = await response.text();
        throw new Error(`Expected JSON but received:\n${text}`);
    }

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message);
    }

    return data;
}