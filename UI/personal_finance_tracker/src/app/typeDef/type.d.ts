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

type DialogAction = {
  label: string;
  callback: () => void;
  position: 'left' | 'right';
  class?: string;
};

type DialogConfig = {
  title?: string;
  message?: string;
  template?: any; // To accept HTML/TemplateRef
  actions?: DialogAction[];
  onClose?: () => void;
};