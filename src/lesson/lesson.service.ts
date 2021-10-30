import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson } from './lesson.entity';
import { v4 as uuid } from 'uuid';
import { CreateLessonInput } from './create-lesson.input';
import { AssignStudentsToLessonInput } from './assign-students-to-lesson.input';
@Injectable()
export class LessonService {
  constructor(
    @InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>,
  ) {}

  async getLesson(id: string): Promise<Lesson> {
    const found = await this.lessonRepository.findOne({ id });
    if (!found) {
      throw new NotFoundException(`Lesson with ID ${id} not found`);
    }
    return found;
  }

  async getLessons(): Promise<Lesson[]> {
    return this.lessonRepository.find();
  }

  async createLesson(createLessonInput: CreateLessonInput): Promise<Lesson> {
    const { name, startDate, endDate, students } = createLessonInput;
    const lesson = this.lessonRepository.create({
      id: uuid(),
      name,
      startDate,
      endDate,
      students,
    });
    return this.lessonRepository.save(lesson);
  }

  async assignStudentToLesson(
    assignStudentsToLessonInput: AssignStudentsToLessonInput,
  ): Promise<Lesson> {
    const { lessonId, studentIds } = assignStudentsToLessonInput;
    const lesson = await this.getLesson(lessonId);
    lesson.students = [...lesson.students, ...studentIds];
    return this.lessonRepository.save(lesson);
  }
}
