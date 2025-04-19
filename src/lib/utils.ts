export const getSharedUrl = (sharedId: string): string => {
    const url = new URL(window.location.href);
    return `${url.origin}/shared/${sharedId}`;
};