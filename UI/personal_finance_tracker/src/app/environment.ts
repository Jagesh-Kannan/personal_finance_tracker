export const environment = {
  production: false,
  expenseApiUrl: 'http://localhost:8082/api/v1/',
  //  expenseApiUrl: 'https://expense-api-mono.onrender.com/api/v1/',

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
  deleteExpenseEndpoint: 'expense/deleteMultiple',
  importExpenseEndpoint: 'file-extractor'
};
