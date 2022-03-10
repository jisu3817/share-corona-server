import { Request } from 'express';
import UserStorage from './UserStorage';

interface response {
  success: boolean;
  msg: string;
}

interface error {
  isError: boolean;
  errMsg: any;
  clientMsg: string;
}

class User {
  private body: any;

  constructor(readonly req: Request) {
    this.body = req.body;
  }

  // async signUp(): Promise<response | error> {
  //   const user: any = this.body;

  //   try {
  //     if (user.id === undefined) return { success: false, msg: '아이디 값을 입력해주세요.' };
  //     if (user.id.length < 5) return { success: false, msg: '아이디 값이 5자 이하입니다.' };

  //     const DuplicatedId = await UserStorage.checkIdDuplication(user.id);

  //     if (DuplicatedId !== undefined) return { success: false, msg: '이미 존재하는 아이디입니다.' };
  //     // 토큰 생성 코드가 들어갈 곳.
  //     return { success: true, msg: '회원가입 완료' };
  //   } catch (err) {
  //     return { isError: true, errMsg: err, clientMsg: '알 수 없는 에러입니다. 서버 개발자에게 문의해주세요.' };
  //   }
  // }

  async checkId(): Promise<response | error> {
    const { id } = this.body;

    try {
      if (id === undefined) return { success: false, msg: '아이디를 입력해주세요.' };
      if (id.length < 5) return { success: false, msg: '아이디가 5자 이하입니다.' };

      const DuplicatedId = await UserStorage.checkIdDuplication(id);

      if (DuplicatedId !== undefined) return { success: false, msg: '이미 존재하는 아이디입니다.' };
      // 토큰 생성 코드가 들어갈 곳.
      return { success: true, msg: '아이디 유효성 검사 완료' };
    } catch (err) {
      return { isError: true, errMsg: err, clientMsg: '알 수 없는 에러입니다. 서버 개발자에게 문의해주세요.' };
    }
  }

  async checkPassword(): Promise<response | error> {
    const { password } = this.body;

    try {
      if (password === undefined) return { success: false, msg: '비밀번호를 입력해주세요.' };
      // if (userId.length < 5) return { success: false, msg: '아이디 값이 5자 이하입니다.' };

      // const DuplicatedId = await UserStorage.checkIdDuplication(userId);

      // if (DuplicatedId !== undefined) return { success: false, msg: '이미 존재하는 아이디입니다.' };
      // 토큰 생성 코드가 들어갈 곳.
      return { success: true, msg: '회원가입 완료' };
    } catch (err) {
      return { isError: true, errMsg: err, clientMsg: '알 수 없는 에러입니다. 서버 개발자에게 문의해주세요.' };
    }
  }
}

export default User;
