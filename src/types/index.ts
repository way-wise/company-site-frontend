import { StaticImageData } from "next/image";

// Base API Response
export interface ApiResponse<T = unknown> {
	success: boolean;
	message: string;
	data?: T;
	meta?: PaginationMeta;
}

// Permission Types
export interface Permission {
	id: string;
	name: string;
	group: string;
	description?: string;
	createdAt: string;
	updatedAt: string;
}

// Role Types
export interface Role {
	id: string;
	name: string;
	description?: string;
	createdAt: string;
	updatedAt: string;
	rolePermissions?: RolePermission[];
	_count?: {
		userRoles: number;
		rolePermissions: number;
	};
}

export interface RolePermission {
	id: string;
	roleId: string;
	permissionId: string;
	permission: Permission;
}

export interface UserRoleAssignment {
	id: string;
	userId: string;
	roleId: string;
	role: Role;
	name: string; // Direct access to role name
	assignedAt: string;
}

// User Profile Types (matches Prisma schema)
export interface UserProfile {
	id: string;
	userId: string;
	profilePhoto?: string;
	contactNumber?: string;
	address?: string;
	gender?: "MALE" | "FEMALE";
	isDeleted: boolean;
	bio?: string;
	website?: string;
	twitter?: string;
	linkedIn?: string;
	facebook?: string;
	language?: string;
	education?: string;
	experience?: string;
	createdAt: string;
	updatedAt: string;
}

// User Types
export interface User {
	id: string;
	email: string;
	name: string;
	status: "ACTIVE" | "BLOCKED" | "DELETED";
	roles: UserRoleAssignment[]; // Backend returns UserRoleAssignment[] from /auth/me
	userProfile?: UserProfile | null;
	createdAt: string;
	updatedAt: string;
	isPasswordChangeRequired?: boolean;
}

// Pagination Types
export interface PaginationMeta {
	currentPage: number;
	totalPages: number;
	totalItems: number;
	hasNextPage: boolean;
	hasPrevPage: boolean;
	itemsPerPage: number;
	page?: number;
	total?: number;
	limit?: number;
}

export interface PaginatedResponse<T> {
	meta: PaginationMeta;
	result: T[];
}

// User Management Types
export interface UserStats {
	totalUsers: number;
	activeUsers: number;
	bannedUsers: number;
	adminUsers: number;
}

export interface LoginCredentials {
	email: string;
	password: string;
}

export interface RegisterCredentials {
	password: string;
	client: {
		name: string;
		email: string;
		gender: "MALE" | "FEMALE";
	};
}

export type PortfolioProject = {
	id: number;
	title: string;
	description: string;
	tags: string[];
	url: string;
	image: StaticImageData;
};

// Service Types for API (matching backend Prisma model)
export interface Service {
	id: string;
	name: string;
	description?: string;
	createdAt: string;
	updatedAt: string;
}

// Service Types for forms (with File support)
export interface ServiceFormData {
	name: string;
	description?: string;
}

// Service Types for Frontend Display (with images)
export type ServiceDisplay = {
	id: number;
	title: string;
	description: string;
	bgImage: StaticImageData;
	url: string;
	icon: StaticImageData;
	slug: string;
};

export type ExpertiseArea = {
	number: string;
	title: string;
	description: string;
};

export type ServiceDetail = ServiceDisplay & {
	detailedDescription: string;
	videoImage: StaticImageData;
	expertiseAreas: ExpertiseArea[];
	serviceOutcomes: string[];
	ctabutton?: string;
};

// Service Management Types
export interface ServiceStats {
	totalServices: number;
	activeServices: number;
	inactiveServices: number;
}

export interface ServicesQueryParams {
	page: number;
	limit: number;
	search?: string;
}

// Permission Management Types
export interface PermissionFormData {
	name: string;
	group: string;
	description?: string;
}

export interface PermissionStats {
	totalPermissions: number;
	totalGroups: number;
}

export interface PermissionsQueryParams {
	page?: number;
	limit?: number;
	search?: string;
	group?: string;
}

