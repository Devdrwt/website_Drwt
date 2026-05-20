import type { ProjectStatus, ProjectPriority, ServiceCategory } from "@prisma/client";

export type ProjectRow = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  client: string;
  category: ServiceCategory;
  status: ProjectStatus;
  priority: ProjectPriority;
  progress: number;
  startDate: string | null;
  endDate: string | null;
  teamSize: number;
  duration: string | null;
  coverImage: string;
  updatedAt: string;
  phases: {
    challenge: boolean;
    discover: boolean;
    define: boolean;
    develop: boolean;
    deliver: boolean;
  };
  counts: { resources: number; accesses: number; notes: number; members: number };
};
