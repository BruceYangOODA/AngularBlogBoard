import { User } from './user.interface';

export interface BlogEntry {
    id: string;
    title?: string;
    slug?: string;
    description?: string;
    body?: string;
    createdAt?: string;
    updatedAt?: string;
    likes?: number;
    author?: User;
    headerImage?: string;
    publishedDate?: string;
    isPublished?: boolean;
}

export interface Meta {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
}

export interface Links {
    first: string;
    previous: string;
    next: string;
    last: string;
}

export interface BlogEntriesPageable {
    items: BlogEntry[];
    meta: Meta;
    links: Links;
}