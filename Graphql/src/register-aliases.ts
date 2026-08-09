import * as moduleAlias from "module-alias";
import path from "path";

moduleAlias.addAliases({
  "@prisma-client": path.join(__dirname, "generated/prisma/client"),
  "@prisma-client/models": path.join(__dirname, "generated/prisma/models"),
});
