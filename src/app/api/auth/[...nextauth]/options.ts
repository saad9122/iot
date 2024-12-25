import CredentialsProvider from 'next-auth/providers/credentials';
import { NextAuthOptions } from 'next-auth';
import { IUserInfo, IUserSignin } from '@/app/_types/interfaces';
import db from '@/db/db';
import { matchPassowrd } from '@/app/_actions/auth';

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        userName: {
          label: 'User Name:',
          type: 'text',
          placeholder: 'user Name',
        },
        password: {
          label: 'password:',
          type: 'password',
          placeholder: 'user Name',
        },
      },
      async authorize(credentials): Promise<any> {
        try {
          const userInDB = await db.user.findUnique({
            where: {
              userName: credentials?.userName,
              isDeleted: false,
            },
            include: {
              role: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          });
          console.log(userInDB, 'userInDB');

          if (userInDB && credentials?.userName === userInDB?.userName) {
            const isPassword: boolean = await matchPassowrd(credentials?.password, userInDB?.password);

            const data: IUserSignin = {
              id: userInDB.id,
              userName: userInDB.userName,
              role: userInDB.role,
            };

            return isPassword ? data : null;
          }
          return null;
        } catch (error: any) {
          console.log(error.message);
          throw new Error(error.message);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user as any;
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
};
