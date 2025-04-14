export interface Notification {
    kind?: "success" | "error" | "info" | "warning";
    title?: string;
    subtitle?: string;
    timeout?: number;
    caption?: string;
}