// Role Management Types
export interface RoleFormData {
	name: string;
	description?: string;
	permissionIds?: string[];
}

export interface RoleStats {
	totalRoles: number;
	totalAssignments: number;
}

export interface RolesQueryParams {
	page?: number;
	limit?: number;
	search?: string;
}

export interface AssignRoleToUserData {
	userId: string;
	roleId: string;
}

export interface AssignPermissionsToRoleData {
	permissionIds: string[];
}

// Project Types
export interface Project {
	id: string;
	name: string;
	description?: string;
	status: "PENDING" | "ACTIVE" | "COMPLETED" | "CANCELLED";
	userProfileId: string;
	createdAt: string;
	updatedAt: string;
	userProfile?: {
		id: string;
		userId: string;
		user: {
			id: string;
			name: string;
			email: string;
		};
	};
	milestones?: Milestone[];
	notes?: ProjectNote[];
	files?: ProjectFile[];
	_count?: {
		milestones: number;
	};
}

export interface ProjectFormData {
	name: string;
	description?: string;
	status?: "PENDING" | "ACTIVE" | "COMPLETED" | "CANCELLED";
	userProfileId: string;
}

export interface ProjectStats {
	totalProjects: number;
	activeProjects: number;
	completedProjects: number;
	pendingProjects: number;
}

export interface ProjectsQueryParams {
	page: number;
	limit: number;
	search?: string;
	status?: string;
	userProfileId?: string;
}

// Live Project Types
export interface DailyNote {
	note: string;
	createdAt: string;
}

export interface LiveProject {
	id: string;
	clientName: string;
	clientLocation: string;
	projectType: "FIXED" | "HOURLY" | "MONTHLY" | "CUSTOM";
	projectBudget?: number;
	hourlyRate?: number;
	paidAmount: number;
	assignedMembers: string[];
	projectStatus: "PENDING" | "ACTIVE" | "COMPLETED" | "CANCELLED" | "ON_HOLD";
	dailyNotes?: DailyNote[];
	nextActions?: string;
	createdAt: string;
	updatedAt: string;
	// Optional relations
	assignedMembersDetails?: Array<{
		id: string;
		user: {
			id: string;
			name: string;
			email: string;
		};
	}>;
}

export interface LiveProjectFormData {
	clientName: string;
	clientLocation: string;
	projectType: "FIXED" | "HOURLY" | "MONTHLY" | "CUSTOM";
	projectBudget?: number;
	hourlyRate?: number;
	paidAmount?: number;
	assignedMembers: string[];
	projectStatus?: "PENDING" | "ACTIVE" | "COMPLETED" | "CANCELLED" | "ON_HOLD";
	dailyNotes?: DailyNote[];
	nextActions?: string;
}

export interface LiveProjectsQueryParams {
	page: number;
	limit: number;
	search?: string;
	projectStatus?: string;
	projectType?: string;
	clientName?: string;
}

// Milestone Types
export interface Milestone {
	id: string;
	name: string;
	description?: string;
	cost: number;
	paymentStatus: "UNPAID" | "PAID";
	startDate?: string;
	endDate?: string;
	index: number;
	status: "PENDING" | "ONGOING" | "COMPLETED" | "CANCELLED";
	projectId: string;
	createdAt: string;
	updatedAt: string;
	project?: {
		id: string;
		name: string;
		status: string;
	};
	employeeMilestones?: EmployeeMilestone[];
	serviceMilestones?: ServiceMilestone[];
	Task?: Task[];
	payments?: MilestonePayment[];
	_count?: {
		employeeMilestones: number;
		serviceMilestones: number;
		Task: number;
	};
}

export interface EmployeeMilestone {
	id: string;
	userProfileId: string;
	milestoneId: string;
	status: "ASSIGNED" | "ONGOING" | "COMPLETED" | "RELEASED";
	createdAt: string;
	updatedAt: string;
	userProfile?: {
		id: string;
		user: {
			id: string;
			name: string;
			email: string;
		};
	};
}

