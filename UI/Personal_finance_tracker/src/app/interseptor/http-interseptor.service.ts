import { HttpInterceptorFn } from '@angular/common/http';

export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {
  const authorizedReq = req.clone({
    withCredentials: true // Automatically attaches cookies to every request
  });
  return next(authorizedReq);
};