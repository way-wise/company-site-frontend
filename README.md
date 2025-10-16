      # Complete Project Management System Implementation

## Backend Development

### 1. Project Module (`way-wise-backend/src/app/modules/project/`)

Create 6 files following existing service module pattern:

- `project.constants.ts` - searchableFields, validParams
- `project.interface.ts` - IProjectFilterParams
- `project.validationSchema.ts` - create, update schemas with Zod
- `project.controller.ts` - CRUD operations (create, getAll, getSingle, update, delete, getProjectWithDetails)
- `project.service.ts` - Prisma operations with pagination, includes milestones and userProfile
- `project.routes.ts` - Express routes with authGuard, roleGuard, validateRequest

Fields: name, description, status (PENDING/ACTIVE/COMPLETED/CANCELLED), userProfileId

### 2. Milestone Module (`way-wise-backend/src/app/modules/milestone/`)

Create 6 files following same pattern:

- `milestone.constants.ts`
- `milestone.interface.ts`
- `milestone.validationSchema.ts`
- `milestone.controller.ts` - CRUD + assignEmployee, assignService, getEmployees, getServices
- `milestone.service.ts` - Prisma with project, employeeMilestones, serviceMilestones relations
- `milestone.routes.ts`

Fields: name, description, status (PENDING/ONGOING/COMPLETED/REVIEW/APPROVED/REJECTED), projectId

### 3. Task Module (`way-wise-backend/src/app/modules/task/`)

Create 6 files following same pattern:

- `task.constants.ts`
- `task.interface.ts`
- `task.validationSchema.ts`
- `task.controller.ts` - CRUD + assignEmployee, addComment, updateProgress, updateTimeTracking
- `task.service.ts` - Prisma with milestone, creator, assignments, comments relations
- `task.routes.ts`

Fields: title, description, milestoneId, creatorId, status (TODO/IN_PROGRESS/BLOCKED/REVIEW/DONE), priority (LOW/MEDIUM/HIGH/CRITICAL), progress, estimatedHours, spentHours, startedAt, completedAt

### 4. Update Routes

Add to `way-wise-backend/src/app/routes/index.ts`:

```typescript
{ path: "/projects", route: ProjectRoutes }
{ path: "/milestones", route: MilestoneRoutes }
{ path: "/tasks", route: TaskRoutes }
```

## Frontend Development

### 5. TypeScript Types (`way-wise-client/src/types/index.ts`)

Add interfaces for:

- Project, ProjectFormData, ProjectStats, ProjectsQueryParams
- Milestone, MilestoneFormData, MilestoneStats, MilestonesQueryParams
- Task, TaskFormData, TaskStats, TasksQueryParams, TaskComment, TaskAssignment
- EmployeeMilestone with status
- ServiceMilestone

### 6. API Services Layer

Create 3 service files:

- `way-wise-client/src/services/ProjectService/index.ts` - getAllProjects, getProjectById, createProject, updateProject, deleteProject, getProjectStats
- `way-wise-client/src/services/MilestoneService/index.ts` - All CRUD + assignEmployee, assignService, getEmployees, getServices
- `way-wise-client/src/services/TaskService/index.ts` - All CRUD + assignEmployee, addComment, updateProgress, updateTimeTracking

### 7. React Query Hooks

Create 3 hook files:

- `way-wise-client/src/hooks/useProjectMutations.ts` - useProjects, useProject, useCreateProject, useUpdateProject, useDeleteProject
- `way-wise-client/src/hooks/useMilestoneMutations.ts` - Similar pattern with employee/service assignment hooks
- `way-wise-client/src/hooks/useTaskMutations.ts` - Similar pattern with comment and progress hooks

### 8. Validation Schemas

Create `way-wise-client/src/components/modules/admin/projectValidation.ts`:

- createProjectSchema, updateProjectSchema
- createMilestoneSchema, updateMilestoneSchema
- createTaskSchema, updateTaskSchema, addCommentSchema

### 9. Project Components (`way-wise-client/src/app/dashboard/_components/project-components/`)

- `project-table.tsx` - Main table view with search, pagination, CRUD modals
- `UpdateProject.tsx` - Update modal component
- `project-details.tsx` - Shows project with milestones list
- `milestone-list.tsx` - Table of milestones for a project
- `assign-employee-modal.tsx` - Multi-select for employee assignment
- `assign-service-modal.tsx` - Multi-select for service assignment

### 10. Milestone Components (`way-wise-client/src/app/dashboard/_components/milestone-components/`)

- `milestone-table.tsx` - Main table with filter by project
- `UpdateMilestone.tsx` - Update modal
- `milestone-details.tsx` - Shows milestone with tasks

### 11. Task Components (`way-wise-client/src/app/dashboard/_components/task-components/`)

- `task-table.tsx` - Table view with filters (status, priority, milestone)
- `task-kanban.tsx` - Kanban board with columns for TODO/IN_PROGRESS/BLOCKED/REVIEW/DONE, drag-and-drop using dnd-kit
- `task-card.tsx` - Card component for Kanban
- `UpdateTask.tsx` - Update modal
- `task-details.tsx` - Full task details with comments, time tracking, assignments
- `task-comment-section.tsx` - Comments list and add comment
- `task-time-tracker.tsx` - Estimated vs spent hours display
- `assign-task-modal.tsx` - Assign employees to task

### 12. Dashboard Pages

Update/Create:

- `way-wise-client/src/app/dashboard/projects/page.tsx` - Shows project table with permission guard
- `way-wise-client/src/app/dashboard/projects/[id]/page.tsx` - Project details page
- `way-wise-client/src/app/dashboard/milestones/page.tsx` - Milestone table
- `way-wise-client/src/app/dashboard/tasks/page.tsx` - Toggle between table and Kanban view

### 13. UI Enhancements

Use existing shadcn components:

- DataTable for table views
- Modal for CRUD operations
- Select for status/priority dropdowns
- Badge for status indicators with color coding
- Progress bar for task progress
- Tabs for switching table/Kanban views
- Card components for Kanban
- Avatar for assigned employees
- Tooltip for hover information

## Implementation Details

### Key Features:

1. **Employee Assignment to Milestones**: Uses EmployeeMilestone table with status (ASSIGNED/ONGOING/COMPLETED/RELEASED)
2. **Employee Assignment to Tasks**: Uses TaskAssignment table with role field
3. **Service-Milestone Link**: ServiceMilestone junction table
4. **Task Comments**: Full comment system with TaskComment table
5. **Time Tracking**: estimatedHours and spentHours on tasks
6. **Progress Tracking**: 0-100 progress field on tasks
7. **Kanban Board**: Drag-and-drop task cards between status columns
8. **Beautiful UI**: Consistent with existing Services page, modern cards, smooth animations

### Code Standards:

- Follow existing module structure (6 files per module)
- Use Zod validation on both frontend and backend
- TanStack Query for data fetching
- React Hook Form for forms
- Proper error handling with toast notifications
- Permission guards for protected routes
- TypeScript strict mode
- Prisma includes for related data
- Pagination on all list endpoints
- Search functionality on relevant fields

All code will follow the existing patterns from the Service module implementation.
