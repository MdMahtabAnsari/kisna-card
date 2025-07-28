import { pageLimitSchema } from "./page-limit";
import { name,code } from "../area";

export const nameOrCodeSchema = pageLimitSchema.extend({
  name: name.optional(),
  code: code.optional(),
});
