import { apiAuth } from '@/lib/axios';

export async function createAccount({
  name,
  email,
  password,
  cpf,
  phone,
  genre,
  birth,
  country,
  district,
  city
}) {
  await apiAuth.post('/users', {
    name,
    email,
    password,
    cpf,
    phone,
    genre,
    birth,
    country,
    district,
    city
  });
}
