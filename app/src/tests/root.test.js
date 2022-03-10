import 'regenerator-runtime';
import User from '../models/services/User/User';
import UserStorage from '../models/services/User/UserStorage';

jest.mock('../models/services/User/UserStorage');

describe('checkId function test', () => {
  const checkIdDuplication = jest.fn(async () => {
    return { id: '12345' };
  });

  UserStorage.checkIdDuplication = checkIdDuplication;

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

  it('if id is undefined, obj returns false with a msg', async () => {
    delete req.body.id;
    const createUser = await user.checkId();
    expect(createUser).toEqual({ success: false, msg: '아이디 값을 입력해주세요.' });
  });

  it('if id length less than 5, obj returns false with a msg', async () => {
    const createUser = await user.checkId();
    expect(createUser).toEqual({ success: false, msg: '아이디 값이 5자 이하입니다.' });
  });

  it('if id is not unique, obj returns false with a msg', async () => {
    req.body.id = '12345';
    const createUser = await user.checkId();

    expect(createUser).toEqual({ success: false, msg: '이미 존재하는 아이디입니다.' });
    expect(checkIdDuplication.mock.calls.length).toBe(1);
  });

  it('if checkId function ocurrs error, obj returns error ', async () => {
    req.body.id = '12345';
    const createUser = await user.checkId();

    expect(createUser).toEqual({ success: false, msg: '이미 존재하는 아이디입니다.' });
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
