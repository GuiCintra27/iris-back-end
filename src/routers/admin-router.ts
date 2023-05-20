import { signInSchema } from "../schemas";
import { validateBody, adminAuthenticateToken } from "../middlewares";
import { Router } from "express";
import { createNewAdmin, singInAdmin } from "../controllers/admin-controller";
import { newAdminSchema } from "../schemas/admin-schema";

const adminRouter = Router();

adminRouter
  .post("/", validateBody(signInSchema), singInAdmin)
  .all("/*", adminAuthenticateToken)
  .post("/newAdmin", validateBody(newAdminSchema), createNewAdmin);
/* 
.get("/",) //Lista dos admins
.put("/:id") //Editar um admin
.delete("/:id"); //Deletar um admin
*/

export { adminRouter };
