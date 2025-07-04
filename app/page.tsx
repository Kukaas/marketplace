"use client"

import { useState } from "react";

const CATEGORIES = [
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

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Placeholder listings with categories
  const listings = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    price: 2300,
    title: "Lorem ipsum dolor sit",
    location: "Palo Alto, CA",
    category: CATEGORIES[i % CATEGORIES.length],
  }));

  const filteredListings = selectedCategory
    ? listings.filter((l) => l.category === selectedCategory)
    : listings;

  return (
    <div>
      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        <button
          className={`px-4 py-1 rounded-full border text-sm font-medium transition-colors ${selectedCategory === null ? "bg-blue-600 text-white" : "bg-white text-black border-border"}`}
          onClick={() => setSelectedCategory(null)}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`px-4 py-1 rounded-full border text-sm font-medium transition-colors ${selectedCategory === cat ? "bg-blue-600 text-white" : "bg-white text-black border-border"}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
      <h2 className="text-xl font-bold mb-6">Today's picks</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {filteredListings.map((listing) => (
          <div key={listing.id} className="bg-blue-100 rounded-xl aspect-square flex flex-col items-center justify-end p-3 border border-border">
            <div className="w-full h-2/3 bg-blue-200 rounded-lg mb-2" />
            <div className="font-semibold">${listing.price.toLocaleString()}</div>
            <div className="text-xs">{listing.title}<br />{listing.location}</div>
            <div className="text-xs mt-1 text-gray-500">{listing.category}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
