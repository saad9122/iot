'use server';

// import * as Yup from "yup";
// import { SignUpschema } from "../schemas/registrationSchema";
import bcryptjs from 'bcryptjs';

interface IOptions {
  method: string;
  headers?: { 'Content-Type': string; Authorization: string };
  body?: any;
  cache?: any;
  next?: any;
  token?: any;
}

export const optionGenerator = async ({ method, headers, body, cache, token }: IOptions) => {
  const options: IOptions = {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `{Bearer ${token} }`,
    },
    next: { tags: [`${cache}`] },
  };

  if (body && Object.keys(body).length > 0) {
    options.body = JSON.stringify(body);
  }

  return options;
};

// export const signup = async (data: Yup.InferType<typeof SignUpschema>) => {
//   try {
//     const options = await optionGenerator("POST", data);

//     const res = await fetch(`${URL}/users/signup`, options);

//     return res.json();
//   } catch (error: any) {
//     return {
//       success: false,
//       message: error.message,
//     };
//   }
// };

export const matchPassowrd = async (inputPassword: string, password: string): Promise<boolean> => {
  try {
    return bcryptjs.compare(inputPassword, password);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getHashedPassword = async (password: string): Promise<string> => {
  try {
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    return hashedPassword;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
