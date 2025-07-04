"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

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

export default function ItemDetailPage() {
    const params = useParams() || {};
    const id = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : "";
    const [listing, setListing] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [buyerEmail, setBuyerEmail] = useState("");
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        async function fetchListing() {
            const { data, error } = await supabase.from("listings").select("*").eq("id", id).single();
            if (!error) setListing(data);
            setLoading(false);
        }
        if (id) fetchListing();
    }, [id]);

    async function handleSendMessage(e: React.FormEvent) {
        e.preventDefault();
        setSending(true);
        setError(null);
        setSent(false);
        try {
            if (!buyerEmail || !message) {
                setError("Please fill in all fields.");
                setSending(false);
                return;
            }
            const { error: dbError } = await supabase.from("messages").insert([
                {
                    listing_id: id,
                    buyer_email: buyerEmail,
                    seller_email: listing.seller_email,
                    message,
                },
            ]);
            if (dbError) throw dbError;
            // Send email via API route
            try {
                await fetch("/api/send-email-message", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        listing_id: id,
                        buyer_email: buyerEmail,
                        seller_email: listing.seller_email,
                        message,
                    }),
                });

                toast.success("Message sent successfully!")
            } catch (emailErr) {
                setError("Message saved, but failed to send email notification.");
            }
            setSent(true);
            setMessage("");
            setBuyerEmail("");
        } catch (err: any) {
            setError(err.message || "Failed to send message.");
        } finally {
            setSending(false);
        }
    }

    return (
        <div className="flex flex-col md:flex-row gap-8 py-10 max-w-5xl mx-auto">
            {/* Image */}
            <div className="flex-1 flex items-start justify-center">
                {loading ? (
                    <Skeleton className="w-full h-[400px] rounded-xl" />
                ) : listing?.image_url ? (
                    <img src={listing.image_url} alt={listing.title} className="w-full max-w-lg h-[400px] object-cover rounded-xl" />
                ) : (
                    <div className="w-full max-w-lg h-[400px] bg-blue-100 rounded-xl" />
                )}
            </div>
            {/* Details */}
            <div className="flex-1 flex flex-col gap-4">
                {loading ? (
                    <>
                        <Skeleton className="h-8 w-2/3 mb-2" />
                        <Skeleton className="h-6 w-1/3 mb-2" />
                        <Skeleton className="h-4 w-1/2 mb-2" />
                        <Skeleton className="h-4 w-1/2 mb-2" />
                        <Skeleton className="h-4 w-1/2 mb-2" />
                        <Skeleton className="h-4 w-1/2 mb-2" />
                    </>
                ) : listing ? (
                    <>
                        <div className="font-bold text-2xl">{listing.title}</div>
                        <div className="text-blue-700 font-bold text-xl mb-2">${listing.price?.toLocaleString?.() ?? listing.price}</div>
                        <div className="text-gray-500 text-sm mb-2">{formatListingDate(listing.created_at)}</div>
                        <div className="text-gray-500 text-sm mb-2">in {listing.location}</div>
                        <div className="text-gray-500 text-sm mb-2">Category: {listing.category}</div>
                        <div className="font-semibold mt-4 mb-1">Description</div>
                        <div className="mb-2 whitespace-pre-line">{listing.description || <span className="text-gray-400">No description</span>}</div>
                        <div className="font-semibold mt-4 mb-1">Seller Information</div>
                        <div className="mb-4">{listing.seller_email}</div>
                        <div className="font-semibold mt-4 mb-1">Message Seller</div>
                        <form onSubmit={handleSendMessage} className="flex flex-col gap-2">
                            <Label htmlFor="buyerEmail">Your Email</Label>
                            <Input
                                id="buyerEmail"
                                type="email"
                                placeholder="your@email.com"
                                value={buyerEmail}
                                onChange={e => setBuyerEmail(e.target.value)}
                                required
                            />
                            <Label htmlFor="message">Message</Label>
                            <Textarea
                                id="message"
                                placeholder="I'm interested in your item!"
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                required
                            />
                            {error && <div className="text-red-600 text-sm">{error}</div>}
                            <Button type="submit" className="mt-2" disabled={sending}>
                                {sending ? "Sending..." : "Send Message"}
                            </Button>
                        </form>
                    </>
                ) : (
                    <div className="text-gray-500">Listing not found.</div>
                )}
            </div>
        </div>
    );
}
