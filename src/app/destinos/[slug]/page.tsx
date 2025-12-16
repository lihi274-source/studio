import { Suspense } from 'react';
import DestinoPageComponent from './page-content';

// Server Component Wrapper
export default async function DestinoPage({ params }: { params: { slug: string } }) {
    const { slug } = params;

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DestinoPageComponent slug={slug} />
        </Suspense>
    )
}