import { Request } from 'express';
import UserStorage from './UserStorage';

interface iResponse {
  success?: boolean;
  msg?: string;
}

interface iError {
  isError: boolean;
  errMsg: any;
  clientMsg: string;
  success?: boolean;
}

class User {
  private body: any;

  constructor(readonly req: Request) {
    this.body = req.body;
  }

  async signUp(): Promise<iResponse | iError> {
    // const user: any = this.body;

    try {
      const checkIdResult = await this.checkId();

      if (!checkIdResult.success) return checkIdResult;

      const checkPasswordResult = await this.checkPassword();

      if (!checkPasswordResult.success) return checkPasswordResult;

      return { success: true, msg: '회원가입 완료' };
    } catch (err) {
      return { isError: true, errMsg: err, clientMsg: '알 수 없는 에러입니다. 서버 개발자에게 문의해주세요.' };
    }
  }

  async checkId(): Promise<iResponse | iError> {
    const { id } = this.body;

    try {
      if (id === undefined) return { success: false, msg: '아이디를 입력해주세요.' };
      if (id.length < 5) return { success: false, msg: '아이디는 5자리 이상 가능합니다.' };

      const DuplicatedId = await UserStorage.checkIdDuplication(id);

      if (DuplicatedId !== undefined) return { success: false, msg: '이미 존재하는 아이디입니다.' };

      return { success: true };
    } catch (err) {
      return { isError: true, errMsg: err, clientMsg: '알 수 없는 에러입니다. 서버 개발자에게 문의해주세요.' };
    }
  }

  async checkPassword(): Promise<iResponse | iError> {
    const { password } = this.body;
    const { checkPassword } = this.body;

    try {
      if (password === undefined) return { success: false, msg: '비밀번호를 입력해주세요.' };

      const isInvalidCheck = this.checkPasswordValidation();

      if (!isInvalidCheck) return { success: false, msg: '비밀번호 조건을 확인해주세요.' };
      if (password !== checkPassword) return { success: false, msg: '비밀번호와 비밀번호 확인 값이 다릅니다.' };
      return { success: true };
    } catch (err) {
      return { isError: true, errMsg: err, clientMsg: '알 수 없는 에러입니다. 서버 개발자에게 문의해주세요.' };
    }
  }

  checkPasswordValidation() {
    const { password } = this.body;

    const regExp = /^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&^])[a-z\d@$!%*#?&^]{8,}$/;

    return regExp.test(password);
  }
}
