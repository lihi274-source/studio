import { Suspense } from 'react';
import BlogPostPageComponent from './page-content';

// Server Component Wrapper
export default async function BlogPostPage({ params }: { params: { slug: string } }) {
    const { slug } = params;

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <BlogPostPageComponent slug={slug} />
        </Suspense>
    )
}

    