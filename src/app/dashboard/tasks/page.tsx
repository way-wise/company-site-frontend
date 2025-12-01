"use client";

import { PermissionGuard } from "@/components/auth/PermissionGuard";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDebounce } from "@/hooks/useDebounce";
import { useMilestones } from "@/hooks/useMilestoneMutations";
import { useProjects } from "@/hooks/useProjectMutations";
import { Milestone, Project, Task } from "@/types";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import TaskDetailsModal from "../_components/task-components/task-details-modal";
import TaskKanban from "../_components/task-components/task-kanban";

const STORAGE_KEY = 'tasks_selected_project';
const RECENT_PROJECTS_KEY = 'tasks_recent_projects';
const MAX_RECENT = 5;

const getStoredProject = (): Project | null => {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const storeProject = (project: Project) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
  
  // Also add to recent projects
  const recentStr = localStorage.getItem(RECENT_PROJECTS_KEY);
  const recent: Project[] = recentStr ? JSON.parse(recentStr) : [];
  const filtered = recent.filter(p => p.id !== project.id);
  const updated = [project, ...filtered].slice(0, MAX_RECENT);
  localStorage.setItem(RECENT_PROJECTS_KEY, JSON.stringify(updated));
};

const getRecentProjects = (): Project[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(RECENT_PROJECTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export default function TasksPage() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [projectSearch, setProjectSearch] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string>("all");
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState("");
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);

  const debouncedProjectSearch = useDebounce(projectSearch, 500);
  
  // Load from localStorage on mount
  useEffect(() => {
    const stored = getStoredProject();
    const recent = getRecentProjects();
    setRecentProjects(recent);
    
    if (stored) {
      setSelectedProject(stored);
      setProjectSearch(stored.name);
    }
  }, []);

  // Fetch projects with search
  const { data: projectsData, isLoading: isProjectsLoading } = useProjects({
    page: 1,
    limit: 50,
    search: debouncedProjectSearch,
  });

  // Fetch milestones for selected project
  const { data: milestonesData, isLoading: isMilestonesLoading } =
    useMilestones({
      page: 1,
      limit: 100,
      projectId: selectedProject?.id,
    });

  const projects = projectsData?.data?.result || [];
  const milestones = milestonesData?.data?.result || [];

  // Reset milestone selection when project changes
  useEffect(() => {
    setSelectedMilestoneId("all");
  }, [selectedProject?.id]);

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    setProjectSearch(project.name);
    setShowProjectDropdown(false);
    storeProject(project);
    setRecentProjects(getRecentProjects());
  };

  const handleClearProject = () => {
    setSelectedProject(null);
    setProjectSearch("");
    setSelectedMilestoneId("all");
  };

  return (
    <PermissionGuard permissions={["read_task"]}>
      <div className="space-y-6">
        <Breadcrumb
          items={[
            { label: "Projects", href: "/dashboard/projects" },
            { label: "All Tasks", current: true },
          ]}
        />

        {/* Filters Section */}
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Project Selection */}
            <div className="w-full sm:w-80 relative">
              <Label htmlFor="project-search" className="text-xs font-medium mb-1.5 block text-gray-600">
                Select Project
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="project-search"
                  type="text"
                  placeholder="Search projects..."
                  value={projectSearch}
                  onChange={(e) => {
                    setProjectSearch(e.target.value);
                    setShowProjectDropdown(true);
                  }}
                  onFocus={() => setShowProjectDropdown(true)}
                  className="pl-9 pr-9 h-9 text-sm"
                />
                {selectedProject && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearProject}
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Project Dropdown */}
              {showProjectDropdown && !selectedProject && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                  {isProjectsLoading ? (
                    <div className="p-3 text-sm text-gray-500">Loading...</div>
                  ) : (
                    <>
                      {/* Recent Projects Section */}
                      {!projectSearch && recentProjects.length > 0 && (
                        <div className="border-b">
                          <div className="px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-50">
                            Recent Projects
                          </div>
                          {recentProjects.map((project) => (
                            <button
                              key={project.id}
                              onClick={() => handleProjectSelect(project)}
                              className="w-full text-left px-3 py-2 hover:bg-gray-100 transition-colors"
                            >
                              <div className="font-medium text-sm">{project.name}</div>
                              {project.description && (
                                <div className="text-xs text-gray-500 line-clamp-1">
                                  {project.description}
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                      
                      {/* Search Results or All Projects */}
                      {projects.length === 0 ? (
                        <div className="p-3 text-sm text-gray-500">
                          No projects found
                        </div>
                      ) : (
                        <>
                          {projectSearch && projects.length > 0 && (
                            <div className="px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-50">
                              {projectSearch ? 'Search Results' : 'All Projects'}
                            </div>
                          )}
                          {projects.map((project) => (
                            <button
                              key={project.id}
                              onClick={() => handleProjectSelect(project)}
                              className="w-full text-left px-3 py-2 hover:bg-gray-100 transition-colors"
                            >
                              <div className="font-medium text-sm">{project.name}</div>
                              {project.description && (
                                <div className="text-xs text-gray-500 line-clamp-1">
                                  {project.description}
                                </div>
                              )}
                            </button>
                          ))}
                        </>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Priority Filter */}
            <div className="w-full sm:w-40">
              <Label htmlFor="priority-filter" className="text-xs font-medium mb-1.5 block text-gray-600">
                Priority
              </Label>
              <select
                id="priority-filter"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm h-9"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="">All Priorities</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content Area */}
        {!selectedProject ? (
          /* Empty State - No Project Selected */
          <div className="bg-white p-12 rounded-lg border shadow-sm text-center">
            <div className="max-w-md mx-auto">
              <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Project Selected
              </h3>
              <p className="text-gray-500">
                Please select a project above to view its tasks organized by
                milestones.
              </p>
            </div>
          </div>
        ) : milestones.length === 0 ? (
          /* Empty State - No Milestones */
          <div className="bg-white p-12 rounded-lg border shadow-sm text-center">
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Milestones Found
              </h3>
              <p className="text-gray-500">
                This project doesn&apos;t have any milestones yet. Please create
                milestones to organize tasks.
              </p>
            </div>
          </div>
        ) : (
          /* Milestone Tabs with Kanban */
          <Tabs
            value={selectedMilestoneId}
            onValueChange={setSelectedMilestoneId}
            className="w-full"
          >
            <TabsList className="w-full justify-start overflow-x-auto">
              <TabsTrigger value="all">All Milestones</TabsTrigger>
              {milestones.map((milestone) => (
                <TabsTrigger key={milestone.id} value={milestone.id}>
                  {milestone.name}
                  {milestone._count?.Task !== undefined && (
                    <span className="ml-1 text-xs text-gray-500">
                      ({milestone._count.Task})
                    </span>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* All Milestones Tab */}
            <TabsContent value="all" className="space-y-6">
              <TaskKanban
                key={`all-${selectedProject.id}`}
                milestoneId={undefined}
                projectMilestoneIds={milestones.map((m) => m.id)}
                priorityFilter={priorityFilter}
                onTaskClick={setSelectedTask}
              />
            </TabsContent>

            {/* Individual Milestone Tabs */}
            {milestones.map((milestone) => (
              <TabsContent
                key={milestone.id}
                value={milestone.id}
                className="space-y-6"
              >
                <TaskKanban
                  key={milestone.id}
                  milestoneId={milestone.id}
                  priorityFilter={priorityFilter}
                  onTaskClick={setSelectedTask}
                />
              </TabsContent>
            ))}
          </Tabs>
        )}

        {/* Task Details Modal */}
        <TaskDetailsModal
          task={selectedTask}
          open={!!selectedTask}
          onOpenChange={(open) => !open && setSelectedTask(null)}
        />
      </div>
    </PermissionGuard>
  );
}
