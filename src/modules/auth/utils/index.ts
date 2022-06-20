import * as bcrypt from 'bcryptjs';

export async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

export async function checkDTOandHashPassword(dto) {
  if (dto?.password) dto.password = await hashPassword(dto.password);
  return dto;
}

export async function isPasswordValid(p1, p2) {
  const isValid = await bcrypt.compare(p1, p2)
  return isValid;
}