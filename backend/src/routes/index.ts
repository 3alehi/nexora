import { Router } from "express";
import { authRouter } from "./auth.routes.js";
import { collectionsRouter } from "./collections.routes.js";
import { marketRouter } from "./market.routes.js";
import { nftsRouter } from "./nfts.routes.js";
import { usersRouter } from "./users.routes.js";
import { walletRouter } from "./wallet.routes.js";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/collections", collectionsRouter);
apiRouter.use("/nfts", nftsRouter);
apiRouter.use("/market", marketRouter);
apiRouter.use("/wallet", walletRouter);
