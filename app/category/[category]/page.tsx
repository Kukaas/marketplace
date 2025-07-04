"use client";

import { useEffect, useState } from "react";
import { notFound, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/SearchBar";

const CATEGORIES = [
    "All",
    "Vehicles",
    "Property Rentals",
    "Apparel",
    "Classifieds",
    "Electronics",
    "Entertainment",
    "Family",
    "Free Stuff",
    "Garden & Outdoor",
    "Hobbies",
    "Home Goods",
    "Home Improvement",
    "Home Sales",
    "Musical Instruments",
    "Office Supplies",
    "Pet Supplies",
    "Sporting Goods",
    "Toys & Games",
    "Buy and sell groups",
];

function formatListingDate(dateString: string) {
    const date = new Date(dateString);
    return `Posted on ${date.toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    }).replace(",", "")}`;
}

export default function CategoryPage({ params }: { params: { category: string } }) {
    // Unwrap params with React.use() as required by Next.js 15+
    // @ts-ignore
    const unwrappedParams = typeof React.use === "function" ? React.use(params) as { category: string } : params;
    const decodedCategory = decodeURIComponent(unwrappedParams.category);
    if (!CATEGORIES.includes(decodedCategory)) return notFound();

    const [listings, setListings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const router = useRouter();

    useEffect(() => {
        setLoading(true);
        async function fetchListings() {
            let query = supabase.from("listings").select("*", { count: "exact" }).order("created_at", { ascending: false });
            if (decodedCategory !== "All") {
                query = query.eq("category", decodedCategory);
            }
            const { data, error } = await query;
            if (!error) setListings(data || []);
            setLoading(false);
        }
        fetchListings();
    }, [decodedCategory]);

    const filteredListings = listings.filter((l) => {
        if (!search) return true;
        const s = search.toLowerCase();
        return (
            l.title?.toLowerCase().includes(s) ||
            l.location?.toLowerCase().includes(s)
        );
    });

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">{decodedCategory}</h2>
            <div className="mb-6">
                <SearchBar onSearch={setSearch} />
            </div>
            {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <Card key={i} className="flex flex-col bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
                            <Skeleton className="w-full h-48" />
                            <div className="flex-1 flex flex-col p-4 gap-2">
                                <Skeleton className="h-5 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                                <Skeleton className="h-3 w-1/3" />
                                <Skeleton className="h-3 w-1/4" />
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {filteredListings.length === 0 ? (
                        <div className="col-span-full text-center text-gray-500 flex flex-col items-center gap-4">
                            <div>No listings found.</div>
                            <Button onClick={() => router.push('/create/item')} className="mt-2">Create a Listing</Button>
                        </div>
                    ) : (
                        filteredListings.map((listing) => (
                            <Card
                                key={listing.id}
                                className="flex flex-col bg-white rounded-xl shadow hover:shadow-lg transition-shadow border border-gray-200 overflow-hidden cursor-pointer group"
                                onClick={() => router.push(`/item/${listing.id}`)}
                                tabIndex={0}
                                role="button"
                                onKeyDown={e => { if (e.key === 'Enter') router.push(`/item/${listing.id}`); }}
                            >
                                {listing.image_url ? (
                                    <img src={listing.image_url} alt={listing.title} className="w-full h-48 object-cover" />
                                ) : (
                                    <div className="w-full h-48 bg-blue-100" />
                                )}
                                <div className="flex-1 flex flex-col p-4">
                                    <div className="font-semibold text-lg mb-1 truncate">{listing.title}</div>
                                    <div className="text-blue-700 font-bold mb-1">${listing.price?.toLocaleString?.() ?? listing.price}</div>
                                    <div className="text-xs text-gray-500 mb-2 truncate">{listing.location}</div>
                                    <div className="text-xs text-gray-400">{formatListingDate(listing.created_at)}</div>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
