// backend/controllers/subscriptionController.js

import prisma from "../client/prismaClient.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import {
  successResponse,
  errorResponse,
} from "../middleware/errorMiddleware.js";
import { SubscriptionStatus } from "@prisma/client/index.js";

// --- Public / User-Facing Controllers ---

/**
 * @desc    List all active subscription plans for users to browse
 * @route   GET /api/subscriptions/plans
 * @access  Public
 */
export const listActivePlans = asyncHandler(async (req, res) => {
  const plans = await prisma.subscriptionPlan.findMany({
    where: { isActive: true },
    orderBy: { price: "asc" },
  });
  return successResponse(res, plans, "Active subscription plans retrieved");
});

/**
 * @desc    Allow a user to subscribe to a plan
 * @route   POST /api/subscriptions/subscribe
 * @access  Private/User
 */
export const subscribeToPlan = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { planId, paymentGatewayId, paymentMethod } = req.body;

  const existingSubscription = await prisma.userSubscription.findFirst({
    where: { userId, status: "ACTIVE" },
  });
  if (existingSubscription) {
    return errorResponse(res, "You already have an active subscription.", 400);
  }

  const plan = await prisma.subscriptionPlan.findUnique({
    where: { id: planId },
  });
  if (!plan || !plan.isActive) {
    return errorResponse(
      res,
      "Subscription plan not found or is not active.",
      404
    );
  }

  const newSubscription = await prisma.$transaction(async (tx) => {
    const periodEndDate = new Date();
    periodEndDate.setMonth(periodEndDate.getMonth() + 1); // Add one month

    // 1. Create the subscription record for the user
    const subscription = await tx.userSubscription.create({
      data: {
        userId,
        planId,
        status: SubscriptionStatus.ACTIVE,
        startDate: new Date(),
        currentPeriodEndDate: periodEndDate,
      },
    });

    // 2. Create a corresponding payment record for this transaction
    await tx.payment.create({
      data: {
        userId,
        // Subscriptions are not tied to a single rental
        rentalId: null,
        amount: plan.price,
        paymentGatewayId,
        method: paymentMethod,
        status: "SUCCESS",
      },
    });

    return subscription;
  });

  return successResponse(
    res,
    newSubscription,
    `Successfully subscribed to the ${plan.name} plan!`,
    201
  );
});

/**
 * @desc    Get the logged-in user's current subscription details
 * @route   GET /api/subscriptions/me
 * @access  Private/User
 */
export const getMySubscription = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const subscription = await prisma.userSubscription.findUnique({
    where: { userId },
    include: { plan: true }, // Include the details of the plan
  });
  if (!subscription) {
    return errorResponse(res, "No active subscription found.", 404);
  }
  return successResponse(res, subscription, "Subscription details retrieved.");
});

/**
 * @desc    Cancel the logged-in user's subscription
 * @route   PATCH /api/subscriptions/me/cancel
 * @access  Private/User
 */
export const cancelMySubscription = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const activeSubscription = await prisma.userSubscription.findFirst({
    where: { userId, status: "ACTIVE" },
  });

  if (!activeSubscription) {
    return errorResponse(res, "No active subscription to cancel.", 404);
  }

  const updatedSubscription = await prisma.userSubscription.update({
    where: { id: activeSubscription.id },
    data: {
      status: SubscriptionStatus.CANCELLED,
      cancelledAt: new Date(),
    },
  });

  return successResponse(
    res,
    updatedSubscription,
    "Subscription cancelled. It will remain active until the end of the current period."
  );
});

// --- Admin-Only Controllers ---

/**
 * @desc    Create a new subscription plan
 * @route   POST /api/subscriptions/plans/manage
 * @access  Private/Admin
 */
export const createPlan = asyncHandler(async (req, res) => {
  const newPlan = await prisma.subscriptionPlan.create({ data: req.body });
  return successResponse(res, newPlan, "Subscription plan created.", 201);
});

/**
 * @desc    Update an existing subscription plan
 * @route   PUT /api/subscriptions/plans/manage/:planId
 * @access  Private/Admin
 */
export const updatePlan = asyncHandler(async (req, res) => {
  const planId = parseInt(req.params.planId, 10);
  const updatedPlan = await prisma.subscriptionPlan.update({
    where: { id: planId },
    data: req.body,
  });
  return successResponse(res, updatedPlan, "Subscription plan updated.");
});
