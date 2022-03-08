import { Request } from 'express';

class User {
  private body: any;

  constructor(readonly req: Request) {
    this.body = req.body;
  }

  async signUp() {
    const user: any = this.body;

    try {
      if (user.id === undefined) return { success: false, msg: '아이디 값을 입력해주세요.' };
      if (user.id.length < 5) return { success: false, msg: '아이디 값이 5자 이하입니다.' };

      return { success: true, msg: '회원가입 완료' };
    } catch (err) {
      return { isError: true, errMsg: err, clientMsg: '알 수 없는 에러입니다. 서버 개발자에게 문의해주세요.' };
    }
  }
}

export default User;
