import 'regenerator-runtime';
import User from '../models/services/User/User';
import UserStorage from '../models/services/User/UserStorage';

jest.mock('../models/services/User/UserStorage');

describe('checkId 함수 테스트', () => {
  let user;
  let req;

  beforeEach(() => {
    req = {
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
  });

  it('id값이 undefined라면 false 반환', async () => {
    delete req.body.id;
    const createId = await user.checkId();
    expect(createId).toEqual({ success: false, msg: '아이디 값을 입력해주세요.' });
  });

  it('id값의 길이가 5이하라면 false 반환', async () => {
    const createId = await user.checkId();
    expect(createId).toEqual({ success: false, msg: '아이디 값이 5자 이하입니다.' });
  });

  it('id값이 중복되는 데이터가 있다면 false 반환', async () => {
    const checkIdDuplication = jest.fn(async () => {
      return { id: '12345' };
    });

    UserStorage.checkIdDuplication = checkIdDuplication;

    req.body.id = '12345';
    const createId = await user.checkId();

    expect(createId).toEqual({ success: false, msg: '이미 존재하는 아이디입니다.' });
    expect(checkIdDuplication.mock.calls.length).toBe(1);
  });

  it('checkIdDuplication 함수 실행 중 에러 발생시 catch의 에러 반환', async () => {
    const checkIdDuplication = jest.fn(async () => {
      const err = 'db error';

      throw err;
    });

    UserStorage.checkIdDuplication = checkIdDuplication;

    // const createId = await user.checkId();
    req.body.id = '12345';

    expect(user.checkId()).rejects.toThrow({
      isError: true,
      errMsg: 'db error',
      clientMsg: '알 수 없는 에러입니다. 서버 개발자에게 문의해주세요.',
    });
    expect(checkIdDuplication.mock.calls.length).toBe(1);
  });

  it('id값이 중복되는 값이 없다면 true 반환', async () => {
    const checkIdDuplication = jest.fn(async () => {
      return undefined;
    });

    UserStorage.checkIdDuplication = checkIdDuplication;

    req.body.id = '12345';
    const createId = await user.checkId();

    expect(createId).toEqual({ success: true, msg: '아이디 유효 검사 완료' });
    expect(checkIdDuplication.mock.calls.length).toBe(1);
  });

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
