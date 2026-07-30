import request from 'supertest';
import { app } from '../../src/index';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from '@jest/globals';
import { prisma } from '../../src/db/prisma-client';

describe('User API End-to-End Tests', () => {
  beforeAll(async () => {
    // Ensure database is connected
    await prisma.$connect();
  });

  afterAll(async () => {
    // Clean up and disconnect
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Clean all tables before each test
    await prisma.user.deleteMany();
  });

  describe('POST /users', () => {
    it('should create a new user successfully', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        role: 'USER',
        status: 'ACTIVE'
      };

      const response = await request(app)
        .post('/users')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('message', 'User created successfully');

      // Verify user was created in database
      const user = await prisma.user.findUnique({
        where: { email: 'john.doe@example.com' }
      });

      expect(user).toBeTruthy();
      expect(user?.name).toBe('John Doe');
      expect(user?.role).toBe(1); // USER enum value
      expect(user?.status).toBe(1); // ACTIVE enum value
      expect(user?.passwordHash).toBeDefined();
      expect(user?.passwordHash).not.toBe('password123'); // Should be hashed
    });

    it('should return 422 for invalid data', async () => {
      const invalidData = {
        name: '', // Invalid: empty name
        email: 'invalid-email', // Invalid: not an email
        password: '123' // Invalid: too short
      };

      const response = await request(app)
        .post('/users')
        .send(invalidData)
        .expect(422);

      expect(response.body).toHaveProperty('errorCode', 'UNPROCESSABLE_ENTITY');
    });

    it('should return 409 for duplicate email', async () => {
      // Create first user
      await prisma.user.create({
        data: {
          name: 'Existing User',
          email: 'existing@example.com',
          passwordHash: 'hashed',
          role: 1,
          status: 1
        }
      });

      const duplicateData = {
        name: 'New User',
        email: 'existing@example.com', // Same email
        password: 'password123',
        role: 'USER',
        status: 'ACTIVE'
      };

      const response = await request(app)
        .post('/users')
        .send(duplicateData)
        .expect(409);

      expect(response.body).toHaveProperty('errorCode', 'CONFLICT');
    });
  });

  describe('GET /users', () => {
    beforeEach(async () => {
      // Create test users
      await prisma.user.createMany({
        data: [
          {
            name: 'Alice Johnson',
            email: 'alice@example.com',
            passwordHash: 'hash1',
            role: 0, // ADMIN
            status: 1, // ACTIVE
          },
          {
            name: 'Bob Smith',
            email: 'bob@example.com',
            passwordHash: 'hash2',
            role: 1, // USER
            status: 1, // ACTIVE
          },
          {
            name: 'Charlie Brown',
            email: 'charlie@example.com',
            passwordHash: 'hash3',
            role: 1, // USER
            status: 0, // PENDING
          }
        ]
      });
    });

    it('should return paginated users with transformed enum values', async () => {
      const response = await request(app)
        .get('/users?page=1&size=10')
        .expect(200);

      expect(response.body).toHaveProperty('rows');
      expect(response.body).toHaveProperty('total', 3);
      expect(Array.isArray(response.body.rows)).toBe(true);
      expect(response.body.rows).toHaveLength(3);

      // Check that enums are transformed to strings
      const alice = response.body.rows.find((u: any) => u.email === 'alice@example.com');
      expect(alice.role).toBe('ADMIN');
      expect(alice.status).toBe('ACTIVE');

      const bob = response.body.rows.find((u: any) => u.email === 'bob@example.com');
      expect(bob.role).toBe('USER');
      expect(bob.status).toBe('ACTIVE');

      const charlie = response.body.rows.find((u: any) => u.email === 'charlie@example.com');
      expect(charlie.role).toBe('USER');
      expect(charlie.status).toBe('PENDING');
    });

    it('should handle pagination correctly', async () => {
      const response = await request(app)
        .get('/users?page=1&size=2')
        .expect(200);

      expect(response.body.rows).toHaveLength(2);
      expect(response.body.total).toBe(3);
    });

    it('should return all users when paging is disabled', async () => {
      const response = await request(app)
        .get('/users?paging=false')
        .expect(200);

      expect(response.body.rows).toHaveLength(3);
      expect(response.body.total).toBe(3);
    });
  });

  describe('GET /users/:id', () => {
    let testUser: any;

    beforeEach(async () => {
      testUser = await prisma.user.create({
        data: {
          name: 'Test User',
          email: 'test@example.com',
          passwordHash: 'hash',
          role: 1,
          status: 1
        }
      });
    });

    it('should return user by id with transformed enums', async () => {
      const response = await request(app)
        .get(`/users/${testUser.id}`)
        .expect(200);

      expect(response.body.id).toBe(testUser.id);
      expect(response.body.name).toBe('Test User');
      expect(response.body.email).toBe('test@example.com');
      expect(response.body.role).toBe('USER');
      expect(response.body.status).toBe('ACTIVE');
    });

    it('should return 400 for invalid id', async () => {
      const response = await request(app)
        .get('/users/invalid-id')
        .expect(400);

      expect(response.body).toHaveProperty('errorCode', 'BAD_REQUEST');
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .get('/users/99999')
        .expect(404);

      expect(response.body).toHaveProperty('errorCode', 'NOT_FOUND');
    });
  });

  describe('PATCH /users/:id', () => {
    let testUser: any;

    beforeEach(async () => {
      testUser = await prisma.user.create({
        data: {
          name: 'Original Name',
          email: 'original@example.com',
          passwordHash: 'hash',
          role: 1,
          status: 1
        }
      });
    });

    it('should update user successfully', async () => {
      const updateData = {
        name: 'Updated Name',
        email: 'updated@example.com'
      };

      const response = await request(app)
        .patch(`/users/${testUser.id}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'User updated successfully');

      // Verify in database
      const updatedUser = await prisma.user.findUnique({
        where: { id: testUser.id }
      });
      expect(updatedUser?.name).toBe('Updated Name');
      expect(updatedUser?.email).toBe('updated@example.com');
    });

    it('should hash new password when provided', async () => {
      const updateData = {
        password: 'newpassword123'
      };

      await request(app)
        .patch(`/users/${testUser.id}`)
        .send(updateData)
        .expect(200);

      const updatedUser = await prisma.user.findUnique({
        where: { id: testUser.id }
      });
      expect(updatedUser?.passwordHash).not.toBe('hash'); // Should be re-hashed
      expect(updatedUser?.passwordHash).toBeDefined();
    });

    it('should return 404 for non-existent user', async () => {
      const updateData = { name: 'New Name' };

      const response = await request(app)
        .patch('/users/99999')
        .send(updateData)
        .expect(404);

      expect(response.body).toHaveProperty('errorCode', 'NOT_FOUND');
    });
  });

  describe('DELETE /users/:id', () => {
    let testUser: any;

    beforeEach(async () => {
      testUser = await prisma.user.create({
        data: {
          name: 'User to Delete',
          email: 'delete@example.com',
          passwordHash: 'hash',
          role: 1,
          status: 1
        }
      });
    });

    it('should delete user successfully', async () => {
    await request(app)
        .delete(`/users/${testUser.id}`)
        .expect(204);

      // Verify user is deleted
      const deletedUser = await prisma.user.findUnique({
        where: { id: testUser.id }
      });
      expect(deletedUser).toBeNull();
    });

    it('should return 400 for invalid id', async () => {
      const response = await request(app)
        .delete('/users/invalid-id')
        .expect(400);

      expect(response.body).toHaveProperty('errorCode', 'BAD_REQUEST');
    });
  });
});