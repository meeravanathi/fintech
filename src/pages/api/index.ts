import dbConnect from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  await dbConnect();
  const { method } = req;

  switch (method) {
    case 'GET':
      const transactions = await Transaction.find().sort({ date: -1 });
      res.status(200).json(transactions);
      break;
    case 'POST':
      const newTransaction = await Transaction.create(req.body);
      res.status(201).json(newTransaction);
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
