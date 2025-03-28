import * as z from 'zod';

type TranslationFunction = (key: string) => string;

export const createSignUpSchema = (t: TranslationFunction) =>
  z
    .object({
      firstname: z.string().min(2, {
        message: t('validname'),
      }),
      lastname: z.string().min(2, {
        message: t('validlastname'),
      }),
      email: z.string().email({
        message: t('validemail'),
      }),
      password: z.string().min(6, {
        message: t('validpassword'),
      }),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('validconfirmPassword'),
      path: ['confirmPassword'],
    });

export const createLogInSchema = (t: TranslationFunction) =>
  z.object({
    identifier: z.string().email({
      message: t('validemail'),
    }),
    password: z.string().min(1, {
      message: t('validpassword'),
    }),
    staySignedIn: z.boolean().optional(),
  });

export const createForgotPasswordSchema = (t: TranslationFunction) =>
  z.object({
    email: z
      .string()
      .min(1, { message: t('emailRequired') })
      .email({ message: t('invalidEmail') }),
  });

export const createResetPasswordSchema = (t: TranslationFunction) =>
  z.object({
    password: z.string().min(8, { message: t('passwordMin') }),
    confirmedPassword: z.string().min(8, { message: t('passwordMin') }),
    code: z.string(),
  });