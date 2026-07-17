import { BadRequestException } from "../responce/error.responce.js";

export const validate = (Schema) => {
  return (req, res, next) => {
    const { value, error } = Schema.validate(req.body, {
      abortEarly: false,
    });

    console.log(error);

    if (error) {
      throw BadRequestException({
        message: error.details.map((e) => e.message),
      });
    }

    req.body = value;
    next();
  };
};
