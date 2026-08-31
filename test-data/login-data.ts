export const validLoginData = {
  username: process.env.TEST_USER_EMAIL ?? '',
  password: process.env.TEST_USER_PASSWORD ?? '',
};

export const invalidLoginData = {
  username: process.env.TEST_USER_EMAIL ?? '',
  password: 'wrong-password-123',
};