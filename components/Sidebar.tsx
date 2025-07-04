"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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

export function Sidebar() {
    const pathname = usePathname();
    return (
        <aside className="w-64 border-r border-border p-6 hidden md:block">
            <div className="mb-6">
                <div className="font-bold mb-3 text-lg">Create new listing</div>
                <ul className="space-y-2 text-sm">
                    <li>
                        <Link href="/create" className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100 transition-colors">
                            <span className="inline-block w-5 h-5 text-gray-500">
                                {/* Tag icon */}
                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M3 11.25V7a2 2 0 012-2h4.25a2 2 0 011.414.586l7.75 7.75a2 2 0 010 2.828l-4.25 4.25a2 2 0 01-2.828 0l-7.75-7.75A2 2 0 013 11.25z" /></svg>
                            </span>
                            Choose listing type
                        </Link>
                    </li>
                    <li>
                        <div className="flex items-center gap-2 px-2 py-1 text-gray-700">
                            <span className="inline-block w-5 h-5 text-gray-500">
                                {/* Tag icon */}
                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M3 11.25V7a2 2 0 012-2h4.25a2 2 0 011.414.586l7.75 7.75a2 2 0 010 2.828l-4.25 4.25a2 2 0 01-2.828 0l-7.75-7.75A2 2 0 013 11.25z" /></svg>
                            </span>
                            Your listings
                        </div>
                    </li>
                    <li>
                        <div className="flex items-center gap-2 px-2 py-1 text-gray-700">
                            <span className="inline-block w-5 h-5 text-gray-500">
                                {/* User icon */}
                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A9 9 0 1112 21a9 9 0 01-6.879-3.196z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            </span>
                            Seller help
                        </div>
                    </li>
                </ul>
            </div>
            <div className="font-bold mb-4 text-lg">Categories</div>
            <ul className="space-y-2 text-sm">
                {CATEGORIES.map((cat) => {
                    const slug = encodeURIComponent(cat);
                    const isActive = pathname === `/category/${slug}`;
                    return (
                        <li key={cat}>
                            <Link
                                href={`/category/${slug}`}
                                className={`block px-3 py-2 rounded transition-colors ${isActive ? "bg-blue-100 text-blue-700 font-semibold" : "hover:bg-gray-100"}`}
                            >
                                {cat}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </aside>
    );
}
