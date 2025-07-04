"use client";

import { useRouter } from "next/navigation";

export default function CreatePage() {
    const router = useRouter();
    const options = [
        {
            title: "Item for sale",
            subtitle: "Lorem ipsum dolor sit",
            onClick: () => router.push("/create/item"),
        },
        {
            title: "Create multiple listings",
            subtitle: "Lorem ipsum dolor sit",
            onClick: () => console.log("Create multiple listings clicked"),
        },
        {
            title: "Vehicle for sale",
            subtitle: "Lorem ipsum dolor sit",
            onClick: () => console.log("Vehicle for sale clicked"),
        },
        {
            title: "Home for sale or rent",
            subtitle: "Lorem ipsum dolor sit",
            onClick: () => console.log("Home for sale or rent clicked"),
        },
    ];

    return (
        <div className="py-10">
            <h1 className="text-3xl font-bold text-center mb-10">Choose listing type</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
                {options.map((opt, i) => (
                    <button
                        key={opt.title}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col items-center p-8 hover:shadow-md transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
                        onClick={opt.onClick}
                        type="button"
                    >
                        <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-6">
                            <div className="w-10 h-10 rounded-full bg-gray-300" />
                        </div>
                        <div className="font-bold text-lg text-center mb-2">{opt.title}</div>
                        <div className="text-gray-500 text-sm text-center">{opt.subtitle}</div>
                    </button>
                ))}
            </div>
        </div>
    );
}