export interface ServiceMilestone {
	id: string;
	serviceId: string;
	milestoneId: string;
	createdAt: string;
	updatedAt: string;
	service?: {
		id: string;
		name: string;
		image?: string;
		description?: string;
	};
}

export interface MilestoneFormData {
	name: string;
	description?: string;
	cost: number;
	status?:
		| "PENDING"
		| "ONGOING"
		| "COMPLETED"
		| "REVIEW"
		| "APPROVED"
		| "REJECTED";
	projectId: string;
	startDate?: string;
	endDate?: string;
}

export interface MilestonePayment {
	id: string;
	milestoneId: string;
	userId: string;
	amount: number;
	paymentType: "STRIPE" | "MANUAL";
	stripePaymentIntentId?: string;
	stripeChargeId?: string;
	paymentMethodId?: string;
	manualPaymentMethod?: string;
	notes?: string;
	processedBy?: string;
	status: string;
	invoiceNumber: string;
	paidAt: string;
	createdAt: string;
	updatedAt: string;
	milestone?: {
		id: string;
		name: string;
		description?: string;
		cost: number;
		project?: {
			id: string;
			name: string;
		};
	};
	paymentMethod?: {
		id: string;
		cardLast4: string;
		cardBrand: string;
		cardExpMonth?: number;
		cardExpYear?: number;
	};
	processor?: {
		id: string;
		name: string;
		email: string;
	};
	user?: {
		id: string;
		name: string;
		email: string;
	};
}

export interface Invoice {
	payment: MilestonePayment;
	companyInfo?: {
		name: string;
		address?: string;
		email?: string;
		phone?: string;
	};
}

export interface MilestoneStats {
	totalMilestones: number;
	pendingMilestones: number;
	ongoingMilestones: number;
	completedMilestones: number;
}

export interface MilestonesQueryParams {
	page: number;
	limit: number;
	search?: string;
	status?: string;
	projectId?: string;
}

// Task Types
export type TaskStatus = "TODO" | "IN_PROGRESS" | "BLOCKED" | "REVIEW" | "DONE";
export type Priority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface Task {
	id: string;
	title: string;
	description?: string;
	milestoneId: string;
	creatorId?: string;
	status: "TODO" | "IN_PROGRESS" | "BLOCKED" | "REVIEW" | "DONE";
	priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
	progress: number;
	estimatedHours?: number;
	startedAt?: string;
	completedAt?: string;
	createdAt: string;
	updatedAt: string;
	milestone?: {
		id: string;
		name: string;
		status: string;
		project?: {
			id: string;
			name: string;
		};
	};
	creator?: {
		id: string;
		user: {
			id: string;
			name: string;
			email: string;
		};
	};
	assignments?: TaskAssignment[];
	comments?: TaskComment[];
	_count?: {
		comments: number;
		assignments: number;
	};
}

export interface TaskAssignment {
	id: string;
	taskId: string;
	userProfileId: string;
	assignedAt: string;
	role?: string;
	userProfile?: {
		id: string;
		user: {
			id: string;
			name: string;
			email: string;
		};
	};
}

export interface TaskComment {
	id: string;
	taskId: string;
	content: string;
	userProfileId: string;
	createdAt: string;
	userProfile?: {
		id: string;
		user: {
			id: string;
			name: string;
			email: string;
		};
	};
}

export interface TaskFormData {
	title: string;
	description?: string;
	milestoneId: string;
	creatorId?: string;
	status?: "TODO" | "IN_PROGRESS" | "BLOCKED" | "REVIEW" | "DONE";
	priority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
	progress?: number;
	estimatedHours?: number;
}

export interface TaskStats {
	totalTasks: number;
	todoTasks: number;
	inProgressTasks: number;
	blockedTasks: number;
	reviewTasks: number;
	doneTasks: number;
}

export interface TasksQueryParams {
	page: number;
	limit: number;
	search?: string;
	status?: string;
	priority?: string;
	milestoneId?: string;
	creatorId?: string;
}

