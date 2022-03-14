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
      checkPassword: 'wltn8803@',
      email: '123@naver.com',
      nickname: '123',
      district: '123',
    },
  };

  user = new User(req);
});

describe('sign-up 함수 테스트', () => {
  it('checkId 함수가 false를 반환할 경우 false 반환', async () => {
    user.checkId = jest.fn(() => {
      return { success: false, msg: '아이디를 입력해주세요.' };
    });
    const { checkId } = user;

    const createUser = await user.signUp();

    expect(createUser).toEqual({ success: false, msg: '아이디를 입력해주세요.' });
    expect(checkId.mock.calls.length).toBe(1);
  });

  it('checkPassword 함수가 false를 반환할 경우 false 반환', async () => {
    user.checkId = jest.fn(() => {
      return { success: true };
    });

    user.checkPassword = jest.fn(() => {
      return { success: false, msg: '비밀번호를 입력해주세요.' };
    });

    const { checkPassword } = user;

    const createUser = await user.signUp();

    expect(createUser).toEqual({ success: false, msg: '비밀번호를 입력해주세요.' });
    expect(checkPassword.mock.calls.length).toBe(1);
  });

  it('checkEmial 함수가 false를 반환할 경우 false 반환', async () => {
    user.checkId = jest.fn(() => {
      return { success: true };
    });

    user.checkPassword = jest.fn(() => {
      return { success: true };
    });

    user.checkEmail = jest.fn(() => {
      return { success: true };
    });

    const createUser = await user.signUp();

    expect(createUser).toEqual({ success: false, msg: '비밀번호를 입력해주세요.' });
    // expect(checkPassword.mock.calls.length).toBe(1);
  });
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

    // UserStorage.mockImplementation(() => {
    //   return checkIdDuplication;
    // });

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

  it('isInvalidCheck가 false인 경우 false 반환', async () => {
    user.checkPasswordValidation = jest.fn(() => false);
    const { checkPasswordValidation } = user;

    req.body.password = '12345678';

    const createPassword = await user.checkPassword();

    expect(createPassword).toEqual({
      success: false,
      msg: '비밀번호 조건을 확인해주세요.',
    });

    expect(checkPasswordValidation.mock.calls.length).toBe(1);
  });

  it('password와 checkPassword 값이 일치하지 않다면 false 반환', async () => {
    user.checkPasswordValidation = jest.fn(() => true);
    const { checkPasswordValidation } = user;

    req.body.password = 'wltn8803@@';

    const createPassword = await user.checkPassword();

    expect(createPassword).toEqual({ success: false, msg: '비밀번호와 비밀번호 확인 값이 다릅니다.' });

    expect(checkPasswordValidation.mock.calls.length).toBe(1);
  });

  it('password가 모든 조건문을 통과한다면 true 반환', async () => {
    user.checkPasswordValidation = jest.fn(() => true);
    const { checkPasswordValidation } = user;

    req.body.password = 'wltn8803@';
    const createPassword = await user.checkPassword();

    expect(createPassword).toEqual({ success: true });
    expect(checkPasswordValidation.mock.calls.length).toBe(1);
  });
});

describe('비밀번호 유효성 검사 함수 테스트', () => {
  it('password 값이 모두 숫자인 경우 false 반환', async () => {
    req.body.password = '12345678';
    const checkPasswordValidation = await user.checkPasswordValidation();

    expect(checkPasswordValidation).toBeFalsy();
  });

  it('password 값이 모두 영어인 경우 false 반환', async () => {
    req.body.password = 'aaaaaaaa';
    const checkPasswordValidation = await user.checkPasswordValidation();

    expect(checkPasswordValidation).toBeFalsy();
  });
  it('password 값이 모두 특수문자인 경우 false 반환', async () => {
    req.body.password = '@@@@@@@*';
    const checkPasswordValidation = await user.checkPasswordValidation();

    expect(checkPasswordValidation).toBeFalsy();
  });

  it('password 값이 특수문자가 없는 경우 false 반환', async () => {
    req.body.password = '12345aaa';
    const checkPasswordValidation = await user.checkPasswordValidation();

    expect(checkPasswordValidation).toBeFalsy();
  });

  it('password 값이 숫자가 없는 경우 false 반환', async () => {
    req.body.password = 'aaaaaaa@';
    const checkPasswordValidation = await user.checkPasswordValidation();

    expect(checkPasswordValidation).toBeFalsy();
  });

  it('password 값이 소문자가 없는 경우 false 반환', async () => {
    req.body.password = '123456^^';
    const checkPasswordValidation = await user.checkPasswordValidation();

    expect(checkPasswordValidation).toBeFalsy();
  });

  it('password 값이 7자인 경우 false 반환', async () => {
    req.body.password = '12345^';
    const checkPasswordValidation = await user.checkPasswordValidation();

    expect(checkPasswordValidation).toBeFalsy();
  });

  it('password 값이 유효성 검사를 만족 경우 true 반환', async () => {
    req.body.password = 'wltn8803@';
    const checkPasswordValidation = await user.checkPasswordValidation();

    expect(checkPasswordValidation).toBeTruthy();
  });
});

// it('isInvalidCheck가 true일 경우 rePassword 값과 일치하다면 true 반환', async () => {
//   user.checkPasswordValidation = jest.fn(() => true);
//   const { checkPasswordValidation } = user;

//   req.body.password = '12345678';

//   const createPassword = await user.checkPassword();

//   expect(createPassword).toEqual({
//     success: false,
//     msg: '비밀번호는 소문자, 숫자, 특수문자를 모두 포함해야 합니다.',
//   });

//   expect(checkPasswordValidation.mock.calls.length).toBe(1);
// });

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
