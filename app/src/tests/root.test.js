import 'regenerator-runtime';
import User from '../models/services/user/user';
// import stubUser from './stub_root.test';

describe('회원가입', () => {
  let user;

  // beforeEach(() => {
  //   const req = {
  //     body: {
  //       password: '123',
  //       checkPassword: '123',
  //       email: '123@naver.com',
  //       nickname: '123',
  //       district: '123',
  //     },
  //   };
  //
  //   user = new User(req);
  // });

  it('if id is undefined, success returns false with a msg', async () => {
    const req = {
      body: {
        password: '123',
        checkPassword: '123',
        email: '123@naver.com',
        nickname: '123',
        district: '123',
      },
    };

    user = new User(req);
    const createUser = await user.signUp();
    expect(createUser).toEqual({ success: false, msg: '아이디 값을 입력해주세요.' });
  });

  it('if id length less than 5, success returns false with a msg', async () => {
    const req = {
      body: {
        id: '123',
        password: '123',
        checkPassword: '123',
        email: '123@naver.com',
        nickname: '123',
        district: '123',
      },
    };

    user = new User(req);
    const createUser = await user.signUp();
    expect(createUser).toEqual({ success: false, msg: '아이디 값이 5자 이하입니다.' });
  });

  // it('If the id does not pass validation success returns false with a msg', async () => {
  //   const req = {
  //     body: {
  //       id: '123456',
  //       password: '123',
  //       checkPassword: '123',
  //       email: '123@naver.com',
  //       nickname: '123',
  //       district: '123',
  //     },
  //   };

  //   user = new User(req);
  // });

  // it('unique id가 아니라면 throw error 반환', () => {
  //   expect().toBeTruthy();
  // });

  // it('password 길이가 8자 이하라면 throw error 반환', () => {
  //   expect().toBeTruthy();
  // });

  // it('이메일이 중복된다면 throw error 반환', () => {
  //   expect().toBeTruthy();
  // });

  // it('모든 조건에 만족하는 id, password, email이라면 성공 메세지 반환', () => {
  //   const isUnique = await stubUser.checkUniqueId('123');

  //   expect(isUnique).toEqual({});
  // });
});
