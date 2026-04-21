type LoginDetails = {
  email: string;
  password: string;
};

type RegisterDetails = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    passwordConfirm: string;
};

type ResetPasswordDetails = {
  password: string;
  passwordConfirm: string;
};

type userInfoResponse = {
    status: string;
    user: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        emailVerified: boolean;
        __v: number;
    }
}

type userInfo = {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    emailVerified: boolean;
};