import { z } from 'zod';

// ----- /admin/file-manager schemas -----
export const deleteFilesSchema = z.object({
    file_ids: z.array(z.string()),
  });