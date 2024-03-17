import { expect, it, describe, beforeEach } from 'vitest'
import { RegisterUserCase } from './register'
import { compare } from 'bcryptjs'

import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
let usersRepository: InMemoryUsersRepository
let sut: RegisterUserCase

describe('Register use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUserCase(usersRepository)
  })

  it('should hash user password upon registration', async () => {
    const { user } = await sut.execute({
      name: 'Junior',
      email: 'teste@junior',
      password: '123456',
    })

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should has email', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const regigterUsercase = new RegisterUserCase(usersRepository)

    const email = 'johndoe@example.com'

    await regigterUsercase.execute({
      name: 'Junior',
      email,
      password: '123456',
    })

    await expect(() =>
      regigterUsercase.execute({
        name: 'Junior',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })

  it('should be able to register', async () => {
    const { user } = await sut.execute({
      name: 'Junior',
      email: 'teste@junior',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })
})
