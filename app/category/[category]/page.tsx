import CategoryPageClient from "./CategoryPageClient";

export default function CategoryPage({ params }: any) {
    return <CategoryPageClient category={params.category} />;
}
