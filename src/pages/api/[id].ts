import dbConnect from '@/lib/mongodb';
import Transaction from '@/models/Transaction';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  await dbConnect();
  const { method } = req;
  const { id } = req.query;

  switch (method) {
    case 'PUT':
      const updated = await Transaction.findByIdAndUpdate(id, req.body, { new: true });
      res.status(200).json(updated);
      break;
    case 'DELETE':
      await Transaction.findByIdAndDelete(id);
      res.status(204).end();
      break;
    default:
      res.setHeader('Allow', ['PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
