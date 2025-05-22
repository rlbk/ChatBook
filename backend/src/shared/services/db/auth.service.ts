import { IAuthDocument } from '@features/auth/interfaces/auth.interface';
import { AuthModel } from '@features/auth/models/auth.model';
import { Helpers } from '@globals/helpers';

class AuthService {
  public async getUserByUsernameOrName(username: string, email: string): Promise<IAuthDocument> {
    const query = {
      $or: [{ username: Helpers.capitalize(username) }, { email: email.toLowerCase() }]
    };
    const user: IAuthDocument = (await AuthModel.findOne(query)) as IAuthDocument;
    return user;
  }
}

export const authService: AuthService = new AuthService();
