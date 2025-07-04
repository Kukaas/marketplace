"use client";

import { useState } from "react";

export function SearchBar({ onSearch }: { onSearch: (value: string) => void }) {
    const [search, setSearch] = useState("");
    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        onSearch(search);
    }
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setSearch(e.target.value);
        onSearch(e.target.value);
    }
    return (
        <form onSubmit={handleSearch} className="flex flex-1 items-center gap-2">
            <div className="relative flex-1">
                <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2 rounded border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 text-base"
                    placeholder="Search listings..."
                    value={search}
                    onChange={handleChange}
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {/* Search icon */}
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" /></svg>
                </span>
            </div>
            <button type="submit" className="bg-black text-white font-semibold px-6 py-2 rounded ml-2 hover:bg-gray-900 transition">Search</button>
        </form>
    );
}
