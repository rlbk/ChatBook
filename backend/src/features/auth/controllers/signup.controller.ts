import { ObjectId } from 'mongodb';
import { Request, Response } from 'express';
import { JoiValidation } from '@globals/decorators/joi-validation.decorator';
import { signupSchema } from '../schemas/signup.schema';
import { IAuthDocument, ISignUpData } from '../interfaces/auth.interface';
import { authService } from '@services/db/auth.service';
import { BadRequestError } from '@globals/helpers/error-handler';
import { Helpers } from '@globals/helpers';
import { uploads } from '@globals/helpers/cloudinary-upload';
import { UploadApiResponse } from 'cloudinary';
import HTTP_STATUS from 'http-status-codes';

export class SignUp {
  @JoiValidation(signupSchema)
  public async create(req: Request, res: Response): Promise<void> {
    const { username, email, password, avatarColor, avatarImage } = req.body;
    const checkIfUserExist: IAuthDocument = await authService.getUserByUsernameOrName(username, email);
    if (checkIfUserExist) throw new BadRequestError('User already exist');
    const authObjectId = new ObjectId();
    const userObjectId = new ObjectId();
    const uId = `${Helpers.generateRandomIntegers(12)}`;
    const authData = SignUp.prototype.signUpData({ _id: authObjectId, uId, username, email, password, avatarColor });
    const imageUploadResult: UploadApiResponse = (await uploads(avatarImage, `${userObjectId}`, true, true)) as UploadApiResponse;
    if (!imageUploadResult) throw new BadRequestError('File upload failed. Try again!');
    res.status(HTTP_STATUS.CREATED).json({ message: 'User created successfully', authData, imageUploadResult });
  }

  private signUpData(data: ISignUpData): IAuthDocument {
    const { _id, username, uId, password, email, avatarColor } = data;
    return {
      _id,
      uId,
      username: Helpers.capitalize(username),
      email: email.toLowerCase(),
      avatarColor,
      createdAt: new Date()
    } as IAuthDocument;
  }
}
