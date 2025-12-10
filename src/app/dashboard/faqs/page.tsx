"use client";

import { PermissionGuard } from "@/components/auth/PermissionGuard";
import { FaqTable } from "./_components/faq-table";

const DashboardFaqsPage = () => {
	return (
		<PermissionGuard permissions={["read_faq"]} requireAll={false}>
			<div className="space-y-6">
				<FaqTable />
			</div>
		</PermissionGuard>
	);
};

export default DashboardFaqsPage;
