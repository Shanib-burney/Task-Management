import { prisma } from "../../../db/prisma-client";
import { PrismaClient, Prisma } from "../../../generated/prisma/client";


export abstract class BaseRepository {
  /**
   * Runs a callback inside a Prisma transaction.
   * All operations using the passed `tx` client are atomic.
   */
  async runInTransaction<T>(callback: (tx: Prisma.TransactionClient ) => Promise<T>): Promise<T> {
    return prisma.$transaction(async (tx) => {
      return callback(tx);
    });
  }
}
