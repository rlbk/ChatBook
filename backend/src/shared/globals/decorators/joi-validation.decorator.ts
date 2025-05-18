import { JoiRequestValidationError } from '@globals/helpers/error-handler';
import { Request } from 'express';
import { ObjectSchema } from 'joi';

type TJoiDecorator = (target: any, key: string, descriptor: PropertyDescriptor) => void;

/**
 * A decorator that validates the request body of an Express.js controller
 * method using Joi. If the validation fails, it throws a
 * JoiRequestValidationError with the first error message.
 * @param schema The Joi schema to validate against.
 * @returns A decorator that validates the request body.
 */
export function JoiValidation(schema: ObjectSchema): TJoiDecorator {
  return (_target: any, _key: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const req: Request = args[0];
      const { error } = await Promise.resolve(schema.validate(req.body));
      if (error?.details) throw new JoiRequestValidationError(error.details[0].message);
      return originalMethod.apply(this, args);
    };
    return descriptor;
  };
}
