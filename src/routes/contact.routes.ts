import { Router, Request, Response } from "express";
import { supabase } from "../config/supabase";
import { sendContactEmail, sendConfirmationEmail } from "../config/email";
import { asyncHandler, AppError } from "../middleware";
import { createContactMessageSchema } from "../validations";

const router = Router();

// GET /api/contact - Get all contact messages (for admin dashboard)
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const { is_read } = req.query;

    let query = supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (is_read !== undefined) {
      query = query.eq("is_read", is_read === "true");
    }

    const { data, error } = await query;

    if (error) {
      throw new AppError(error.message, 500);
    }

    res.status(200).json({
      status: "success",
      count: data?.length || 0,
      unread: data?.filter((msg) => !msg.is_read).length || 0,
      data: data,
    });
  }),
);

// GET /api/contact/:id - Get single contact message by ID
router.get(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw new AppError("Contact message not found", 404);
    }

    res.status(200).json({
      status: "success",
      data: data,
    });
  }),
);

// POST /api/contact - Create new contact message (public endpoint for contact form)
router.post(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const validatedData = createContactMessageSchema.parse(req.body);

    // Save to database
    const { data, error } = await supabase
      .from("contact_messages")
      .insert([validatedData])
      .select()
      .single();

    if (error) {
      throw new AppError(error.message, 400);
    }

    // Send email notification to you
    try {
      await sendContactEmail(validatedData);
      console.log("✅ Notification email sent to admin");
    } catch (emailError) {
      console.error("❌ Failed to send notification email:", emailError);
      // Don't fail the request if email fails - message is still saved
    }

    // Send confirmation email to sender (optional)
    try {
      await sendConfirmationEmail(validatedData);
      console.log("✅ Confirmation email sent to sender");
    } catch (emailError) {
      console.error("❌ Failed to send confirmation email:", emailError);
      // Don't fail the request if confirmation email fails
    }

    res.status(201).json({
      status: "success",
      message: "Message sent successfully! I will get back to you soon.",
      data: data,
    });
  }),
);

// PATCH /api/contact/:id/mark-read - Mark message as read
router.patch(
  "/:id/mark-read",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("contact_messages")
      .update({ is_read: true })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new AppError("Contact message not found", 404);
    }

    res.status(200).json({
      status: "success",
      message: "Message marked as read",
      data: data,
    });
  }),
);

// PATCH /api/contact/:id/mark-unread - Mark message as unread
router.patch(
  "/:id/mark-unread",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("contact_messages")
      .update({ is_read: false })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new AppError("Contact message not found", 404);
    }

    res.status(200).json({
      status: "success",
      message: "Message marked as unread",
      data: data,
    });
  }),
);

// DELETE /api/contact/:id - Delete contact message
router.delete(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const { error } = await supabase
      .from("contact_messages")
      .delete()
      .eq("id", id);

    if (error) {
      throw new AppError("Contact message not found or delete failed", 404);
    }

    res.status(200).json({
      status: "success",
      message: "Contact message deleted successfully",
    });
  }),
);

// GET /api/contact/stats/summary - Get contact message statistics
router.get(
  "/stats/summary",
  asyncHandler(async (req: Request, res: Response) => {
    const { data, error } = await supabase.from("contact_messages").select("*");

    if (error) {
      throw new AppError(error.message, 500);
    }

    const total = data?.length || 0;
    const unread = data?.filter((msg) => !msg.is_read).length || 0;
    const read = total - unread;

    res.status(200).json({
      status: "success",
      data: {
        total,
        read,
        unread,
      },
    });
  }),
);

export default router;
