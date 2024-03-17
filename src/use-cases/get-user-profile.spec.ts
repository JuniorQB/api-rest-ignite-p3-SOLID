import { expect, it, describe, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'

import { GetUserProfileUseCase } from './get-user-profile'

import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
let usersRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase

describe('Get user profile use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileUseCase(usersRepository)
  })

  it('should be able to get user profile  authenticate', async () => {
    const createUser = await usersRepository.create({
      name: 'John Doe',
      email: 'teste@teste',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      userId: createUser.id,
    })

    expect(user.name).toEqual('John Doe')
  })

  it('should not be able to get user profile  with wrong id', async () => {
    await expect(() =>
      sut.execute({
        userId: 'non-exists-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
