import { z } from 'zod';
import { TASK_STATUSES } from '@/lib/constants';

export const taskFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  description: z.string().max(5000, 'Description is too long').optional(),
  status: z.enum(TASK_STATUSES).optional(),
  dueDate: z.string().optional(),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;