// Chat Types
export type ConversationType = "DIRECT" | "GROUP" | "PROJECT";

export interface ConversationParticipant {
	id: string;
	conversationId: string;
	userProfileId: string;
	joinedAt: string;
	lastReadAt: string;
	isAdmin: boolean;
	userProfile: {
		id: string;
		user: {
			id: string;
			name: string;
			email: string;
		};
		profilePhoto?: string;
	};
}

export type ChatAttachmentType = "image" | "document";

export interface ChatAttachment {
	id: string;
	key: string;
	url: string;
	name: string;
	mimeType: string;
	size: number;
	type: ChatAttachmentType;
	uploadedAt: string;
}

export interface ChatMessage {
	id: string;
	conversationId: string;
	senderId: string;
	content: string;
	attachments?: ChatAttachment[] | null;
	isEdited: boolean;
	isDeleted: boolean;
	createdAt: string;
	updatedAt: string;
	sender: {
		id: string;
		user: {
			id: string;
			name: string;
			email: string;
		};
		profilePhoto?: string;
	};
}

export interface ConversationMediaItem extends ChatAttachment {
	messageId: string;
	conversationId: string;
	senderId: string;
	messageCreatedAt: string;
}

export interface Conversation {
	id: string;
	name?: string;
	type: ConversationType;
	projectId?: string;
	createdAt: string;
	updatedAt: string;
	participants: ConversationParticipant[];
	messages?: ChatMessage[];
	lastMessage?: ChatMessage | null;
	unreadCount?: number;
	project?: {
		id: string;
		name: string;
		description?: string;
	};
	_count?: {
		messages: number;
	};
}

export interface CreateConversationData {
	type: ConversationType;
	name?: string;
	projectId?: string;
	participantIds: string[];
}

export interface ConversationsQueryParams {
	page?: number;
	limit?: number;
	search?: string;
	type?: ConversationType;
	projectId?: string;
}

// Leave Management Types
export const LEAVE_TYPE_VALUES = ["CASUAL", "SICK", "EMERGENCY"] as const;
export type LeaveType = (typeof LEAVE_TYPE_VALUES)[number];

export interface LeaveTypeMeta {
	value: LeaveType;
	label: string;
	description: string;
	defaultDaysPerYear: number;
	requiresDocument: boolean;
	color: string;
}

export interface LeaveBalance {
	id: string;
	userProfileId: string;
	leaveType: LeaveType;
	year: number;
	totalDays: number;
	usedDays: number;
	remainingDays: number;
	createdAt: string;
	updatedAt: string;
}

export interface LeaveBalanceWithRelations extends LeaveBalance {
	userProfile: {
		id: string;
		userId: string;
		user: {
			id: string;
			name: string;
			email: string;
		};
	};
	leaveTypeMeta: LeaveTypeMeta;
}

