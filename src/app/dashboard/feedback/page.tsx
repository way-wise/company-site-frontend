import { PermissionGuard } from "@/components/auth/PermissionGuard";
import { FeedbackTable } from "../_components/feedback/feedback-table";

const FeedbackPage = () => {
	// TODO: Add proper permissions for feedback/contact viewing if implemented
	// For now using user permissions as placeholder or generic admin
	return (
		<PermissionGuard permissions={["read_user"]} requireAll={false}>
			<FeedbackTable />
		</PermissionGuard>
	);
};

export default FeedbackPage;
