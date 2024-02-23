import { updateTransaction } from "@/backend/transactions";
import { UpdateTransactionBackend } from "@/domain";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).end();
  }

  if (req.method === "PUT") {
    const { row } = req.query;
    const newTransaction = JSON.parse(req.body as string) as UpdateTransactionBackend;

    await updateTransaction(session, row, newTransaction);

    res.end();
  } else {
    return res.status(404).end();
  }
};

export default handler;