export interface LeaveApplication {
	id: string;
	userProfileId: string;
	leaveType: LeaveType;
	startDate: string;
	endDate: string;
	reason: string;
	status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
	approvedBy?: string | null;
	totalDays: number;
	attachmentUrl?: string | null;
	cancelledAt?: string | null;
	rejectionReason?: string | null;
	comments?: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface LeaveApplicationWithRelations extends LeaveApplication {
	userProfile: {
		id: string;
		userId: string;
		user: {
			id: string;
			name: string;
			email: string;
		};
	};
	leaveTypeMeta: LeaveTypeMeta;
	approver?: {
		id: string;
		userId: string;
		user: {
			id: string;
			name: string;
			email: string;
		};
	} | null;
}

export interface LeaveStats {
	total: number;
	pending: number;
	approved: number;
	rejected: number;
	cancelled: number;
	byType: Array<{
		type: LeaveType;
		count: number;
		color: string;
	}>;
}

export interface LeaveCalendarEvent {
	id: string;
	title: string;
	start: string;
	end: string;
	user: {
		name: string;
		email: string;
	};
	type: {
		value: LeaveType;
		label: string;
		color: string;
	};
	status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
}

// Partner Types
export interface Partner {
	id: string;
	name: string;
	image: string;
	isShow: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface PartnerFormData {
	name: string;
	image?: string;
	isShow?: boolean;
}

export interface PartnersQueryParams {
	page: number;
	limit: number;
	search?: string;
	isShow?: boolean;
}

// Project Note Types
export interface ProjectNote {
	id: string;
	projectId: string;
	content: string;
	createdBy: string;
	createdAt: string;
	updatedAt: string;
	creator?: {
		id: string;
		userId: string;
		user: {
			id: string;
			name: string;
			email: string;
		};
	};
}

export interface ProjectNoteFormData {
	projectId: string;
	content: string;
}

// Project File Types
export interface ProjectFile {
	id: string;
	projectId: string;
	fileName: string;
	fileUrl: string;
	fileType: string;
	fileSize: number;
	uploadedBy: string;
	createdAt: string;
	updatedAt: string;
	uploader?: {
		id: string;
		userId: string;
		user: {
			id: string;
			name: string;
			email: string;
		};
	};
}

export interface ProjectFileFormData {
	projectId: string;
	file: File;
}

// Earning Types
export interface Earning {
	id: string;
	amount: number;
	description?: string;
	date: string;
	projectId?: string;
	category?: string;
	createdBy: string;
	createdAt: string;
	updatedAt: string;
	project?: {
		id: string;
		name: string;
	};
	creator?: {
		id: string;
		user: {
			id: string;
			name: string;
			email: string;
		};
	};
}

export interface EarningFormData {
	amount: number;
	description?: string;
	date: string;
	projectId?: string;
	category?: string;
}

export interface EarningsQueryParams {
	page: number;
	limit: number;
	search?: string;
	projectId?: string;
	category?: string;
	startDate?: string;
	endDate?: string;
}

export interface EarningStats {
	totalEarnings: number;
	totalCount: number;
	earningsByProject: Array<{
		projectId: string | null;
		projectName: string;
		totalAmount: number;
		count: number;
	}>;
	earningsByCategory: Array<{
		category: string;
		totalAmount: number;
		count: number;
	}>;
}

export interface ProjectEarning {
	projectId: string;
	projectName: string;
	totalAmount: number;
	count: number;
}

// Expense Types
export interface Expense {
	id: string;
	amount: number;
	description?: string;
	date: string;
	category?: string;
	receiptUrl?: string;
	createdBy: string;
	createdAt: string;
	updatedAt: string;
	creator?: {
		id: string;
		user: {
			id: string;
			name: string;
			email: string;
		};
	};
}

export interface ExpenseFormData {
	amount: number;
	description?: string;
	date: string;
	category?: string;
	receiptUrl?: string;
	receiptFile?: File;
}

export interface ExpensesQueryParams {
	page: number;
	limit: number;
	search?: string;
	category?: string;
	startDate?: string;
	endDate?: string;
}

export interface ExpenseStats {
	totalExpenses: number;
	totalCount: number;
	expensesByCategory: Array<{
		category: string;
		totalAmount: number;
		count: number;
	}>;
}

// Notification Types
export type NotificationType =
	| "PROJECT"
	| "TASK"
	| "LEAVE"
	| "PAYMENT"
	| "MILESTONE"
	| "CHAT"
	| "FILE"
	| "COMMENT"
	| "SYSTEM";

export interface Notification {
	id: string;
	userProfileId: string;
	type: NotificationType;
	title: string;
	message: string;
	data?: Record<string, unknown> | null;
	read: boolean;
	readAt?: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface NotificationsQueryParams {
	page: number;
	limit: number;
	search?: string;
	type?: NotificationType;
	read?: boolean;
	startDate?: string;
	endDate?: string;
}

export interface NotificationMeta {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
}

export interface NotificationsResponse {
	meta: NotificationMeta;
	result: Notification[];
}

export interface UnreadCountResponse {
	count: number;
}
