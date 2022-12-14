import processJoiErrors from "../processJoiErrors";
const Joi = require("joi");
const signupValidator = function (user:any) {
  const schema = Joi.object({
    name: Joi.string().min(4).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(4).max(255).required(),
    whatsapp: Joi.string().min(1).required(),
  });
  let { error } = schema.validate(user, { abortEarly: false });
  if (error) return processJoiErrors(error);
  else return null;
};
export default signupValidator;
