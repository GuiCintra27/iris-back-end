import { users as User, admins } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { SignInParams, invalidCredentialsError } from "../authentication-service";
import adminRepository from "../../repositories/admin-repository";
import { duplicatedCPFError, duplicatedEmailError } from "../users-service";

export async function singInAdmin(params: SignInParams): Promise<SignInResult> {
  const admin = await adminRepository.findByEmail(params.email);
  if (!admin) throw invalidCredentialsError();

  const isPasswordValid = await bcrypt.compare(params.password, admin.password);
  if (!isPasswordValid) throw invalidCredentialsError();

  const adminId = admin.id;
  const token = jwt.sign({ adminId }, process.env.JWT_SECRET);
  await adminRepository.createSessionadmin({
    adminId,
    token,
  });

  return {
    admin: { id: admin.id, name: admin.name, email: admin.email },
    token,
  };
}

export async function createNewAdmin(params: BodyAdmin) {
  const adminEmail = await adminRepository.findByEmail(params.email);
  if (adminEmail) throw duplicatedEmailError();

  const adminCpf = await adminRepository.findByCpf(params.cpf);
  if (adminCpf) throw duplicatedCPFError();

  const hashedPassword = await bcrypt.hash(params.password, 12);

  const newAdmin = await adminRepository.createNewadmin({ ...params, password: hashedPassword });

  return newAdmin;
}

const adminService = {
  singInAdmin,
  createNewAdmin,
};

export default adminService;

type SignInResult = {
  admin: Pick<User, "id" | "name" | "email">;
  token: string;
};

type BodyAdmin = {
    cpf: string;
    name: string;
    email: string;
    photo: string;
    birthDay: string;
    password: string;
}
