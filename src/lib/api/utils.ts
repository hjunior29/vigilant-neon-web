import { env } from '$env/dynamic/public';

interface ApiResponse<T> {
    status: number;
    message: string;
    data?: T;
}

export async function apiRequest<T>(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
    body?: object,
    params?: number | string
): Promise<T> {
    try {
        const publicRoutes = [
            "ping",
            "pubsub/",
            "auth/login",
        ];
        const isPublicRoute =
            publicRoutes.includes(endpoint) ||
            endpoint.includes("shared")

        const token = localStorage.getItem("token");

        if (!isPublicRoute && !token) {
            localStorage.removeItem("token");
            window.location.href = "/login";

            const response: ApiResponse<T> = {
                status: 401,
                message: "Token não informado",
                data: undefined,
            };

            return response as T;
        }

        let url: string = "";
        if (process.env.NODE_ENV === "production") {
            const baseUrl = `${env.PUBLIC_API_URL}`;
            url = params ? `${baseUrl}/api/${endpoint}/${params}` : `${baseUrl}/api/${endpoint}`;
        } else {
            url = params ? `/api/${endpoint}/${params}` : `/api/${endpoint}`;
        }

        const request = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: method !== "GET" && body ? JSON.stringify(body) : undefined,
        });

        if (!request.ok) {
            const apiResponse = await request.json();

            if (request.status === 401 && !window.location.href.includes("/login")) {
                localStorage.removeItem("token");
                window.location.href = "/login";

                const response: ApiResponse<T> = {
                    status: 401,
                    message: apiResponse.message,
                    data: undefined,
                };

                return response as T;
            }

            const response: ApiResponse<T> = {
                status: request.status,
                message: apiResponse.message,
                data: undefined
            }

            return response as T;
        }

        const apiResponse = await request.json();

        const response: ApiResponse<T> = {
            status: apiResponse.status,
            message: apiResponse.message,
            data: apiResponse.data,
        };

        return response as T;

    } catch (error) {
        console.error("Error during request:", error);
        throw error;
    }
}