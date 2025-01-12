"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"

const createSponsorSchema = z.object({
    name: z.string()
        .min(1, "Name is required")
        .max(100, "Name cannot exceed 100 characters"),
    description: z.string()
        .min(1, "Description is required")
        .max(1000, "Description cannot exceed 1000 characters"),
    logo: z.custom<FileList>()
        .refine((files) => files?.length === 1, "Logo is required")
        .refine(
            (files) => files?.[0]?.size <= 2 * 1024 * 1024,
            "Logo must be less than 2MB"
        )
        .refine(
            (files) => 
                ["image/jpeg", "image/jpg", "image/png"].includes(files?.[0]?.type),
            "Only .jpg, .jpeg, and .png files are allowed"
        ),
    email: z.string()
        .min(1, "Email is required")
        .email("Invalid email address"),
    phone: z.string().optional(),
    website: z.string().optional(),
    sponsorshipLevel: z.enum(["Platinum", "Gold", "Silver", "Bronze", "Partner"], {
        required_error: "Sponsorship level is required"
    })
})

type CreateSponsorForm = z.infer<typeof createSponsorSchema>

export default function CreateSponsor() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CreateSponsorForm>({
        resolver: zodResolver(createSponsorSchema)
    })

    const onSubmit = async (data: CreateSponsorForm) => {
        try {
            setIsSubmitting(true)

            const formData = new FormData()
            Object.keys(data).forEach((key) => {
                if (key === "logo") {
                    formData.append("logo", data.logo[0])
                } else {
                    formData.append(key, data[key as keyof CreateSponsorForm]?.toString() || "")
                }
            })

            const response = await fetch("/api/sponsors", {
                method: "POST",
                body: formData,
            })

            if (!response.ok) throw new Error("Failed to create sponsor")

            toast.success("Sponsor created successfully!")
            router.push("/admin/sponsors")
        } catch (error) {
            toast.error("Error creating sponsor")
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-white mb-8">Add New Sponsor</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Name */}
                <div>
                    <label className="block text-white mb-2">Name</label>
                    <input
                        {...register("name")}
                        className="w-full bg-[#000000] border border-[#222222] text-white rounded-lg p-3 focus:outline-none focus:border-[#222222]"
                        placeholder="Enter sponsor name"
                    />
                    {errors.name && (
                        <p className="text-red-500 mt-1">{errors.name.message}</p>
                    )}
                </div>

                {/* Description */}
                <div>
                    <label className="block text-white mb-2">Description</label>
                    <textarea
                        {...register("description")}
                        rows={5}
                        className="w-full bg-[#000000] border border-[#222222] text-white rounded-lg p-3 focus:outline-none focus:border-[#222222]"
                        placeholder="Enter sponsor description"
                    />
                    {errors.description && (
                        <p className="text-red-500 mt-1">{errors.description.message}</p>
                    )}
                </div>

                {/* Logo */}
                <div>
                    <label className="block text-white mb-2">Logo</label>
                    <input
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        {...register("logo")}
                        className="w-full bg-[#000000] border border-[#222222] text-white rounded-lg p-3 focus:outline-none focus:border-[#222222]"
                    />
                    {errors.logo && (
                        <p className="text-red-500 mt-1">{errors.logo.message}</p>
                    )}
                </div>

                {/* Contact Details */}
                <div>
                    <h2 className="text-xl font-semibold text-white mb-4">Contact Details</h2>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-white mb-2">Email</label>
                            <input
                                type="email"
                                {...register("email")}
                                className="w-full bg-[#000000] border border-[#222222] text-white rounded-lg p-3 focus:outline-none focus:border-[#222222]"
                                placeholder="Enter contact email"
                            />
                            {errors.email && (
                                <p className="text-red-500 mt-1">{errors.email.message}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-white mb-2">Phone (Optional)</label>
                            <input
                                {...register("phone")}
                                className="w-full bg-[#000000] border border-[#222222] text-white rounded-lg p-3 focus:outline-none focus:border-[#222222]"
                                placeholder="Enter contact phone"
                            />
                        </div>
                        <div>
                            <label className="block text-white mb-2">Website (Optional)</label>
                            <input
                                {...register("website")}
                                className="w-full bg-[#000000] border border-[#222222] text-white rounded-lg p-3 focus:outline-none focus:border-[#222222]"
                                placeholder="Enter website URL"
                            />
                        </div>
                    </div>
                </div>

                {/* Sponsorship Level */}
                <div>
                    <label className="block text-white mb-2">Sponsorship Level</label>
                    <select
                        {...register("sponsorshipLevel")}
                        className="w-full bg-[#000000] border border-[#222222] text-white rounded-lg p-3 focus:outline-none focus:border-[#222222]"
                    >
                        <option value="">Select sponsorship level</option>
                        <option value="Platinum">Platinum</option>
                        <option value="Gold">Gold</option>
                        <option value="Silver">Silver</option>
                        <option value="Bronze">Bronze</option>
                        <option value="Partner">Partner</option>
                    </select>
                    {errors.sponsorshipLevel && (
                        <p className="text-red-500 mt-1">{errors.sponsorshipLevel.message}</p>
                    )}
                </div>

                {/* Submit Button */}
                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-2 bg-[#000000] text-white border border-[#222222] rounded-lg hover:border-red-500 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition-colors disabled:opacity-50"
                    >
                        {isSubmitting ? "Creating Sponsor..." : "Create Sponsor"}
                    </button>
                </div>
            </form>
        </div>
    )
} 