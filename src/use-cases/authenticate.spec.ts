import { expect, it, describe, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'

import { AuthenticateUseCase } from './authenticate'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('Authenticate use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUseCase(usersRepository)
  })

  it('should be able ti authenticate', async () => {
    await usersRepository.create({
      name: 'Junior',
      email: 'teste@teste',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      email: 'teste@teste',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong email', async () => {
    await expect(() =>
      sut.execute({
        email: 'teste2@teste',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
  it('should not be able to authenticate with wrong password', async () => {
    await usersRepository.create({
      name: 'Junior',
      email: 'teste@teste',
      password_hash: await hash('123456', 6),
    })

    await expect(() =>
      sut.execute({
        email: 'teste@teste',
        password: '1234567',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
