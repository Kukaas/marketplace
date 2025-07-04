"use client";

import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

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

export default function CreateItemPage() {
    const [form, setForm] = useState({
        title: "",
        category: "",
        price: "",
        location: "Palo Alto, CA",
        email: "",
        description: "",
    });
    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            setImage(ev.target?.result as string);
        };
        reader.readAsDataURL(file);
    }

    function handleRemoveImage(e: React.MouseEvent) {
        e.stopPropagation();
        setImage(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);
        try {
            const { title, category, price, location, email, description } = form;
            if (!title || !category || !price || !email) {
                setError("Please fill in all required fields.");
                setLoading(false);
                return;
            }
            const { error: dbError } = await supabase.from("listings").insert([
                {
                    title,
                    category,
                    price: parseFloat(price),
                    location,
                    seller_email: email,
                    description,
                    image_url: image || null,
                },
            ]);
            if (dbError) throw dbError;
            setSuccess(true);
            toast.success("Item added  to marketplace!")
            setForm({
                title: "",
                category: "",
                price: "",
                location: "Palo Alto, CA",
                email: "",
                description: "",
            });
            setImage(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (err: any) {
            setError(err.message || "Failed to create listing.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col md:flex-row gap-8 py-10 max-w-7xl mx-auto">
            {/* Form */}
            <form className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 p-8" onSubmit={handleSubmit}>
                <div className="font-bold text-lg mb-2">Photos</div>
                <div className="mb-6">
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                    />
                    <div
                        className="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 text-center cursor-pointer relative overflow-hidden"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {image ? (
                            <>
                                <img src={image} alt="Preview" className="absolute inset-0 w-full h-full object-cover rounded-lg z-0" />
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="absolute top-2 right-2 z-10 bg-white/80 hover:bg-white text-gray-700 rounded-full p-1 shadow border border-gray-300"
                                    aria-label="Remove image"
                                >
                                    &times;
                                </button>
                            </>
                        ) : (
                            <>
                                <span className="text-3xl mb-2 z-10">&#8682;</span>
                                <div className="z-10">Add photos</div>
                                <div className="text-xs mt-1 z-10">JPEG, PNG, or WebP (max 5MB)</div>
                            </>
                        )}
                        {image && <div className="absolute inset-0 bg-black/10 rounded-lg" />}
                    </div>
                </div>
                <div className="mb-4">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                        id="title"
                        className="w-full"
                        placeholder="What are you selling?"
                        value={form.title}
                        onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                        required
                    />
                </div>
                <div className="mb-4">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                        value={form.category}
                        onValueChange={val => setForm(f => ({ ...f, category: val }))}
                        required
                    >
                        <SelectTrigger id="category" className="w-full">
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                            {CATEGORIES.map(cat => (
                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="mb-4">
                    <Label htmlFor="price">Price *</Label>
                    <Input
                        id="price"
                        className="w-full"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={form.price}
                        onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                        required
                    />
                </div>
                <div className="mb-4">
                    <Label htmlFor="location">Location</Label>
                    <Input
                        id="location"
                        className="w-full"
                        value={form.location}
                        onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                    />
                </div>
                <div className="mb-4">
                    <Label htmlFor="email">Contact Email *</Label>
                    <Input
                        id="email"
                        className="w-full"
                        type="email"
                        placeholder="your@email.com"
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        required
                    />
                </div>
                <div className="mb-6">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        className="w-full"
                        rows={3}
                        placeholder="Describe your item..."
                        value={form.description}
                        onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    />
                </div>
                {error && <div className="text-red-600 mb-2">{error}</div>}
                <Button className="w-full" type="submit" disabled={loading}>
                    {loading ? "Creating..." : "Create Listing"}
                </Button>
            </form>
            {/* Preview */}
            <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 p-8 flex flex-col">
                <div className="font-bold text-lg mb-4 text-center">Preview</div>
                <div className="flex-1 flex flex-col">
                    {image ? (
                        <img src={image} alt="Preview" className="w-full h-64 object-cover rounded-lg mb-4" />
                    ) : (
                        <div className="w-full h-64 bg-[repeating-linear-gradient(135deg,#c3d2e6_0_4px,#e6ecf3_4px_8px)] rounded-lg mb-4" />
                    )}
                    <div className="font-bold text-xl mb-1">{form.title || "Title"}</div>
                    <div className="font-semibold text-lg mb-2">{form.price ? `$${form.price}` : "Price"}</div>
                    <div className="text-gray-500 text-sm mb-2">Listed just now<br />in {form.location || "Palo Alto, CA"}</div>
                    <div className="font-semibold mb-1">Seller Information</div>
                    <div className="text-gray-700 text-sm">{form.email || "seller@email.com"}</div>
                </div>
            </div>
        </div>
    );
}
