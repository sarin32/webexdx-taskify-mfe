import type {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  // No token injection needed for cookies
  const newReq = req.clone({
    withCredentials: true,
  });
  return next(newReq);
};
