import { Router, Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { asyncHandler, AppError } from '../middleware';
import { createExperienceSchema, updateExperienceSchema } from '../validations';

const router = Router();

// GET /api/experiences - Get all experiences
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const { is_published } = req.query;
  
  let query = supabase
    .from('experiences')
    .select('*')
    .order('order_index', { ascending: true });

  if (is_published !== undefined) {
    query = query.eq('is_published', is_published === 'true');
  }

  const { data, error } = await query;

  if (error) {
    throw new AppError(error.message, 500);
  }

  res.status(200).json({
    status: 'success',
    count: data?.length || 0,
    data: data,
  });
}));

// GET /api/experiences/:id - Get single experience by ID
router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new AppError('Experience not found', 404);
  }

  res.status(200).json({
    status: 'success',
    data: data,
  });
}));

// POST /api/experiences - Create new experience
router.post('/', asyncHandler(async (req: Request, res: Response) => {
  const validatedData = createExperienceSchema.parse(req.body);

  const { data, error } = await supabase
    .from('experiences')
    .insert([validatedData])
    .select()
    .single();

  if (error) {
    throw new AppError(error.message, 400);
  }

  res.status(201).json({
    status: 'success',
    message: 'Experience created successfully',
    data: data,
  });
}));

// PUT /api/experiences/:id - Update experience by ID
router.put('/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const validatedData = updateExperienceSchema.parse(req.body);

  if (Object.keys(validatedData).length === 0) {
    throw new AppError('No data provided for update', 400);
  }

  const { data, error } = await supabase
    .from('experiences')
    .update(validatedData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new AppError('Experience not found or update failed', 404);
  }

  res.status(200).json({
    status: 'success',
    message: 'Experience updated successfully',
    data: data,
  });
}));

// DELETE /api/experiences/:id - Delete experience by ID
router.delete('/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('experiences')
    .delete()
    .eq('id', id);

  if (error) {
    throw new AppError('Experience not found or delete failed', 404);
  }

  res.status(200).json({
    status: 'success',
    message: 'Experience deleted successfully',
  });
}));

// PATCH /api/experiences/:id/toggle-publish - Toggle publish status
router.patch('/:id/toggle-publish', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const { data: current, error: fetchError } = await supabase
    .from('experiences')
    .select('is_published')
    .eq('id', id)
    .single();

  if (fetchError) {
    throw new AppError('Experience not found', 404);
  }

  const { data, error } = await supabase
    .from('experiences')
    .update({ is_published: !current.is_published })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new AppError('Failed to toggle publish status', 500);
  }

  res.status(200).json({
    status: 'success',
    message: `Experience ${data.is_published ? 'published' : 'unpublished'} successfully`,
    data: data,
  });
}));

export default router;
