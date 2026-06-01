export type DummyUser = {
  employeeId: number
  accountId: number
  username: string
  firstName: string
  middleName: string
  lastName: string
  suffix: string
  displayName: string
  role: string
  department: string
}

/** Demo accounts (no backend required). */
const DUMMY_ACCOUNTS: Array<{ username: string; password: string; user: DummyUser }> = [
  {
    username: 'admin',
    password: 'admin123',
    user: {
      employeeId: 1,
      accountId: 1,
      username: 'admin',
      firstName: 'Demo',
      middleName: '',
      lastName: 'Admin',
      suffix: '',
      displayName: 'Demo Admin',
      role: 'admin',
      department: 'Human Resources',
    },
  },
]

export function authenticateDummy(
  username: string,
  password: string,
): { ok: true; user: DummyUser } | { ok: false; message: string } {
  const normalizedUsername = username.trim().toLowerCase()

  const account = DUMMY_ACCOUNTS.find(
    (entry) =>
      entry.username.toLowerCase() === normalizedUsername && entry.password === password,
  )

  if (!account) {
    return {
      ok: false,
      message: 'Invalid username or password. Try admin / admin123.',
    }
  }

  return { ok: true, user: account.user }
}
