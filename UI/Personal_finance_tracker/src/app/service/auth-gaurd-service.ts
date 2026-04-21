import { inject, Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';



 export const authGuard:CanActivateFn = async (route, state) => {

  
const router = inject(Router);
  
      // const token =   await window.cookieStore.get('accessToken').then(token => {
      //   console.log('Token from cookieStore:', token);
      //   return token;
      // }).catch(error => {
      //   console.error('Error retrieving token from cookieStore:', error);
      //   return null;
      // });

    // console.log('tokn', token);
    

      return true
    
 }
