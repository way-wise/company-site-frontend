"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BlogFiltersProps {
	categories: string[];
}

export const BlogFilters = ({ categories }: BlogFiltersProps) => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const currentCategory = searchParams.get("category") || "All";
	const currentSearch = searchParams.get("search") || "";
	const pathname = usePathname();

	const allCategories = ["All", ...categories];

	const handleCategoryChange = (category: string) => {
		const params = new URLSearchParams(searchParams.toString());
		if (category === "All") {
			params.delete("category");
		} else {
			params.set("category", category);
		}
		router.replace(`${pathname}?${params.toString()}`, { scroll: false });
	};

	const handleSearchChange = (term: string) => {
		const params = new URLSearchParams(searchParams.toString());
		if (term) {
			params.set("search", term);
		} else {
			params.delete("search");
		}
		router.replace(`${pathname}?${params.toString()}`, { scroll: false });
	};

	return (
		<div className="sticky top-20 z-30 mb-8 space-y-4 rounded-xl bg-white/80 p-4 shadow-sm backdrop-blur-md dark:bg-gray-950/80 md:top-24">
			<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				{/* Categories */}
				<div className="flex flex-wrap gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
					{allCategories.map((category) => (
						<Button
							key={category}
							variant={currentCategory === category ? "default" : "outline"}
							size="sm"
							onClick={() => handleCategoryChange(category)}
							className={cn(
								"rounded-full whitespace-nowrap transition-all",
								currentCategory === category
									? "bg-gray-900 text-white hover:bg-gray-800"
									: "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
							)}
						>
							{category}
						</Button>
					))}
				</div>

				{/* Search */}
				<div className="relative w-full md:w-64">
					<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
					<Input
						placeholder="Search articles..."
						className="h-10 w-full rounded-full border-gray-200 bg-gray-50 pl-10 focus:bg-white focus:ring-gray-200"
						defaultValue={currentSearch}
						onChange={(e) => handleSearchChange(e.target.value)}
					/>
				</div>
			</div>
		</div>
	);
};
