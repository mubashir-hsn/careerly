"use server";

import { checkUser } from "./checkUser";


export async function ensureUserExists() {
  return await checkUser();
}
