import 'regenerator-runtime';
import User from '../models/services/User/User';
import UserStorage from '../models/services/User/UserStorage';

jest.mock('../models/services/User/UserStorage');
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

describe('checkId 함수 테스트', () => {
  it('id값이 undefined라면 false 반환', async () => {
    delete req.body.id;
    const createId = await user.checkId();

    expect(createId).toEqual({ success: false, msg: '아이디를 입력해주세요.' });
  });

  it('id값의 길이가 5이하라면 false 반환', async () => {
    const createId = await user.checkId();

    expect(createId).toEqual({ success: false, msg: '아이디는 5자리 이상 가능합니다.' });
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

    expect(createId).toEqual({ success: true });
    expect(checkIdDuplication.mock.calls.length).toBe(1);
  });
});

describe('checkPassword 함수 테스트', () => {
  it('password값이 undefined라면 false 반환', async () => {
    delete req.body.password;
    const createPassword = await user.checkPassword();

    expect(createPassword).toEqual({ success: false, msg: '비밀번호를 입력해주세요.' });
  });

  it('password 길이가 8자 이하라면 false 반환', async () => {
    const createPassword = await user.checkPassword();

    expect(createPassword).toEqual({ success: false, msg: '비밀번호는 8자리 이상 가능합니다.' });
  });

  it('isInvalidCheck가 false인 경우 false 반환', async () => {
    user.checkPasswordValidation = jest.fn(() => false);
    const { checkPasswordValidation } = user;

    req.body.password = '12345678';

    const createPassword = await user.checkPassword();

    expect(createPassword).toEqual({
      success: false,
      msg: '비밀번호는 소문자, 숫자, 특수문자를 모두 포함해야 합니다.',
    });

    expect(checkPasswordValidation.mock.calls.length).toBe(1);
  });

  it('isInvalidCheck가 true인 경우 false 반환', async () => {
    user.checkPasswordValidation = jest.fn(() => false);
    const { checkPasswordValidation } = user;

    req.body.password = '12345678';

    const createPassword = await user.checkPassword();

    expect(createPassword).toEqual({
      success: false,
      msg: '비밀번호는 소문자, 숫자, 특수문자를 모두 포함해야 합니다.',
    });

    expect(checkPasswordValidation.mock.calls.length).toBe(1);
  });

  // it('password 값이 모두 영어인 경우 false 반환', async () => {
  //   req.body.password = '12345678';
  // });

  // it('password 값이 모두 특수문자인 경우 false 반환', async () => {
  //   req.body.password = '12345678';
  // });

  // it('password 값이 특수문자가 없는 경우 false 반환', async () => {
  //   req.body.password = '12345678';
  // });

  // it('password 값이 숫자가 없는 경우 false 반환', async () => {
  //   req.body.password = '12345678';
  // });

  // it('password 값이 영어가 없는 경우 false 반환', async () => {
  //   req.body.password = '12345678';
  // });

  // it('password 값이 유효성 검사를 만족 경우 true 반환', async () => {
  //   req.body.password = '12345678';
  // });

  // it('password 값이 유효성 검사를 통과할 경우 false 반환', () => {});
});
