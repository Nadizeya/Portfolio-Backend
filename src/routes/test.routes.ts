import { Router, Request, Response } from 'express';
import { testSupabaseConnection } from '../config/supabase';
import { asyncHandler } from '../middleware';

const router = Router();

router.get('/test/supabase', asyncHandler(async (req: Request, res: Response) => {
  const result = await testSupabaseConnection();
  
  res.status(result.success ? 200 : 500).json({
    status: result.success ? 'success' : 'error',
    ...result,
  });
}));

export default router;
