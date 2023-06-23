import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { performanceReviewValidationSchema } from 'validationSchema/performance-reviews';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.performance_review
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getPerformanceReviewById();
    case 'PUT':
      return updatePerformanceReviewById();
    case 'DELETE':
      return deletePerformanceReviewById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getPerformanceReviewById() {
    const data = await prisma.performance_review.findFirst(convertQueryToPrismaUtil(req.query, 'performance_review'));
    return res.status(200).json(data);
  }

  async function updatePerformanceReviewById() {
    await performanceReviewValidationSchema.validate(req.body);
    const data = await prisma.performance_review.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deletePerformanceReviewById() {
    const data = await prisma.performance_review.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
