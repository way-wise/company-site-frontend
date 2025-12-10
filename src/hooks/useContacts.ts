"use client";

import {
	contactService,
	GetAllContactsParams,
} from "@/services/ContactService";
import { useQuery } from "@tanstack/react-query";

export const contactQueryKeys = {
	all: ["contacts"] as const,
	lists: () => [...contactQueryKeys.all, "list"] as const,
	list: (params: GetAllContactsParams) =>
		[...contactQueryKeys.lists(), params] as const,
};

export const useContacts = (params: GetAllContactsParams) => {
	return useQuery({
		queryKey: contactQueryKeys.list(params),
		queryFn: () => contactService.getAllContacts(params),
		staleTime: 5 * 60 * 1000,
	});
};
