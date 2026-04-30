export const environment = {
  production: true,
   expenseApiUrl: 'https://expense-api-mono.onrender.com/api/v1/',

  login_path:'/login',

  appVersion: '1.0.0',

  //------ USER ENDPOINTS -------
  loginEndpoint: 'users/login',
  registrationEndpoint: 'users/signup',
  logoutEndpoint:'users/logout',
  refreshTokenEndpoint:'users/refresh-token',
  forgotPassowrdEndpoint: 'users/forgot-password',
  resetPasswordEndpoint: 'users/reset-password/',
  userInfoEndpoint: 'users/me',


  //------ EXPENSE ENDPOINTS -------
  getAllExpenseEndpoint: 'expense/getAll',
  createExpenseEndpoint: 'expense/create',
  deleteExpenseEndpoint: 'expense/deleteMultiple'
};
