export type Topic = {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    publisherId: string;
    subscriberId: string;
    content: Json;
};

export type Json = Record<string, unknown>;