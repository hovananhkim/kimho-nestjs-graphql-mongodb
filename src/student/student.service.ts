import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './student.entity';
import { v4 as uuid } from 'uuid';
import { CreateStudentInput } from './create-student.input';
@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student) private studentRepository: Repository<Student>,
  ) {}
  async createStudent(
    createStudentInput: CreateStudentInput,
  ): Promise<Student> {
    const { firstName, lastName } = createStudentInput;
    const student = this.studentRepository.create({
      id: uuid(),
      firstName,
      lastName,
    });
    return this.studentRepository.save(student);
  }

  async getStudent(id: string): Promise<Student> {
    const found = await this.studentRepository.findOne({ id });
    if (!found) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
    return found;
  }

  async getStudents(): Promise<Student[]> {
    return this.studentRepository.find();
  }

  async getManyStudents(studentIds: string[]): Promise<Student[]> {
    return this.studentRepository.find({
      where: {
        id: {
          $in: studentIds,
        },
      },
    });
  }
}
