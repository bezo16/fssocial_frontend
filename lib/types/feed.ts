
export type FeedPost = {
    id: string;
    title: string;
    content: string | null;
    authorId: string;
    imageUrl: string | null;
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
}